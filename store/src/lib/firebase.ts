import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVWH3M6rkYZda5kvZHaUH2IjYfndI21F0",
  authDomain: "websites-4c0f0.firebaseapp.com",
  projectId: "websites-4c0f0",
  storageBucket: "websites-4c0f0.firebasestorage.app",
  messagingSenderId: "183301522493",
  appId: "1:183301522493:web:c3ebc3932adc57005f5654",
  measurementId: "G-DED6C1L5Z2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
