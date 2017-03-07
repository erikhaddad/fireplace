const functions = require('firebase-functions');

const storage = require('./storage');
const vision = require('./vision');
const uppercase = require('./uppercase');
const thumbnail = require('./thumbnail');

// // Start writing Firebase Functions
// // https://firebase.google.com/preview/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })

// Run all uploaded photos through Cloud Vision for label detection
let onPhotoUpload = functions.database.ref(
    '/posts/{postId}'
).onWrite(vision.annotatePhoto);

// Delete files when their database entry is removed
let onFileDeleted = functions.database.ref(
    '/people/{userId}/{postId}'
).onWrite(storage.deleteFile);

let onPhotoChange = functions.storage.object()
    .onChange(thumbnail.generateThumbnail);

module.exports = {
    onPhotoUpload: onPhotoUpload,
    onFileDeleted: onFileDeleted,
    onPhotoChange: onPhotoChange
};
