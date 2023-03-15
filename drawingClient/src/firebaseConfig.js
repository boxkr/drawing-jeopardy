// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcTMvRnOPqy7GmeDgEAt8SdZjq3SkgaJU",
  authDomain: "backtothedrawingboard.firebaseapp.com",
  projectId: "backtothedrawingboard",
  storageBucket: "backtothedrawingboard.appspot.com",
  messagingSenderId: "720316333150",
  appId: "1:720316333150:web:e341aa57ca0a3a766d48cf",
  measurementId: "G-94ZFX1K47L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)


export {db}