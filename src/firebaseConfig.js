import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase
const config = {
  apiKey: process.env.VUE_APP_FIREBASE_SECRET_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(config);

// Firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const {
  currentUser
} = auth;

// Firebase collections
const usersCollection = db.collection('users'); // User Profile data
const partnersCollection = db.collection('partners'); // User Partner data
const sexCollection = db.collection('sex'); // User sex data
const feedbackCollection = db.collection('feedback'); // Feedback on app by User

export {
  db,
  auth,
  currentUser,
  usersCollection,
  partnersCollection,
  sexCollection,
  feedbackCollection,
};
