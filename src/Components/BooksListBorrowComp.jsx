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

function BoksListBorrowComp(props) {


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
		{ columnName: 'm_btn', width: 300 },
		{ columnName: 'm_title', width: 400 },
		{ columnName: 'm_author', width: 300 },
		{ columnName: 'm_pub_date', width: 100 },
		{ columnName: 'm_dept', width: 200 },
        { columnName: 'm_copies', width: 200},
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
			<Table />
			<TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
			<TableHeaderRow showSortingControls />
			<Toolbar />
			
			<SearchPanel style={{width:'100%'}}/>
			<PagingPanel
				pageSizes={pSizes}
			/>
			</Grid>
		</Paper>
	</>
	);
}
export default BoksListBorrowComp;