const _ = require('lodash');
const firebase = require('firebase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
//admin.initializeApp(functions.config().firebase);
const vision = require('@google-cloud/vision')();
const util = require('util');

function annotatePhoto(evt) {
    const object = evt.data; // The Storage object.

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
        console.log('This is not an image.');
        return;
    }

    // Get the file name.
    const fileName = filePath.split('/').pop();
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith('thumb_')) {
        console.log('Already a Thumbnail.');
        return;
    }

    // Exit if this is a move or deletion event.
    if (resourceState === 'not_exists') {
        console.log('This is a deletion event.');
        return;
    }

    // Construct a Cloud Vision request
    let req = {
        image: {
            source: {
                gcsImageUri: util.format('gs://%s/%s', fileBucket, filePath)
            }
        },
        features: [{ type: 'LABEL_DETECTION' }]
    };

    // Make the Cloud Vision request
    return vision.annotate(req)
        .then(function(data) {
            let annotations = data[0];
            let apiResponse = data[1];

            let err = _.get(apiResponse, 'responses[0].error');
            if (err) {
                throw new Error(err.message);
            }

            // Save the annotations into the file in the database
            let labelAnnotations = _.get(annotations, '[0].labelAnnotations');
            if (labelAnnotations) {
                return admin.database().ref('tags/').push(labelAnnotations);
            }
        });
}

module.exports = {
    annotatePhoto: annotatePhoto
};
