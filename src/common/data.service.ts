import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AuthService} from '../auth/auth.service';
import {IPost, Post, IComment, IPerson, ILike, Person} from './data.model';

@Injectable()
export class DataService {
    private publicPostsPath;
    private userPostsPath;
    private commentsPath;
    private likesPath;
    private peoplePath;

    private tagsPath;
    private locationsPath;
    private camerasPath;

    constructor(private af: AngularFire, private auth: AuthService) {
        this.publicPostsPath = `/posts`;
        this.userPostsPath = `/feed/${auth.id}`;
        this.commentsPath = `/comments/`;
        this.likesPath = `/likes/`;
        this.peoplePath = `/people/`;

        this.tagsPath = `/tags/`;
        this.locationsPath = `/locations/`;
        this.camerasPath = `/cameras/`;
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

    get cameras(): FirebaseListObservable<any[]> {
        return this.af.database.list(this.camerasPath);
    }

    /** PUBLIC POST **/
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

    /** USER POST  **/
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

    /** PERSON **/
    createPerson(person:Person): firebase.Promise<any> {
        return this.af.database.list(this.peoplePath).push(person);
    }
    getPerson(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.peoplePath+'/'+id);
    }
    removePerson(person: IPerson): firebase.Promise<any> {
        return this.af.database.list(this.peoplePath).remove(person.$key);
    }
    updatePerson(person: IPerson, changes: any): firebase.Promise<any> {
        return this.af.database.list(this.peoplePath).update(person.$key, changes);
    }

}
