import {useState, useEffect} from "react";
import '../Styles/Admin.css';

import { db } from "../Database/firebase-config";
import {collection, getDocs} from "firebase/firestore";


import Paper from '@mui/material/Paper';
import {
  PagingState,
  IntegratedPaging,
  IntegratedSorting,
  SortingState,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar,
  SearchPanel,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';

function AdminAppointmentTable(props) {
    const [appointResult, setAppointResult] = useState([])
    const appointRef = collection(db, "Appointment") 
    const [columns] = useState([
        { name: 'appnt_full_name', title: 'NAME' },
        { name: 'appnt_user_number', title: 'ID NUMBER' },
        { name: 'appnt_time', title: 'TIME' },
        { name: 'appnt_patron_type', title: 'PATRON' },
        { name: 'appnt_section', title: 'LOCATION' },
    ]);
    const [defaultColumnWidths] = useState([
        { columnName: 'appnt_full_name', width: 250 },
        { columnName: 'appnt_user_number', width: 150 },
        { columnName: 'appnt_time', width: 150 },
        { columnName: 'appnt_patron_type', width: 150 },
        { columnName: 'appnt_section', width: 250 },
    ]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pSize, setPSize] = useState(5);
    const [pSizes] = useState([5, 10, 15]);

    //STYLE
    const tableP = {
        width: '80%',
        margin: '30px auto 20px auto',
        color: "black",
        padding: "10px",
        fontFamily: "Sans-Serif",
        textalign: 'center',
    };

    useEffect(()=>{
        const appointGather = async () => {
            await getDocs(appointRef).then( res => {
                setAppointResult(
                    res.docs.map((doc)=>({
                        appnt_full_name:doc.data().appnt_full_name,
                        appnt_user_number:doc.data().appnt_user_number,
                        appnt_time:doc.data().appnt_time,
                        appnt_patron_type:doc.data().appnt_patron_type,
                        appnt_section:doc.data().appnt_section,
                    }))
                )
            })


        }
        appointGather()
    }, [])

    return (
        <>
            <Paper style={tableP} elevation={5} hidden={props.hide}>
                <Grid
                rows={appointResult}
                columns={columns}
                >
                <SearchState defaultValue="" />
                <IntegratedFiltering />
                <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={setCurrentPage}
                    pageSize={pSize}
                    onPageSizeChange={setPSize}
                />
                
                <IntegratedPaging />
                <SortingState
                defaultSorting={[{ columnName: 'issue_due', direction: 'asc' }]}
                />
                <IntegratedSorting/>
                <Table />
                <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                <TableHeaderRow showSortingControls/>
                <Toolbar />
                
                <SearchPanel />
                <PagingPanel
                    pageSizes={pSizes}
                />
                </Grid>
            </Paper>

            
        </>
    );
}
export default AdminAppointmentTable;