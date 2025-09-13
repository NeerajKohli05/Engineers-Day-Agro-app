// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ use Realtime DB instead of Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAtHE_jy1mCbJuNW_7vjtvo6LcCnZDXZvs",
  authDomain: "agro-farming-f7ab4.firebaseapp.com",
  projectId: "agro-farming-f7ab4",
  databaseURL: "https://agro-farming-f7ab4-default-rtdb.firebaseio.com", // ✅ FIXED
  storageBucket: "agro-farming-f7ab4.appspot.com", // ✅ FIXED bucket name
  messagingSenderId: "16266002473",
  appId: "1:16266002473:web:c0304cac5cfcb12ec49c38",
  measurementId: "G-7JPCMW3VQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth + Realtime Database
export const auth = getAuth(app);
export const db = getDatabase(app); // ✅ Realtime Database
