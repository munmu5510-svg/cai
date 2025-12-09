import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA8Aruwgc3EHPiwSLFfSKpkJN05fiHXjCg",
  authDomain: "upside-1ff31.firebaseapp.com",
  databaseURL: "https://upside-1ff31-default-rtdb.firebaseio.com",
  projectId: "upside-1ff31",
  storageBucket: "upside-1ff31.firebasestorage.app",
  messagingSenderId: "707128980621",
  appId: "1:707128980621:web:712438133ac0669d7a1ec4",
  measurementId: "G-MEHK9E7WX9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);