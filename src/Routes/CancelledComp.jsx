import {useState, useEffect, useRef, useCallback} from "react";
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
  ExportPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
function CancelledComp(props) {
  const exporterRef = useRef(null);

  const startExport = useCallback(() => {
    exporterRef.current.exportGrid();
  }, [exporterRef]);

  const onSave = (workbook) => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ReturnedRecords.xlsx');
    });
  };

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
        fontSize: '14px',
        textAlign : 'center',
        fontWeight : 'bold',
        whiteSpace: 'normal',  
          wordWrap: 'break-word',
        }}
      />
      );
    const HeadStyle = (props)=>{
      return <HeaderCell {...props}/>
    }

    const [defCol] = useState([
        { columnName: 'cancel_date',          width: 250 },
        { columnName: 'record_type',          width: 250 },
        { columnName: 'issue_cancel_reason',  width: 250 },
        { columnName: 'patron_id',            width: 250 },
        { columnName: 'patron_name',          width: 250 },
        { columnName: 'm_title',              width: 250 },
        { columnName: 'issue_borrowed',       width: 250 },
        { columnName: 'issue_due',            width: 250 },
        { columnName: 'issue_fine',           width: 250 },
    ]) 
  
    const HighlightedCell = ({ value, style, ...restProps }) => {
      let val = value;
      if(value == 0){
        val = '₱ 0';
      } else if (typeof(value) == 'number') {
        val = '₱ ' + value;
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
          defaultSorting={[{ columnName: 'cancel_date', direction: 'asc' }]}
        />
        <IntegratedSorting/>
        <Table  cellComponent={Cell}/>
        <TableColumnResizing defaultColumnWidths={defCol}/>
        <TableHeaderRow showSortingControls cellComponent={HeadStyle}/>
        <Toolbar />
        <ExportPanel startExport={startExport} />
        
        <SearchPanel />
        <PagingPanel
            pageSizes={pSizes}
        />
        </Grid>
        <GridExporter
        ref={exporterRef}
        rows={props.searchValue}
        columns={props.admin_columns}
        onSave={onSave}
      />
    </Paper>
    </>
  );
}
export default CancelledComp;