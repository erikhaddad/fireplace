import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";

import {AuthGuard} from '../auth/auth.module';

import {MapComponent} from './map.component';
import {DataService} from "../common/data.service";

import {AgmCoreModule} from 'angular2-google-maps/core';

const routes: Routes = [
    {path: 'map', component: MapComponent, canActivate: [AuthGuard]}
];

@NgModule({
    declarations: [
        MapComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCN6tRaZEdRALfbKLQnnYR2iZiSKeOV4l4'
        })
    ],
    providers: [
        DataService
    ]
})

export class MapModule {
}

export {DataService};
