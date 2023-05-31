import React, { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
// import {View, Text} from 'react-native';

import StdNav from '../Components/StdNav';
import Footer from "../Components/Footer";
import "../Styles/StdHome.css"
import BooksList from "../Components/BookList";
import BorrowRecord from "../Components/BorrowRecord";

import { doc, setDoc, addDoc, collection, getDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../Database/firebase-config";
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



function StdHome() {
  const [name, setName] = useState("");
  const [sn, setSN] = useState("");
  const [studentInp, setStudentInp] = useState("")
  const [college, setCollege] = useState("")
  const [program, setProgram] = useState("")
  const [programs, setPrograms] = useState([])
  const [open, setOpen] = useState(false);

  

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

  const cptPrograms = [
    "Bachelor of Science in Physical Therapy",
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

  const confirmEnteredData = query(collection(db, "UserData"), where("email", "==", localStorage.getItem("email")))
  const snapshotQuery = async () => {
    console.log("UMI::OTILSI")
    await getDocs(confirmEnteredData).then((v) => {
      console.log("DOCS SEARCHED")
      console.log(v.size)
      if(v.size > 0){
        v.forEach((doc)=>{
          if(doc.data().is_completed == true){
            setSN(doc.data().student_number)
            localStorage.setItem("sn", sn)
            setOpen(false);
          } else {
            setOpen(true)
          } 
        })
      } else {
        setOpen(true)
        console.log("3UMI::OTILSI")
      }
    })
  }
  snapshotQuery();

  const filterInpSN = (val) => {
    setSN(val.replace(/\D/g, ''))

  }

  const colleges = ['CET','PLMBS','CN', 'COS', 'CHASS', 'COL', 'CAUP', 'CPT', 'Educ']

  const handleClose = async (event) => {
    if(sn.length == 9) {
      setStudentInp("")
      console.log(studentInp)
    }

    if(sn.length == 9 && program.length > 0 && college.length > 0){
      setStudentInp("")
      // Add the user entered data
      await addDoc(collection(db,"UserData"), {
        college:college,
        email:localStorage.getItem("email"),
        name:localStorage.getItem("name"),
        program:program,
        student_number:sn,
        is_completed:true
      })
      setOpen(false);
    } else {
      alert("SN LENGTH\t" + sn.length)
      if(sn.length < 9) {
        setStudentInp("You have missed some digits")
        console.log(studentInp)
      } else {
        setStudentInp("")
      }
      
      return;}
  };

  useEffect(() => {
    setName(localStorage.getItem("name"));

    // When College is selected, specific programs for it will be shown in the dropdown of PROGRAMS
    switch (college) {
      case undefined:
        setPrograms([''])
        break
      case "CET":
        setPrograms(cetPrograms)
        break;
      case "CPT":
        setPrograms(["Bachelor of Science in Physical Therapy"])
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
      case "CN":
        setPrograms(["Bachelor of Science in Nursing"])
        break;
    } 
  }, [name, college, sn, studentInp]);

  const noRefresh = (event) => {
    event.preventDefault();
  }

  return (
  <>
    <Dialog open={open} maxWidth="md" fullWidth="false" scroll="body">
      <DialogTitle>Enter your details.</DialogTitle>
      <DialogContent>
        <form onSubmit={noRefresh} focused="true" target="_self">
            <DialogContentText>
              <i>All fields with asterisk (*) must be filled</i>
            </DialogContentText>

            <FormControl required sx={{ mt: 3, minWidth: 180 }}>
                <TextField 
                  required
                  inputProps={{maxLength:9}}
                  margin="dense"
                  id="sn"
                  label="Student Number"
                  type="text"
                  value={sn}
                  onChange={e => filterInpSN(e.target.value)}
                /> 
              <FormHelperText>{studentInp}</FormHelperText>
            </FormControl>

            <br/>

            <FormControl required sx={{ mt: 3, minWidth: 180 }}>
              <InputLabel>College</InputLabel>
              <Select
                required
                onChange={e => setCollege(e.target.value)}
                label="College"
                value={college}
                placeholder="Piliin mo taga CET"
              >
                {colleges.map(item => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>

            <br/>

            <FormControl required sx={{ mt: 3, minWidth: 180 }}>
              <InputLabel>Program</InputLabel>
              <Select
                required
                onChange={e => setProgram(e.target.value)}
                label="Program"
                value={program}
              >
                {programs.map(item => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
            
            
            <DialogActions >
              <Button type="submit" variant="contained" sx={{bgcolor:"primary.main", width:1, mt:3}} onClick={handleClose}>SUBMIT</Button>
            </DialogActions>
        </form>

      </DialogContent>
    </Dialog>
    
    
    <div className='Body'>
      <StdNav/>
      <>
        <BooksList/>
      </>
      {/* <div className='Content'> */}
        
        {/* <div className="transrec"> */}
        <>
          <BorrowRecord/>
          </>
        {/* </div> */}
      {/* </div> */}
      <Footer/>
    </div>
  </>
  ) 
}

export default StdHome
