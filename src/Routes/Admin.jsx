import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import {increment, setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, documentId, updateDoc, deleteDoc} from "firebase/firestore";
import { Container } from "react-bootstrap";
import { Button, Table, Grid, Input, Center, Flex, Pagination, SimpleGrid, ActionIcon } from "@mantine/core";
import '../Styles/Admin.css';
import { IconSearch } from "@tabler/icons-react";
import StdHome from './StdHome';

import StdNav from "../Components/StdNav";
import Footer from "../Components/Footer";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconTrash } from "@tabler/icons-react";


import AdminBorrowTable from "./AdminBorrowTable";
import { Fragment } from "react";
import AdminAppointmentTable from "./AdminAppointmentTable";

function Admin() {
    const STATUS_ARR = ['not confirmed', 'confirmed', 'returned']
    const [status, setStatus] = useState('')
    const [activeMaterial, setActiveMaterial] = useState('')
    const [activeIssue, setActiveIssue] = useState('')

    const [hiddAppt, setHiddAppt] = useState(true)
    const [hiddRese, setHiddRese] = useState(false)

    const [issueResult, setIssueResult] = useState([])
    const [specificResult, setSpecResult] = useState([])
    const colRefIssue = collection(db, "Issue")
    
    const [searchRes, setSearchRes] = useState([])
    const [searchVal, setSearchVal] = useState("")

    useEffect(() => {
        // alert('SPECIFIC RESULT CHANGED 1')
        setSearchRes(specificResult)
        // alert(searchRes)
        // console.log('SEARCH RESULT')
        // console.log(searchRes)
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
    
    
    const confirmation = (m_status, issueID, matID) => {
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

    // If admin has changed the status --> confirmed, returned, not confirmed
    useEffect(()=> {
        const updateConfirmedMat = async ()=>{
            if(status == 'confirmed'){
                // the due date must be 2 days after the confirmation
                let dateToday = new Date()
                let dateDue = dateToday //Date accepted by DB
                dateDue.setDate(dateDue.getDate()+2) 

                await updateDoc(doc(db, "Issue", activeIssue),{
                    issue_status: status,
                    issue_due: dateDue
                }).then(()=>{
                    // alert("SUCCESFFULLY CONFIRMED")
                    window.location.reload(false);
                })
            } else if(status == 'returned'){
                var answer = prompt('Are you sure to return this?')
                alert('your anwer:'+(answer=='yes'))
                if(answer == 'yes'){
                    await deleteDoc(doc(db, "Issue", activeIssue))
                    // add one to the book you have
                    await updateDoc(doc(db,'Material',activeMaterial),{
                        material_copies:increment(1)
                    })
                    alert('it ran')
                } else {
                    alert('You have cancelled to return the book')
                }
            }
            
        }
        
        updateConfirmedMat()
    }, [status])


    const ll = (val, issueID, matID) => {
        if(val == "confirmed") {
            return (
                <td>
                    <>
                        <Button style={{display:"inline-block"}} className="confirmed-btn" variant="light" color="green" radius="xs" size="xs"  uppercase>
                            {val}
                        </Button>
                        <ActionIcon onClick={()=>confirmation('returned', issueID, matID)} style={{display:"inline-block",margin:'2px',textAlign:'center'}} variant="subtle"><IconTrash size="17" /></ActionIcon>
                    </>
                </td>
            )
        } 
        else if(val == "not confirmed") {
            return (
                <td>
                        <Button onClick={() => confirmation('not confirmed', issueID, matID)} className="nconfirmed-btn" variant="light" color="red" radius="xs" size="xs"  uppercase>
                            {val}
                        </Button>
                        <ActionIcon onClick={()=>confirmation('returned', issueID, matID)} style={{display:"inline-block",margin:'2px',textAlign:'center'}} variant="subtle"><IconTrash size="17" /></ActionIcon>
                </td>
            )
        }
    }
    
    useEffect(()=>{
        const specResult = async () => {
            setSpecResult([])
            console.log('spec result length')
            console.log(specificResult.length)
            await issueResult.map((idd)=>{
                let res = {}
                const specificMat = getDoc(doc(db, "Material", idd.m_id)) 
                
                if(idd.issue_status == 'confirmed'){
                    //check if the date in DB is confirmed by admin
                    res.issue_status = ll("confirmed", idd.issue_id, idd.m_id)

                    let dateToday = new Date()

                    const timeDue = idd.issue_due.toDate().toLocaleDateString('en-US') + " " + idd.issue_due.toDate().toLocaleTimeString('en-US')
                    res.issue_due = timeDue

                    //count cost
                    let times = Math.abs(dateToday.getDate() - idd.issue_due.toDate().getDate())

                    let counter = 0
                    let iMonth = idd.issue_due.toDate().getMonth()+1
                    let iDate = idd.issue_due.toDate().getDate()
                    let iYear = idd.issue_due.toDate().getFullYear()
                    let iDateF = iMonth + '-' + iDate + '-' + iYear;

                    let tMonth = dateToday.getMonth()+1
                    let tDate = dateToday.getDate()
                    let tYear = dateToday.getFullYear()
                    let tDateF = tMonth + '-' + tDate + '-' + tYear;

                    if((tMonth -  iMonth) > 0) {
                        while(iDateF != tDateF){
                            dateToday.setDate(dateToday.getDate() - 1)

                            tMonth = dateToday.getMonth()+1
                            tDate = dateToday.getDate()
                            tYear = dateToday.getFullYear()
                            tDateF = tMonth + '-' + tDate + '-' + tYear;
                           
                            counter+=1
                        }
                    }
                    times = counter

                    if(idd.issue_due.toDate() < dateToday){
                        res.issue_fine = times*parseInt(50)
                        updateDoc(doc(db, "Issue", idd.issue_id),{
                            issue_fine: times*parseInt(50)
                        })
                    } else {
                        res.issue_fine = 0
                    }
                } else {
                    res.issue_status = ll("not confirmed", idd.issue_id, idd.m_id)
                }
                
                res = Object.assign(res, {patron_id: idd.patron_id, patron_name: idd.patron_name})

                specificMat.then((doc)=>{
                    res = Object.assign(res, doc.data())   
                    // alert('Material Result')
                    // console.log(res)

                    //fix this by finding out the duplicating problem... then remove this logic
                    if(!(specificResult.includes(res))){
                        setSpecResult(prev => (prev.concat(res)))  

                        // setSearchRes(prev => (prev.concat(res)))
                    }
                    
                })

                console.log('specific result')
                console.log(specificResult)
                
            })
        }
        specResult()
        
    }, [issueResult])

    

    const noRefresh = (event) => {
        event.preventDefault();
        // searchQ
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
        
        setSearchRes(filterSearch)
        alert(filterSearch)
    }


    const [columns] = useState([
        { name: 'patron_id', title: 'ID' },
        { name: 'patron_name', title: 'NAME' },
        { name: 'm_title', title: 'TITLE' },
        { name: 'issue_due', title: 'DUE' },
        { name: 'issue_fine', title: 'PENALTY' },
        { name: 'issue_status', title: 'STATUS' },
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
        <StdNav/>

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


        {/* //abt */}
        <AdminBorrowTable       hide={hiddRese} searchValue={searchRes} admin_columns={columns}/>
        <AdminAppointmentTable  hide={hiddAppt}/>

    <Footer/>
    </>
  );
}

export default Admin;