import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";

import {AuthGuard} from '../auth/auth.module';

import {FeedComponent} from './feed.component';
import {DataService} from "../common/data.service";

const routes: Routes = [
    {path: 'feed', component: FeedComponent, canActivate: [AuthGuard]}
];

@NgModule({
    declarations: [
        FeedComponent
    ],
    imports: [
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

export class FeedModule {
}

export {DataService};
