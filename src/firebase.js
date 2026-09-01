import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBllhsTbIFAAk_68wG9nWT5LGHhJQfIYOU",
  authDomain: "nfc-fridge-gallery.firebaseapp.com",
  projectId: "nfc-fridge-gallery",
  storageBucket: "nfc-fridge-gallery.firebasestorage.app",
  messagingSenderId: "494255430444",
  appId: "1:494255430444:web:31dc2c44dfc9ca793faa89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();