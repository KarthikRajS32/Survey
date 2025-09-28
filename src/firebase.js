import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBu_edYnjYTtRpljx5CAUIgEURRtsRKhuQ",
  authDomain: "vsurvey-form.firebaseapp.com",
  projectId: "vsurvey-form",
  storageBucket: "vsurvey-form.firebasestorage.app",
  messagingSenderId: "142095218079",
  appId: "1:142095218079:web:67db0b3e915e96a1f3f9aa",
  measurementId: "G-J1ZF68M40W"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };