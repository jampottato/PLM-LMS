import {useState, useEffect} from "react";
import {db, auth} from "../Database/firebase-config";
import {setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, documentId, updateDoc} from "firebase/firestore";
import { Container } from "react-bootstrap";
import '../Styles/BorrowRecord.css';
import { Grid, Table } from "@mantine/core";

function BorrowRecord() {
//show : TItle, Status, Due, Penalty
    const [confirmedRes, setConfirmedRes] = useState([])
    const [materialResult, setMaterialResult] = useState([])
    const [specificResult, setSpecResult] = useState([])
    
    const colRefIssue = collection(db, "Issue")

    var user = auth.currentUser;

    const [activePatronEmail, setActivePatronEmail] = useState('')
    
    // auth.onAuthStateChanged(function(user) {
    //     if (user) {
    //     // User is signed in.
    //     console.log('It ran here')
    //     activePatronEmail = user.email
    //     console.log(activePatronEmail)
    //     } else {
    //     // No user is signed in.
    //     }
    // });

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
            console.log('ALSO RUN HERE')
            setActivePatronEmail(user.email)
            console.log(activePatronEmail)
        }
        
        let patronBorrows = query(colRefIssue, where("patron_email", "==", activePatronEmail));
        // console.log('active patron email')
        // console.log(activePatronEmail) 

        const borrowed = async () => {
            await getDocs(patronBorrows).then( res => {
                console.log("BORROWED LIST RESULT")
                
                //Get the ISSUE docs that the active patron has borrowed
                setMaterialResult(
                    res.docs.map((doc)=>({
                        issue_id:           doc.id,
                        material_id:        doc.data().material_id,
                        material_title:     doc.data().material_title,
                        patron_id:          doc.data().patron_id,
                        issue_confirmed:    doc.data().issue_confirmed,
                        issue_fine:         doc.data().issue_fine,
                        issue_due:          doc.data().issue_due,         
                        issue_checkout_date:doc.data().issue_checkout_date
                    }))
                )
                console.log(materialResult)
            })

        }
        borrowed()
    }, [activePatronEmail])
    
    let sR = []
    let fine_count = 0
    useEffect(()=>{
        const specResult = async () => {
            setSpecResult([])
            await materialResult.map((idd)=>{
                let res = {}
                const specificMat = getDoc(doc(db, "Material", idd.material_id)) 
                
                if(idd.issue_confirmed){
                    res.issue_confirmed = "confirmed"
                } else {
                    res.issue_confirmed = "not confirmed"
                }
                console.log(idd.issue_due)
                res.issue_fine = idd.issue_fine 
                const timeDue = (idd.issue_due).toDate().toLocaleDateString('en-US') + " " + (idd.issue_due).toDate().toLocaleTimeString('en-US')
                res.issue_due = timeDue
                
                specificMat.then((doc)=>{
                    res = Object.assign(res, doc.data())
                }).then(()=>{
                    const specificDoc = getDoc(doc(db, "Book", idd.material_id))
                    specificDoc
                    .then((doc)=>{
                        res = Object.assign(res, doc.data())   
                        console.log("TOTAL DOCS", res)
                        setSpecResult(prev => (prev.concat(res)))
                        console.log(specificResult)
                    })
                })
                
            })
            return sR
        }
        specResult()
        
    }, [materialResult])

    useEffect(()=>{
        // let tt = specificResult.filter((item)=>{
        //     return item.issue_confirmed === true
        // })
        // setConfirmedRes(tt)
    },[specificResult])
    
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
                        {specificResult.map(doc => {
                            return (
                                <tr>
                                    <td><strong>{doc.material_title}</strong><br/></td>
                                    <td><strong>{doc.issue_due}</strong><br/></td>
                                    <td><strong>{doc.issue_fine}</strong><br/></td>
                                    <td><strong>{doc.issue_confirmed}</strong><br/></td>
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