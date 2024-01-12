import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import SearchBar from '@/components/Layouts/CommonSearchBar';
import CreateEmployeeDialog from '@/components/Administrator/Employee_Master/CreateEmployeeDialog';
import EditEmployeeDialog from '@/components/Administrator/Employee_Master/EditEmployeeDialog';
import CommonModal from '@/components/Layouts/CommonModal';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { LoadingComponent } from '@/components/Layouts/CustomLoadingCellRenderer';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CommonHeavyDataAgGridReact = React.lazy(() => import('@/components/Layouts/CommonHeavyDataAgGridReact'),{ ssr: false });

export default function EmployeeMaster() {
  const [isClient, setIsClient] = useState(false); //For CommonAgGrid. Because in Server Side Rendering heavy library takes time to load
  const [searchText, setSearchText] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    delete: false,
    selectedUser: null,
    employeeToDelete: null
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const columns = useMemo(() => [
    { headerName: "Name", field: "name", sortable: true, filter: true, flex: 1, cellRenderer: (params) => {
      if (!params.data) {
        return <LoadingComponent />;
      }
      return params.value;
    } },
    { headerName: "Employee Code", field: "employeeCode", sortable: true, filter: true, flex: 1 },
    { headerName: "Email", field: "email", sortable: true, filter: true, flex: 1 },
    { headerName: "Username", field: "username", sortable: true, filter: true, flex: 1 },
    { headerName: "Created At", field: "createdAt", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Options",
      field: "options",
      cellRenderer: (params) => {

        if (!params.data) {
          return null; 
        }

        return (
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
        );
      },
      flex: 0.5
    }
  ], []);  

  const fetchEmployee = useCallback(() => {
    return {
      getRows: (params) => {
        const startRow = params.startRow;
        const endRow = params.endRow;
        //With sorting feature and it's slow
        //const sortingModel = params.sortModel;
  
        //let sortField = sortingModel.length > 0 ? sortingModel[0].colId : null;
        //let sortOrder = sortingModel.length > 0 ? sortingModel[0].sort : null;

        //const requestUrl = `${API_ENDPOINTS.GET_ALL_USERS}?startRow=${startRow}&endRow=${endRow}&sortField=${sortField}&sortOrder=${sortOrder}`;
  
        //Without sorting feature and it's fast
        const requestUrl = `${API_ENDPOINTS.GET_ALL_USERS}?startRow=${startRow}&endRow=${endRow}`;

        fetch(requestUrl)
          .then(response => response.json())
          .then(data => {
            if (data && data.data) {
              params.successCallback(data.data, data.totalCount);
            } else {
              params.failCallback();
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            params.failCallback();
          });
      }
    };
  }, []);
  
  

  const refreshGridData = useCallback(() => {
    if (gridApi) {
      const dataSource = fetchEmployee();
      gridApi.updateGridOptions({ datasource: dataSource });
    }
  }, [fetchEmployee, gridApi]);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    const dataSource = fetchEmployee();
    params.api.updateGridOptions({ datasource: dataSource });
  }, [fetchEmployee]);

  const handleSearch = useCallback(() => {
    if (gridApi) {
      const dataSource = {
        getRows: (params) => {
          fetch(`${API_ENDPOINTS.GET_ALL_USERS}?searchText=${searchText}&startRow=${params.startRow}&endRow=${params.endRow}`)
            .then(response => response.json())
            .then(data => {
              if (data && data.data) {
                params.successCallback(data.data, data.totalCount);
              } else {
                params.failCallback();
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              params.failCallback();
            });
        }
      };
      gridApi.updateGridOptions({ datasource: dataSource });
    }
  }, [searchText, gridApi]);
  
  

  const handleCreateUser = () => {
    setDialogState(prev => ({ ...prev, create: true }));
  };

  const handleEdit = useCallback(user => {
    setDialogState(prev => ({ ...prev, edit: true, selectedUser: user }));
  }, []);

  const handleDelete = useCallback(user => {
    setDialogState(prev => ({ ...prev, delete: true, employeeToDelete: user }));
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!dialogState.employeeToDelete) return;
  
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_USER(dialogState.employeeToDelete._id), {
        method: 'DELETE',
      });
  
      if (response.ok) {
        refreshGridData(); // Refresh grid data
        setDialogState(prev => ({ ...prev, delete: false })); // Close the modal
      } else {
        console.error('Failed to delete the employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  }, [dialogState.employeeToDelete, fetchEmployee]);

  const handleCloseDialog = useCallback(() => {
    setDialogState({ create: false, edit: false, delete: false, selectedUser: null, employeeToDelete: null });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800">Employee Master</h2>
      <p>Manage Your Employees</p>

      <div className="my-4 flex justify-between items-center">
        <SearchBar searchText={searchText} setSearchText={setSearchText} onSearch={handleSearch} placeholder="Search by Name or Username" />
        <button onClick={handleCreateUser} className="bg-[#1F2937] hover:bg-opacity-90 text-white py-1.5 px-4 ml-2 rounded flex items-center">
            <FaPlus className="mr-2"/>Create Employee
        </button>
      </div>

      <Suspense fallback={<div>Loading Grid...</div>}>
        {isClient && (
          <CommonHeavyDataAgGridReact 
            onGridReady={onGridReady} 
            columnDefs={columns} 
            fetchDataSource={fetchEmployee} 
          />
        )}
      </Suspense>

      {dialogState.create && (
        <CreateEmployeeDialog onClose={handleCloseDialog} refreshGrid={refreshGridData} isCreateDialogOpen={dialogState.create} />
      )}

      {dialogState.edit && dialogState.selectedUser && (
        <EditEmployeeDialog onClose={handleCloseDialog} userData={dialogState.selectedUser} refreshGrid={refreshGridData}  isEditDialogOpen={dialogState.edit}/>
      )}

      <CommonModal isOpen={dialogState.delete} onClose={handleCloseDialog} title="Confirm Delete">
        <p>Are you sure you want to delete {dialogState.employeeToDelete?.name}?</p>
        <div className="flex justify-end space-x-3">
          <button onClick={handleCloseDialog} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Cancel</button>
          <button onClick={confirmDelete} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Delete</button>
        </div>
      </CommonModal>
    </div>
  );
}
