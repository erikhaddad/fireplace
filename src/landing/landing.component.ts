import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {DataService} from "../common/data.service";


@Component({
    selector: 'landing-root',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements OnInit {

    constructor(private dataService: DataService) {

    }

    ngOnInit() {}
}
