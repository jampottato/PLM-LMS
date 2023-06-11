import {useState, useEffect} from "react";
import {db, auth} from "../Database/firebase-config";
import {query, collection, where, getDocs} from "firebase/firestore";
import { Container } from "react-bootstrap";
import '../Styles/BorrowRecord.css';
import { Grid, Table } from "@mantine/core";
import BorrowRecordComp from "./BorrowRecordComp";

function BorrowReserveFilter() {
    const [issueResult, setIssueResult] = useState([])
    const [borrowResult, setBorrowResult] = useState([])
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
                setIssueResult(
                    res.docs.map((doc)=>{
                        let timeDue = doc.data().issue_due.toDate().toLocaleDateString('en-US') + " " + 
                                        doc.data().issue_due.toDate().toLocaleTimeString('en-US');
                        let fine    = doc.data().issue_fine;

                        if(doc.data().issue_status != 'confirmed') {
                            timeDue = null;
                            fine    = null;
                        }

                        return {
                            issue_id:           doc.id,
                            issue_status:       doc.data().issue_status,
                            issue_fine:         fine,
                            issue_due:          timeDue,         
                            issue_checkout_date:doc.data().issue_checkout_date,
                            m_id:               doc.data().m_id,
                            m_title:            doc.data().m_title,
                            patron_id:          doc.data().patron_id,
                        }
                    })
                )
            }).catch(anything => {
            })

        }
        borrowed()
    }, [activePatronEmail])

    useEffect(() => {

    }, [issueResult])


    const [columns] = useState([
        {name : 'm_title',      title : 'MATERIAL TITLE'},
        {name : 'issue_due',    title : 'DUE'},
        {name : 'issue_fine',   title : 'FINE'},
        {name : 'issue_status', title : 'Status'}
    ]);

    return (
        <>
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

            <BorrowRecordComp column_name={columns} searchValue={issueResult}/>
        </>
    );
}

export default BorrowReserveFilter;