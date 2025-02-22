// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFr1pOb74fSQNufvjfSKsKHSWwgH6N_rs",
  authDomain: "tft-tracker-313ff.firebaseapp.com",
  projectId: "tft-tracker-313ff",
  storageBucket: "tft-tracker-313ff.firebasestorage.app",
  messagingSenderId: "527969441602",
  appId: "1:527969441602:web:28316326f058e732ea9adb",
  measurementId: "G-P10PD2H1Y2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);