import React from 'react'
import StdNav from '../Components/StdNav';
import Footer from "../Components/Footer";
import Button from 'react-bootstrap/Button';
import "../Styles/Appointment.css"
import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import {addDoc, collection, setDoc, doc, getDocs, updateDoc} from "firebase/firestore"
function Appointment() {

     //full name, student number, patron type, program, college, section, email
    //Add Book
    const [full_name, setFullName] = useState("")
    const [user_number, setUserNumber] = useState("")
    const [patron_type, setPatronType] = useState("")
    const [college, setCollege] = useState("")
    const [program, setProgram] = useState("")
    const [section, setSection] = useState("")
    const [email, setEmail] = useState("")
    const [time, setTime] = useState("")
    
    const addAppointment = async () => {
        await addDoc(collection(db, "Appointment"), {
            appnt_full_name:        full_name,
            appnt_user_number:      user_number,
            appnt_patron_type:      patron_type,
            appnt_college:          college,
            appnt_program:          program,
            appnt_section:          section,
            appnt_email:            email,
            appnt_time:             time
            })
        }

  return (
      <div className='Body'>
         <StdNav/>
        <div className='Content'>
       
          <div className='form'>
          <input  placeholder='Full Name' 
                    onChange={(event)=>{setFullName(event.target.value)}}/>
            <br/>
            <input  placeholder='Email' 
                    onChange={(event)=>{setEmail(event.target.value)}}/>
            <br/>
            <input  
                    placeholder='Section' 
                    onChange={(event)=>{setSection(event.target.value)}}/>
            <br/>
            <input  placeholder='Program' 
                    onChange={(event)=>{setProgram(event.target.value)}}/>
            <br/>
            <input  
                    placeholder='College' 
                    onChange={(event)=>{setCollege(event.target.value)}}/>
            <br/>
            <input  placeholder='Patron Type' 
                    onChange={(event)=>{setPatronType(event.target.value)}}/>
            <br/>
            <input  placeholder='User Number' 
                    onChange={(event)=>{setUserNumber(event.target.value)}}/>
            <br/>
            <input  placeholder='Time' 
                    onChange={(event)=>{setTime(event.target.value)}}/>

                <button
                variant ='dark' 
                onClick={addAppointment}>Submit</button>  
          </div>     
        </div>
            <Footer/>
       </div>
   
  )  
}

export default Appointment;