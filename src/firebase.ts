import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7IcCuB1dQJwUJOVOFS9G42l3U9sx72Ig",
  authDomain: "dumnezeu-este-cu-noi.firebaseapp.com",
  projectId: "dumnezeu-este-cu-noi",
  storageBucket: "dumnezeu-este-cu-noi.firebasestorage.app",
  messagingSenderId: "498564687732",
  appId: "1:498564687732:web:c0fee56c7d37673c21ee21",
  measurementId: "G-9X1XKPPNT3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);