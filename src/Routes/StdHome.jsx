import React, { useState, useEffect } from "react";

import StdNav from '../Components/StdNav';
import Footer from "../Components/Footer";
import "../Styles/StdHome.css"
import BooksList from "../Components/BookList";
import BorrowRecord from "../Components/BorrowRecord";

import { addDoc, collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db, auth } from "../Database/firebase-config";

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
  const [pn, setPN] = useState('');
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

  const [activePatronEmail, setActivePatronEmail] = useState(localStorage.getItem('email'))

  var user = auth.currentUser;
  // console.log('Value of em')
  // console.log(em)
  console.log('FIRST\t' + pn)
  const confirmEnteredData = query(collection(db, "UserData"), where("patron_email", "==", activePatronEmail))
  // console.log('confirmEnteredData EMAIL')
  // console.log(em)
  // if (user != null) {
  //   console.log(user.email)
  // }
  // console.log('-----------------')

  useEffect(()=>{
    if(user == null){
      // alert('NULL')
    } else {
        // alert(user.email)   
        setActivePatronEmail(user.email)
    }
  },[user])
    // Check if the user has already ENTERED DATA completely
    // if yes : no need for modal
    // if no : show modal
    const snapshotQuery = async () => {
      await getDocs(confirmEnteredData).then((v) => {
        console.log('Entered here')
        // alert('active email'+activePatronEmail)
        if(v.size > 0){
          v.forEach((doc)=>{
            // console.log("snapShotQuery")
            // console.log(doc.data())
            if(doc.data().is_completed == true){
              // console.log('is completed true')
              setPN(doc.data().patron_id)
              // localStorage.setItem("pn", pn)
              setOpen(false);
            } else {
              // console.log('is completed false')
              setOpen(true)
            } 
          })
        } else {
          // console.log('query 0 or -1')
          // console.log(v.size)
          // console.log('--------------')
          setOpen(true)
        }
      })
    }
    snapshotQuery();

  const filterInpSN = (val) => {
    setPN(val.replace(/\D/g, ''))
  }

  console.log('SECOND\t' + pn)

  const colleges = ['CET','PLMBS','CN', 'COS', 'CHASS', 'COL', 'CAUP', 'CPT', 'Educ']

  const handleClose = async (event) => {
    if(pn.length == 9) {
      setStudentInp("")
      // console.log(studentInp + '/tINPUT')
    }

    if(pn.length == 9 && program.length > 0 && college.length > 0){
      setStudentInp("")
      // console.log("ADDING SOME DATA NOW")
      // Add the user entered data
      await addDoc(collection(db,"UserData"), {
        college:college,
        patron_email:localStorage.getItem("email"),
        patron_name:localStorage.getItem("name"),
        program:program,
        patron_id:pn,
        is_completed:true
      })

      // ERROR HERE : FIX THIS BUG
      alert(activePatronEmail)
      
      console.log("DONE ADDING PN", pn)
      setOpen(false);
      window.location.reload()
    } else {
      alert("SN LENGTH\t" + pn.length)
      if(pn.length < 9) {
        setStudentInp("You have missed some digits")
        // console.log(studentInp)
      } else {
        setStudentInp("")
      }
      
      return;}
  };

  useEffect(() => {
    setName(localStorage.getItem("name"));
    // console.log("MANY THINGS HERE")
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
  }, [name, college, pn, studentInp]);

  const noRefresh = (event) => {
    event.preventDefault();
  }

  return (
  <>
    <Dialog open={open} maxWidth="md" fullWidth={false} scroll="body">
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
                  value={pn}
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
        <BooksList activePID={pn}/>
      </>
      <>
				<BorrowRecord/>
      </>
      <Footer/>
    </div>
  </>
  ) 
}

export default StdHome
