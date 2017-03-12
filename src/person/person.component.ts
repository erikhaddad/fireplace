import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {DataService} from "../common/data.service";
import {IPost, IComment, IPerson, ILike} from "../common/data.model";
import {AuthService} from "../auth/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'person-root',
    templateUrl: 'person.component.html',
    styleUrls: ['person.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PersonComponent implements OnInit, OnDestroy {

    private personId:string;

    private paramSubscription: any;
    private notificationsEnabled: boolean;
    private followingEnabled: boolean;
    private showFollowers: boolean;
    private currentPerson: IPerson;

    private publicPosts: IPost[] = [];
    private userPosts: IPost[];
    private comments: IComment[];
    private likes: ILike[];
    private people: IPerson[];
    private tags: any[];
    private locations: any[];
    private cameras: any[];

    constructor(private dataService: DataService,
                private route: ActivatedRoute,
                private authService:AuthService) {

        this.notificationsEnabled = true;
        this.followingEnabled = true;
        this.showFollowers = false;

        this.dataService.publicPosts.subscribe(queriedItems => {
            this.publicPosts = queriedItems.reverse();

            console.log('public posts', this.publicPosts);
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
    }

    ngOnInit() {
        this.paramSubscription = this.route.params.subscribe(params => {
            this.personId = params['personId'];

            this.dataService.getPerson(this.personId)
                .subscribe(person => {
                    this.currentPerson = person;

                    console.log('authService id', this.authService.id);
                    console.log('currentPerson', this.currentPerson);
                });

        });
    }

    ngOnDestroy() {}

    toggleShowFollowers(evt:Event) {
        this.showFollowers = !this.showFollowers;
    }
}
