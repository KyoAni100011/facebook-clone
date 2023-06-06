// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB79j-itCewk1cUoJFWOEm6SdvMLbtgsO8",
  authDomain: "facebook-clone-b0e48.firebaseapp.com",
  projectId: "facebook-clone-b0e48",
  storageBucket: "facebook-clone-b0e48.appspot.com",
  messagingSenderId: "384823393658",
  appId: "1:384823393658:web:dee1d300ae6895e9e6aac3",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase();

export { app, auth, firestore, storage, db };
