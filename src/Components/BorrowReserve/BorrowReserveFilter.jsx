import {useState, useEffect} from "react";
import {db, auth} from "../../Database/firebase-config";
import {query, collection, where, getDocs} from "firebase/firestore";
import { Container } from "react-bootstrap";
import '../../Styles/BorrowRecord.css';
import { Grid, Table } from "@mantine/core";
import BorrowComp from "./BorrowComp";
import ReserveComp from "./ReserveComp";


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

    useEffect(()=>{
        if(activePatronEmail == '' && user != null){
            setActivePatronEmail(user.email)
        }

        // Find the ACTIVE USER's borrowed book in ISSUE collection
        let patronBorrows = query(colRefIssue, where("patron_email", "==", activePatronEmail));
        const borrowed = async () => {
            await getDocs(patronBorrows).then( res => {
                
                //Get the ISSUE docs that the active patron has borrowed
                res.docs.map((doc)=>{
                    let tmpMap = {}
                    let timeDue = doc.data().issue_due.toDate().toLocaleDateString('en-US') + " " + 
                                    doc.data().issue_due.toDate().toLocaleTimeString('en-US');
                    let fine    = doc.data().issue_fine;

                        tmpMap.issue_id             =   doc.id;
                        tmpMap.issue_status         =   doc.data().issue_status;
                        tmpMap.issue_fine           =   fine;
                        tmpMap.issue_due            =   timeDue;
                        tmpMap.issue_checkout_date  =   doc.data().issue_checkout_date;
                        tmpMap.m_id                 =   doc.data().m_id;
                        tmpMap.m_title              =   doc.data().m_title;
                        tmpMap.patron_id            =   doc.data().patron_id;

                    if(doc.data().issue_status != 'confirmed') {
                        tmpMap.issue_due = null;
                        tmpMap.issue_fine   = null;
                        setReserveResult(prev => prev.concat(tmpMap))
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
        {name : 'm_title',      title : 'TITLE'},
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