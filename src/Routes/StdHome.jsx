import React, { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";

import StdNav from '../Components/StdNav';
import Footer from "../Components/Footer";
import "../Styles/StdHome.css"
import BooksList from "../Components/BookList";
import BorrowRecord from "../Components/BorrowRecord";

import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../Database/firebase-config";

import { createStyles, rem, Select, TextInput } from '@mantine/core';

function StdHome() {
  const [name, setName] = useState("");
  const [sn, setSN] = useState("");
  const [college, setCollege] = useState("")
  const [program, setProgram] = useState("")
  const [programs, setPrograms] = useState([])
  const [open, setOpen] = useState(true);

  const cetPrograms = [
    "Bachelor of Science in Chemical Engineering - BSCHE",
    "Bachelor of Science in Civil Engineering - BSCE",
    "Bachelor of Science in Computer Engineering - BS CpE",
    "Bachelor of Science in Computer Science - BSCS",
    "Bachelor of Science in Electrical Engineering - BSEE",
    "Bachelor of Science in Electronics Engineering - BS ECE",
    "Bachelor of Science in Information Technology - BSIT",
    "Bachelor of Science in Manufacturing Engineering - BSMFGE",
    "Bachelor of Science in Mechanical Engineering - BSME"
  ]

  const caupPrograms = [
    "Bachelor of Science in Architecture - BS Arch"
  ]

  const eduPrograms = [
    "Bachelor of Elementary Education (Generalist) (BEEd)",
    "Bachelor of Secondary Education major in English (BSEd-Eng)",
    "Bachelor of Secondary Education major in Filipino (BSEd-Fil)",
    "Bachelor of Secondary Education major Mathematics (BSEd-Math)",
    "Bachelor of Secondary Education major in Sciences (BSEd-Sciences)",
    "Bachelor of Secondary Education major in Social Studies (BSEd-SS)",
    "Bachelor of Physical Education (BPE)"
  ]

  const chassPrograms = [
    "Bachelor of Arts in Communication - BAC",
    "Bachelor of Arts in Communication Major in Public Relations - BAC-PR",
    "Bachelor of Arts in Public Relations - BAPR",
    "Bachelor of Science in Social Work - BS SW"
  ]

  const cosPrograms = [
    "Bachelor of Science in Biology - BS Bio",
    "Bachelor of Science in Chemistry - BS Chem",
    "Bachelor of Science in Mathematics - BS Math",
    "Bachelor of Science in Psychology - BS PSY"
  ]

  const plmbsPrograms = [
    
    "Bachelor of Science in Accountancy - BS ACCTG",
    "Bachelor of Science in Business Administration Major in Business Economics - BSBA BE",
    "Bachelor of Science in Business Administration Major in Financial Management - BSBA FM",
    "Bachelor of Science in Business Administration Major in Human Resource Management - BSBA HRM",
    "Bachelor of Science in Business Administration Major in Marketing Management - BSBA MM",
    "Bachelor of Science in Business Administration Major in Operations Management - BSBA OM",
    "Bachelor of Science in Entrepreneurship - BS ENTRE",
    "Bachelor of Science In Hospitality Management - BSHM",
    "Bachelor of Science in Tourism Management - BSTM"

  ]

  const handleClose = async () => {
    // Add the user entered data
    await addDoc(collection(db,"UserData"), {
      college:college,
      email:localStorage.getItem("email"),
      name:localStorage.getItem("name"),
      program:program,
      student_number:sn,
    })
    setOpen(false);
  };

  useEffect(() => {
    setName(localStorage.getItem("name"));
    console.log("USEEFFECT in COLLEGE")
    console.log(college == "CET")
    // When College is selected, specific programs for it will be shown in the dropdown of PROGRAMS
    switch (college) {
      case "CET":
        setPrograms(cetPrograms)
        break;
      case "CHASS":
        setPrograms(chassPrograms)
        break;
      case "CAUP":
        setPrograms(caupPrograms)
        break;
      case "COS":
        setPrograms(cosPrograms)
        break;
      case "Educ":
        setPrograms(eduPrograms)
        break;
      case "PLMBS":
        setPrograms(plmbsPrograms)
        break;
    } 

    console.log("college")
    console.log(college)
  }, [name, college]);

  const [age, setAge] = React.useState('');


  return (
    <>
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth="true" scroll="body">
      <DialogTitle>Submit</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter your details.
        </DialogContentText>
        <TextField 
          required
          autoFocus
          margin="dense"
          id="sn"
          label="Student Number"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setSN(e.target.value)}
        />
        <Select
          dropdownPosition="bottom"
          onChange={e => setCollege(e)}
          value = {college}
          label="College"
          placeholder="Piliin mo ako please"
          data={['CET','PLMBS','CN', 'COS', 'CHASS', 'COL', 'CAUP', 'PT', 'Educ', 'CM']}
        />
        <Select
          onChange={setProgram}
          value = {program}
          label="Program"
          placeholder="Piliin mo taga CET"
          data={programs}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ENTER</Button>
      </DialogActions>
    </Dialog>
    
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
    </>
  ) 
}

export default StdHome
