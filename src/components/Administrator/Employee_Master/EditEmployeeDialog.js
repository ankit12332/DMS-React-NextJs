import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CommonModal from '../../Layouts/CommonModal';
import { API_ENDPOINTS } from '../../../config/apiConfig';

function EditEmployeeDialog({ onClose, userData, refreshGrid }) {
  const initialFormData = useMemo(() => ({ ...userData, newPassword: '' }), [userData]);

  const [formData, setFormData] = useState(initialFormData);

  // Update formData when userData changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleInputChange = useCallback((event) => {
    setFormData(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }, []);
  
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      let dataToUpdate = { ...formData };
  
      // If a new password is provided, include it in the update.
      // Otherwise, do not send any password field.
      if (formData.newPassword && formData.newPassword.trim() !== '') {
        dataToUpdate.password = formData.newPassword;
      } else {
        delete dataToUpdate.password; // Remove the original hashed password if new password is not provided
      }
  
      // Remove the newPassword field from the data being sent to the server.
      delete dataToUpdate.newPassword;
  
      // Make the PUT request to update the user data.
      const response = await fetch(API_ENDPOINTS.UPDATE_USER(formData._id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      });
  
      if (response.ok) {
        // Refresh the user data grid/list and close the modal on successful update.
        refreshGrid();
        onClose();
      } else {
        // Handle server errors
        console.error('Failed to update user. Server responded with status:', response.status);
      }
    } catch (error) {
      // Handle errors in the request
      console.error('Error during user update:', error);
    }
  }, [formData, refreshGrid, onClose]);
  
  const formFields = ['name', 'employeeCode', 'email', 'username'];

  return (
    <CommonModal isOpen={true} onClose={onClose} title="Edit Employee">
    <form id="editEmployeeForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {formFields.map(field => (
        <div key={field}>
          <label className="block text-gray-700 text-sm font-bold mb-1 capitalize">{field}</label>
          <input 
            type="text"
            name={field}
            value={formData[field] || ''}
            placeholder={`Enter ${field}`}
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
          />
        </div>
      ))}
       <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">New Password:</label>
          <input 
            type="password"
            name="newPassword"
            value={formData.newPassword}
            placeholder="Enter new password"
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
          />
        </div>
    </form>
    <div className="px-6 py-3">
      <div className="flex justify-end space-x-3">
        <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105">Close</button>
        <button type="submit" form="editEmployeeForm" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105">Save</button>
      </div>
    </div>
  </CommonModal>
  );
}

export default EditEmployeeDialog;
