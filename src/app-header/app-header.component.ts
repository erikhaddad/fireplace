import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {AuthService} from "../auth/auth.service";

import * as firebase from 'firebase';

@Component({
    selector: 'app-header',
    styleUrls: ['app-header.component.scss'],
    templateUrl: 'app-header.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AppHeaderComponent {

    showSearchInput: boolean = false;

    @Input() authenticated: boolean;
    @Input() userId: string;
    @Input() userInfo: firebase.UserInfo;
    @Output() signOut = new EventEmitter(false);

    constructor(private authService:AuthService) {

    }

    toggleShowSearchInput(evt:Event) {
        this.showSearchInput = !this.showSearchInput;
    }

    triggerSignOut(evt: Event): void {
        let msg:string = this.userInfo.displayName + ' signed out';
        this.signOut.emit(msg);
    }


    agentImageFile:File;
    onInputFileChange(evt:Event) {
        let target: HTMLInputElement = <HTMLInputElement> event.target;
        let files: FileList = target.files;

        if (files && files[0]) {
            this.upload(files[0]);
        }
    }

    triggerInputFileClick (evt) {
        let element = document.getElementById('new-post-input');

        element.click();

        evt.preventDefault();
    }

    upload(fileForUpload) {
        let newPostKey = firebase.database().ref().child('posts').push().key;
        let imagePath = this.authService.id+'/full/'+newPostKey+'/'+fileForUpload.name;

        let storage = firebase.storage();
        let storageRef = storage.ref();
        let newImageRef = storageRef.child(imagePath);
        const metadata = {
            contentType: fileForUpload.type
        };

        /*
        let picUploadTask = newImageRef.put(fileForUpload, metadata)
            .on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function (snapshot) {
                    // Get task progress, including the number of bytes
                    // uploaded and the total number of bytes to be uploaded
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                        case firebase.storage.TaskState.SUCCESS:
                            console.log('New pic uploaded. Size:', snapshot.totalBytes, 'bytes.');
                            let url = snapshot.metadata.downloadURLs[0];
                            console.log('File available at', url);
                            return url;
                    }
                }, function (error) {
                    // Upload failed
                    console.error(error);
                }, function () {
                    // Upload completed successfully

                });
        */

        let picUploadTask = newImageRef.put(fileForUpload, metadata)
            .then(snapshot => {
                console.log('New pic uploaded. Size:', snapshot.totalBytes, 'bytes.');
                let url = snapshot.metadata.downloadURLs[0];
                console.log('File available at', url);

                return url;
            }).catch(error => {
                console.error('Error while uploading new pic', error);
            });

        let newImageText = 'Using tags from Cloud Vision instead';

        // using Promise.all in case I add more tasks prior to upload
        return Promise.all([picUploadTask]).then(urls => {
            // Once both pics and thumbnails has been uploaded add a new post in the Firebase Database and
            // to its fanned out posts lists (user's posts and home post).
            const update = {};
            update[`/posts/${newPostKey}`] = {
                full_url: urls[0],
                thumb_url: urls[0],
                text: newImageText,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                full_storage_uri: newImageRef.toString(),
                thumb_storage_uri: newImageRef.toString(),
                author: {
                    uid: this.authService.id,
                    full_name: this.authService.userInfo.displayName,
                    profile_picture: this.authService.userInfo.photoURL
                }
            };
            update[`/people/${this.authService.id}/posts/${newPostKey}`] = true;
            update[`/feed/${this.authService.id}/${newPostKey}`] = true;
            return firebase.database().ref().update(update).then(() => newPostKey);
        });
    }
}
