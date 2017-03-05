import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AuthService} from '../auth/auth.service';
import {IPost, Post} from './data.model';

@Injectable()
export class DataService {
    private _publicPosts$: FirebaseListObservable<IPost[]>;
    private _userPosts$: FirebaseListObservable<IPost[]>;

    private publicPostsPath;
    private userPostsPath;

    constructor(private af: AngularFire, auth: AuthService) {
        this.publicPostsPath = `/posts`;
        this._publicPosts$ = this.af.database.list(this.publicPostsPath, {
            query: {
                orderByChild: 'timestamp'
            }
        });

        this.userPostsPath = `/users/${auth.id}/posts`;
        this._userPosts$ = this.af.database.list(this.userPostsPath, {
            query: {
                orderByChild: 'createdAt'
            }
        });
    }


    get publicPosts(): FirebaseListObservable<IPost[]> {
        return this._publicPosts$;
    }

    get userPosts(): FirebaseListObservable<IPost[]> {
        return this._userPosts$;
    }

    /** PUBLIC EVENTS **/
    createPublicPost(post:Post): firebase.Promise<any> {
        return this._publicPosts$.push(post);
    }
    getPublicPost(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.publicPostsPath+'/'+id);
    }
    removePublicPost(post: IPost): firebase.Promise<any> {
        return this._publicPosts$.remove(post.$key);
    }
    updatePublicPost(post: IPost, changes: any): firebase.Promise<any> {
        return this._publicPosts$.update(post.$key, changes);
    }

    /** USER-CENTRIC EVENTS **/
    createUserPost(post:Post): firebase.Promise<any> {
        return this._userPosts$.push(post);
    }
    getUserPost(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.userPostsPath+'/'+id);
    }
    removeUserPost(post: IPost): firebase.Promise<any> {
        return this._userPosts$.remove(post.$key);
    }
    updateUserPost(post: IPost, changes: any): firebase.Promise<any> {
        return this._userPosts$.update(post.$key, changes);
    }
}
