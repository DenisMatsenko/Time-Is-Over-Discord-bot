import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/database"

var firebaseConfig = {
  apiKey: "AIzaSyAOF6gO29jAnAzxoKdEj0VmohWIMMuUa6Y",
  authDomain: "discorddb2build.firebaseapp.com",
  projectId: "discorddb2build",
  storageBucket: "discorddb2build.appspot.com",
  messagingSenderId: "790016192233",
  appId: "1:790016192233:web:6a8a28804e45c69a5b0a78",
  databaseURL: "https://discorddb2build-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)