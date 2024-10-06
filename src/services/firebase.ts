import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVZCR6TR4naNmloO13S2ZZahQQm-cGSKk",
  authDomain: "schoolbustracker-744ff.firebaseapp.com",
  projectId: "schoolbustracker-744ff",
  storageBucket: "schoolbustracker-744ff.appspot.com",
  messagingSenderId: "231080355576",
  appId: "1:231080355576:web:160f914f0625f2fd6bfd0d",
  measurementId: "G-MJP3RERDCN",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
