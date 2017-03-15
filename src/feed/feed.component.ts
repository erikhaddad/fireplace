import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {DataService} from "../common/data.service";
import {IPost, IComment, IPerson, ILike, ITag, ICamera, ILocation, CompositePost, Post} from "../common/data.model";

import {Observable, Subscription} from 'rxjs';
import {FirebaseListObservable} from "angularfire2";

import * as _ from "lodash";
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'feed-root',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeedComponent implements OnInit, OnDestroy {

    // Posts shown in the feed
    private compositePosts: CompositePost[];
    private subscribePosts:Subscription;

    // Realtime Database observables
    private publicPosts$: FirebaseListObservable<IPost[]>;
    private userPosts$: FirebaseListObservable<IPost[]>;
    private comments$: FirebaseListObservable<IComment[]>;
    private likes$: FirebaseListObservable<ILike[]>;
    private people$: FirebaseListObservable<IPerson[]>;
    private tags$: FirebaseListObservable<ITag[]>;
    private locations$: FirebaseListObservable<ILocation[]>;
    private cameras$: FirebaseListObservable<ICamera[]>;

    constructor(private dataService: DataService, private authService: AuthService) {
        this.publicPosts$ = this.dataService.publicPosts;
        this.userPosts$ = this.dataService.userPosts;
        this.comments$ = this.dataService.comments;
        this.likes$ = this.dataService.likes;
        this.people$ = this.dataService.people;
        this.tags$ = this.dataService.tags;
        this.locations$ = this.dataService.locations;
        this.cameras$ = this.dataService.cameras;

        this.compositePosts = [];
        this.combineData();
    }

    ngOnInit() {}

    ngOnDestroy() {}

    togglePostLike(post:CompositePost, evt:Event) {
        post.liked = !post.liked;

        this.dataService.updatePostLikes(post.id, this.authService.id, post.liked);
    }

    combineData() {
        const combinedPosts = Observable
            .combineLatest(
                this.publicPosts$,
                this.userPosts$,
                this.comments$,
                this.likes$,
                this.people$,
                this.tags$,
                this.locations$,
                this.cameras$,
                (publicPosts:IPost[], userPosts:IPost[], comments:IComment[], likes:ILike[], people:IPerson[], tags:ITag[], locations:ILocation[], cameras:ICamera[]) => {

                    _.each(publicPosts, post => {
                        let postId:string = post.$key;

                        let showDebug = false;

                        let newCompositePost = new CompositePost();
                        newCompositePost.id = postId;

                        /** POST **/
                        newCompositePost.author = post.author;
                        newCompositePost.full_storage_uri = post.full_storage_uri;
                        newCompositePost.full_url = post.full_url;
                        newCompositePost.text = post.text;
                        newCompositePost.thumb_storage_uri = post.thumb_storage_uri;
                        newCompositePost.thumb_url = post.thumb_url;
                        newCompositePost.timestamp = post.timestamp;

                        /** LIKES **/
                        let postLikeCount = 0;
                        let isPostLiked = false;
                        let postLikes = _.find(likes, like => like.$key == postId);
                        if (!!postLikes) {
                            let keys = Object.keys(postLikes);
                            isPostLiked = _.indexOf(keys, this.authService.id) > -1;
                            postLikeCount = keys.length;
                        }
                        newCompositePost.liked = isPostLiked;
                        newCompositePost.likes = postLikeCount;

                        /** TAGS **/
                        let postTags = _.find(tags, tag => tag.$key == postId);
                        if (Array.isArray(postTags) && postTags.length > 0) {
                            newCompositePost.tags = postTags;
                        }

                        /** LOCATIONS **/
                        let postLocations = _.find(locations, location => location.$key == postId);
                        if (Array.isArray(postLocations) && postLocations.length > 0) {
                            newCompositePost.location = postLocations[0];
                        }

                        /** CAMERA **/
                        let postCamera = _.find(cameras, camera => camera.$key == postId);
                        newCompositePost.camera = postCamera;


                        if (showDebug) {
                            console.log('this postId', postId);
                            console.log('this post likes', postLikes);
                            console.log('this post tags', postTags);
                            console.log('this post location', postLocations);
                            console.log('this post camera', postCamera);
                        }

                        /** RESULT **/
                        // Find item index using indexOf+find
                        let index = _.indexOf(this.compositePosts, _.find(this.compositePosts, {id: postId}));

                        if (index > -1) {
                            // Replace item at index using native splice
                            this.compositePosts.splice(index, 1, newCompositePost);
                        } else {
                            this.compositePosts.push(newCompositePost);
                        }
                    });

                    this.compositePosts = _.orderBy(this.compositePosts, ['timestamp', 'id'], ['desc', 'desc']);

                    return this.compositePosts;
                }
            );

        //log values
        this.subscribePosts = combinedPosts.subscribe(latestValuesProject => console.log(latestValuesProject));
    }


}
