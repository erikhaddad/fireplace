import {Component, OnInit, ViewEncapsulation, OnDestroy} from "@angular/core";
import {IPost, ITag, ILocation, ICamera, CompositePost} from "../common/data.model";
import {FirebaseListObservable} from "angularfire2";
import {MdDialogRef} from "@angular/material";

@Component({
    selector: 'post-root',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit, OnDestroy {

    // Param and object
    currentPost: CompositePost;

    constructor(public dialogRef: MdDialogRef<PostComponent>) {

    }

    ngOnInit() {

    }

    ngOnDestroy() {}

    cancel(evt: Event) {
        // close the dialog
        this.dialogRef.close();
    }
}
