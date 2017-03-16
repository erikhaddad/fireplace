import {Component, OnInit, OnDestroy} from '@angular/core';

import {DataService} from "../common/data.service";
import {ILocation} from "../common/data.model";

@Component({
    selector: 'map-root',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

    // google maps zoom level
    zoom: number = 10;

    // Het Sieraad, Amsterdam, Netherlands'
    mapStartLat: number = 52.3644154;
    mapStartLng: number = 4.8567585;

    private locations:ILocation[];

    constructor(private dataService:DataService) {

        this.dataService.locations.subscribe(queriedItems => {
            this.locations = queriedItems;

            console.log('locations', this.locations);
        });
    }

    ngOnInit() {}

    ngOnDestroy() {}

}