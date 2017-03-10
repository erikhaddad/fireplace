import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";

import {AuthGuard} from '../auth/auth.module';

import {WordCloudComponent} from './word-cloud.component';
import {DataService} from "../common/data.service";

const routes: Routes = [
    {path: 'word-cloud', component: WordCloudComponent, canActivate: [AuthGuard]}
];

@NgModule({
    declarations: [
        WordCloudComponent
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

export class WordCloudModule {
}

export {DataService};
