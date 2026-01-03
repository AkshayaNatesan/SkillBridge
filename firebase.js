import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Your Firebase configuration (KEEP YOUR VALUES)
const firebaseConfig = {
  apiKey: "AIzaSyCBD5Q7Um_VAAgimuOyOW_k7cR5-TT8CUE",
  authDomain: "skillbridge-1139a.firebaseapp.com",
  projectId: "skillbridge-1139a",
  storageBucket: "skillbridge-1139a.appspot.com",
  messagingSenderId: "93126528450",
  appId: "1:93126528450:web:9d0a4caa0118b3cdb85a5b",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT THESE (THIS FIXES YOUR ERROR)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
