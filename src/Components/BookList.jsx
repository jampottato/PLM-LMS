import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import "../Styles/BookList.css";

import { Button, Flex, Grid, Input} from '@mantine/core';
import { IconSearch } from "@tabler/icons-react";
import { Container } from "react-bootstrap";

import {doc, query, collection, onSnapshot, getDoc, addDoc, updateDoc} from "firebase/firestore";


function BooksList(props) {
    let activePatronEmail = localStorage.getItem("email");
    let activePatronName = localStorage.getItem("name");
    // let activePatronSN = localStorage.getItem("pn");
    let activePatronSN = props.activePID
    //MATERIAL DETAILS
    const [searchRes, setSearchRes] = useState([])
    const [materialResult, setMaterialResult] = useState([])
    const [totalRes, setTotalRes] = useState([])
    //SEARCH VALUE
    const [searchVal, setSearchVal] = useState("")
    //REFERNCES
    const colRefMaterial = collection(db, "Material")

    //START: search for something with material title and category
    let studentQueryBook = query(colRefMaterial);

    //BORROW Button disable/able
    const [dAble, setDAble] = useState(true)
    
    // Disable the borrow button when the copies of book are 0 
    const disableWhenZero = (val) => {
        return parseInt(val) > 0 ? false : true
    }

    useEffect(()=>{
        const ff = async ()=>{
            await onSnapshot(collection(db,"Material"), (qSnapshot)=>{
                setMaterialResult(
                    qSnapshot.docs.map((docMaterial)=>({
                        material_id : docMaterial.id,
                        material_title : docMaterial.data().material_title,
                        material_copies : docMaterial.data().material_copies,
                        material_description : docMaterial.data().material_description
                    }))
                )
            })
        }
        ff()
    },[])

    useEffect(() => {
        const allMaterials = async () => {
            setTotalRes([])
            setSearchRes([])
            await materialResult.map((idd)=>{
                
                onSnapshot(doc(db, "Book", idd.material_id), ((doc)=>{   
                    let oo = doc.data()
                    oo.material_id = idd.material_id
                    oo.material_title = idd.material_title
                    oo.material_copies = idd.material_copies
                    oo.material_description = idd.material_description
                    setTotalRes(prev => (prev.concat(oo))) 
                    setSearchRes(prev => (prev.concat(oo))) 
                    }))
            })
        }
        allMaterials()
    },[materialResult]) 

    // Borrow Function
    const getInfo = async (bId, title) => {
        alert(bId)
        let copies = 0
        let dateToday = new Date()
        let dateTomorrow = new Date()
        dateTomorrow.setDate(dateToday.getDate()+2)

        await getDoc(doc(db, "Material", bId)).then((doc)=> {
            copies = parseInt(parseInt(doc.data().material_copies))
            console.log("When BORROW btn clicked, the copies before are ", copies)
        })

        // ## the adding of items in ISSUE must first consider these
        // 1. When borrower has confirmed, specified material data must decrease to 1
        if(copies > 0){
            await updateDoc(doc(db, "Material", bId), {
                material_copies: (copies-1)
            })
            // 2. The button should turn diasabled then the copies of this material is 0
            // 3. Then add the necessary details to ISSUE entity 
            // Add the borrower info and material borrowed to the ISSUE entity
            
            // Get the UserData of the logged in BORROWER and get IDNUMBER, email and name
            await addDoc(collection(db, "Issue"), {
                patron_id : activePatronSN,
                patron_name : activePatronName,
                patron_email : activePatronEmail,
                material_id : bId,
                material_title: title,
                issue_confirmed : false,
                issue_checkout_date : dateToday, //today
                issue_due : dateTomorrow, // tomorrow
                issue_fine : 0 // 0
            })
            window.location.reload()
        } 
        else {
            alert("There are 0 copies, you could not borrow this")
        }
    }

    const searchQ = (val) => {
        setSearchVal(val)
        console.log(searchVal);
        // studentRawQueryCategory = searchVal
        const tt = totalRes.filter((item)=>{
            const title = item.material_title.toLowerCase()
            const desc = item.material_description.toLowerCase()
            return  title.includes(searchVal.toLowerCase()) || 
                    desc.includes(searchVal.toLowerCase())
        })
        setSearchRes(tt)
    }

    useEffect(()=>{
        // testing searchRes value - console.log("Searchres",searchRes)
        // use this when you want to do something when searchRes changes
    },[searchRes])

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
                    <Button type="submit" onClick={searchQ} size="xs" radius="xl" hidden={true}>
                        Search
                    </Button>
                </form>
                </Flex>
                    {/* <input  placeholder="Search materials here"
                            onChange={e => setSearchVal(e.target.value)}
                            className="input-edited"/>
                    <button onClick={searchQ}
                            className="input-edited">
                                HERE
                    </button> */}
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
                                <p> Book ISBN:          <strong>{doc.book_isbn}</strong><br/>
                                    Book Title:         <strong>{doc.material_title}</strong><br/>
                                    Book Description:   <strong>{doc.material_description}</strong><br/>
                                    Copies:             <strong>{doc.material_copies}</strong><br/>
                                </p>
                                <button onClick={()=>getInfo(doc.material_id, doc.material_title)} disabled={disableWhenZero(doc.material_copies)}>BORROW</button>
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

export default BooksList;