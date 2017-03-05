import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';

@Component({
    selector: 'post-root',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit, OnDestroy {

    constructor() {

    }

    ngOnInit() {}

    ngOnDestroy() {}
}
