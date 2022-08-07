import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import "firebase/compat/database"

// var firebaseConfig = {
//   apiKey: "AIzaSyDO7HNc-SdrPgyGaqScbeY0tGFQhC_IxpI",
//   authDomain: "fbtest-1-eb4bc.firebaseapp.com",
//   databaseURL: "https://fbtest-1-eb4bc-default-rtdb.firebaseio.com",
//   projectId: "fbtest-1-eb4bc",
//   storageBucket: "fbtest-1-eb4bc.appspot.com",
//   messagingSenderId: "614668429474",
//   appId: "1:614668429474:web:904a9d8d72569f01228ffb"
// };

// firebase.initializeApp(firebaseConfig);
// const databaseRef = firebase.database().ref() 
// export const myRef = databaseRef.child("myRef")
// export default firebase

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/database"

var firebaseConfig = {
  apiKey: "AIzaSyBKPyRqTuw3x-e5S8pGR2dKxeGEVXw1-D4",
  authDomain: "discorddb-75dcb.firebaseapp.com",
  projectId: "discorddb-75dcb",
  storageBucket: "discorddb-75dcb.appspot.com",
  messagingSenderId: "224617886108",
  appId: "1:224617886108:web:3bc3f9f45fdac562959859"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)