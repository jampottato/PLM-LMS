import {useState, useEffect} from "react";
import {db, auth} from "../../Database/firebase-config";
import {query, collection, where, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc} from "firebase/firestore";
import { Container } from "react-bootstrap";
import '../../Styles/BorrowRecord.css';
import { Grid, Table, Button, Stack } from "@mantine/core";
import BorrowComp from "./BorrowComp";
import ReserveComp from "./ReserveComp";
import MoreInfo from "../MoreInfo";
import MoreInfoReserve from "./MoreInfoReserve";


function BorrowReserveFilter() {
    const [borrowingResult, setBorrowingResult] = useState([])
    const [reserveResult, setReserveResult] = useState([])
    const [activePatronEmail, setActivePatronEmail] = useState('')
    const colRefIssue = collection(db, "Issue")
    var user = auth.currentUser;
    
    //See if there is an active user 
    useEffect(()=>{
        if(user == null){
            // alert('NULL')
        } else {
            // alert(user.email)   
            setActivePatronEmail(user.email)
        }
    },[user])

    const cancelReserve = async (mId, iId, mCopies, issueData) => {
        // +1 again on the material copies identified
        // Add the Issue record to a new collection called CancelledRecords
        // Delete in Issue ccolelction
        await updateDoc(doc(db, 'Material', mId), {
            m_copies: mCopies+1
        })
        await addDoc(collection(db, 'CancelledRecords'), {
            issue_id: iId,
            ...issueData
        })
        await deleteDoc(doc(db, 'Issue', iId)).then(
            window.location.reload(false)
        )
    }

    // More details BTN
    const moreInfoReserve = (dataHere, mId, iId, mCopies, issueData) => {
        return (
            <>
                <MoreInfoReserve dataHere={dataHere}/> 
                <Stack align='center'>
                <Button onClick={()=>cancelReserve(mId, iId, mCopies, issueData)} style={{margin:0,padding:'10px',width:'38%'}}>cancel</Button>
                </Stack>
            </>
        )
    }

    useEffect(()=>{
        if(activePatronEmail == '' && user != null){
            setActivePatronEmail(user.email)
        }

        // Find the ACTIVE USER's borrowed book in ISSUE collection
        let patronBorrows = query(colRefIssue, where("patron_email", "==", activePatronEmail));
        const borrowed = async () => {
            await getDocs(patronBorrows).then( res => {
                
                //Get the ISSUE docs that the active patron has borrowed
                res.docs.map((docH)=>{
                    let tmpMap = {}
                    let timeDue = docH.data().issue_due.toDate().toLocaleDateString('en-US') + " " + 
                                    docH.data().issue_due.toDate().toLocaleTimeString('en-US');
                    let fine    = docH.data().issue_fine;

                    tmpMap.issue_id             =   docH.id;
                    tmpMap.issue_status         =   docH.data().issue_status;
                    tmpMap.issue_fine           =   fine;
                    tmpMap.issue_due            =   timeDue;
                    tmpMap.issue_checkout_date  =   docH.data().issue_checkout_date;
                    tmpMap.patron_id            =   docH.data().patron_id;
                    tmpMap.m_id                 =   docH.data().m_id;
                    tmpMap.m_title              =   docH.data().m_title;
                    
                    if(docH.data().issue_status != 'confirmed') {
                        let queryMaterial = doc(db, 'Material', docH.data().m_id)
                        getDoc(queryMaterial).then( (qM)=>{
                            console.log(qM.data())
                            tmpMap.m_author     = qM.data().m_author;
                            tmpMap.m_dept       = qM.data().m_dept, 
                            tmpMap.m_pub_date   = qM.data().m_pub_date,
                            tmpMap.m_copies     = qM.data().m_copies,
                            tmpMap.m_call_num   = qM.data().m_call_num
                            tmpMap.m_more_info  = moreInfoReserve(qM.data(), docH.data().m_id, docH.id, qM.data().m_copies, docH.data())
                        }).then(()=>{
                            tmpMap.issue_due = null;
                            tmpMap.issue_fine   = null;
                            setReserveResult(prev => prev.concat(tmpMap))
                        })
                        
                    }  else {
                        setBorrowingResult(prev => prev.concat(tmpMap))
                    }
                })
            })
        }
        borrowed()
    }, [activePatronEmail])

    const [columnsBorrowing] = useState([
        {name : 'm_title',      title : 'TITLE'},
        {name : 'issue_due',    title : 'DUE'},
        {name : 'issue_fine',   title : 'PENALTY'},
    ]);

    const [columnsReserve] = useState([
        {name : 'm_call_num',      title : 'CALL NUMBER'},
        {name : 'm_title',      title : 'TITLE'},
        { name: 'm_author',     title: 'AUTHOR' },
        { name: 'm_dept',       title: 'DEPARTMENT' },
        { name: 'm_more_info',     title: ' '},
    ]);

    return (
        <>
            <br/><br/>
            <Container fluid='true' className="head-search">
                <Grid className="hs">
                    <Grid.Col span={5} className="welcome-msg">
                        <h2 className="header-texts"><strong>RESERVED</strong></h2>
                    </Grid.Col>

                    <Grid.Col span={3}></Grid.Col>

                    <Grid.Col span={4} className="search-box">
                    </Grid.Col>
                </Grid>
            </Container>

            <ReserveComp column_name={columnsReserve} searchValue={reserveResult}/>

            <br/><br/>
            <Container fluid='true' className="head-search">
                <Grid className="hs">
                    <Grid.Col span={5} className="welcome-msg">
                        <h2 className="header-texts"><strong>BORROWING</strong></h2>
                    </Grid.Col>

                    <Grid.Col span={3}></Grid.Col>

                    <Grid.Col span={4} className="search-box">
                    </Grid.Col>
                </Grid>
            </Container>

            <BorrowComp column_name={columnsBorrowing} searchValue={borrowingResult}/>
        </>
    );
}

export default BorrowReserveFilter;