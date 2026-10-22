// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzHIv0-NTRvnTFgf0mFu1bucxXj6kMoXE",
  authDomain: "chqvagas-c9b0c.firebaseapp.com",
  projectId: "chqvagas-c9b0c",
  storageBucket: "chqvagas-c9b0c.firebasestorage.app",
  messagingSenderId: "232566126755",
  appId: "1:232566126755:web:1588cd63b9841abd7d6716",
  measurementId: "G-PCVTN1KYK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);