import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AuthService} from '../auth/auth.service';
import {IPost, Post, IComment, IPerson, ILike, Person, ITag, ILocation, ICamera, IFollower} from './data.model';

import * as firebase from 'firebase';

@Injectable()
export class DataService {
    private publicPostsPath: string;
    private userPostsPath: string;
    private commentsPath: string;
    private likesPath: string;
    private followersPath: string;
    private peoplePath: string;

    private tagsPath: string;
    private locationsPath: string;
    private camerasPath: string;

    constructor(private af: AngularFire, private auth: AuthService) {
        this.publicPostsPath = `/posts`;
        this.userPostsPath = `/feed/${auth.id}/posts`;
        this.commentsPath = `/comments/`;
        this.likesPath = `/likes/`;
        this.peoplePath = `/people/`;
        this.followersPath = `/followers/`;

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

    get tags(): FirebaseListObservable<ITag[]> {
        return this.af.database.list(this.tagsPath);
    }

    get locations(): FirebaseListObservable<ILocation[]> {
        return this.af.database.list(this.locationsPath);
    }

    get cameras(): FirebaseListObservable<ICamera[]> {
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

    /** LIKE **/
    updatePostLikes(postId:string, userId:string, value: boolean): firebase.Promise<any> {
        return this.af.database.object(this.likesPath+'/'+postId+'/'+userId).set(value ? firebase.database.ServerValue.TIMESTAMP : null);
    }

    /** FOLLOW **/
    getUserFollowers(id: string): FirebaseObjectObservable<IFollower> {
        return this.af.database.object(this.followersPath+'/'+id);
    }
    updateUserFollowers(followedUserId:string, currentUserId:string, value: boolean): firebase.Promise<any> {
        return this.af.database.object(`${this.followersPath}/${followedUserId}/${currentUserId}`).set(value ? true : null);
    }

    getUserFollowing(id: string): FirebaseObjectObservable<IFollower> {
        return this.af.database.object(this.peoplePath + '/' + id +'/following');
    }
    updateUserFollowing(currentUserId:string, followedUserId:string, value: boolean): firebase.Promise<any> {
        return this.af.database.object(`${this.peoplePath}/${currentUserId}/following/${followedUserId}`).set(value ? true : null);
    }


    getPublicPostComments(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.commentsPath+'/'+id);
    }
    getPublicPostLikes(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.likesPath+'/'+id);
    }
    getPublicPostTags(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.tagsPath+'/'+id);
    }
    getPublicPostLocation(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.locationsPath+'/'+id);
    }
    getPublicPostCamera(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object(this.camerasPath+'/'+id);
    }
}
