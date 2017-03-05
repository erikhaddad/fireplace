import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";

import {LandingComponent} from './landing.component';
import {DataService} from '../common/avatar.service';
import {FeedModule} from "../avatar/avatar.module";

const routes: Routes = [
    {path: '',   redirectTo: '/landing', pathMatch: 'full'},
    {path: 'landing', component: LandingComponent}
];

@NgModule({
    declarations: [
        LandingComponent
    ],
    imports: [
        FeedModule,

        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        DataService
    ]
})

export class LandingModule {
}

export {DataService};
