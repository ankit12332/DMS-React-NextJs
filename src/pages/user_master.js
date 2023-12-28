import { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { API_ENDPOINTS } from '../config/apiConfig';
import { FaSearch, FaPlus } from 'react-icons/fa';

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function UserMaster() {
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [gridApi, setGridApi] = useState(null);

  // Define the columns for AG Grid
  const columns = useMemo(() => [
    { headerName: "Name", field: "name", sortable: true, filter: true, flex: 1 },
    { headerName: "Email", field: "email", sortable: true, filter: true, flex: 1},
    { headerName: "Username", field: "username", sortable: true, filter: true, flex: 1 },
    { headerName: "Created At", field: "createdAt", sortable: true, filter: true, flex: 1 },
    // Additional fields as needed
  ], []);

  const fetchData = useCallback(async () => {
    try {
      if (gridApi) gridApi.showLoadingOverlay();
      const response = await fetch(API_ENDPOINTS.GET_ALL_USERS);
      const data = await response.json();
      setRowData(data);
      if (gridApi) gridApi.hideOverlay();
    } catch (error) {
      console.error('Error fetching data:', error);
      if (gridApi) gridApi.showNoRowsOverlay();
    }
  }, [gridApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onGridReady = params => {
    setGridApi(params.api); // Set the grid API
  };

  const handleSearch = useCallback(() => {
    if (searchText.trim() === '') {
      gridApi.setRowData(rowData); // Reset to original data if search text is empty
    } else {
      const filteredData = rowData.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) || 
        item.username.toLowerCase().includes(searchText.toLowerCase())
      );
      gridApi.setRowData(filteredData); // Set filtered data
    }
  }, [searchText, rowData, gridApi]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800">Employee Master</h2>
      <p>Manage Your Employees</p>

      {/* Search Bar and Button */}
      <div className="my-4 flex justify-between items-center">
        <div className="flex items-center">
          <input 
            type="text"
            placeholder="Search by Name or Username"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="border-2 border-gray-300 rounded p-1.5 mr-2"
          />
          <button 
            onClick={handleSearch}
            className="bg-[#1F2937] hover:bg-opacity-90 text-white py-1.5 px-4 rounded items-center flex"
          >
            <FaSearch className="mr-2"/>
            Search
          </button>
        </div>
        <button 
        // Add your method to handle the creation of a new employee
        className="bg-[#1F2937] hover:bg-opacity-90 text-white py-1.5 px-4 ml-2 rounded flex items-center"
        >
        <FaPlus className="mr-2"/> {/* Plus icon */}
        Create Employee
      </button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 435, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          //domLayout='autoHeight'
          pagination={true}
          paginationPageSize={8}
          animateRows={true}
          onGridReady={onGridReady}
        />  
      </div>
    </div>
  );
}
