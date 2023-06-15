import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import {increment, setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, documentId, updateDoc, deleteDoc} from "firebase/firestore";

import '../Styles/Admin.css';
import PatronRecords from "./PatronRecords";

function TransactionsPatron(props) {
    const [returnsResP, setReturnsResultP] = useState([])
    const [returnsResA, setReturnsResultA] = useState([])
    const [showRes, setShowRes] = useState([])

    const [columnsBorrow] = useState([
        { name: 'patron_id',        title: 'PATRON ID' },
        { name: 'patron_name',      title: 'NAME' },
        { name: 'm_title',          title: 'TITLE' },
        { name: 'issue_borrowed',        title: 'BORROWED DATE' },
        { name: 'issue_due',        title: 'DUE' },
        { name: 'issue_fine',       title: 'PENALTY' },
    ]);

    

    useEffect(()=>{
        // patron
        const q = query(collection(db, 'ReturnReports'), where('patron_email', '==', props.activeEmail))
        const returnsA = async () => {
            await getDocs(q).then((results)=>{
                let rMat = {}
                setReturnsResultA(
                    results.docs.map((docHere) => {
                        const dateReserved = docHere.data().issue_checkout_date.toDate().toLocaleDateString('en-US') + " " + docHere.data().issue_checkout_date.toDate().toLocaleTimeString('en-US')
                        let dateBorrowed = docHere.data().issue_borrowed.toDate().toLocaleDateString('en-US') + " " + docHere.data().issue_borrowed.toDate().toLocaleTimeString('en-US')
                        const dateDue = docHere.data().issue_due.toDate().toLocaleDateString('en-US') + " " + docHere.data().issue_due.toDate().toLocaleTimeString('en-US')
                        return {...docHere.data(),
                            issue_borrowed: dateBorrowed,
                            issue_checkout_date : dateReserved,
                            issue_due : dateDue}
                    })
                )
            })
        }
        returnsA()
    },[props.activeEmail])

    useEffect(()=>{
        setShowRes(returnsResA)
    },[returnsResA])

    useEffect(()=>{
        setShowRes(returnsResP)
    },[returnsResP])

    useEffect(()=>{
        console.log(' SHOW RES ', showRes)
    },[showRes])

  return (
    <>
        <PatronRecords searchValue={showRes} admin_columns={columnsBorrow}/>
    </>
  );
}

export default TransactionsPatron;