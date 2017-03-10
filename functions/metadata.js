const _ = require('lodash');
const firebase = require('firebase');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const maps = require('@google/maps');
const util = require('util');

const ExifImage = require('exif').ExifImage;

function convertDMSToDD(days, minutes, seconds, direction) {
    var dd = days + (minutes/60) + seconds/(60*60);
    dd = parseFloat(dd);
    if (direction == "S" || direction == "W") {
        dd *= -1;
    } // Don't do anything for N or E
    return dd;
}

function getPhotoMetadata(evt) {
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

    // Download file from bucket.
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = `/tmp/${fileName}`;

    return bucket.file(filePath).download({
        destination: tempFilePath
    }).then(() => {
        console.log('metadata.js: Image downloaded locally to', tempFilePath);

        try {
            new ExifImage(
                {image: tempFilePath},
                function (error, exifData) {
                    if (error) {
                        console.log('Error: ' + error.message);
                    } else {
                        console.log('ExifData successful', exifData); // Do something with your data!


                        if (!!exifData) {

                            if (!!exifData.gps && exifData.gps.GPSLatitude.length == 3 && exifData.gps.GPSLongitude.length == 3) {
                                let mapsClient = maps.createClient(
                                    { key: 'AIzaSyDNl3uihAT5EYQwjCOK_NEQn_9XZFKx6u8' }
                                );

                                let latitude, longitude, latlng; // latlng=40.714224,-73.961452 or 43°38'19.39"N

                                /*
                                latitude = exifData.gps.GPSLatitude[0] + '°' +
                                            exifData.gps.GPSLatitude[1] + "'" +
                                            exifData.gps.GPSLatitude[2] + '"' +
                                            exifData.gps.GPSLatitudeRef;

                                longitude = exifData.gps.GPSLongitude[0] + '°' +
                                            exifData.gps.GPSLongitude[1] + "'" +
                                            exifData.gps.GPSLongitude[2] + '"' +
                                            exifData.gps.GPSLongitudeRef;
                                */

                                latitude = convertDMSToDD(exifData.gps.GPSLatitude[0],
                                                            exifData.gps.GPSLatitude[1],
                                                            exifData.gps.GPSLatitude[2],
                                                            exifData.gps.GPSLatitudeRef);

                                longitude = convertDMSToDD(exifData.gps.GPSLongitude[0],
                                                            exifData.gps.GPSLongitude[1],
                                                            exifData.gps.GPSLongitude[2],
                                                            exifData.gps.GPSLongitudeRef);

                                latlng = latitude + ',' + longitude;

                                console.log('querying latlng', latlng);

                                // call Google Maps API
                                try {
                                    mapsClient.geocode({
                                        latlng: latlng
                                    }, function(err, response) {
                                        if (!err) {
                                            console.log('Google Maps API geocode response', response.json.results);
                                        }
                                    });
                                } catch (e) {
                                    console.error(e);
                                }

                                try {
                                    mapsClient.places({
                                        location: latlng
                                    }, function(err, response) {
                                        if (!err) {
                                            console.log('Google Maps API places response', response.json.results);
                                        }
                                    });
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                            if (!!exifData.image && !!exifData.image.Make && !!exifData.image.Model) {
                                let make, model;

                                make = exifData.image.Make;
                                model = exifData.image.Model;

                                admin.database().ref('cameras/makes').push(make).then(snapshot => {
                                    console.log('new cameras snapshot (real data)', snapshot.ref);
                                });
                                admin.database().ref('cameras/models').push(model).then(snapshot => {
                                    console.log('new cameras snapshot (real data)', snapshot.ref);
                                });
                            }
                        }


                        admin.database().ref('metadata/').push(exifData).then(snapshot => {
                            console.log('new metadata snapshot (real data)', snapshot.ref);
                        });
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
