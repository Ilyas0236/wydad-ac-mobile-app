// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuration Firebase (REMPLACEZ avec VOS valeurs)
const firebaseConfig = {
  apiKey: "AIzaSyBb2m-4LXwn900C1cI-wV7fGxI-kZYGmuE",
  authDomain: "wydad-ac-app.firebaseapp.com",
  projectId: "wydad-ac-app",
  storageBucket: "wydad-ac-app.firebasestorage.app",
  messagingSenderId: "455178697522",
  appId: "1:455178697522:web:ab93881010a8706dddb52b",
  measurementId: "G-WKJ1TP5S7X"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
