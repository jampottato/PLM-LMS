import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import {setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, documentId, updateDoc} from "firebase/firestore";
import { Container } from "react-bootstrap";
import { Button, Table, Grid, Input, Center, Flex, Pagination, SimpleGrid } from "@mantine/core";
import '../Styles/Admin.css';
import { IconSearch } from "@tabler/icons-react";
import StdHome from './StdHome';

import StdNav from "../Components/StdNav";
import Footer from "../Components/Footer";



import AdminBorrowTable from "./AdminBorrowTable";
import { Fragment } from "react";
const PAGE_SIZES = [3, 10, 15, 20];

function Admin() {
    const [ABTVal, setABTVal] = useState({})
    const [ABTCol, setABTCol] = useState({})

    const [adminConfirm, setAdminConfirm] = useState(false)
    const [activeBook, setActiveBook] = useState('')

    const [confirmedRes, setConfirmedRes] = useState([])
    const [issueResult, setIssueResult] = useState([])
    const [specificResult, setSpecResult] = useState([])
    const colRefIssue = collection(db, "Issue")
    // console.log(activeStudentNum)
    const [searchRes, setSearchRes] = useState([])
    const [searchVal, setSearchVal] = useState("")

    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

    const tableP = {
        width: '80%',
        margin: '0 auto 20px auto',
        color: "white",
        padding: "10px",
        fontFamily: "Sans-Serif",
        textalign: 'center',
    };

    let studentRawQueryCategory = "";

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const [page, setPage] = useState(1);
    const [records, setRecords] = useState(specificResult.slice(0, pageSize));

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(specificResult.slice(from, to));
        setSearchRes(specificResult)
    }, [specificResult, page, pageSize]);
    
    useEffect(()=>{

        setRecords(specificResult.slice(0, pageSize));
        console.log("RECORDS")
        console.log(records)

        const borrowed = async () => {
            await getDocs(colRefIssue).then( res => {
                //ISSUE Entity
                setIssueResult(
                    res.docs.map((doc)=>({
                        issue_id:           doc.id,
                        material_id:        doc.data().material_id,
                        patron_id:          doc.data().patron_id,
                        patron_name:        doc.data().patron_name,
                        material_title:     doc.data().material_title,
                        issue_confirmed:    doc.data().issue_confirmed,
                        issue_fine:         doc.data().issue_fine,
                        issue_due:          doc.data().issue_due,         
                        issue_checkout_date:doc.data().issue_checkout_date
                    }))
                )
            })

        }
        borrowed()
    }, [])

    const confirmation = (isTrue, issueID) => {
        if(!isTrue){
            setActiveBook(issueID)
        }
    }

    useEffect(()=> {
        const updateConfirmedMat = async ()=>{
            await updateDoc(doc(db, "Issue", activeBook),{
                issue_confirmed: true
            }).then(()=>{
                alert("SUCCESFFULLY CONFIRMED")
                window.location.reload(false);
            })
        }
        updateConfirmedMat()
    }, [activeBook])

    const ll = (val, issueID) => {
        if(val == "confirmed") {
            return (
                <td>
                    <SimpleGrid cols={1}>
                        <Center>
                            <Button onClick={() => confirmation(true, issueID)} className="confirmed-btn" variant="light" color="green" radius="xs" size="xs"  uppercase>
                                {val}
                            </Button>
                        </Center>
                    </SimpleGrid>
                </td>
            )
        } 
        else {
            return (
                <td>
                    <SimpleGrid cols={1}>
                        <Center>
                            <Button onClick={() => confirmation(false, issueID)} className="nconfirmed-btn" variant="light" color="red" radius="xs" size="xs"  uppercase>
                                {val}
                            </Button>
                        </Center>
                    </SimpleGrid>
                </td>
                )
        }
    }
    
    let sR = []
    let fine_count = 0
    useEffect(()=>{
        const specResult = async () => {
            setSpecResult([])
            await issueResult.map((idd)=>{
                let res = {}
                const specificMat = getDoc(doc(db, "Material", idd.material_id)) 
                
                if(idd.issue_confirmed){
                    res.issue_confirmed = ll("confirmed", idd.issue_id)
                    const timeDue = (idd.issue_due).toDate().toLocaleDateString('en-US') + " " + (idd.issue_due).toDate().toLocaleTimeString('en-US')
                    res.issue_due = timeDue

                    let dateToday = new Date()

                    let times = Math.abs(dateToday.getDate() - (idd.issue_due).toDate().getDate())
                    console.log("TIMES DUE")
                    console.log((idd.issue_due).toDate())

                    let counter = 0
                    let iMonth = (idd.issue_due).toDate().getMonth()+1
                    let iDate = (idd.issue_due).toDate().getDate()
                    let iYear = (idd.issue_due).toDate().getFullYear()
                    let iDateF = iMonth + '-' + iDate + '-' + iYear;

                    let tMonth = dateToday.getMonth()+1
                    let tDate = dateToday.getDate()
                    let tYear = dateToday.getFullYear()
                    let tDateF = tMonth + '-' + tDate + '-' + tYear;

                    if((tMonth -  iMonth) > 0) {
                        
                        while(iDateF != tDateF){
                            dateToday.setDate(dateToday.getDate() - 1)

                            tMonth = dateToday.getMonth()+1
                            tDate = dateToday.getDate()
                            tYear = dateToday.getFullYear()
                            tDateF = tMonth + '-' + tDate + '-' + tYear;
                           
                            counter+=1
                        }
                        
                    }
                    times = counter
                    // dateToday.setDate(dateToday.getDate() - 1)
                    // console.log(dateToday)
                    console.log(times)

                    if((idd.issue_due).toDate() < dateToday){
                        // console.log("There is penalty", (idd.issue_due).toDate(), "\t", dateToday)
                        res.issue_fine = times*parseInt(50)
                        updateDoc(doc(db, "Issue", idd.issue_id),{
                            issue_fine: times*parseInt(50)
                        })
                    } else {
                        // console.log("There is no penalty", (idd.issue_due).toDate(), "\t", dateToday)
                        res.issue_fine = 0
                    }
                } else {
                    // console.log("Check if CONFIRMED")
                    // console.log(idd.issue_id)
                    res.issue_confirmed = ll("not confirmed", idd.issue_id)
                }
                
                
                res = Object.assign(res, {patron_id: idd.patron_id, patron_name: idd.patron_name})

                specificMat.then((doc)=>{
                    res = Object.assign(res, doc.data())   
                    // console.log("Material Doc", doc.data())
                }).then(()=>{
                    const specificDoc = getDoc(doc(db, "Book", idd.material_id))
                    specificDoc
                    .then((doc)=>{
                        res = Object.assign(res, doc.data())   
                        // console.log("TOTAL DOCS", res)
                        setSpecResult(prev => (prev.concat(res)))  
                        
                    })
                })

                console.log(res) 
                
            })
            return sR
        }
        specResult()
        
    }, [issueResult, adminConfirm])

    useEffect(()=>{
        // console.log("CONFIREMD", specificResult)
        // let tt = specificResult.filter((item)=>{
        //     return item.issue_confirmed === true
        // })
        // setConfirmedRes(tt)
        // console.log("IT RAN")
    },[specificResult])

    

    const convertData = (val)=>{
        console.log("TO JSON")
        console.log(JSON.stringify(val))
        console.log(typeof(JSON.stringify(val)))
        console.log(typeof(val))
        console.log(specificResult)
        return JSON.stringify(val)
    }

    const noRefresh = (event) => {
        event.preventDefault();
        // searchQ
    }

    const searchQ = (val) => {
        setSearchVal(val)

        console.log(searchVal);
        studentRawQueryCategory = searchVal

        const filterSearch = specificResult.filter((item)=>{
            const title = item.material_title.toLowerCase()
            const desc = item.material_description.toLowerCase()
            const name = item.patron_name.toLowerCase()
            const id =  item.patron_id
            return  title.includes(searchVal.toLowerCase()) || 
                    desc.includes(searchVal.toLowerCase()) ||
                    name.includes(searchVal.toLowerCase()) ||
                    id.includes(searchVal.toLowerCase()) 
        })
        console.log("Filter Search")
        console.log(filterSearch)
        setSearchRes(filterSearch)
    }


    const [columns] = useState([
        { name: 'patron_id', title: 'ID' },
        { name: 'patron_name', title: 'NAME' },
        { name: 'material_title', title: 'TITLE' },
        { name: 'issue_due', title: 'DUE' },
        { name: 'issue_fine', title: 'PENALTY' },
        { name: 'issue_confirmed', title: 'STATUS' },
      ]);
      const [currentPage, setCurrentPage] = useState(0);
      const [pSize, setPSize] = useState(5);
      const [pSizes] = useState([5, 10, 15]);

      const apptABT = () => {

      }
      const reservedABT = () => {

      }

  return (
    <>
        <StdNav/>

        <Container fluid='true' className="head-search">
            
            <Grid className="hs" grow>
                <Grid.Col span={4}></Grid.Col>
                <Grid.Col span={4} className="welcome-msg">
                    <Fragment >

                    <span className="header-texts"><Button style={{margin: '10px', padding:'5px'}} color="blue" onClick={reservedABT}>Reserved</Button></span>
                    <span className="header-texts" ><Button style={{margin: '10px', padding:'5px'}} color="blue" onClick={apptABT}>Appointment</Button></span>
                    </Fragment>
                </Grid.Col>

                <Grid.Col span={4} className="search-box">
                
                    <Flex direction="row" gap="sm" align="center" justify="center" wrap="wrap">
                    <form onSubmit={noRefresh} focused="true" target="_self">
                        <Input
                            icon={<IconSearch size={25} />}
                            placeholder="Search"
                            radius="lg"
                            className="input-edited"
                            onChange={e => searchQ(e.target.value)}
                            style={{marginTop:'10px'}}
                        />
                        <Button type="submit" onClick={searchQ} size="xs" radius="xl" hidden="true">
                            Search
                        </Button>
                    </form>
                    </Flex>
                </Grid.Col>
            </Grid>
        </Container>

        {/* //abt */}
        <AdminBorrowTable searchValue={searchRes} admin_columns={columns}/>
        
        <Container fluid='true' className="result" hidden={true}>
            <div className="panel"></div>   
            <div className="borrow-content">
                <Table>
                    <thead>
                        <tr>
                            <th><Center>Borrower ID</Center></th>
                            <th><Center>Borrower NAME</Center></th>
                            <th><Center>Book Title</Center></th>
                            <th><Center>Due</Center></th>
                            <th><Center>Penalty</Center></th>
                            <th><Center>Status</Center></th>
                        </tr>
                    </thead>
                
                    <tbody>
                        {searchRes.map(doc => {
                            return (
                                <tr className="reserved-item" >
                                    <td><Center><strong>{doc.patron_id}</strong></Center></td>
                                    <td><Center><strong>{doc.patron_name}</strong></Center></td>
                                    <td><Center><strong>{doc.material_title}</strong></Center></td>
                                    <td><Center><strong>{doc.issue_due}</strong></Center></td>
                                    <td><Center><strong>{doc.issue_fine}</strong></Center></td>
                                    {ll(doc.issue_confirmed)}
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table> 
            </div>
        </Container>

    <Footer/>
    </>
  );
}

export default Admin;