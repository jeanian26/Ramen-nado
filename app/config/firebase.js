/* eslint-disable prettier/prettier */
import {initializeApp} from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCwmNKMu__Q_m6g7FcM8Y1dhibgerSnZFI',
  authDomain: 'ramen-nado-86f76.firebaseapp.com',
  databaseURL:
    'https://ramen-nado-86f76-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'ramen-nado-86f76',
  storageBucket: 'ramen-nado-86f76.appspot.com',
  messagingSenderId: '475279679552',
  appId: '1:475279679552:web:97cef742b499f14b973fa5',
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export function passAuth() {
  return auth;
}
export function testAPP() {
  console.log(app);
}

export var USERID;
export var USERNAME;
export var USEREMAIL;
export var USERIMAGE;

export function checkLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      console.log(user);
    } else {
      console.log('no user logged in');
    }
  });
}

export const signUpUser = async (email, password) => {
  try {
    createUserWithEmailAndPassword(auth, email, password).then((result) => {
      const user = result.user;
      console.log(user);
    }).catch((e)=>{console.log(e);});
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const sendEmailWithPassword = async (email) => {
  try {
    await sendPasswordResetEmail(email);
    console.log('success');
    return {};
  } catch (error) {
    console.log(error);
    return {
      error: error.message,
    };
  }
};
