import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import "../Styles/BookList.css";

import { Button, Grid} from '@mantine/core';
import { Container } from "react-bootstrap";

import {doc, collection, getDoc, addDoc, updateDoc, getDocs, Timestamp} from "firebase/firestore";

import BookListBorrowComp from './BooksListBorrowComp';


function BookList(props) {
    // Get these email, name, and idNumber for us to identify who is going to reserve some books 
    let activePatronEmail   =   props.activePatronEmail;          // They are in a localStorage because we want to get the
    let activePatronName    =   props.name;                       // current LOGGED IN user (available info only are those)
    let activeIDN           =   props.activePID;                  // Patron ID is provided when the user has already entered data
                                                                  // and it is retrieved from UserData collection as props in this BookList

    //DB REFERENCES
    const colRefMaterial = collection(db, "Material")

    //MATERIAL DETAILS
    const [searchRes, setSearchRes] = useState([])              // It is the result {} for the searched value
    const [materialResult, setMaterialResult] = useState([])    // The result for the Materials collection
    
    //SEARCH VALUE
    const [searchVal, setSearchVal] = useState(localStorage.getItem('college')) // The default search value is the department of the patron
    

    // Disable the borrow button when the copies of book are 0 
    const disableWhenZero = (val) => {
        return parseInt(val) > 0 ? false : true
    }

    //PATRONS' Reserve Function (reserve button)
    const getInfo = async (bId, title) => { // bId = Material ID that the patron borrowed
        let copies = 0
        let dateToday = new Date()
        let dateDue = new Date()
        dateDue.setDate(dateToday.getDate()+2) //+2 means that the borrow days should be max of 2 days only

        //Get current copies from Material collection 
        // so that you will know what value to decrease
        await getDoc(doc(db, "Material", bId)).then((doc)=> {
            copies = doc.data().m_copies
        })

        //Adding of items in ISSUE entity when the patron wants to reserve a book
        if(copies > 0){
            //Check if there is a patron ID
            if(!(activeIDN == null || activeIDN == '')){
                //When the patron has confirmed, specified material data must decrease to 1
                await updateDoc(doc(db, "Material", bId), {
                    m_copies: (copies-1)
                })

                // Add the necessary fields to Issue entity when patron confirmed to borrow a book
                await addDoc(collection(db, "Issue"), {
                    patron_id : activeIDN,
                    m_id : bId,
                    m_title: title,
                    patron_name : activePatronName,
                    patron_email : activePatronEmail,
                    issue_status : 'not confirmed',
                    issue_checkout_date : dateToday, //today
                    issue_due : dateDue, // 2days after
                    issue_fine : 0 // 0
                }).then(
                    alert('You have reserved a book. Come to the library to borrow the material.')
                ).then(
                    window.location.reload(false)
                )
            } else {
                console.log('There is no patron ID: ', activeIDN, props.activePID)
            }
        } 
        else {
            // TODO: Change this with a modal
            alert("There are 0 copies, you could not borrow this")
        }
    }

    const reserveBtn = (mid, mtitle, mcopies) => {
        return (
            <Button style={{display:"inline-block",margin:0,padding:"0 30px 0 30px",maxWidth:'100%'}} onClick={() => getInfo(mid, mtitle)} disabled={disableWhenZero(mcopies)}>RESERVE</Button>
        )
    }

    useEffect(()=>{
        const getAllMaterials = async ()=>{
            await getDocs(colRefMaterial).then( (qSnapshot)=>{
                let materials =
                    qSnapshot.docs.map((docMaterial)=>({
                        m_id        : docMaterial.id,
                        m_author    : docMaterial.data().m_author,
                        m_title     : docMaterial.data().m_title,
                        m_copies    : docMaterial.data().m_copies,
                        m_dept      : docMaterial.data().m_dept, 
                        m_pub_date  : docMaterial.data().m_pub_date,
                        m_btn       : reserveBtn(docMaterial.id,docMaterial.data().m_title,docMaterial.data().m_copies)
                    }))
                setMaterialResult(materials)
            })
        }
        getAllMaterials()
    },[props.activePID])

    // It serves as the initiator for the contents of the books in the patron landing page after log in
    // It initiates the SEARCH VALUE into the department they are currently in
    useEffect(()=>{
        searchQ(props.college)
    },[materialResult])

    // Get the Material details in order to initiate a search
    const searchQ = (val) => {
        setSearchVal(val.toLowerCase())

        const filteredSearch = materialResult.filter((item)=>{
            const title = item.m_title.toLowerCase()
            const dept = item.m_dept.toLowerCase()
            const author = item.m_author.toLowerCase()
            const pub_date = item.m_pub_date.toString()
            return  title.includes(searchVal.toLowerCase()) || 
                    dept.includes(searchVal.toLowerCase()) || 
                    author.includes(searchVal.toLowerCase()) || 
                    pub_date.includes(searchVal.toLowerCase())
        })
        setSearchRes(filteredSearch)
    }

    const [columns] = useState([
        { name: 'm_btn',        title: ' ' },
        { name: 'm_title',      title: 'TITLE' },
        { name: 'm_author',     title: 'AUTHOR' },
        { name: 'm_pub_date',   title: 'PUBLISHED YEAR' },
        { name: 'm_dept',       title: 'DEPARTMENT' },
        { name: 'm_copies',     title: 'COPIES'},
    ]);

    return (
        <>
        <div>
            <Container fluid='true' className="head-search">
                <Grid className="hs">
                    <Grid.Col span={5} className="welcome-msg">
                        <h2 className="header-texts"><strong>Library Materials</strong></h2>
                    </Grid.Col>
                    <Grid.Col span={3}></Grid.Col>
                    <Grid.Col span={4}></Grid.Col>
                </Grid>
            </Container> 
            <BookListBorrowComp searchValue={searchRes} material_columns={columns}/>
        </div>
        </>
    );
}

export default BookList;