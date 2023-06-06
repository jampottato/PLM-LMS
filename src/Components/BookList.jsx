import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import "../Styles/BookList.css";

import { Button, Flex, Grid, Input} from '@mantine/core';
import { IconSearch } from "@tabler/icons-react";
import { Container } from "react-bootstrap";

import {doc, query, collection, onSnapshot, getDoc, addDoc, updateDoc, getDocs} from "firebase/firestore";


function BookList(props) {
    let activePatronEmail = localStorage.getItem("email");
    let activePatronName = localStorage.getItem("name");
    // let activePatronSN = localStorage.getItem("pn");
    let activePatronSN = props.activePID
    //MATERIAL DETAILS
    const [searchRes, setSearchRes] = useState([])
    const [materialResult, setMaterialResult] = useState([])
    
    //SEARCH VALUE
    const [searchVal, setSearchVal] = useState(localStorage.getItem('college'))
    //college my b emt
    
    //REFERENCES
    const colRefMaterial = collection(db, "Material")

    // Disable the borrow button when the copies of book are 0 
    const disableWhenZero = (val) => {
        return parseInt(val) > 0 ? false : true
    }

    const [testReadCounts, setTestReadCounts] = useState(0)
    // To show the Material details when Patron has logged in 
    useEffect(()=>{
        const getAllMaterials = async ()=>{
            // await onSnapshot(collection(db,"Material"), (qSnapshot)=>{
            //     let materials =
            //         qSnapshot.docs.map((docMaterial)=>({
            //             m_id    : docMaterial.id,
            //             m_author : docMaterial.data().m_author,
            //             m_title : docMaterial.data().m_title,
            //             m_copies : docMaterial.data().m_copies,
            //             m_dept : docMaterial.data().m_dept,
            //             m_pub_date : docMaterial.data().m_pub_date
            //         }))
            //         console.log('MATERIALS\t', materials)
            //     setMaterialResult(materials)
            // })
            await getDocs(colRefMaterial).then( (qSnapshot)=>{

                let materials =
                    qSnapshot.docs.map((docMaterial)=>({
                        m_id        : docMaterial.id,
                        m_author    : docMaterial.data().m_author,
                        m_title     : docMaterial.data().m_title,
                        m_copies    : docMaterial.data().m_copies,
                        m_dept      : docMaterial.data().m_dept,
                        m_pub_date  : docMaterial.data().m_pub_date
                    }))
                    console.log('MATERIALS\t', materials)
                setMaterialResult(materials)
                setTestReadCounts(testReadCounts+1)
                alert('read count '+testReadCounts)
            })

        }
        getAllMaterials()
        
    },[])

    useEffect(()=>{
        console.log('MATERIALResult state\t', materialResult)
        searchQ(props.college)
    },[materialResult])

    // Borrow Function to SHOW INFORMATION about the book and the updated copies when borrowed by a patron
    const getInfo = async (bId, title) => { // bId = Material ID that the patron borrowed
        alert("get info function called")
        let copies = 0
        let dateToday = new Date()
        let dateTomorrow = new Date()
        dateTomorrow.setDate(dateToday.getDate()+2) //+2 means that the borrow days should be max of 2 days only

        //Get current copies from Material collection 
        // so that you will know what value to decrease
        await getDoc(doc(db, "Material", bId)).then((doc)=> {
            copies = doc.data().m_copies
            console.log("When BORROW btn clicked, the copies before are ", copies)
        })

        //Adding of items in ISSUE entity
        if(copies > 0){
            //When borrower has confirmed, specified material data must decrease to 1
            await updateDoc(doc(db, "Material", bId), {
                m_copies: (copies-1)
            })
            
            // Add the necessary fields to Issue entity when patron confirmed to borrow a book
            await addDoc(collection(db, "Issue"), {
                patron_id : activePatronSN,
                m_id : bId,
                m_title: title,
                patron_name : activePatronName,
                patron_email : activePatronEmail,
                issue_status : 'not confirmed',
                issue_checkout_date : dateToday, //today
                issue_due : dateTomorrow, // 2days after
                issue_fine : 0 // 0
            })
        } 
        else {
            //Create a proper dialogbox here to ask for confirmation of the patron
            alert("There are 0 copies, you could not borrow this")
        }
    }

    // Get the Material details in order to initiate a search
    const searchQ = (val) => {
        // alert('searchq is ran')
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

    const noRefresh = (event) => {
        event.preventDefault();
    }

    return (
        <>
        <div>                                                                   
            <Container fluid='true' className="head-search">
                <Grid className="hs">
                    <Grid.Col span={5} className="welcome-msg">
                        <h2 className="header-texts"><strong>Welcome, {localStorage.getItem("name")}</strong></h2>
                        <p className="subheader-texts">STUDENT NUMBER: {activePatronSN}</p>
                    </Grid.Col>

                    <Grid.Col span={3}></Grid.Col>

                    <Grid.Col span={4} className="search-box">
                    <Flex direction="row" gap="sm" align="center" justify="center" wrap="wrap">
                    <form onSubmit={noRefresh} focused="true" target="_self">
                        <Input
                            icon={<IconSearch size={25} />}
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

            <Container fluid='true' className="head-search">
                <Grid className="hs">
                    <Grid.Col span={5} className="welcome-msg">
                        <h2 className="header-texts"><strong>Results</strong></h2>
                    </Grid.Col>
                    <Grid.Col span={3}></Grid.Col>
                    <Grid.Col span={4}></Grid.Col>
                </Grid>
            </Container>

            <Container fluid='true' className="result">
                <div className="panel"></div>
                <div className="searched-content">
                <Grid>
                    {searchRes.map((doc)=> {
                        return (
                            <>
                                <Grid.Col span={4} className="BookSection">
                                    <p> Author:            <strong>{doc.m_author}</strong><br/>
                                        Title:             <strong>{doc.m_title}</strong><br/>
                                        Year Published:    <strong>{doc.m_pub_date}</strong><br/>
                                    </p>
                                    <button onClick={() => getInfo(doc.m_id, doc.m_title)} disabled={disableWhenZero(doc.m_copies)}>BORROW</button>
                                </Grid.Col>
                            </>
                        );
                    })}
                </Grid>
                </div>
            </Container>
        </div>
        </>
    );
}

export default BookList;