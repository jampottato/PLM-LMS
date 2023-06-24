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
		// console.log('currentDate - - ',currentDate)
	},[currentDate])

	function containsNumbers(str) {
		return /[0-9]/.test(str);
	}
	
	const navigate = useNavigate()
	const login = async () => {
		await signInWithMicrosoft()
			.then((result) =>{ 

				localStorage.clear();
				localStorage.setItem('name', result.user.displayName);
				localStorage.setItem('email', result.user.email);
				
				console.log('GO BEFORE ANYTHING')
				let userIsAdmin = false;
				const currentUser = query(collection(db, 'UserData'), where('patron_email', '==', result.user.email), where('isAdmin', '==', true))
				getDocs(currentUser).then(results=>{
					alert(results.size)
					if(results.size > 0){
						
						userIsAdmin = true;
						console.log('GO TO ADMIN')
					}
					return results
				}).then(res=>{
					alert('SIZE')
					
					if (containsNumbers(result.user.email) == 1 && res.size < 1){
						alert(res.size < 1)
						const issueRef = collection(db, 'Issue')
						const currentUser = query(issueRef, where('patron_email', '==', result.user.email), where('issue_status', '==', 'confirmed'))
						
						getDocs(currentUser)
						.then( results => {
							let dateToday = currentDate
							results.docs.map((docH)=>{
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
			
								if((todayMonth -  issueMonth) > 0) {
			
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
								if(docH.data().issue_due.toDate() < dateToday){
									updateDoc(doc(db, "Issue", docH.id),{
										issue_fine: times*parseInt(50)
									})
								} 
							})
						})
						.then(()=>{
							alert('RETURNS HERE')
							console.log('GO TO HOME')
							navigate('/StdHome')
						})
						
					} else {
						console.log('GO TO ADMIN')
						navigate('/@!')
					}
				})
				
				
			})
	};

	return (
			<Button onClick={() => login()} variant="dark">Login with Microsoft</Button>
	);
}
	
	export default Login;