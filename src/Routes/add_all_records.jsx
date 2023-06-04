import {useState, useEffect} from "react";
import '../Styles/Admin.css';

import { db } from "../Database/firebase-config";
import {collection, addDoc} from "firebase/firestore";

import bReco from  '../../opac_book_records.json';

function add_all_records() {
    const materialRef=collection(db,"Material");
    const bookRecords = JSON.parse(JSON.stringify(bReco))
    const newCollection = bookRecords
    console.log('BOOK RECORDS')
    console.log(newCollection)

    useEffect(()=>{
        const appointGather = async () => {
            await  newCollection.map((docs)=>{
                addDoc((materialRef),{
                    // m_dept: docs.m_dept, ADD THIS LATER WHEN THEY ARE FINISH FILTERING
                    m_call_num: docs.m_call_num,
                    m_author: docs.m_author,
                    m_barcode: docs.m_barcode,
                    m_title: docs.m_title,
                    m_edition: docs.m_edition,
                    m_date_acquired: docs.m_date_acquired,
                    m_pub_year: docs.m_pub_year,
                    m_price: docs.m_price
                })
            })
            
        }
        appointGather()
    }, [])

    return (
        <>
        </>
    );
}
export default add_all_records;