import {AngularFireModule, AuthMethods} from 'angularfire2';

export const firebaseConfig = {
    apiKey: "AIzaSyCN6tRaZEdRALfbKLQnnYR2iZiSKeOV4l4",
    authDomain: "fireplace-867ee.firebaseapp.com",
    databaseURL: "https://fireplace-867ee.firebaseio.com",
    storageBucket: "fireplace-867ee.appspot.com",
    messagingSenderId: "1085491840581"
};

export const firebaseAuthConfig = {
  method: AuthMethods.Popup,
  remember: 'default'
};

export const FirebaseModule = AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig);
