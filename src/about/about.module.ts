import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";

import {AboutComponent} from './about.component';

const routes: Routes = [
    {path: 'about', component: AboutComponent}
];

@NgModule({
    declarations: [
        AboutComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        RouterModule.forChild(routes)
    ]
})

export class AboutModule {
}
