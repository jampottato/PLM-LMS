import {useState, useEffect} from "react";
import '../Styles/Admin.css';

import Paper from '@mui/material/Paper';
import {
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

function AdminBorrowTable(props) {


    const tableP = {
        width: '80%',
        margin: '30px auto 20px auto',
        color: "white",
        padding: "10px",
        fontFamily: "Sans-Serif",
        textalign: 'center',
    };



      const [currentPage, setCurrentPage] = useState(0);
      const [pSize, setPSize] = useState(5);
      const [pSizes] = useState([5, 10, 15]);

  return (
    <>
        <Paper style={tableP} elevation={5}>
        <Grid
        rows={props.searchValue}
        columns={props.admin_columns}
        >
        <PagingState
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pSize}
            onPageSizeChange={setPSize}
        />
        <IntegratedPaging />
        <Table />
        <TableHeaderRow />
        <PagingPanel
            pageSizes={pSizes}
        />
        </Grid>
    </Paper>
    </>
  );
}
export default AdminBorrowTable;