import { useState, useCallback } from 'react';
import CommonModal from '../../Layouts/CommonModal';
import { API_ENDPOINTS } from '../../../config/apiConfig';

const CreateEmployeeDialog = ({ onClose, isCreateDialogOpen, refreshGrid }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeCode: '',
    email: '',
    username: '',
    password: ''
  });

  const [error, setError] = useState(null);

  const handleChange = useCallback((e) => {
    setFormData(prevFormData => ({ ...prevFormData, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Make the POST request to the API
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_USER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        //const result = await response.json();
        //console.log('Successfully submitted:', result);
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

  const formFields = ['name', 'employeeCode', 'email', 'username', 'password'];

  return (
    <CommonModal isOpen={isCreateDialogOpen} onClose={onClose} title="Create New Employee">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form id="createEmployeeForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {formFields.map(field => (
              <div key={field}>
                <label className="block text-gray-700 text-sm font-bold mb-1 capitalize">{field}</label>
                <input 
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  placeholder={`Enter ${field}`}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                />
              </div>
            ))}
        </form>
        <div className="px-6 py-3">
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105">Close</button>
            <button type="submit" form="createEmployeeForm" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105">Save</button>
          </div>
        </div>
    </CommonModal>
  );
};

export default CreateEmployeeDialog;