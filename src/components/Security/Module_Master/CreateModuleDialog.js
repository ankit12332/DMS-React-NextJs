import React, { useState, useCallback } from 'react';
import CommonModal from '../../Layouts/CommonModal';
import { API_ENDPOINTS } from '../../../config/apiConfig';

const CreateModuleDialog = ({ onClose, isCreateDialogOpen, refreshGrid }) => {
  const [formData, setFormData] = useState({
    moduleName: ''
  });

  const [error, setError] = useState(null);

  const handleChange = useCallback((e) => {
    setFormData(prevFormData => ({ ...prevFormData, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_MODULE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        refreshGrid();
        onClose();  // Close the modal on success
      } else {
        const errorMsg = await response.text();
        setError(`Failed to submit: ${errorMsg}`);
      }
    } catch (error) {
      setError(`Error during submission: ${error.message}`);
    }
  }, [formData, onClose, refreshGrid]);

  return (
    <CommonModal isOpen={isCreateDialogOpen} onClose={onClose} title="Create New Module">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form id="createModuleForm" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-4">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Module Name</label>
                <input 
                  type="text"
                  name="moduleName"
                  placeholder="Enter Module Name"
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                />
            </div>
        </form>
        <div className="px-6 py-3">
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105">Close</button>
            <button type="submit" form="createModuleForm" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105">Save</button>
          </div>
        </div>
    </CommonModal>
  );
};

export default CreateModuleDialog;
