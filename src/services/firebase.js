import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBnTeRBgvlYUIcBTgESK1JOlT0epyabN-E",
  authDomain: "chatbox-1efe2.firebaseapp.com",
  databaseURL: "https://chatbox-1efe2.firebaseio.com",
  projectId: "chatbox-1efe2",
  storageBucket: "chatbox-1efe2.appspot.com",
  messagingSenderId: "927250568142",
  appId: "1:927250568142:web:4f89df03fd15885ebd119f",
  measurementId: "G-SVMZQ75XVW"
  };
  firebase.initializeApp(config);
  export const auth = firebase.auth;
  export const db = firebase.database();