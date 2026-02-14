import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBE07mc-Elrzur5NQy-1nvvKsOjaO5pOhM",
  authDomain: "embraze-react.firebaseapp.com",
  databaseURL: "https://embraze-react-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "embraze-react",
  storageBucket: "embraze-react.firebasestorage.app",
  messagingSenderId: "181038669879",
  appId: "1:181038669879:web:2da446c744ce86964cdfb2"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
