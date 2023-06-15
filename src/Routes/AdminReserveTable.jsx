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
import { Container } from "react-bootstrap";

function AdminReserveTable(props) {
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
  
    const HighlightedCell = ({ value, style, ...restProps }) => (
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
        {value}
      </Table.Cell>
    );
    
    const Cell = (props) => {
    return <HighlightedCell {...props} />;
    };
      const [currentPage, setCurrentPage] = useState(0);
      const [pSize, setPSize] = useState(5);
      const [pSizes] = useState([5, 10, 15]);

  return (
    <>
      <Paper style={tableP} elevation={5} hidden={props.hide}>
        <h1 style={{fontSize:'2rem'}} className="header-texts"><strong>RESERVED</strong></h1>

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
            defaultSorting={[{ columnName: 'issue_checkout_date', direction: 'asc' }]}
          />
          <IntegratedSorting/>
          <Table  cellComponent={Cell}/>
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
export default AdminReserveTable;