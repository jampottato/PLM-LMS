import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { BsMicrosoft } from "react-icons/bs";
import { signInWithMicrosoft, auth } from "../Database/firebase-config"
import { Router, useNavigate } from "react-router-dom";
import EnterInfo from "../Routes/EnterInfo";
import { collection, getDocs, query, updateDoc, where, doc } from "firebase/firestore";
import {db} from "../Database/firebase-config";
function Login() {
	
	const [currentDate, setCurrentDate] = useState()

    // Fetch the Universal Time to det the date and time to only one source and sync 
    useEffect(() => {
        fetch("http://worldtimeapi.org/api/timezone/Asia/Manila").then( res => {
            res.text().then( val => {
                const toObj = JSON.parse(val) 
                const newDate = new Date(toObj.datetime)
                setCurrentDate(newDate)
                
            })
        })
    },[])

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
					const issueRef = collection(db, 'Issue')
					const currentUser = query(issueRef, where('patron_email', '==', result.user.email), where('issue_status', '==', 'confirmed'))
					
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
					
				} else {
					console.log('GO TO ADMIN')
					navigate('/Admin')
				}
				return result.user;
				
			})
			// .then((v)=>{alert(v.email)})
			.catch((error) => {
				// alert(error.message);
			});
	};

	return (
			<Button onClick={login} variant="dark">Login with Microsoft</Button>
	);
}
	
	export default Login;