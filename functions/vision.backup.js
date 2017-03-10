const _ = require('lodash');
const firebase = require('firebase');
const functions = require('firebase-functions');
const util = require('util');
const vision = require('@google-cloud/vision')();

function annotatePhoto(evt) {
    let env = functions.env;
    let record = evt.data.val();

    // Only run when file is first created
    if (!record || evt.data.previous.val()) {
        console.log('Not a new file, skipping.');
        return;
    }

    // Skip directories
    if (record.type === 1) {
        console.log(util.format('Not a file, skipping. type=%s', record.type));
        return;
    }

    // DEBUG: logging the execution time of this function
    evt.data.ref.update({_functionsEnd: firebase.database.ServerValue.TIMESTAMP});

    // Only run if this is a photo
    let data = record.data || {};
    if (!_.startsWith(data.contentType, 'image/')) {
        console.log(util.format('Not an image, skipping. contentType=%s', data.contentType));
        return;
    }

    // Construct a Cloud Vision request
    let req = {
        image: {
            source: {
                gcsImageUri: util.format('gs://%s/%s', env.firebase.storageBucket, data.path)
            }
        },
        features: [{type: 'LABEL_DETECTION'}]
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
                return evt.data.ref.child('tags/'+event.params.pushId+'/').set(labelAnnotations);
            }
        });
}

module.exports = {
    annotatePhoto: annotatePhoto
};
