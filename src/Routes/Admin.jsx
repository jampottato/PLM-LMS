import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import {increment, setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, documentId, updateDoc, deleteDoc} from "firebase/firestore";
import { Container } from "react-bootstrap";
import { Button, Table, Grid, Input, Center, Flex, Pagination, SimpleGrid, ActionIcon, Stack, Notification } from "@mantine/core";
import '../Styles/Admin.css';
import { IconSearch } from "@tabler/icons-react";
import StdHome from './StdHome';

import AdminNav from "../Components/AdminNav";
import Footer from "../Components/Footer";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconTrash, IconCheck } from "@tabler/icons-react";


import AdminBorrowTable from "./AdminBorrowTable";
import { Fragment } from "react";
import AdminAppointmentTable from "./AdminAppointmentTable";
import AdminReserveTable from "./AdminReserveTable";

function Admin() {
    const STATUS_ARR = ['not confirmed', 'confirmed', 'returned']
    const [status, setStatus] = useState('')
    const [activeMaterial, setActiveMaterial] = useState('')
    const [activeIssue, setActiveIssue] = useState('')

    const [hiddAppt, setHiddAppt] = useState(true)
    const [hiddRese, setHiddRese] = useState(false)

    const [issueResult, setIssueResult] = useState([])
    const [specificResult, setSpecResult] = useState([])
    const [specificResultC, setSpecResultC] = useState([])
    const colRefIssue = collection(db, "Issue")
    
    const [searchRes, setSearchRes] = useState([])
    const [searchVal, setSearchVal] = useState("")

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

    useEffect(() => {
        setSearchRes(specificResult)
    }, [specificResult]);

    useEffect(()=>{
        const borrowed = async () => {
            await getDocs(colRefIssue).then( res => {
                //ISSUE Entity
                setIssueResult(
                    res.docs.map((doc)=>({
                        issue_id:           doc.id,
                        issue_checkout_date:doc.data().issue_checkout_date,
                        issue_due:          doc.data().issue_due,
                        issue_borrowed:          doc.data().issue_borrowed,
                        issue_fine:         doc.data().issue_fine,
                        issue_status:       doc.data().issue_status,
                        m_id:               doc.data().m_id,
                        m_title:            doc.data().m_title,
                        patron_email:       doc.data().patron_email,
                        patron_id:          doc.data().patron_id,
                        patron_name:        doc.data().patron_name,
                    }))
                )
            })
        }
        borrowed()
    }, [])

    useEffect(()=>{
        console.log('Issue result has been filled\t:\t',issueResult)
    }, [issueResult])
    
    const confirmation = async (m_status, issueID, matID,pName) => {
        if(confirm('Are you sure you want to confirm this reservation from ' + pName + " ?")){
            let copies;
            await getDoc(doc(db, "Material", matID)).then((doc)=> {
                copies = doc.data().m_copies
            })
            await updateDoc(doc(db, "Material", matID), {
                m_copies: (copies-1)
            })
            setActiveMaterial(matID)
            setActiveIssue(issueID)
            if(m_status == 'confirmed'){
                //update to not confirmed
                setStatus(STATUS_ARR[0])
            } else if (m_status == 'not confirmed') {
                //update to confirmed
                setStatus(STATUS_ARR[1])
            } else if (m_status == 'returned') {
                setStatus(STATUS_ARR[2])
            }
        }
        
    }

    const returnMaterial = (m_status, issueID, matID, pName) => {
        if(confirm('Are you sure you want to return the material now?')){
            setActiveMaterial(matID)
            setActiveIssue(issueID)
            if(m_status == 'confirmed'){
                //update to not confirmed
                setStatus(STATUS_ARR[0])
            } else if (m_status == 'not confirmed') {
                //update to confirmed
                setStatus(STATUS_ARR[1])
            } else if (m_status == 'returned') {
                setStatus(STATUS_ARR[2])
            }

            issueResult.map(results =>{
                if(results.issue_id == issueID){
                    console.log('returnMaterial function', )
                    addDoc(collection(db, 'ReturnReports'), results)
                    return
                }
            })
        }
    }

    const cancelConfirmation = async (iid,pName) => {
        if(confirm('Are you sure you want to cancel the confirmation to borrow for this patron ' + pName + " ?")) {
            const reason = prompt('Why did you cancel the confirmation to borrow?')
            console.log('iid\t')
            await updateDoc(doc(db, 'Issue', iid), {
                issue_status: 'not confirmed'
            })
            await getDoc(doc(db, 'Issue', iid)).then((res)=>{
                addDoc(collection(db, 'CancelledRecords'), {
                    issue_id: iid,
                    issue_cancel_reason: reason,
                    position: 'admin',
                    record_type: 'cancelled confirmation to borrow',
                    ...res.data()
                })
            }).then(()=>{
                window.location.reload(false)
            })
        }
    }

    const cancelConfirmationReserve = async (iid,pName) => {
        if(confirm('Are you sure you want to cancel the reservation by ' + pName + " ?")){
            const reason = prompt('Why did you cancel the reservation?')
            console.log('iid\t')
            await getDoc(doc(db, 'Issue', iid)).then((res)=>{
                addDoc(collection(db, 'CancelledRecords'), {
                    issue_id: iid,
                    issue_cancel_reason: reason,
                    position: 'admin',
                    record_type: 'cancelled the patron reservation',
                    ...res.data()
                })
            })
            await deleteDoc(doc(db, 'Issue', iid)).then(()=>{
                window.location.reload(false)
            })
        }

    }

    // If admin has changed the status --> confirmed, returned, not confirmed
    useEffect(()=> {
        const updateConfirmedMat = async ()=>{
            if(status == 'confirmed'){
                // the due date must be 2 days after the confirmation
                let dateToday = currentDate
                let dateDue = dateToday; //Date accepted by DB
                
                
                await updateDoc(doc(db, "Issue", activeIssue),{
                    issue_borrowed: currentDate,
                }).then(
                    dateDue.setDate(dateDue.getDate()+2) 
                )
                
                await updateDoc(doc(db, "Issue", activeIssue),{
                    issue_status: status,
                    issue_due: dateDue
                }).then(()=>{
                    window.location.reload(false);
                })
            } else if(status == 'returned'){
                var answer = prompt('Are you sure to return this?')
                if(answer == 'yes'){
                    
                    await deleteDoc(doc(db, "Issue", activeIssue))
                    // add one to the book you have
                    await updateDoc(doc(db,'Material',activeMaterial),{
                        material_copies:increment(1)
                    }).then(()=>{
                        window.location.reload(false);
                    })


                } else {
                    alert('You have cancelled to return the book')
                }
            }
            
        }
        
        updateConfirmedMat()
    }, [status])

    const ll = (val, issueID, matID, pName) => {
        if(val == "confirmed") {
            return (
                <td>
                    <>
                        <Button  onClick={()=>returnMaterial('returned', issueID, matID, pName)} style={{display:"inline-block", width:'105px'}} className="return-btn" variant="light" color="red" radius="xs" size="xs"  uppercase>
                                RETURN
                        </Button>
                        <Button onClick={()=>cancelConfirmation(issueID,pName)} style={{display:"inline-block"}} className="cancel-btn" variant="light" color="yellow" radius="xs" size="xs"  uppercase>
                            <center>CANCEL <br/>CONFIRM</center>
                        </Button>
                        
                    </>
                </td>
            )
        } 
        else if(val == "not confirmed") {
            return (
                <td >
                    <Stack align='center'>
                        <Button style={{display:"inline-block"}} className="nconfirmed-btn" onClick={() => confirmation('not confirmed', issueID, matID,pName)} variant="light" color="green" radius="xs" size="xs"  uppercase>
                            CONFIRM
                        </Button>
                        <Button onClick={()=>cancelConfirmationReserve(issueID,pName)} style={{display:"inline-block"}} className="nconfirmed-btn" variant="light" color="yellow" radius="xs" size="xs"  uppercase>
                            <center>CANCEL <br/>RESERVATION</center>
                        </Button>
                    </Stack>
                    
                </td>
            )
        }
    }
    
    useEffect(()=>{
        const specResult = async () => {
            setSpecResult([])
            await issueResult.map((idd)=>{
                let res = {}
                const specificMat = getDoc(doc(db, "Material", idd.m_id)) 
                const dateReserved = idd.issue_checkout_date.toDate().toLocaleDateString('en-US') + " " + idd.issue_checkout_date.toDate().toLocaleTimeString('en-US')
                let dateBorrowed;
                res.issue_checkout_date = dateReserved
                dateBorrowed = idd.issue_borrowed.toDate().toLocaleDateString('en-US') + " " + idd.issue_borrowed.toDate().toLocaleTimeString('en-US')
                res.issue_borrowed = dateBorrowed
                
                if(idd.issue_status == 'confirmed'){
                    //check if the date in DB is confirmed by admin
                    res.issue_status = ll("confirmed", idd.issue_id, idd.m_id, idd.patron_name)

                    let dateToday = currentDate

                    const timeDue = idd.issue_due.toDate().toLocaleDateString('en-US') + " " + idd.issue_due.toDate().toLocaleTimeString('en-US')
                    res.issue_due = timeDue

                    //Count penalty if the days are in the same month
                    let times = Math.abs(dateToday.getDate() - idd.issue_due.toDate().getDate())

                    let counter = 0
                    let issueMonth = idd.issue_due.toDate().getMonth()+1
                    let issueDate = idd.issue_due.toDate().getDate()
                    let issueYear = idd.issue_due.toDate().getFullYear()
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
                    if(idd.issue_due.toDate() < dateToday){
                        res.issue_fine = times*parseInt(50)
                        updateDoc(doc(db, "Issue", idd.issue_id),{
                            issue_fine: times*parseInt(50)
                        })
                    } 
                    else {
                        res.issue_fine = 0
                    }

                } 
                else {
                    res.issue_status = ll("not confirmed", idd.issue_id, idd.m_id, idd.patron_name)
                }
                
                res = Object.assign(res, {patron_id: idd.patron_id, patron_name: idd.patron_name})
                

                specificMat.then((doc)=>{
                    res = Object.assign(res, doc.data())   
                }).then(()=>{
                    // To avoid duplicating results
                    if(!(specificResult.includes(res))){
                        if(idd.issue_status == 'confirmed'){
                            setSpecResultC(prev => (prev.concat(res)))  
                        } else {
                            setSpecResult(prev => (prev.concat(res)))  
                        }
                    }
                })
            })
        }
        specResult()
    }, [issueResult])

    useEffect(()=>{
        console.log('Specific result NC', specificResult)
    },[specificResult])
    useEffect(()=>{
        console.log('Specific result C', specificResultC)
    },[specificResultC])

    const noRefresh = (event) => {
        event.preventDefault();
    }

    const searchQ = (val) => {
        setSearchVal(val)

        console.log(searchVal);
        studentRawQueryCategory = searchVal

        const filterSearch = specificResult.filter((item)=>{
            const title = item.m_title.toLowerCase()
            const name = item.patron_name.toLowerCase()
            const id =  item.patron_id
            return  title.includes(searchVal.toLowerCase()) || 
                    name.includes(searchVal.toLowerCase()) ||
                    id.includes(searchVal.toLowerCase()) 
        })
        console.log('filtersearch\t',filterSearch)
        setSearchRes(filterSearch)
    }

    const [columnsReserve] = useState([
        { name: 'patron_id',        title: 'PATRON ID' },
        { name: 'patron_name',      title: 'NAME' },
        { name: 'm_title',          title: 'TITLE' },
        { name: 'issue_checkout_date',        title: 'RESERVED DATE' },
        { name: 'issue_status',     title: ' ' },
    ]);

    const [columnsBorrow] = useState([
        { name: 'patron_id',        title: 'PATRON ID' },
        { name: 'patron_name',      title: 'NAME' },
        { name: 'm_title',          title: 'TITLE' },
        { name: 'issue_borrowed',        title: 'BORROWED DATE' },
        { name: 'issue_due',        title: 'DUE' },
        { name: 'issue_fine',       title: 'PENALTY' },
        { name: 'issue_status',     title: ' ' },
    ]);


    const apptABT = () => {
        setHiddAppt(false)
        setHiddRese(true)
    }
    const reservedABT = () => {
        setHiddAppt(true)
        setHiddRese(false)
    }

  return (
    <>
        <AdminNav/>

        <Container fluid='true' className="head-search">
            
            <Grid className="hs" grow>
                <Grid.Col span={4}></Grid.Col>

                <Grid.Col span={4} className="welcome-msg">
                    <Fragment >

                    <span className="header-texts"><Button style={{margin: '10px', padding:'5px'}} color="blue" onClick={reservedABT}>Reserved</Button></span>
                    <span className="header-texts" ><Button style={{margin: '10px', padding:'5px'}} color="blue" onClick={apptABT}>Appointment</Button></span>
                    </Fragment>
                </Grid.Col>

                {/* NOT SHOWN */}
                <Grid.Col span={4} className="search-box">
                
                    <Flex direction="row" gap="sm" align="center" justify="center" wrap="wrap">
                    <form onSubmit={noRefresh} focused="true" target="_self">
                        <Input
                            //If you want manual search algo uncomment 2 lines below - DONT, may bug pa...If the reserved books list is hidden, then it should be too
                            // hidden={hiddRese}
                            // icon={<IconSearch size={25} hidden={hiddRese}/>}
                            hidden={true}
                            icon={<IconSearch size={25} hidden={true}/>}
                            placeholder="Search"
                            radius="lg"
                            className="input-edited"
                            onChange={e => searchQ(e.target.value)}
                            style={{marginTop:'10px'}}
                        />
                        <Button type="submit" onClick={searchQ} size="xs" radius="xl" hidden="true">
                            Search
                        </Button>
                    </form>
                    </Flex>
                </Grid.Col>
                {/* UNTIL HERE - NOT SHOWN */}
            </Grid>
        </Container>

        <AdminReserveTable      hide={hiddRese} searchValue={searchRes} admin_columns={columnsReserve}/>
        <AdminBorrowTable       hide={hiddRese} searchValue={specificResultC} admin_columns={columnsBorrow}/>
        <AdminAppointmentTable  hide={hiddAppt}/>

    <Footer/>
    </>
  );
}

export default Admin;