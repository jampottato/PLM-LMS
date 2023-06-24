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
import AdminRecords from "./AdminRecords";
import CancelledComp from "./CancelledComp";

function CancelledTransactions(props) {
    const [returnsResA, setReturnsResultA] = useState([])
    const [showRes, setShowRes] = useState([])

    const [columnsBorrow] = useState([
        { name: 'cancel_date',          title: 'DATE CANCELLED' },
        { name: 'record_type',          title: 'CANCELLED OPERATION' },
        { name: 'issue_cancel_reason',  title: 'REASON FOR CANCELLING' },
        { name: 'patron_id',            title: 'PATRON ID' },
        { name: 'patron_name',          title: 'NAME' },
        { name: 'm_title',              title: 'TITLE' },
        { name: 'issue_borrowed',       title: 'BORROWED DATE' },
        { name: 'issue_due',            title: 'DUE' },
        { name: 'issue_fine',           title: 'PENALTY' },
    ]);


    useEffect(()=>{
        // for admin
        const returnsA = async () => {
            await getDocs(collection(db, 'CancelledRecords')).then((results)=>{
                let rMat = {}
                setReturnsResultA(
                    results.docs.map((docHere) => {
                        const dateBorrowed = docHere.data().issue_borrowed.toDate().toLocaleDateString('en-US') + " " + docHere.data().issue_borrowed.toDate().toLocaleTimeString('en-US')
                        const dateDue = docHere.data().issue_due.toDate().toLocaleDateString('en-US') + " " + docHere.data().issue_due.toDate().toLocaleTimeString('en-US')
                        const dateCancel = docHere.data().cancel_date.toDate().toLocaleDateString('en-US') + " " + docHere.data().cancel_date.toDate().toLocaleTimeString('en-US')
                        return {...docHere.data(),
                            issue_borrowed: dateBorrowed,
                            issue_due : dateDue,
                            cancel_date : dateCancel}
                    })
                )
            })
        }
        returnsA()
    },[])

    useEffect(()=>{
        setShowRes(returnsResA)
    },[returnsResA])

    useEffect(()=>{
        console.log(' SHOW RES ', showRes)
    },[showRes])

  return (
    <>
        <div hidden={props.hide}>
        <CancelledComp searchValue={showRes} admin_columns={columnsBorrow} />
        </div>
    </>
  );
}

export default CancelledTransactions;