import { useState, useEffect, useMemo, useCallback } from 'react';
import useFetchUsers from '@/hooks/Employee_Master/useFetchEmployees';
import SearchBar from '@/components/Employee_Master/SearchBar';
import CreateUserButton from '@/components/Employee_Master/CreateEmployeeButton';
import EmployeeGrid from '@/components/Employee_Master/EmployeeGrid';
import CreateEmployeeDialog from '@/components/Employee_Master/CreateEmployeeDialog';
import EditEmployeeDialog from '@/components/Employee_Master/EditEmployeeDialog';
import CommonModal from '@/components/Layouts/CommonModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { API_ENDPOINTS } from '../../config/apiConfig';
// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function EmployeeMaster() {
  const [searchText, setSearchText] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const { rowData, fetchData } = useFetchUsers(gridApi);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);


  // Define the columns for AG Grid
  const columns = useMemo(() => [
    { headerName: "Name", field: "name", sortable: true, filter: true, flex: 1 },
    { headerName: "Employee Code", field: "employeeCode", sortable: true, filter: true, flex: 1 },
    { headerName: "Email", field: "email", sortable: true, filter: true, flex: 1},
    { headerName: "Username", field: "username", sortable: true, filter: true, flex: 1 },
    { headerName: "Created At", field: "createdAt", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Options",
      field: "options",
      cellRenderer: (params) => (
        <div className="flex items-center space-x-3 h-full">
          <button 
            className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out transform hover:scale-110"
            onClick={() => handleEdit(params.data)}
            style={{fontSize:"1.1rem"}}
          >
            <FaEdit />
          </button>
          <button 
            className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out transform hover:scale-110"
            onClick={() => handleDelete(params.data)}
            style={{fontSize:"1rem"}}
          >
            <FaTrash />
          </button>
        </div>
      ),
      flex: 0.5
    }
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

  const handleEdit = user => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user) => {
    setEmployeeToDelete(user);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!employeeToDelete) return;
  
      try {
        const response = await fetch(API_ENDPOINTS.DELETE_USER(employeeToDelete._id), {
        method: 'DELETE',
      });
  
      if (response.ok) {
        fetchData(); // Refresh grid data
        setIsDeleteDialogOpen(false); // Close the modal
      } else {
        console.error('Failed to delete the employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };
  
  

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="p-6">
    <h2 className="text-2xl font-semibold text-gray-800">Employee Master</h2>
    <p>Manage Your Employees</p>

    <div className="my-4 flex justify-between items-center">
      <SearchBar searchText={searchText} setSearchText={setSearchText} onSearch={handleSearch} />
      <CreateUserButton onCreateUser={handleCreateUser} />
    </div>

    <EmployeeGrid rowData={rowData} columnDefs={columns} onGridReady={onGridReady} />
    {/* Ensure the dialog is a direct child of the main container */}
    {isCreateDialogOpen && (
        <CreateEmployeeDialog onClose={handleCloseDialog} refreshGrid={fetchData} isCreateDialogOpen={isCreateDialogOpen} />
    )}

    {isEditDialogOpen && (
        <EditEmployeeDialog onClose={handleCloseDialog} userData={selectedUser} refreshGrid={fetchData} isEditDialogOpen={isEditDialogOpen}/>
    )}

    <CommonModal isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="Confirm Delete">
      <p>Are you sure you want to delete {employeeToDelete?.name}?</p>
      <div className="flex justify-end space-x-3">
        <button onClick={() => setIsDeleteDialogOpen(false)} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Cancel</button>
        <button onClick={confirmDelete} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Delete</button>
      </div>
    </CommonModal>
  </div>
  );
}
