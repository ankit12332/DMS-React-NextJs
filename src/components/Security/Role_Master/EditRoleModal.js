import React, { useState, useEffect, useCallback } from 'react';
import CommonModal from '@/components/Layouts/CommonModal';
import { API_ENDPOINTS } from '@/config/apiConfig';

const EditRoleModal = ({ onClose, roleData, refreshGrid }) => {
    const [formData, setFormData] = useState({ roleName: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (roleData) {
            setFormData({ roleName: roleData.roleName || '' });
        }
    }, [roleData]);

    const handleInputChange = useCallback((event) => {
        setFormData({ roleName: event.target.value });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch(API_ENDPOINTS.UPDATE_ROLE(roleData._id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roleName: formData.roleName })
            });

            if (!response.ok) throw new Error(await response.text());

            refreshGrid();
            onClose();
        } catch (error) {
            setError(`Error during submission: ${error.message}`);
        }
    };

    return (
        <CommonModal isOpen={true} onClose={onClose} title="Edit Role">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <form id="editRoleForm" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Role Name</label>
                    <input 
                        type="text"
                        name="roleName"
                        placeholder="Enter Role Name"
                        value={formData.roleName}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    />
                </div>
            </form>
            <div className="px-6 py-3">
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Close</button>
                    <button type="submit" form="editRoleForm" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Save</button>
                </div>
            </div>
        </CommonModal>
    );
};

export default EditRoleModal;
