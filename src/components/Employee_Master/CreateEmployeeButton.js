import React from 'react';
import { FaPlus } from 'react-icons/fa';

const CreateUserButton = ({ onCreateUser }) => (
    <button 
    onClick={onCreateUser}
    className="bg-[#1F2937] hover:bg-opacity-90 text-white py-1.5 px-4 ml-2 rounded flex items-center"
  >
    <FaPlus className="mr-2"/>
    Create Employee
  </button>
);

export default CreateUserButton;
