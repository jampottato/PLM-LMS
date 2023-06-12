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
import { Typography } from "@mui/material";

function BoksListBorrowComp(props) {


    const tableP = {
        width: '80%',
        margin: '30px auto 20px auto',
        color: "black",
        padding: "10px",
        fontFamily: "Sans-Serif",
        textalign: 'center',
		whiteSpace : 'nowrap'
    };

	const [currentPage, setCurrentPage] = useState(0);
	const [pSize, setPSize] = useState(5);
	const [pSizes] = useState([5, 10, 15]);
	const [defaultColumnWidths] = useState([
		{ columnName: 'm_btn', width: 300 },
		{ columnName: 'm_title', width: 400 },
		{ columnName: 'm_author', width: 300 },
		{ columnName: 'm_dept', width: 200 },
        { columnName: 'm_copies', width: 200},
		{ columnName: 'm_more_info',     width: 200}
	]);

	const HeaderCell = ({ value, style, ...restProps }) => (
		<TableHeaderRow.Cell
		  {...restProps}
		  style={{
			...style,
			textAlign : 'center',
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
			border: '1px solid black 0.5',
			textAlign : 'center'
		  }}
		>
			{value}
		</Table.Cell>
	  );
	  
	  const Cell = (props) => {
		return <HighlightedCell {...props} />;
	  };

	  const [tableColumnExtensions] = useState([
		{ columnName: 'm_title', wordWrapEnabled: true },
		{ columnName: 'm_author', wordWrapEnabled: true },
		{ columnName: 'm_dept', wordWrapEnabled: true },
        { columnName: 'm_copies', wordWrapEnabled: true},
	  ]);

	return (
	<>
		<Paper style={{...tableP}} elevation={5} >
			
			<Grid 
			rows={props.searchValue}
			columns={props.material_columns}
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
					defaultSorting={[{ columnName: 'm_title', direction: 'asc' }]}
				/>
				<IntegratedSorting />
				
				<Table cellComponent={Cell}/>
				<TableHeaderRow showSortingControls cellComponent={HeadStyle}/>
				<Toolbar />
				
				<SearchPanel/>
				<PagingPanel
					pageSizes={pSizes}
				/>

			</Grid>
		</Paper>
	</>
	);
}
export default BoksListBorrowComp;