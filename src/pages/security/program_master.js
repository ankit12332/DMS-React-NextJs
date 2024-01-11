import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import SearchBar from '@/components/Layouts/CommonSearchBar';
import CreateProgramModal from '@/components/Security/Program_Master/CreateProgramModal';
import EditProgramModal from '@/components/Security/Program_Master/EditProgramModal';
import CommonModal from '@/components/Layouts/CommonModal';
import { API_ENDPOINTS } from '../../config/apiConfig';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CommonAgGrid = React.lazy(() => import('@/components/Layouts/CommonAgGridReact'), { ssr: false });

const ProgramMaster = () => {
    const [programs, setPrograms] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [gridApi, setGridApi] = useState(null);
    const [dialogState, setDialogState] = useState({
        create: false,
        edit: false,
        delete: false,
        selectedProgram: null,
        programToDelete: null,
    });

    useEffect(() => {
        // Set the isClient state to true once the component mounts
        setIsClient(true);
        // Fetch Programs Details
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.GET_ALL_PROGRAMS);
            const data = await response.json();
            setPrograms(data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

    const onGridReady = params => {
        setGridApi(params.api);
        fetchPrograms();
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
        { headerName: "Program Name", field: "title", sortable: true, filter: true, flex: 1.5 },
        { headerName: "Module Name", field: "module.moduleName", sortable: true, filter: true, flex: 1.5 },
        { headerName: "Path", field: "path", sortable: true, filter: true, flex: 1.5 },
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

    const handleEdit = useCallback((program) => {
        setDialogState(prev => ({ ...prev, edit: true, selectedProgram: program }));
    }, []);

    const handleDelete = useCallback((program) => {
        setDialogState(prev => ({ ...prev, delete: true, programToDelete: program }));
    }, []);

    const confirmDelete = async () => {
        const { programToDelete } = dialogState;
        if (!programToDelete) return;

        // Replace with actual API call
        const response = await fetch(API_ENDPOINTS.DELETE_PROGRAM(programToDelete._id), { method: 'DELETE' });
        if (response.ok) {
            fetchPrograms();
            setDialogState(prev => ({ ...prev, delete: false }));
        } else {
            console.error('Failed to delete the program:', response.statusText);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Program Master</h2>
            <p>Manage Your Programs</p>
            <div className="my-4 flex justify-between items-center">
                <SearchBar searchText={searchText} setSearchText={setSearchText} onSearch={handleSearch} placeholder="Search by Program Name" />
                <button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-4 ml-2 rounded flex items-center">
                    <FaPlus className="mr-2"/>Create Program
                </button>
            </div>

            <Suspense fallback={<div>Loading Grid...</div>}>
                {isClient && (
                    <CommonAgGrid rowData={programs} columnDefs={columns} onGridReady={onGridReady}/>
                )}
            </Suspense>

            {dialogState.create && (
                <CreateProgramModal onClose={() => setDialogState(prev => ({ ...prev, create: false }))} refreshGrid={fetchPrograms} />
            )}
            {dialogState.edit && dialogState.selectedProgram && (
                <EditProgramModal onClose={() => setDialogState(prev => ({ ...prev, edit: false }))} programData={dialogState.selectedProgram} refreshGrid={fetchPrograms} />
            )}
            {dialogState.delete && (
                <CommonModal isOpen={dialogState.delete} onClose={() => setDialogState(prev => ({ ...prev, delete: false }))} title="Confirm Delete">
                    <p>Are you sure you want to delete {dialogState.programToDelete?.programName}?</p>
                    <div className="flex justify-end space-x-3">
                        <button onClick={() => setDialogState(prev => ({ ...prev, delete: false }))} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={confirmDelete} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Delete</button>
                    </div>
                </CommonModal>
            )}
        </div>
    );
};

export default ProgramMaster;