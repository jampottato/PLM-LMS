// import { Box } from '@mantine/core';
// import dayjs from 'dayjs';
// import { DataTable } from 'mantine-datatable';
// import { useEffect, useState } from 'react';
import employees from '../employees.json';

// const PAGE_SIZES = [10, 15, 20];

// export default function FTest() {
//   const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

//   useEffect(() => {
//     setPage(1);
//   }, [pageSize]);

//   const [page, setPage] = useState(1);
//   const [records, setRecords] = useState(employees.slice(0, pageSize));

//   useEffect(() => {
//     const from = (page - 1) * pageSize;
//     const to = from + pageSize;
//     setRecords(employees.slice(from, to));
//   }, [page, pageSize]);

//   return (
//       <DataTable
//         withBorder
//         records={records}
//         columns={[
//           { accessor: 'firstName', width: 100 },
//           { accessor: 'lastName', width: 100 },
//           { accessor: 'email', width: '100%' },
//           {
//             accessor: 'birthDate',
//             textAlignment: 'right',
//             width: 120,
//             render: ({ birthDate }) => dayjs(birthDate).format('MMM D YYYY'),
//           },
//         ]}
//         totalRecords={employees.length}
//         paginationColor="grape"
//         recordsPerPage={pageSize}
//         page={page}
//         onPageChange={(p) => setPage(p)}
//         recordsPerPageOptions={PAGE_SIZES}
//         onRecordsPerPageChange={setPageSize}
//       />
//   );
// }



import React, { useState } from 'react';
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

import { generateRows } from '../generator';

export default () => {
  const [columns] = useState([
    { name: 'name', title: 'Name' },
    { name: 'gender', title: 'Gender' },
    { name: 'city', title: 'City' },
    { name: 'car', title: 'Car' },
  ]);
  const [rows] = useState(generateRows({ length: 8 }));
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [pageSizes] = useState([5, 10, 15]);

  return (
    <Paper>
      <Grid
        rows={rows}
        columns={columns}
      >
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <IntegratedPaging />
        <Table />
        <TableHeaderRow />
        <PagingPanel
          pageSizes={pageSizes}
        />
      </Grid>
    </Paper>
  );
};
