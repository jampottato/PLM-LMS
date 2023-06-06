import {useState, useEffect} from "react";
import '../Styles/Admin.css';

import { db } from "../Database/firebase-config";
import {collection, getDocs} from "firebase/firestore";

import bReco from  '../../opac_materials.json';

function add_all_records() {
    const materialRef=collection(db,"Material");
    const bookRecords = JSON.parse(JSON.stringify(bReco))
    const newCollection = bookRecords
    const [allMaterials, setAllMaterials] = useState([])

    useEffect(()=>{
        let count = 0
        const appointGather = async () => {
            await getDocs(materialRef).then( res => {
                setAllMaterials(
                    res.docs.map((doc)=>{
                        return doc.data()
                    })
                )
            })
            alert(count)
            count = 0
        }
        appointGather()
        


    }, [])

    return (
        <>
            <h1>HLLO</h1>
            {allMaterials.map((doc)=>{
                return (
                    <>{doc.m_title}</>
                )
            })}
        </>
    );
}
export default add_all_records;