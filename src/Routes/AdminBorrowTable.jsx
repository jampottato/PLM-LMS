import {useState, useEffect} from "react";
import '../Styles/Admin.css';

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

function AdminBorrowTable(props) {


    const tableP = {
        width: '80%',
        margin: '30px auto 20px auto',
        color: "black",
        padding: "10px",
        fontFamily: "Sans-Serif",
        textalign: 'center',
    };



      const [currentPage, setCurrentPage] = useState(0);
      const [pSize, setPSize] = useState(5);
      const [pSizes] = useState([5, 10, 15]);
      const [defaultColumnWidths] = useState([
        { columnName: 'patron_id', width: 103 },
        { columnName: 'patron_name', width: 250 },
        { columnName: 'material_title', width: 200 },
        { columnName: 'issue_due', width: 180 },
        { columnName: 'issue_fine', width: 120 },
        { columnName: 'issue_status', width: 200 },
      ]);

  return (
    <>
        <Paper style={tableP} elevation={5} hidden={props.hide}>
        <Grid
        rows={props.searchValue}
        columns={props.admin_columns}
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
export default AdminBorrowTable;