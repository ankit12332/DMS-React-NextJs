import React from 'react';
import { AgGridReact } from 'ag-grid-react';

const CommonHeavyDataAgGridReact = ({ onGridReady, columnDefs }) => {
  return (
    <div className="ag-theme-alpine" style={{ height: 436, width: '100%' }}>
      <AgGridReact
        onGridReady={onGridReady}
        columnDefs={columnDefs}
        rowModelType="infinite"
        cacheBlockSize={8} // Large block size equal to pagination page size
        maxBlocksInCache={8} // Adjust based on memory capacity
        paginationPageSizeSelector={[8, 10, 20, 50]}
        animateRows={true}
        pagination={true}
        paginationPageSize={8}
      />
    </div>
  );
};

export default CommonHeavyDataAgGridReact;
