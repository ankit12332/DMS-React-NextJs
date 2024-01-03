import React, { useState, useCallback } from 'react';
import CommonModal from '@/components/Layouts/CommonModal';
import { API_ENDPOINTS } from '@/config/apiConfig'; // Adjust the path as needed

const CreateProgramModal = ({ onClose, refreshGrid }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        path: ''
    });
    const [error, setError] = useState(null);

    const handleChange = useCallback((e) => {
        setFormData(prevFormData => ({ ...prevFormData, [e.target.name]: e.target.value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(API_ENDPOINTS.CREATE_PROGRAM, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                refreshGrid(); // Refresh the program list
                onClose(); // Close the modal
            } else {
                const errorMsg = await response.text();
                setError(`Failed to submit: ${errorMsg}`);
            }
        } catch (error) {
            setError(`Error during submission: ${error.message}`);
        }
    }, [formData, onClose, refreshGrid]);

    return (
        <CommonModal isOpen={true} onClose={onClose} title="Create New Program">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <form id="createProgramForm" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Program Title</label>
                    <input 
                        type="text"
                        name="title"
                        placeholder="Enter Program Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Description</label>
                    <textarea 
                        name="description"
                        placeholder="Enter Description"
                        value={formData.description}
                        onChange={handleChange}
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
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    />
                </div>
            </form>
            <div className="px-6 py-3">
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Close</button>
                    <button type="submit" form="createProgramForm" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Save</button>
                </div>
            </div>
        </CommonModal>
    );
};

export default CreateProgramModal;
