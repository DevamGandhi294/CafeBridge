import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeFrPpITTcOlEVxgbkTyrRSjFir2n8WVE",
  authDomain: "cafebridge-9882c.firebaseapp.com",
  projectId: "cafebridge-9882c",
  storageBucket: "cafebridge-9882c.firebasestorage.app",
  messagingSenderId: "1069767579109",
  appId: "1:1069767579109:web:708e676194a0ebfd9d4b0c",
  measurementId: "G-NHK1VQC4QD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
