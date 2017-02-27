const functions = require('firebase-functions');

const storage = require('./storage');
const vision = require('./vision');
const uppercase = require('./uppercase');

// // Start writing Firebase Functions
// // https://firebase.google.com/preview/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })

// Run all uploaded photos through Cloud Vision for label detection
let onPhotoUpload = functions.database().path(
    '/users/{userId}/files/{dirId}/{fileId}'
).onWrite(vision.annotatePhoto);

// Delete files when their database entry is removed
let onFileDeleted = functions.database().path(
    '/users/{userId}/files/{dirId}/{fileId}'
).onWrite(storage.deleteFile);


module.exports = {
    onPhotoUpload: onPhotoUpload,
    onFileDeleted: onFileDeleted
};
