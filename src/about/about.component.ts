import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';

@Component({
    selector: 'about-root',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit, OnDestroy {

    constructor() {

    }

    ngOnInit() {}

    ngOnDestroy() {}
}
