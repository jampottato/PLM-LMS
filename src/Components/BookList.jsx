import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import "../Styles/BookList.css";

import { Button, Grid, Modal, Group, Flex, Input} from '@mantine/core';
import { IconSearch } from "@tabler/icons-react";
import { useDisclosure } from '@mantine/hooks';
import { Container } from "react-bootstrap";

import {doc, collection, getDoc, addDoc, updateDoc, getDocs, Timestamp, onSnapshot, where, query} from "firebase/firestore";

import BookListBorrowComp from './BooksListBorrowComp';
import MoreInfo from './MoreInfo';
import TransactionsPatron from "./TransactionsPatron";

function BookList(props) {
    const [opened, { open, close }] = useDisclosure(false)

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
    const [searchVal, setSearchVal] = useState(props.college) // The default search value is the department of the patron
    

    // Disable the borrow button when the copies of book are 0 
    const disableWhenZero = (val) => {
        return val > 0 ? false : true
    }

    //PATRONS' Reserve Function (reserve button)
    const getInfo = async (bId, title) => { // bId = Material ID that the patron borrowed
        if(confirm("Are you sure you want to reserve '" + title + "'?")){
            const borrowedMaterials = query(collection(db, 'Issue'), where('patron_email', '==', activePatronEmail))
            let count = 0;
            await getDocs((borrowedMaterials)).then((docsHere)=>{
                docsHere.docs.map((doc)=>{
                    count = count + 1;
                })
            })
            if(count >= 3){
                alert('You have reached the maximum number of transactions')
                return
            }

            let copies = 0
            let dateToday = new Date()
            let dateDue = new Date()
            dateDue.setDate(dateToday.getDate()+2) //+2 means that the borrow days should be max of 2 days only

            //Get current copies from Material collection 
            // so that you will know what value to decrease
            let materialDetails;
            await getDoc(doc(db, "Material", bId)).then((doc)=> {
                copies = doc.data().m_copies;
                materialDetails = doc.data()
            })

            //Adding of items in ISSUE entity when the patron wants to reserve a book
            if(copies > 0){
                
                //Check if there is a patron ID
                console.log('You have reserved a book. Come to the library to borrow the material.', activeIDN)
                if(!(activeIDN == null || activeIDN == '')){
                    //When the patron has confirmed, specified material data must decrease to 1
                    // await updateDoc(doc(db, "Material", bId), {
                    //     m_copies: (copies-1)
                    // })

                    // Add the necessary fields to Issue entity when patron confirmed to borrow a book
                    await addDoc(collection(db, "Issue"), {
                        patron_id : activeIDN,
                        m_id : bId,
                        patron_name : activePatronName,
                        patron_email : activePatronEmail,
                        issue_borrowed : dateToday,
                        issue_status : 'not confirmed',
                        issue_checkout_date : dateToday, //today
                        issue_due : dateDue, // 2days after
                        issue_fine : 0, // 0,
                        ...materialDetails
                    }).then(
                        ()=>{
                            alert('You have reserved a book. Come to the library to borrow the material.')
                            window.location.reload(false)
                        }
                    )
                } else {
                    alert('The user has to log in first!')
                    console.log('There is no patron ID: ', activeIDN, props.activePID)
                }
            } 
            else {
                // TODO: Change this with a modal
                alert("There are 0 copies, you could not borrow this")
            }
        }
    }

    // Reserve BTN
    const reserveBtn = (mid, mtitle, mcopies) => {
        return (
            <Button style={{display:"inline-block",margin:0,padding:"0 30px 0 30px",maxWidth:'100%'}} onClick={() => getInfo(mid, mtitle)} disabled={disableWhenZero(mcopies)}>RESERVE</Button>
        )
    }

    // More details BTN
    const moreInfo = (title, author, dept, pubYear, copies) => {
        return (
            <MoreInfo title={title} author={author} department={dept} pubYear={pubYear} copies={copies}/>
        )
    }

    // Generate the Materials list
    useEffect(()=>{
        const getAllMaterials = async ()=>{
            await getDocs(colRefMaterial).then( (qSnapshot)=>{
               
                setMaterialResult(
                    qSnapshot.docs.map((docMaterial)=>({
                        m_id        : docMaterial.id,
                        m_author    : docMaterial.data().m_author,
                        m_title     : docMaterial.data().m_title,
                        m_copies    : docMaterial.data().m_copies,
                        m_dept      : docMaterial.data().m_dept, 
                        m_pub_date  : docMaterial.data().m_pub_date,
                        m_call_num  : docMaterial.data().m_call_num,
                        m_btn       : reserveBtn(docMaterial.id,docMaterial.data().m_title,docMaterial.data().m_copies),
                        m_more_info : moreInfo( docMaterial.data().m_title, 
                                                docMaterial.data().m_author,
                                                docMaterial.data().m_dept,
                                                docMaterial.data().m_pub_date,
                                                docMaterial.data().m_copies
                                                )
                    }))
                )
            })
        }
        getAllMaterials()
    },[props.activePID])

    // It serves as the initiator for the contents of the books in the patron landing page after log in
    // It initiates the SEARCH VALUE into the department they are currently in
    useEffect(()=>{
        const filteredSearch = materialResult.filter((item)=>{
            let dept;

            if (!(item.m_dept == undefined)){ dept = item.m_dept.toLowerCase() } else (dept = '/////')
            return dept.includes(props.college.toLowerCase())
        })
        console.log(searchVal, 'SEARCH RES: ', filteredSearch)
        setSearchRes(materialResult)
    },[materialResult])

    useEffect(()=>{
        console.log('SEARCHRES\t', searchRes)
    },[searchRes])

    // Get the Material details in order to initiate a search
    // const searchQ = (val) => {
    //     setSearchVal(val)
    //     console.log('item ', materialResult)
    //     const filteredSearch = materialResult.filter((item)=>{

    //         return  item.m_title.includes(val) || item.m_author.includes(val)
    //     })
    //     setSearchRes(filteredSearch)
    // }

    const [columns] = useState([
        { name: 'm_btn',        title: ' ' },
        { name: 'm_call_num',   title: 'CALL NUMBER' },
        { name: 'm_title',      title: 'TITLE' },
        { name: 'm_author',     title: 'AUTHOR' },
        { name: 'm_dept',     title: 'DEPARTMENT' },
        { name: 'm_copies',     title: 'AVAILABLE COPIES'},
        { name: 'm_more_info',     title: ' '},
    ]);

    const noRefresh = (event) => {
        event.preventDefault();
    }
    

    return (
        <>
        <div>
            <Container fluid='true' className="head-search">
                
            </Container>

            <Container fluid='true' className="head-search">
                
                <Grid className="hs">
                    <Grid.Col span={5} className="welcome-msg">
                        <h2 className="header-texts"><strong>LIBRARY MATERIALS</strong></h2>

                    </Grid.Col>
                    <Grid.Col span={7}>
                    <Flex direction="row" gap="sm" align="center" justify="center" wrap="wrap">
                        <form onSubmit={noRefresh} focused="true" target="_self">
                            <Input hidden={true}
                                style={{width:'500px'}}
                                icon={<IconSearch hidden={true} size={25} />}
                                placeholder="Search"
                                radius="lg"
                                className="input-edited"
                                onChange={e => searchQ(e.target.value)}
                            />
                        </form>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Container> 
            <BookListBorrowComp searchValue={searchRes} material_columns={columns}/>

            <br/>

            <Container fluid='true' className="head-search">
                
                <Grid className="hs">
                    <Grid.Col span={5} className="welcome-msg">
                        <h2 className="header-texts"><strong>RETURNED RECORDS</strong></h2>

                    </Grid.Col>
                    <Grid.Col span={7}>
                    <Flex direction="row" gap="sm" align="center" justify="center" wrap="wrap">
                        <form onSubmit={noRefresh} focused="true" target="_self">
                            <Input hidden={true}
                                style={{width:'500px'}}
                                icon={<IconSearch hidden={true} size={25} />}
                                placeholder="Search"
                                radius="lg"
                                className="input-edited"
                                onChange={e => searchQ(e.target.value)}
                            />
                        </form>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Container> 
            <TransactionsPatron activeEmail = {props.activePatronEmail}/>
        </div>
        </>
    );
}

export default BookList;