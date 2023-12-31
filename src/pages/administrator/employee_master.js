import { useState, useEffect, useMemo, useCallback } from 'react';
import useFetchUsers from '@/hooks/Employee_Master/useFetchEmployees';
import SearchBar from '@/components/Employee_Master/SearchBar';
import CreateUserButton from '@/components/Employee_Master/CreateEmployeeButton';
import UserGrid from '@/components/Employee_Master/EmployeeGrid';
import CreateEmployeeDialog from '@/components/Employee_Master/CreateEmployeeDialog';
// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


export default function EmployeeMaster() {
  const [searchText, setSearchText] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const { rowData, fetchData } = useFetchUsers(gridApi);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Define the columns for AG Grid
  const columns = useMemo(() => [
    { headerName: "Name", field: "name", sortable: true, filter: true, flex: 1 },
    { headerName: "Employee Code", field: "employeeCode", sortable: true, filter: true, flex: 1 },
    { headerName: "Email", field: "email", sortable: true, filter: true, flex: 1},
    { headerName: "Username", field: "username", sortable: true, filter: true, flex: 1 },
    { headerName: "Created At", field: "createdAt", sortable: true, filter: true, flex: 1 },
    // Additional fields as needed
  ], []);

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

  const handleCreateUser = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="p-6">
    <h2 className="text-2xl font-semibold text-gray-800">Employee Master</h2>
    <p>Manage Your Employees</p>

    <div className="my-4 flex justify-between items-center">
      <SearchBar searchText={searchText} setSearchText={setSearchText} onSearch={handleSearch} />
      <CreateUserButton onCreateUser={handleCreateUser} />
    </div>

    <UserGrid rowData={rowData} columnDefs={columns} onGridReady={onGridReady} />
    {/* Ensure the dialog is a direct child of the main container */}
    {isCreateDialogOpen && (
        <CreateEmployeeDialog onClose={handleCloseDialog} isCreateDialogOpen={isCreateDialogOpen} />
      )}
  </div>
  );
}
