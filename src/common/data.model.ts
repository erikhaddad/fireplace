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
export class Feed implements IFeed {
    value: boolean;
}

export interface ILike {
    $key?: string;
}
export class Like implements ILike {
    timestamp: number;
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

export interface ITag {
    $key?: string;

    description: string;
    mid: string;
    score: number;
}
export interface IAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}
export interface ICoordinate {
    lat: number;
    long: number;
}
export interface IGeometry {
    bounds: {northeast: ICoordinate, southwest: ICoordinate};
    location: ICoordinate;
    location_type: string;
    viewport: {northeast: ICoordinate, southwest: ICoordinate};
}
export interface ILocation {
    $key?: string;

    address_components: IAddressComponent[];
    formatted_address: string;
    geometry: IGeometry[];
    place_id: string;
    types: string[];
}
export interface ICamera {
    $key?: string;

    make: string;
    model: string;
}

export interface IPost {
    $key?: string;

    author: IAuthor;
    full_storage_uri: string;
    full_url: string;
    text: string;
    thumb_storage_uri: string;
    thumb_url: string;
    timestamp: number|object;
}
export class Post implements IPost {
    author: IAuthor;
    full_storage_uri: string;
    full_url: string;
    text: string;
    thumb_storage_uri: string;
    thumb_url: string;
    timestamp: number|object;

    constructor() {}
}

export class CompositePost {
    id: string;

    author: IAuthor;
    full_storage_uri: string;
    full_url: string;
    text: string;
    thumb_storage_uri: string;
    thumb_url: string;
    timestamp: number|object;

    camera: ICamera;
    liked: boolean;
    likes: number;
    comments: IComment[];
    tags: ITag[];
    location: ILocation;
}




