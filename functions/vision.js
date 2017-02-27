var _ = require('lodash');
var firebase = require('firebase');
var functions = require('firebase-functions');
var util = require('util');
var vision = require('@google-cloud/vision')();


function annotatePhoto(evt) {
    var env = functions.env;
    var record = evt.data.val();

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
    var data = record.data || {};
    if (!_.startsWith(data.contentType, 'image/')) {
        console.log(util.format('Not an image, skipping. contentType=%s', data.contentType));
        return;
    }

    // Construct a Cloud Vision request
    var req = {
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
            var annotations = data[0];
            var apiResponse = data[1];

            var err = _.get(apiResponse, 'responses[0].error');
            if (err) {
                throw new Error(err.message);
            }

            // Save the annotations into the file in the database
            var labelAnnotations = _.get(annotations, '[0].labelAnnotations');
            if (labelAnnotations) {
                return evt.data.ref.child('data/vision/labelAnnotations').set(labelAnnotations)
            }
        });
}


module.exports = {
    annotatePhoto: annotatePhoto
};
