import React, { useState, useEffect, useContext, useCallback } from 'react';
import CommonModal from '@/components/Layouts/CommonModal';
import { API_ENDPOINTS } from '../../../config/apiConfig'; // Adjust the path as needed
import { observer } from 'mobx-react';
import { StoreContext } from '@/stores/store-context';

const EditProgramModal = observer(({ onClose, programData, refreshGrid }) => {
    const moduleStore = useContext(StoreContext).moduleStore;
    const [formData, setFormData] = useState({ title: '', description: '', path: '', moduleId: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        moduleStore.fetchModules();
        if (programData) {
            const { title = '', description = '', path = '', moduleId = '' } = programData;
            setFormData({ title, description, path, moduleId });
        }
    }, [programData, moduleStore]);

    const handleInputChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submitting data:', {
            ...formData
        });
        try {
            const response = await fetch(API_ENDPOINTS.UPDATE_PROGRAM(programData._id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, module: formData.moduleId })
            });

            if (!response.ok) throw new Error(await response.text());

            refreshGrid();
            onClose();
        } catch (error) {
            setError(`Error during submission: ${error.message}`);
        }
    };

    return (
        <CommonModal isOpen={true} onClose={onClose} title="Edit Program">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <form id="editProgramForm" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Program Title</label>
                    <input 
                        type="text"
                        name="title"
                        placeholder="Enter Program Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Description</label>
                    <textarea 
                        name="description"
                        placeholder="Enter Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Path</label>
                    <input 
                        type="text"
                        name="path"
                        placeholder="Enter Path"
                        value={formData.path}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Module</label>
                    <select
                        name="moduleId"
                        value={formData.moduleId}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    >
                        <option value="" disabled>Select Module</option>
                        {moduleStore.modules.map((module) => (
                            <option key={module._id} value={module._id}>
                                {module.moduleName}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
            <div className="px-6 py-3">
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Close</button>
                    <button type="submit" form="editProgramForm" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Save</button>
                </div>
            </div>
        </CommonModal>
    );
});

export default React.memo(EditProgramModal);
