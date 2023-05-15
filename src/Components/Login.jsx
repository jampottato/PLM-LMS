import React from "react";
import Button from 'react-bootstrap/Button';
import { BsMicrosoft } from "react-icons/bs";
import { signInWithMicrosoft } from "../Database/firebase-config"
import { useNavigate } from "react-router-dom";

function Login() {
    
    const navigate = useNavigate()
    const login = async () => {
      await signInWithMicrosoft()
        .then((result) =>{ 
            console.log(result.user.email);
            localStorage.setItem('name', result.user.displayName);
            localStorage.setItem('email', result.user.email);
            navigate('/StdHome')
          })
        .catch((error) => {
            console.log(error.message);
        });
    };
  
    return (
        <Button onClick={login} variant="dark">Login with Microsoft</Button>
    );
  }
  
  export default Login;