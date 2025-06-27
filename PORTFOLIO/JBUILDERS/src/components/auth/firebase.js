// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_4Lgt18COnZ_dKwtw2bUJET2gXdDgLtU",
  authDomain: "j-builders.firebaseapp.com",
  projectId: "j-builders",
  storageBucket: "j-builders.appspot.com",
  messagingSenderId: "864477014685",
  appId: "1:864477014685:web:89b310ee371b484fef0274"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
