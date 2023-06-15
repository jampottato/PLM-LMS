import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";

import StdNav from '../Components/StdNav';
import Footer from "../Components/Footer";
import "../Styles/StdHome.css"
import BookList from "../Components/BookList";
import BorrowReserveFilter from "../Components/BorrowReserve/BorrowReserveFilter";

import { addDoc, collection, query, where, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
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
import { Container } from "react-bootstrap";
import { Grid, Header } from "@mantine/core";



function StdHome() {
	const navigate = useNavigate()
	const [pn, setPN] = useState('');
	const [studentInp, setStudentInp] = useState("")
	const [college, setCollege] = useState("")
	const [program, setProgram] = useState("")
	const [programs, setPrograms] = useState([])
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [activePatronEmail, setActivePatronEmail] = useState('')	
	const colleges = ['CET','PLMBS','CN', 'COS', 'CHASS', 'COL', 'CAUP', 'CPT', 'Educ']

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
	const [isInitialized, setInitialized] = useState(false)

	const [currentDate, setCurrentDate] = useState()

    // Fetch the Universal Time to det the date and time to only one source and sync 
    useEffect(() => {
        fetch("https://www.worldtimeapi.org/api/timezone/Asia/Manila.json").then( res => {
            res.text().then( val => {
                const toObj = JSON.parse(val) 
                const newDate = new Date(toObj.datetime)
                setCurrentDate(newDate)
                
            })
        })
    },[])

	useEffect(()=>{
		const issueRef = collection(db, 'Issue')
		const currentUser = query(issueRef, where('patron_email', '==', activePatronEmail), where('issue_status', '==', 'confirmed'))
		
		getDocs(currentUser)
		.then( results => {
			let dateToday = currentDate
			results.docs.map((docH)=>{
				//Count penalty if the days are in the same month
				let times = Math.abs(dateToday.getDate() - docH.data().issue_due.toDate().getDate())
				let counter = 0
				let issueMonth = docH.data().issue_due.toDate().getMonth()+1
				let issueDate = docH.data().issue_due.toDate().getDate()
				let issueYear = docH.data().issue_due.toDate().getFullYear()
				let issueDateFormat = issueMonth + '-' + issueDate + '-' + issueYear;

				let todayMonth = dateToday.getMonth()+1
				let todayDate = dateToday.getDate()
				let todayYear = dateToday.getFullYear()
				let todayDateFormat = todayMonth + '-' + todayDate + '-' + todayYear;

				//Count penalty to check if the days are not in the same month
				//  if it is not in the same month, the {times} will be changed in the value of {counter}
				//  exampel: (April - March) = (4 - 3) = 1
				if((todayMonth -  issueMonth) > 0) {

					//Iterate the issue due date until it is equal to today's date 
					//  counting the number of days to penalize
					while(issueDateFormat != todayDateFormat){
						dateToday.setDate(dateToday.getDate() - 1)
						todayMonth = dateToday.getMonth()+1
						todayDate = dateToday.getDate()
						todayYear = dateToday.getFullYear()
						todayDateFormat = todayMonth + '-' + todayDate + '-' + todayYear;
						
						counter+=1
					}
					times = counter
				} 

				// Assign the penalty value calculated accdg. to the calculation above
				if(docH.data().issue_due.toDate() < dateToday){
					updateDoc(doc(db, "Issue", docH.id),{
						issue_fine: times*parseInt(50)
					})
				} 
			})
		})
		.then(()=>{
			console.log('GO TO HOME')
			navigate('/StdHome')
		})
	},[activePatronEmail])

	useEffect(()=>{
		auth.onAuthStateChanged(user => {
			if(user == null) {
				// User has logged out
			}
			if(user != null) {
				console.log('|')
				const userEmail	= user.email;
				const userName  	= user.displayName;
				setActivePatronEmail(userEmail)
				setName (userName)
			}
			if(isInitialized == false){
				setInitialized(true)
			}
		})
	},[isInitialized])



	// Check if the user has already ENTERED DATA completely
	// if yes : no need for modal
	// if no : show modal
	const snapshotQuery = async () => {
		let confirmEnteredData =  query(collection(db, "UserData"), where("patron_email", "==", activePatronEmail))

		console.log('snapshotquery')
		//Query result from UserData
		await getDocs(confirmEnteredData).then((v) => {
			console.log('result of confirmEnteredData: ' , v, ' ', v.size)
			if(activePatronEmail != null && activePatronEmail != '' ) {
				if(v.size > 0){
					v.forEach((doc)=>{
						if(doc.data().is_completed == true){
							// query to set the needed PATRON details
							setPN(doc.data().patron_id)
							setCollege(doc.data().college)
							setActivePatronEmail(doc.data().patron_email)
							setName(doc.data().patron_name)
							setOpen(false);
						} else {
							setOpen(true)
						} 
					})
				} else {
					setOpen(true)
				}
			}
		})
	}
	snapshotQuery();
	
	const filterInpSN = (val) => {
		console.log('filterINPSN is called')
		setPN(val.replace(/\D/g, ''))
	}
	useEffect(()=>{
		console.log('PN is called : ',pn)
	},[pn])
	
	const handleClose = async (event) => {
		if(pn.length == 9) {
			setStudentInp("")
		}

		if(pn.length == 9 && program.length > 0 && college.length > 0){
			setStudentInp("")
			// Add the user entered data
			await addDoc(collection(db,"UserData"), {
				college:college,
				patron_email:activePatronEmail,
				patron_name:name,
				program:program,
				patron_id:pn,
				is_completed:true,
				patron_maxB : 3
			}).then(()=>{
				setOpen(false);
			})
		} else {
			if(pn.length < 9) {
				setStudentInp("You have missed some digits")
			} else {
				setStudentInp("")
			}
			
			return;}
	};

	useEffect(() => {
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
			case "EDUC":
				setPrograms(eduPrograms)
				break;
			case "PLMBS":
				setPrograms(plmbsPrograms)
				break;
			case "CN":
				setPrograms(["Bachelor of Science in Nursing"])
				break;
		} 
	}, [college]);

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
				<BookList activePID={pn} name={name} activePatronEmail={activePatronEmail} college={college}/>
			</>
			<>
				<BorrowReserveFilter/>
			</>
			<Footer/>
		</div>
		
	</>
	) 
}

export default StdHome
