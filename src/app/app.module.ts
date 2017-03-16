import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule} from '@angular/material';
import 'hammerjs';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MomentModule} from 'angular2-moment';

import {AuthModule} from '../auth/auth.module';
import {FirebaseModule} from '../firebase/firebase.module';
import {LandingModule} from '../landing/landing.module';
import {SignInModule} from '../sign-in/sign-in.module';

import {AppComponent} from './app.component';
import {AppHeaderComponent} from '../app-header/app-header.component';
import {FeedModule} from "../feed/feed.module";
import {WordCloudModule} from "../word-cloud/word-cloud.module";
import {MapModule} from "../map/map.module";
import {PersonModule} from "../person/person.module";
import {PostComponent} from "../post/post.component";

@NgModule({
    declarations: [
        AppComponent,
        AppHeaderComponent,
        PostComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([], {useHash: false}),
        MaterialModule,
        FlexLayoutModule,
        MomentModule,

        AuthModule,
        FirebaseModule,

        LandingModule,
        SignInModule,
        FeedModule,
        PersonModule,
        WordCloudModule,
        MapModule
    ],
    entryComponents: [PostComponent],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule {}
