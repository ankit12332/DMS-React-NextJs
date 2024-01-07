import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import SearchBar from '@/components/Layouts/CommonSearchBar';
import CommonModal from '@/components/Layouts/CommonModal';
import { API_ENDPOINTS } from '../../config/apiConfig';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CommonAgGrid = React.lazy(() => import('@/components/Layouts/CommonAgGridReact'), { ssr: false });

const RoleMaster = () => {
    const [roles, setRoles] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [gridApi, setGridApi] = useState(null);
    const [dialogState, setDialogState] = useState({
        create: false,
        edit: false,
        delete: false,
        selectedRole: null,
        roleToDelete: null,
    });

    useEffect(() => {
        // Set the isClient state to true once the component mounts
        setIsClient(true);
        // Fetch Roles Details
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.GET_ALL_ROLES);
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const formatPrograms = (modules) => {
        return modules.flatMap(module => module.programs.map(program => program.title)).join(', ');
    };

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const handleSearch = useCallback(() => {
        gridApi.setQuickFilter(searchText);
    }, [searchText, gridApi]);

    const columns = useMemo(() => [
        { headerName: "Role Name", field: "roleName", sortable: true, filter: true, flex: 1.5 },
        {
          headerName: "Programs",
          field: "modules",
          valueFormatter: (params) => formatPrograms(params.value),
          sortable: true,
          filter: true,
          flex: 3
        },
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

    const handleEdit = useCallback((role) => {
        setDialogState(prev => ({ ...prev, edit: true, selectedRole: role }));
    }, []);

    const handleDelete = useCallback((role) => {
        setDialogState(prev => ({ ...prev, delete: true, roleToDelete: role }));
    }, []);

    const confirmDelete = async () => {
        const { roleToDelete } = dialogState;
        if (!roleToDelete) return;

        // Replace with actual API call
        const response = await fetch(API_ENDPOINTS.DELETE_ROLE(roleToDelete.roleId), { method: 'DELETE' });
        if (response.ok) {
            fetchRoles();
            setDialogState(prev => ({ ...prev, delete: false }));
        } else {
            console.error('Failed to delete the role:', response.statusText);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Role Master</h2>
            <p>Manage Your Roles</p>
            <div className="my-4 flex justify-between items-center">
                <SearchBar searchText={searchText} setSearchText={setSearchText} onSearch={handleSearch} placeholder="Search by Role Name" />
                <button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-4 ml-2 rounded flex items-center">
                    <FaPlus className="mr-2"/>Create Role
                </button>
            </div>

            <Suspense fallback={<div>Loading Grid...</div>}>
                {isClient && (
                    <CommonAgGrid rowData={roles} columnDefs={columns} onGridReady={onGridReady}/>
                )}
            </Suspense>

            {dialogState.create && (
                <CreateRoleModal onClose={() => setDialogState(prev => ({ ...prev, create: false }))} refreshGrid={fetchRoles} />
            )}
            {dialogState.edit && dialogState.selectedRole && (
                <EditRoleModal onClose={() => setDialogState(prev => ({ ...prev, edit: false }))} roleData={dialogState.selectedRole} refreshGrid={fetchRoles} />
            )}
            {dialogState.delete && (
                <CommonModal isOpen={dialogState.delete} onClose={() => setDialogState(prev => ({ ...prev, delete: false }))} title="Confirm Delete">
                    <p>Are you sure you want to delete {dialogState.roleToDelete?.roleName}?</p>
                    <div className="flex justify-end space-x-3">
                        <button onClick={() => setDialogState(prev => ({ ...prev, delete: false }))} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={confirmDelete} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Delete</button>
                    </div>
                </CommonModal>
            )}
        </div>
    );
};

export default RoleMaster;