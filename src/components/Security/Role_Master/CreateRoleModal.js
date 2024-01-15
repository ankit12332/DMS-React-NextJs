import React, { useState, useCallback } from 'react';
import CommonModal from '@/components/Layouts/CommonModal';
import { API_ENDPOINTS } from '@/config/apiConfig';

const CreateRoleModal = ({ onClose, refreshGrid }) => {
    const [roleName, setRoleName] = useState('');
    const [error, setError] = useState(null);

    const handleChange = useCallback((e) => {
        setRoleName(e.target.value);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_ENDPOINTS.CREATE_ROLE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roleName }),
            });

            if (response.ok) {
                refreshGrid();
                onClose(); // Close the modal
            } else {
                const errorMsg = await response.text();
                setError(`Failed to create role: ${errorMsg}`);
            }
        } catch (error) {
            setError(`Error during submission: ${error.message}`);
        }
    }, [roleName, onClose]);

    return (
        <CommonModal isOpen={true} onClose={onClose} title="Create New Role">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Role Name</label>
                    <input 
                        type="text"
                        name="roleName"
                        placeholder="Enter Role Name"
                        value={roleName}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    />
                </div>
            </form>
            <div className="px-6 py-3 flex justify-end space-x-3">
                <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Close</button>
                <button type="submit" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Create</button>
            </div>
        </CommonModal>
    );
};

export default CreateRoleModal;
