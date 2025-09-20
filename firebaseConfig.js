import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyAhRhbJ4BOJR4xCsZC1e1eI68SX6m3gpW8",
  authDomain: "brocap-f5364.firebaseapp.com",
  projectId: "brocap-f5364",
  storageBucket: "brocap-f5364.firebasestorage.app",
  messagingSenderId: "1070218478981",
  appId: "1:1070218478981:web:0293c246f35547f553b0ec"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);   
export const storage = getStorage(app);

