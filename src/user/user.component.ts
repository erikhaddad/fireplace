import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';

@Component({
    selector: 'user-root',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit, OnDestroy {

    constructor() {

    }

    ngOnInit() {}

    ngOnDestroy() {}
}
