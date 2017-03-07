import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AuthService} from '../auth/auth.service';
import {IPost, Post, IComment, IPerson, ILike} from './data.model';

@Injectable()
export class DataService {
    private publicPostsPath;
    private userPostsPath;
    private commentsPath;
    private likesPath;
    private peoplePath;

    private tagsPath;
    private locationsPath;

    constructor(private af: AngularFire, private auth: AuthService) {
        this.publicPostsPath = `/posts`;
        this.userPostsPath = `/feed/${auth.id}`;
        this.commentsPath = `/comments/`;
        this.likesPath = `/likes/`;
        this.peoplePath = `/people/`;

        this.tagsPath = `/tags/`;
        this.locationsPath = `/locations/`;
    }


    get publicPosts(): FirebaseListObservable<IPost[]> {
        let publicPostsPath = '/posts';
        return this.af.database.list(this.publicPostsPath, {
            query: {
                orderByChild: 'timestamp'
            }
        });
    }

    get userPosts(): FirebaseListObservable<IPost[]> {
        return this.af.database.list(this.userPostsPath);
    }

    get comments(): FirebaseListObservable<IComment[]> {
        return this.af.database.list(this.commentsPath);
    }

    get likes(): FirebaseListObservable<ILike[]> {
        return this.af.database.list(this.likesPath);
    }

    get people(): FirebaseListObservable<IPerson[]> {
        return this.af.database.list(this.peoplePath);
    }

    get tags(): FirebaseListObservable<any[]> {
        return this.af.database.list(this.tagsPath);
    }

    get locations(): FirebaseListObservable<any[]> {
        return this.af.database.list(this.locationsPath);
    }

    /** PUBLIC EVENTS **/
    createPublicPost(post:Post): firebase.Promise<any> {
        return this.af.database.list(this.publicPostsPath).push(post);
    }
    getPublicPost(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.publicPostsPath+'/'+id);
    }
    removePublicPost(post: IPost): firebase.Promise<any> {
        return this.af.database.list(this.publicPostsPath).remove(post.$key);
    }
    updatePublicPost(post: IPost, changes: any): firebase.Promise<any> {
        return this.af.database.list(this.publicPostsPath).update(post.$key, changes);
    }

    /** USER-CENTRIC EVENTS **/
    createUserPost(post:Post): firebase.Promise<any> {
        return this.af.database.list(this.userPostsPath).push(post);
    }
    getUserPost(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.userPostsPath+'/'+id);
    }
    removeUserPost(post: IPost): firebase.Promise<any> {
        return this.af.database.list(this.userPostsPath).remove(post.$key);
    }
    updateUserPost(post: IPost, changes: any): firebase.Promise<any> {
        return this.af.database.list(this.userPostsPath).update(post.$key, changes);
    }
}
