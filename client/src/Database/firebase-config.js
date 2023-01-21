import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  signOut,
  OAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJCPQ5tIkQXnxlXlDiKBaMFanmnhMzmTU",
  authDomain: "se-lms-tk.firebaseapp.com",
  projectId: "se-lms-tk",
  storageBucket: "se-lms-tk.appspot.com",
  messagingSenderId: "756504720193",
  appId: "1:756504720193:web:b7e26f0c10f979eaf367c0",
  measurementId: "G-Z2D2C1WLC3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const provider = new OAuthProvider("microsoft.com");

export const signInWithMicrosoft = async () =>
  await signInWithPopup(
    auth,
    provider.setCustomParameters({
      prompt: "consent",
      login_hint: "",
      tenant: "c83f55a7-7fe8-4934-b759-09926430aef0",
    })
  );
export const db = getFirestore(app);
export const logOut = () => {
  signOut(auth);
};
