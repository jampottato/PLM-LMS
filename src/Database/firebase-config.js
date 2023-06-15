import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  signOut,
  OAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  // apiKey: "AIzaSyB6yCoYZzyuLDzI8pbHtFBQvIDQzAIa1pc",

  // authDomain: "plms-backup.firebaseapp.com",

  // projectId: "plms-backup",

  // storageBucket: "plms-backup.appspot.com",

  // messagingSenderId: "177957918050",

  // appId: "1:177957918050:web:88471749300f12b6c1483b"


   //------------------------------------------
  apiKey: "AIzaSyAJCPQ5tIkQXnxlXlDiKBaMFanmnhMzmTU",

  authDomain: "se-lms-tk.firebaseapp.com",

  projectId: "se-lms-tk",

  storageBucket: "se-lms-tk.appspot.com",

  messagingSenderId: "756504720193",

  appId: "1:756504720193:web:4dea4935e9b1aa09f367c0",

  measurementId: "G-W85R65CL61"

  //------------------------------------------

  // apiKey: "AIzaSyAZgU0sOBHjzwsfeDR_lfRmigy9Jtw-ADY",

  // authDomain: "librarymanage2.firebaseapp.com",

  // projectId: "librarymanage2",

  // storageBucket: "librarymanage2.appspot.com",

  // messagingSenderId: "931290747203",

  // appId: "1:931290747203:web:5971836c5f90dc57d6dff6"
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
      //       c83f55a7-7fe8-4934-b759-09926430aef0
    })
  );
export const db = getFirestore(app);
export const logOut = () => {
  signOut(auth);
};

// 36460649-7ffd-4d7d-b4e8-77a151768180

// Et08Q~Ka4GIPzc2sXIDpmypnZPPZO4sNyBVxVdta

// b74fd2a7-7560-425b-a135-19687a7f325f
// yTy8Q~7VEc6eNfC.61jScs6YphvGxeQuNNdhJbge