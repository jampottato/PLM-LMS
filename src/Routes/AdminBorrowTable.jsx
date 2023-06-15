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

    const HeaderCell = ({ value, style, ...restProps }) => (
      <TableHeaderRow.Cell
        {...restProps}
        style={{
        ...style,
        textAlign : 'center',
        fontWeight : 'bold'
        }}
      />
      );
    const HeadStyle = (props)=>{
      return <HeaderCell {...props}/>
    }
  
    const HighlightedCell = ({ value, style, ...restProps }) => {
      let val = value;
      if(value == 0){
        val = '0';
      }
      return (
        <Table.Cell
        {...restProps}
        style={{
          ...style,
          whiteSpace: 'normal',  
          wordWrap: 'break-word',
          border: '1px solid rgba(0,0,0,0.1)',
          textAlign : 'center'
        }}
        >
          {val}
        </Table.Cell>
      )
    };
    
    const Cell = (props) => {
    return <HighlightedCell {...props} />;
    };


      const [currentPage, setCurrentPage] = useState(0);
      const [pSize, setPSize] = useState(5);
      const [pSizes] = useState([5, 10, 15]);

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
        <Table  cellComponent={Cell}/>
        <TableColumnResizing/>
        <TableHeaderRow showSortingControls cellComponent={HeadStyle}/>
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