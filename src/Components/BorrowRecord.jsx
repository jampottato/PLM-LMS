import {useState, useEffect} from "react";
import {db, auth} from "../Database/firebase-config";
import {query, collection, where, getDocs} from "firebase/firestore";
import { Container } from "react-bootstrap";
import '../Styles/BorrowRecord.css';
import { Grid, Table } from "@mantine/core";

function BorrowRecord() {
    const [issueResult, setIssueResult] = useState([])
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

    const [testReadCounts, setTestReadCounts] = useState(0)

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
                        const timeDue = doc.data().issue_due.toDate().toLocaleDateString('en-US') + " " + doc.data().issue_due.toDate().toLocaleTimeString('en-US')
                        
                        return {
                            issue_id:           doc.id,
                            issue_status:       doc.data().issue_status,
                            issue_fine:         doc.data().issue_fine,
                            issue_due:          timeDue,         
                            issue_checkout_date:doc.data().issue_checkout_date,
                            material_id:        doc.data().material_id,
                            m_title:            doc.data().m_title,
                            patron_id:          doc.data().patron_id,
                        }
                    })
                )
                setTestReadCounts(testReadCounts+1)
                alert('reads in issue: ', testReadCounts)
            })

        }
        borrowed()
    }, [activePatronEmail])

    return (
        <>
            <Container fluid='true' className="head-search">
                <Grid className="hs">
                    <Grid.Col span={5} className="welcome-msg">
                        <h2 className="header-texts"><strong>Borrowed</strong></h2>
                    </Grid.Col>

                    <Grid.Col span={3}></Grid.Col>

                    <Grid.Col span={4} className="search-box">
                    </Grid.Col>
                </Grid>
            </Container>
            
            <Container fluid='true' className="result">
                <div className="panel"></div>   
                <div className="borrow-content">
                    <Table>
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Due</th>
                                <th>Penalty</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issueResult.map(doc => {
                                return (
                                    <tr>
                                        <td><strong>{doc.m_title}</strong><br/></td>
                                        <td><strong>{doc.issue_due}</strong><br/></td>
                                        <td><strong>{doc.issue_fine}</strong><br/></td>
                                        <td><strong>{doc.issue_status}</strong><br/></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}

export default BorrowRecord;