import React from "react";
import {auth, db} from "../Database/firebase-config";
import {setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, documentId, updateDoc} from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import { BsMicrosoft } from "react-icons/bs";
import { signInWithMicrosoft } from "../Database/firebase-config"
import { useNavigate } from "react-router-dom";
import EnterInfo from "../Routes/EnterInfo";

function Login() {
  
    function containsNumbers(str) {
      return /[0-9]/.test(str);
    }
    
    const navigate = useNavigate()
    const login = async () => {
      await signInWithMicrosoft()
        .then((result) =>{ 
          // add the data of the logged in account in USERDATA
          // notify the home that the active account is the user logged in

            localStorage.clear();
            localStorage.setItem('name', result.user.displayName);
            localStorage.setItem('email', result.user.email);

            console.log('GO BEFORE ANYTHING')
            // For testing purposes, it is set to 0, set to 1 for production
            if (containsNumbers(result.user.email) == 1 ){
              console.log('GO TO HOME')
              navigate('/StdHome')
            } else {
              console.log('GO TO ADMIN')
              navigate('/Admin')
            }
            return result.user;
            
          }).then((v)=>{alert(v.email)})
        .catch((error) => {
          alert(error.message);
        });
    };
  
    return (
        <Button onClick={login} variant="dark">Login with Microsoft</Button>
    );
  }
  
  export default Login;