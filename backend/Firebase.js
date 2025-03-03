import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsGW-i5uI9CvIsvW7kmTvSJs3C-AGT06o",
  authDomain: "tft-tracker-d8a59.firebaseapp.com",
  projectId: "tft-tracker-d8a59",
  storageBucket: "tft-tracker-d8a59.firebasestorage.app",
  messagingSenderId: "388579002661",
  appId: "1:388579002661:web:96952cdcb5a7b6e9f672cc",
  measurementId: "G-TQE02QTP1Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const analytics = () => getAnalytics(app);

export default app