import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {DataService} from "../common/data.service";
import {IPost, IComment, IPerson, ILike, ITag, ICamera, ILocation, CompositePost, Post} from "../common/data.model";

import {Observable} from 'rxjs';
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

    private publicPosts$: FirebaseListObservable<IPost[]>;
    private userPosts$: FirebaseListObservable<IPost[]>;
    private comments$: FirebaseListObservable<IComment[]>;
    private likes$: FirebaseListObservable<ILike[]>;
    private people$: FirebaseListObservable<IPerson[]>;
    private tags$: FirebaseListObservable<ITag[]>;
    private locations$: FirebaseListObservable<ILocation[]>;
    private cameras$: FirebaseListObservable<ICamera[]>;
    
    private publicPosts: IPost[] = [];
    private userPosts: IPost[];
    private comments: IComment[];
    private likes: ILike[];
    private people: IPerson[];
    private tags: ITag[];
    private locations: ILocation[];
    private cameras: ICamera[];

    private compositePosts: CompositePost[];

    constructor(private dataService: DataService, private authService: AuthService) {

        /*
        this.dataService.publicPosts.subscribe(queriedItems => {
            this.publicPosts = queriedItems.reverse();

            console.log('public posts', this.publicPosts);

            this.publicPosts.map(post => {
                // do something
            });
        });
        this.dataService.userPosts.subscribe(queriedItems => {
            this.userPosts = queriedItems;

            console.log('person posts', this.userPosts);
        });
        this.dataService.comments.subscribe(queriedItems => {
            this.comments = queriedItems;

            console.log('comments', this.comments);
        });
        this.dataService.likes.subscribe(queriedItems => {
            this.likes = queriedItems;

            console.log('likes', this.likes);
        });
        this.dataService.people.subscribe(queriedItems => {
            this.people = queriedItems;

            console.log('people', this.people);
        });

        this.dataService.tags.subscribe(queriedItems => {
            this.tags = queriedItems;

            console.log('tags', this.tags);
        });
        this.dataService.locations.subscribe(queriedItems => {
            this.locations = queriedItems;

            console.log('locations', this.locations);
        });
        this.dataService.cameras.subscribe(queriedItems => {
            this.cameras = queriedItems;

            console.log('cameras', this.cameras);
        });
        */

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
    }

    combineData() {
        /*
        //timerOne emits first value at 1s, then once every 4s
        const timerOne = Observable.timer(1000, 4000);
        //timerTwo emits first value at 2s, then once every 4s
        const timerTwo = Observable.timer(2000, 4000);
        //timerThree emits first value at 3s, then once every 4s
        const timerThree = Observable.timer(3000, 4000);

        const combinedProjects = Observable
            .combineLatest(
                timerOne,
                timerTwo,
                timerThree,
                (one, two, three) => {
                    return `Timer One (Proj) Latest: ${one}, 
                              Timer Two (Proj) Latest: ${two}, 
                              Timer Three (Proj) Latest: ${three}`
                }
            );

        //log values
        const subscribeProjects = combinedProjects.subscribe(latestValuesProject => console.log(latestValuesProject));
        */

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

                        let showDebug = postId == '-KfFC5qX2Eiex_oGYfCP';

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
                            //isPostLiked = _.indexOf(this.compositePosts, this.authService.id);
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
                        console.log('new composite post', newCompositePost);
                        //this.compositePosts[postId] = newCompositePost;

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
                    console.log('compositePosts', this.compositePosts);

                    return this.compositePosts;
                }
            );

        //log values
        const subscribePosts = combinedPosts.subscribe(latestValuesProject => console.log(latestValuesProject));
    }


}
