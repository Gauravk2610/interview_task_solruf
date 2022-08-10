// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1STer3ZGN0CHZVRWwx7G4fC_O9nJG_hc",
  authDomain: "profile-7e953.firebaseapp.com",
  projectId: "profile-7e953",
  storageBucket: "profile-7e953.appspot.com",
  messagingSenderId: "141278811113",
  appId: "1:141278811113:web:e92c5168e73bf0a0f0f178"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore()
const auth = getAuth()
const storage = getStorage()

export { app, db, storage, auth }