import React, { useState, useEffect, useCallback, useMemo, Suspense, useRef } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import SearchBar from '@/components/Layouts/CommonSearchBar';
import CommonModal from '@/components/Layouts/CommonModal';
import { API_ENDPOINTS } from '../../config/apiConfig';
import CreateRoleModal from '@/components/Security/Role_Master/CreateRoleModal';
import EditRoleModal from '@/components/Security/Role_Master/EditRoleModal';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CommonAgGrid = React.lazy(() => import('@/components/Layouts/CommonAgGridReact'), { ssr: false });

const RoleMaster = () => {
    const [roles, setRoles] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPrograms, setCurrentPrograms] = useState(null);
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
            console.log(data)
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    // const formatPrograms = (modules) => {
    //     return modules.flatMap(module => module.programs.map(program => program.title)).join(', ');
    // };

    const onGridReady = params => {
        setGridApi(params.api);
        fetchRoles();
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

    const closeDropdown = () => {
        setCurrentPrograms(null);
        setDropdownPosition(null);
    };

    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, closeDropdown);

    const showPrograms = (programs, event) => {
        const buttonElement = event.currentTarget;
        const rect = buttonElement.getBoundingClientRect();

        setCurrentPrograms(programs);
        setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });
    };

    const ViewProgramsRenderer = ({ data }) => {
        const programs = data.modules.flatMap(module => module.programs);
        if (programs.length === 0) {
            return null; // Don't show anything if there are no programs
        }

        return (
            <span
                onClick={(e) => showPrograms(programs, e)}
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
            >
                View Programs
            </span>
        );
    };

    const columns = useMemo(() => [
        { headerName: "Role Name", field: "roleName", sortable: true, filter: true, flex: 1.5 },
        {
          headerName: "Programs",
          field: "modules",
          valueFormatter: (params) => {
            // Format the modules object into a string representation
            // Example: return a comma-separated list of program titles
            return params.value.map(module => module.programs.map(program => program.title).join(', ')).join('; ');
          },
          cellRenderer: ViewProgramsRenderer,
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
        const response = await fetch(API_ENDPOINTS.DELETE_ROLE(roleToDelete._id), { method: 'DELETE' });
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
            <div ref={dropdownRef}>
                <FloatingDropdown programs={currentPrograms} position={dropdownPosition} />
            </div>
        </div>
    );
};

export default RoleMaster;

const FloatingDropdown = ({ programs, position }) => {
    if (!programs) return null;

    return (
        <div
            style={{ top: position.top, left: position.left }}
            className="absolute mt-3 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
        >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {programs.map(program => (
                    // Use program.id as the key, assuming each program has a unique id
                    <a key={program.id} href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        {program.title}
                    </a>
                ))}
            </div>
        </div>
    );
};


function useOutsideClick(ref, onOutsideClick) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutsideClick();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, onOutsideClick]);
}
