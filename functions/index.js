const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const metadata = require('./metadata');
const vision = require('./vision');

let storageUploadMetadata = functions.storage.object()
    .onChange(metadata.getPhotoMetadata);

let storageUploadVision = functions.storage.object()
    .onChange(vision.annotatePhoto);


module.exports = {
    storageUploadMetadata: storageUploadMetadata,
    storageUploadVision: storageUploadVision
};