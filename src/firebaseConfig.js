import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAHIvVRud6EL5xuViTDIeuxjJkqR8kcBO8',
  authDomain: 'sextivity-cef50.firebaseapp.com',
  databaseURL: 'https://sextivity-cef50.firebaseio.com',
  projectId: 'sextivity-cef50',
  storageBucket: 'sextivity-cef50.appspot.com',
  messagingSenderId: '818915923976',
  appId: '1:818915923976:web:d007c864e34c8540',
};

firebase.initializeApp(config);

// Firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const { currentUser } = auth;

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
