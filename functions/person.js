const _ = require('lodash');
const firebase = require('firebase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const util = require('util');

function createPerson(evt) {
    const user = evt.data; // The Firebase user. Type: functions.auth.UserRecord

    const email = user.email; // The email of the user.
    const displayName = user.displayName; // The display name of the user.

    let personObj = {
        _search_index: [],
        following: {},
        full_name: displayName,
        notificationEnabled: false,
        notificationTokens: {},
        posts: {},
        profile_picture: user.photoURL
    };

    admin.database().ref('people/'+user.uid).update(personObj);
}

module.exports = {
    createPerson: createPerson
};
