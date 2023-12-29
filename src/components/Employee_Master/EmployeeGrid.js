import React from 'react';
import { AgGridReact } from 'ag-grid-react';

const UserGrid = ({ rowData, columnDefs, onGridReady }) => (
  <div className="ag-theme-alpine" style={{ height: 435, width: '100%' }}>
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      pagination={true}
      paginationPageSize={8}
      animateRows={true}
      onGridReady={onGridReady}
    />  
  </div>
);

export default UserGrid;
