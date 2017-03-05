import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';

@Component({
    selector: 'add-root',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit, OnDestroy {

    constructor() {

    }

    ngOnInit() {}

    ngOnDestroy() {}
}
