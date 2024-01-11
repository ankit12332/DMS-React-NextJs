import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import SearchBar from '@/components/Layouts/CommonSearchBar';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { API_ENDPOINTS } from '../../config/apiConfig';
import CommonModal from '@/components/Layouts/CommonModal';
import CreateModuleDialog from '@/components/Security/Module_Master/CreateModuleModal';
import EditModuleDialog from '@/components/Security/Module_Master/EditModuleModal';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CommonAgGrid = React.lazy(() => import('@/components/Layouts/CommonAgGridReact'), { ssr: false });

const ModuleMaster = () => {
  const [modules, setModules] = useState([]);
  const [isClient, setIsClient] = useState(false); //For CommonAgGrid. Because in Server Side Rendering heavy library takes time to load
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    delete: false,
    selectedModule: null,
    moduleToDelete: null,
  });

  useEffect(() => {
    // Set the isClient state to true once the component mounts
    setIsClient(true);
    // Fetch Modules Details
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ALL_MODULES);
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const onGridReady = params => {
    setGridApi(params.api);
    fetchModules();
  };

  useEffect(() => {
    if (gridApi && isLoading) {
        gridApi.showLoadingOverlay();
    } else if (gridApi) {
        gridApi.hideOverlay();
    }
}, [gridApi, isLoading]);

  const handleSearch = useCallback(() => {
    gridApi.setQuickFilter(searchText);
  }, [searchText, gridApi]);

  const columns = useMemo(() => [
    { headerName: "Module Name", field: "moduleName", sortable: true, filter: true, flex: 5 },
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
  ], []);

  const handleCreate = () => {
    setDialogState(prev => ({ ...prev, create: true }));
  };

  const handleEdit = useCallback((module) => {
    setDialogState(prev => ({ ...prev, edit: true, selectedModule: module }));
  }, []);

  const handleDelete = useCallback((module) => {
    setDialogState(prev => ({ ...prev, delete: true, moduleToDelete: module }));
  }, []);

  const confirmDelete = async () => {
    const { moduleToDelete } = dialogState;
    if (!moduleToDelete) return;

    try {
      const response = await fetch(API_ENDPOINTS.DELETE_MODULE(moduleToDelete._id), {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchModules(); // Refresh grid data
        setDialogState(prev => ({ ...prev, delete: false })); // Close the modal
      } else {
        console.error('Failed to delete the module:', response.statusText);
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800">Module Master</h2>
      <p>Manage Your Modules</p>
      <div className="my-4 flex justify-between items-center">
        <SearchBar searchText={searchText} setSearchText={setSearchText} onSearch={handleSearch} placeholder="Search by Module Name" />
        <button onClick={handleCreate} className="bg-[#1F2937] hover:bg-opacity-90 text-white py-1.5 px-4 ml-2 rounded flex items-center">
            <FaPlus className="mr-2"/>Create Module
        </button>
      </div>

      <Suspense fallback={<div>Loading Grid...</div>}>
        {isClient && (
          <CommonAgGrid rowData={modules} columnDefs={columns} onGridReady={onGridReady}/>
        )}
      </Suspense>

      {dialogState.create && (
        <CreateModuleDialog onClose={() => setDialogState(prev => ({ ...prev, create: false }))} isCreateDialogOpen={dialogState.create} refreshGrid={fetchModules} />
      )}
      {dialogState.edit && dialogState.selectedModule && (
        <EditModuleDialog onClose={() => setDialogState(prev => ({ ...prev, edit: false }))} moduleData={dialogState.selectedModule} refreshGrid={fetchModules} />
      )}
      {dialogState.delete && (
        <CommonModal isOpen={dialogState.delete} onClose={() => setDialogState(prev => ({ ...prev, delete: false }))} title="Confirm Delete">
          <p>Are you sure you want to delete {dialogState.moduleToDelete?.moduleName}?</p>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setDialogState(prev => ({ ...prev, delete: false }))} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Cancel</button>
            <button onClick={confirmDelete} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Delete</button>
          </div>
        </CommonModal>
      )}
    </div>
  );
};

export default ModuleMaster;