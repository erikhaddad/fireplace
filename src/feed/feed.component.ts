import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {DataService} from "../common/data.service";
import {IPost, IComment, IPerson, ILike, ITag, ICamera, ILocation, CombinedPost} from "../common/data.model";

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

    private combinedPosts: CombinedPost[];

    constructor(private dataService: DataService, private authService: AuthService) {
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


        this.publicPosts$ = this.dataService.publicPosts;
        this.userPosts$ = this.dataService.userPosts;
        this.comments$ = this.dataService.comments;
        this.likes$ = this.dataService.likes;
        this.people$ = this.dataService.people;
        this.tags$ = this.dataService.tags;
        this.locations$ = this.dataService.locations;
        this.cameras$ = this.dataService.cameras;
        
        
    }

    ngOnInit() {}

    ngOnDestroy() {}

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
                (publicPosts, userPosts, comments, likes, people, tags, locations, cameras) => {

                    _.each(publicPosts, post => {
                        let postId:string = post.$key;

                        _.filter(userPosts, userPost => userPost.$key == postId);


                    });

                    return "";
                }
            );

        //log values
        const subscribePosts = combinedPosts.subscribe(latestValuesProject => console.log(latestValuesProject));
    }


}
