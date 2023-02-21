// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAJCPQ5tIkQXnxlXlDiKBaMFanmnhMzmTU",
  authDomain: "se-lms-tk.firebaseapp.com",
  projectId: "se-lms-tk",
  storageBucket: "se-lms-tk.appspot.com",
  messagingSenderId: "756504720193",
  appId: "1:756504720193:web:b7e26f0c10f979eaf367c0"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)