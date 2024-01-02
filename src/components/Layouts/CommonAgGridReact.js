import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CommonAgGrid = ({ rowData, columnDefs, onGridReady }) => {
  return (
    <div className="ag-theme-alpine" style={{ height: 436, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={8}
        paginationPageSizeSelector={[8, 10, 20, 50]}
        animateRows={true}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default CommonAgGrid;
