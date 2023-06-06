import {useState, useEffect} from "react";
import '../Styles/Admin.css';

import { db } from "../Database/firebase-config";
import {collection, setDoc, query, getDocs, doc, updateDoc} from "firebase/firestore";

import bReco from  '../../opac_materials.json';

function set_all_copies() {
    const materialRef=collection(db,"Material");
    const bookRecords = JSON.parse(JSON.stringify(bReco))
    const newCollection = bookRecords
    // const [allMaterials, setAllMaterials] = ([])

    useEffect(()=>{
        let count = 0
        const appointGather = async () => {

            // query collection Material
            // getDocs from query
            // from the result, set doc to have copies of 1 in Material collection

            const allMaterials = query(materialRef) 
            await getDocs(allMaterials).then( val => {
                val.docs.map((d)=>{
                    updateDoc(doc(db, 'Material', d.id),{
                        m_copies : 1
                    })

                }
                )
            });

            
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
export default set_all_copies;