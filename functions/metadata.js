const _ = require('lodash');
const firebase = require('firebase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
//admin.initializeApp(functions.config().firebase);
const gcs = require('@google-cloud/storage')();
const maps = require('@google/maps');
const util = require('util');

const ExifImage = require('exif').ExifImage;

function convertDMSToDD(days, minutes, seconds, direction) {
    let dd = days + (minutes / 60) + seconds / (60 * 60);
    dd = parseFloat(dd);
    if (direction == "S" || direction == "W") {
        dd *= -1;
    } // Don't do anything for N or E
    return dd;
}
/* Expected input: lES9QqFENNZZkd3mCtTQLVgiNUQ2/full/-KfFC5qX2Eiex_oGYfCP/IMG_20170313_134331.jpg */
function derivePathMap(path) {
    let pathMap = {};

    if (!!path) {
        let pathTokens = path.split('/');

        if (pathTokens.length == 4) {
            let userId = pathTokens[0];
            let postId = pathTokens[2];
            let filename = pathTokens[3];

            if (!!userId && !!postId && !!filename) {
                pathMap = {userId: userId, postId: postId, filename: filename};
            }
        }
    }

    return pathMap;
}

function getPhotoMetadata(evt) {
    const object = evt.data; // The Storage object.

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const pathMap = derivePathMap(filePath);
    const contentType = object.contentType; // File content type.
    const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
        console.info('This is not an image.');
        return;
    }

    // Get the file name.
    const fileName = filePath.split('/').pop();
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith('thumb_')) {
        console.info('Already a Thumbnail.');
        return;
    }

    // Exit if this is a move or deletion event.
    if (resourceState === 'not_exists') {
        console.info('This is a deletion event.');
        return;
    }

    // Download file from bucket.
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = `/tmp/${fileName}`;

    return bucket.file(filePath).download({
        destination: tempFilePath
    }).then(() => {
        try {
            new ExifImage(
                {
                    image: tempFilePath
                },
                function (error, exifData) {
                    if (error) {
                        console.error('ExifData error' + error.message);
                    } else {
                        //console.log('ExifData successful', exifData);

                        if (!!exifData) {

                            if (!!exifData.gps &&
                                exifData.gps.GPSLatitude.length == 3 &&
                                exifData.gps.GPSLongitude.length == 3) {

                                let mapsClient = maps.createClient(
                                    { key: 'AIzaSyA-il0hK1qwbjR-DF-ggS5sI5oOjhsOv9M' }
                                );

                                let latitude, longitude;

                                latitude = convertDMSToDD(exifData.gps.GPSLatitude[0],
                                    exifData.gps.GPSLatitude[1],
                                    exifData.gps.GPSLatitude[2],
                                    exifData.gps.GPSLatitudeRef);

                                longitude = convertDMSToDD(exifData.gps.GPSLongitude[0],
                                    exifData.gps.GPSLongitude[1],
                                    exifData.gps.GPSLongitude[2],
                                    exifData.gps.GPSLongitudeRef);

                                // call Google Maps API
                                try {
                                    mapsClient.reverseGeocode({
                                        latlng: [latitude, longitude],
                                        result_type: ['country', 'administrative_area_level_1', 'street_address'],
                                        location_type: ['ROOFTOP', 'APPROXIMATE']
                                    }, function (err, response) {
                                        //console.log('reverseGeocode', err, response);

                                        admin.database().ref().child('locations/'+pathMap.postId).set(response.json.results);
                                    });
                                } catch (e) {
                                    console.error('catch reverseGeocode', e);
                                }
                            }
                            if (!!exifData.image && !!exifData.image.Make && !!exifData.image.Model) {
                                let make, model;

                                make = exifData.image.Make;
                                model = exifData.image.Model;

                                admin.database().ref().child('cameras/'+pathMap.postId).set({make: make, model: model});
                            }

                            //admin.database().ref('metadata/').push(exifData);
                        }
                    }
                });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    });
}

module.exports = {
    getPhotoMetadata: getPhotoMetadata
};
