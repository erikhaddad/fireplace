import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";

import {AuthGuard} from '../auth/auth.module';

import {PersonComponent} from './person.component';
import {DataService} from "../common/data.service";

const routes: Routes = [
    {path: 'person/:personId', component: PersonComponent, canActivate: [AuthGuard]}
];

@NgModule({
    declarations: [
        PersonComponent
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

export class PersonModule {
}

export {DataService};
