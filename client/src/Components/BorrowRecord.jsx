import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import {setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, documentId, updateDoc} from "firebase/firestore";

function BorrowRecord() {
//show : TItle, Status, Due, Penalty


    const [confirmedRes, setConfirmedRes] = useState([])
    const [materialResult, setMaterialResult] = useState([])
    const [specificResult, setSpecResult] = useState([])
    const colRefIssue = collection(db, "Issue")
    let activeStudentNum = "202011847";
    let studentBorrows = query(colRefIssue, where("issue_confirmed", "==", true), where("patron_id", "==", activeStudentNum));
   
    
    useEffect(()=>{
        const borrowed = async () => {
            await getDocs(studentBorrows).then( res => {
                //ISSUE Entity
                setMaterialResult(
                    res.docs.map((doc)=>({
                        issue_id:           doc.id,
                        material_id:        doc.data().material_id,
                        patron_id:          doc.data().patron_id,
                        issue_confirmed:    doc.data().issue_confirmed,
                        issue_fine:         doc.data().issue_fine,
                        issue_due:          doc.data().issue_due,         
                        issue_checkout_date:doc.data().issue_checkout_date
                    }))
                )
            })

        }
        borrowed()
    }, [])
    
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
                const timeDue = (idd.issue_due).toDate().toLocaleDateString('en-US') + " " + (idd.issue_due).toDate().toLocaleTimeString('en-US')
                res.issue_due = timeDue
                let dateToday = new Date()
                let times = Math.abs((idd.issue_due).toDate().getDay()-dateToday.getDay())
                if((idd.issue_due).toDate() < dateToday){
                    console.log("There is penalty", (idd.issue_due).toDate(), "\t", dateToday)
                    res.issue_fine = times*parseInt(50)
                    updateDoc(doc(db, "Issue", idd.issue_id),{
                        issue_fine: times*parseInt(50)
                    })
                } else {
                    console.log("There is no penalty", (idd.issue_due).toDate(), "\t", dateToday)
                    res.issue_fine = 0
                }
                
                // res.issue_fine = idd.issue_fine

                specificMat.then((doc)=>{
                    res = Object.assign(res, doc.data())   
                    // console.log("Material Doc", doc.data())
                }).then(()=>{
                    const specificDoc = getDoc(doc(db, "Book", idd.material_id))
                    specificDoc
                    .then((doc)=>{
                        res = Object.assign(res, doc.data())   
                        console.log("TOTAL DOCS", res)
                        setSpecResult(prev => (prev.concat(res)))  
                        // console.log("Book doc", doc.data()) 
                    })
                })

                
                
            })
            return sR
        }
        specResult()
        
    }, [materialResult])

    useEffect(()=>{
        // console.log("CONFIREMD", specificResult)
        let tt = specificResult.filter((item)=>{
            return item.issue_confirmed === true
        })
        setConfirmedRes(tt)
        // console.log("IT RAN")
    },[specificResult])
    
  return (
    <div>
        <h1>YOU BORROWED THESE</h1>
        {specificResult.map(doc => {
            return (
                <div className = "BookSection">
                    <pre>Title, Status, Due, Penalty</pre>
                    <p> Book Title:         <strong>{doc.material_title}</strong><br/>
                        Status:             <strong>{doc.issue_confirmed}</strong><br/>
                        Due:                <strong>{doc.issue_due}</strong><br/>
                        Penalty:            <strong>{doc.issue_fine}</strong><br/>
                    </p>
                </div>
            )
        })}
        
    </div>
  );
}

export default BorrowRecord;