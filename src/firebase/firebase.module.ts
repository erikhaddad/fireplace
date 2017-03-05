import {AngularFireModule, AuthMethods} from 'angularfire2';

export const firebaseConfig = {
    apiKey: "AIzaSyCjt8GegI5LGswEdbWi6-WVlCJwxoIrcRo",
    authDomain: "fireplace-22d32.firebaseapp.com",
    databaseURL: "https://fireplace-22d32.firebaseio.com",
    storageBucket: "fireplace-22d32.appspot.com",
    messagingSenderId: "166679574539"
};

export const firebaseAuthConfig = {
  method: AuthMethods.Popup,
  remember: 'default'
};

export const FirebaseModule = AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig);
