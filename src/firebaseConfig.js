import firebase from 'firebase';
import 'firebase/firestore';

// Initialize Firebase
const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
};

firebase.initializeApp(config);

// Firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const { currentUser } = auth;

// Date issue fix
const settings = {
  timestampsInSnapshots: true,
};

db.settings(settings);

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
