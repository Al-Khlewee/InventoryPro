import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjtNn3-kbQj4pHDBJUpfD6wSFxW2WpfdQ",
  authDomain: "inventorypro-63ee1.firebaseapp.com",
  databaseURL: "https://inventorypro-63ee1-default-rtdb.firebaseio.com",
  projectId: "inventorypro-63ee1",
  storageBucket: "inventorypro-63ee1.firebasestorage.app",
  messagingSenderId: "929851147131",
  appId: "1:929851147131:web:c28177a0a3970cceb073de",
  measurementId: "G-3SKLYNQ6TH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };