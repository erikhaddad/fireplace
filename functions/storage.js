const _ = require('lodash');
const functions = require('firebase-functions');
const storage = require('@google-cloud/storage')();


function deleteFile(evt) {
  let env = functions.env;

  // We only care about deletions
  if (evt.data.val()) {
    console.log('Not a deletion, skipping.');
    return;
  }

  // Delete the file if there's a storage path
  let path = _.get(evt.data.previous.val(), 'data.path');
  if (path) {
    return storage.bucket(env.firebase.storageBucket).file(path).delete();
  }
}


module.exports = {
  deleteFile: deleteFile
};
