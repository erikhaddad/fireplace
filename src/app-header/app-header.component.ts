import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-header',
    styleUrls: ['app-header.component.scss'],
    templateUrl: 'app-header.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AppHeaderComponent {

    showSearchInput: boolean = false;

    @Input() authenticated: boolean;
    @Input() userInfo: firebase.UserInfo;
    @Output() signOut = new EventEmitter(false);

    constructor() {

    }

    toggleShowSearchInput(evt:Event) {
        this.showSearchInput = !this.showSearchInput;
    }

    triggerSignOut(evt: Event): void {
        let msg:string = this.userInfo.displayName + ' signed out';
        this.signOut.emit(msg);
    }
}
