import {useState, useEffect} from "react";
import '../Styles/Admin.css';

import { db } from "../Database/firebase-config";
import {collection, setDoc, query, getDocs, doc, updateDoc, addDoc} from "firebase/firestore";

import bReco from  '../../opac_materials.json';

function add_all_records() {
    const materialRef=collection(db,"Material");
    const bookRecords = JSON.parse(JSON.stringify(bReco))
    const newCollection = bookRecords
    // const [allMaterials, setAllMaterials] = ([])

    useEffect(()=>{
        let count = 0
        const appointGather = async () => {
                newCollection.map( doc => {
                    addDoc(materialRef, (
                        doc
                    ))
                })
            alert(count)
            count = 0
        }
        appointGather()


    }, [])

    return (
        <>
        </>
    );
}
export default add_all_records;