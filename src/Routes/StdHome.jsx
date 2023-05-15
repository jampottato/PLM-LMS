import React, { useState, useEffect } from "react";
import StdNav from '../Components/StdNav';
import Footer from "../Components/Footer";
import "../Styles/StdHome.css"
import BooksList from "../Components/BookList";
import BorrowRecord from "../Components/BorrowRecord";

function StdHome() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setEmail(localStorage.getItem("email"));
  }, []);

  return (
    <div className='Body'>
      <StdNav/>
      <h2> WELCOME, {name} </h2>
        <div className='Content'>
       
          <div className="result">
            <BooksList/>
          </div>
          <div className="transrec">
            <BorrowRecord/>
          </div>
        </div>
        <Footer/>
       </div>
   
  ) 
}

export default StdHome
