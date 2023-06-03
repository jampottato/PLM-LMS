import {useState, useEffect} from "react";
import {db} from "../Database/firebase-config";
import {setDoc, doc, query, collection, where, getDocs, onSnapshot, getDoc, QuerySnapshot, addDoc, documentId, updateDoc} from "firebase/firestore";
import { Container } from "react-bootstrap";
import { Button, Center, Flex, Pagination, SimpleGrid } from "@mantine/core";
import '../Styles/Admin.css';
import { Grid, Table, Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import StdHome from './StdHome';

import { Box } from '@mantine/core';
import dayjs from 'dayjs';
import { DataTable } from 'mantine-datatable';
import employees from '../employees.json';
import StdNav from "../Components/StdNav";
import Footer from "../Components/Footer";

import { generateRows } from '../generator';
const PAGE_SIZES = [3, 10, 15, 20];

function Admin() {
    const [confirmedRes, setConfirmedRes] = useState([])
    const [materialResult, setMaterialResult] = useState([])
    const [specificResult, setSpecResult] = useState([])
    const colRefIssue = collection(db, "Issue")
    // console.log(activeStudentNum)
    const [searchRes, setSearchRes] = useState([])
    const [searchVal, setSearchVal] = useState("")

    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

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
                setMaterialResult(
                    res.docs.map((doc)=>({
                        issue_id:           doc.id,
                        material_id:        doc.data().material_id,
                        patron_id:          doc.data().patron_id,
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
    
    let sR = []
    let fine_count = 0
    useEffect(()=>{
        const specResult = async () => {
            setSpecResult([])
            await materialResult.map((idd)=>{
                let res = {}
                const specificMat = getDoc(doc(db, "Material", idd.material_id)) 
                
                if(idd.issue_confirmed){
                    res.issue_confirmed = "confirmed"
                } else {
                    res.issue_confirmed = "not confirmed"
                }
                const timeDue = (idd.issue_due).toDate().toLocaleDateString('en-US') + " " + (idd.issue_due).toDate().toLocaleTimeString('en-US')
                res.issue_due = timeDue

                let dateToday = new Date()
                let times = Math.abs((idd.issue_due).toDate().getDay()-dateToday.getDay())

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
                // res.issue_fine = idd.issue_fine
                res = Object.assign(res, {patron_id: idd.patron_id})
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
        
    }, [materialResult])

    useEffect(()=>{
        // console.log("CONFIREMD", specificResult)
        // let tt = specificResult.filter((item)=>{
        //     return item.issue_confirmed === true
        // })
        // setConfirmedRes(tt)
        // console.log("IT RAN")
    },[specificResult])

    const ll = (val) => {
        if(val == "confirmed") {
            return (
                <td>
                {/* <Flex
                justify="left"
                align="left"
                > */}
                <SimpleGrid cols={1}>
                    <Center>
                        <Button className="confirmed-btn" variant="light" color="green" radius="xs" size="xs"  uppercase>
                            {val}
                        </Button>
                    </Center>
                </SimpleGrid>
                {/* </Flex> */}
                </td>
            )
        } 
        else {
            return (
                <td>
                    {/* <Flex
                justify="left"
                align="left"
                > */}
                <SimpleGrid cols={1}>
                    <Center>
                        <Button className="nconfirmed-btn" variant="light" color="red" radius="xs" size="xs"  uppercase>
                            {val}
                        </Button>
                    </Center>
                </SimpleGrid>
                {/* </Flex> */}
                </td>
                )
        }
    }

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

        const tt = specificResult.filter((item)=>{
            const title = item.material_title.toLowerCase()
            const desc = item.material_description.toLowerCase()
            return  title.includes(searchVal.toLowerCase()) || 
                    desc.includes(searchVal.toLowerCase())
        })
        console.log("TT")
        console.log(tt)
        setSearchRes(tt)
    }


    const [columns] = useState([
        { name: 'name', title: 'Name' },
        { name: 'gender', title: 'Gender' },
        { name: 'city', title: 'City' },
        { name: 'car', title: 'Car' },
      ]);
      const [rows] = useState(generateRows({ length: 8 }));
      const [currentPage, setCurrentPage] = useState(0);
      const [pSize, setPSize] = useState(5);
      const [pSizes] = useState([5, 10, 15]);

  return (
    <>
        <StdNav/>

        <Container fluid='true' className="head-search">
            <Grid className="hs">
                <Grid.Col span={5} className="welcome-msg">
                    <h2 className="header-texts"><strong>Reserved</strong></h2>
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
                        <Button type="submit" onClick={searchQ} size="xs" radius="xl" hidden="true">
                            Search
                        </Button>
                    </form>
                    </Flex>
                </Grid.Col>
            </Grid>
        </Container>
        
        <Container fluid='true' className="result">
            <div className="panel"></div>   
            <div className="borrow-content">
                <Table>
                    <thead>
                        <tr>
                            <th><Center>Borrower</Center></th>
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
                                    <td><Center><strong>{doc.material_title}</strong></Center></td>
                                    <td><Center><strong>{doc.issue_due}</strong></Center></td>
                                    <td><Center><strong>{doc.issue_fine}</strong></Center></td>
                                    {ll(doc.issue_confirmed)}
                                    {/* <td><Button><strong>{doc.issue_confirmed}</strong></Button></td> */}
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table> 
            </div>
        </Container>

        {/* <Pagination value={activePage} onChange={e => trackPage(e)} total={10} /> */}

        {/* <Center>
            <DataTable
                className="paginate"
                loadingText="Data is being processed"
                withBorder
                records={records}
                columns={[
                { accessor: 'patron_id', width: '20%' },
                { accessor: 'material_title', width: 100 },
                { accessor: 'issue_due', width: 100},
                { accessor: 'issue_fine', width: 120,},
                { accessor: 'issue_confirmed', width: 100,
                    render: ({issue_confirmed}) => ll(issue_confirmed) }
                ]}
                totalRecords={specificResult.length}
                paginationColor="grape"
                recordsPerPage={pageSize}
                page={page}
                onPageChange={(p) => setPage(p)}

                // paginationSize="xs"
                // paginationWrapBreakpoint='lg'
                // recordsPerPageOptions={PAGE_SIZES}
                // onRecordsPerPageChange={setPageSize}
            />
        </Center> */}


    </>
  );
}

export default Admin;