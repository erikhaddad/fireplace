import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';

@Component({
    selector: 'feed-root',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeedComponent implements OnInit, OnDestroy {

    constructor() {

    }

    ngOnInit() {}

    ngOnDestroy() {}
}
