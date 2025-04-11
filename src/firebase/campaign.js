// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwuYO9gExOmww5TV_5wCF0w-syW33RymY",
  authDomain: "campaign-65102.firebaseapp.com",
  projectId: "campaign-65102",
  storageBucket: "campaign-65102.firebasestorage.app",
  messagingSenderId: "1046761247223",
  appId: "1:1046761247223:web:2bf5da0d5e332138185ef2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore DB
export { db };
