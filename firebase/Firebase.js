import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBKJysOqFccnh5VfashIXx6p5nmOaF8u7k",
    authDomain: "frame-bfc13.firebaseapp.com",
    projectId: "frame-bfc13",
    storageBucket: "frame-bfc13.firebasestorage.app",
    messagingSenderId: "246850531018",
    appId: "1:246850531018:web:539157cfe842500a960e33",
    measurementId: "G-R0G5LPPLLL"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const analytics = () => getAnalytics(app);

export default app