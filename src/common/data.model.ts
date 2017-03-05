export interface IAuthor {
    full_name: string;
    profile_picture: string;
    uid: string;
}

export interface IComment {
    $key?: string;

    author: IAuthor;
    text: string;
    timestamp: number;
}
export class Comment implements IComment {
    author: IAuthor;
    text: string;
    timestamp: number;

    constructor() {}
}

export interface IFeed {
    $key?: string;
}
export interface Feed {
    value: boolean;
}

export interface IPerson {
    $key?: string;

    _search_index: Object;
    full_name: string;
    notificationEnabled: boolean;
    notificationTokens: string[];
    posts: Object;
    profile_picture: string;
}
export class Person implements IPerson {
    _search_index: Object;
    full_name: string;
    notificationEnabled: boolean;
    notificationTokens: string[];
    posts: Object;
    profile_picture: string;

    constructor() {}
}

export interface IPost {
    $key?: string;

    author: IAuthor;
    full_storage_uri: string;
    full_url: string;
    text: string;
    thumb_storage_uri: string;
    thumb_url: string;
    timestamp: number;
}
export class Post implements IPost {
    author: IAuthor;
    full_storage_uri: string;
    full_url: string;
    text: string;
    thumb_storage_uri: string;
    thumb_url: string;
    timestamp: number;

    constructor() {}
}