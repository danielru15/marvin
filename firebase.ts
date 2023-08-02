// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
//import { getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj7mdHYTtGj-F_KwQIQOEBDJEXkjv7J-A",
  authDomain: "marvi-dec8a.firebaseapp.com",
  projectId: "marvi-dec8a",
  storageBucket: "marvi-dec8a.appspot.com",
  messagingSenderId: "220932831092",
  appId: "1:220932831092:web:c608aa1242d5ca68919e21"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth()
const db = getFirestore();
export {app, auth,db}