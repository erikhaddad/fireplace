import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {DataService} from "../common/data.service";
import {IPost, IComment, IPerson, ILike} from "../common/data.model";

@Component({
    selector: 'feed-root',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeedComponent implements OnInit, OnDestroy {

    publicPosts: IPost[] = [];
    userPosts: IPost[];
    comments: IComment[];
    likes: ILike[];
    people: IPerson[];
    tags: any[];
    locations: any[];
    cameras: any[];

    constructor(dataService: DataService) {
        dataService.publicPosts.subscribe(queriedItems => {
            this.publicPosts = queriedItems.reverse();

            console.log('public posts', this.publicPosts);
        });
        dataService.userPosts.subscribe(queriedItems => {
            this.userPosts = queriedItems;

            console.log('person posts', this.userPosts);
        });
        dataService.comments.subscribe(queriedItems => {
            this.comments = queriedItems;

            console.log('comments', this.comments);
        });
        dataService.likes.subscribe(queriedItems => {
            this.likes = queriedItems;

            console.log('likes', this.likes);
        });
        dataService.people.subscribe(queriedItems => {
            this.people = queriedItems;

            console.log('people', this.people);
        });

        dataService.tags.subscribe(queriedItems => {
            this.tags = queriedItems;

            console.log('tags', this.tags);
        });
        dataService.locations.subscribe(queriedItems => {
            this.locations = queriedItems;

            console.log('locations', this.locations);
        });
        dataService.cameras.subscribe(queriedItems => {
            this.cameras = queriedItems;

            console.log('cameras', this.cameras);
        });
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
