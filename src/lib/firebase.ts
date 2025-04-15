import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBBrmTSYLpQ91PhqyrOU1uvun2gdE_xCtg",
  authDomain: "zeyrek-cafe-qr.firebaseapp.com",
  projectId: "zeyrek-cafe-qr",
  storageBucket: "zeyrek-cafe-qr.appspot.com",
  messagingSenderId: "51367985923",
  appId: "1:51367985923:web:0d3eca653dda5a3bbc5f36",
  measurementId: "G-TSPVJGF49S",
  databaseURL: "https://zeyrek-cafe-qr-default-rtdb.europe-west1.firebasedatabase.app"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);