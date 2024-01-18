import { API_ENDPOINTS } from "@/config/apiConfig";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const UserRoleTagging = () => {
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.GET_ALL_USERS}?searchText=${searchText}&startRow=0&endRow=1000000`);
            const data = await response.json();
            //console.log(data)
            // Assuming the data is in the format { users: [...] }
            setUsers(data.data);   
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle the error appropriately
        }
        setIsLoading(false);
    };

    const handleUserChange = (userId) => {
        setSelectedUserId(userId);
        const user = users.find(u => u._id === userId);
        if(user && user.roles){
            // Update roles with isChecked based on user's roles
            const updatedRoles = roles.map(role => ({
                ...role,
                isChecked: user.roles.includes(role.roleId)
            }));
            setRoles(updatedRoles);
        } else {
            setRoles(roles.map(role => ({ ...role, isChecked: false })));
        }
    };

    const handleRoleChange = (roleId) => {
        setRoles(roles.map(role => 
            role.roleId === roleId ? { ...role, isChecked: !role.isChecked } : role
        ));
    };

    const handleSave = async () => {
        if(selectedUserId){
            const selectedRoleIds = roles.filter(role => role.isChecked).map(role => role.roleId);
            try {
                const response = await fetch(API_ENDPOINTS.GET_USER_ROLES(selectedUserId), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ roleIds: selectedRoleIds })
                });
                if(response.ok){
                    // Handle successful save
                    console.log("Roles updated successfully");
                } else {
                    // Handle errors
                    console.error("Error updating roles");
                }
            } catch(error){
                console.error('Error:', error);
            }
        }
    };

    useEffect(() => {
        const fetchRoles = async () => {
            // Replace with your actual roles API endpoint
            const response = await fetch(API_ENDPOINTS.GET_ALL_ROLES);
            const data = await response.json();
            setRoles(data); // Adjust according to the actual response structure
        };

        fetchRoles().catch(console.error);
    }, []);
    
    return (
        <div className="p-6">
            <Head>
                <title>User Role Tagging</title>
            </Head>

            <h2 className="text-2xl font-semibold text-gray-800">User Role Tagging</h2>
            <p>Manage Your User Role Tagging</p>

            <div className="grid grid-cols-2 gap-8 mt-4 items-center"> {/* Increased gap size here */}
                {/* Left Column - Search Input */}
                <div>
                    <span className="text-sm font-medium">Enter Employee Code:</span>
                    <div className="flex mt-2">
                        <input 
                            type="text" 
                            value={searchText} 
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border border-gray-300 rounded-l-lg p-2 flex-grow"
                            placeholder="Search..."
                        />
                        <button 
                            onClick={handleSearch} 
                            className={`border border-l-0 border-gray-300 rounded-r-lg p-2 bg-gray-200 hover:bg-gray-300 ${isLoading ? 'cursor-wait' : ''}`}
                        >
                            <FaSearch />
                        </button>
                    </div>
                </div>

                {/* Right Column - Dropdown */}
                <div>
                    <span className="text-sm font-medium">Select User:</span>
                    <select onChange={(e) => handleUserChange(e.target.value)} className="border border-gray-300 rounded-lg p-2 mt-2 w-full">
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.name} - {user.employeeCode}</option>
                        ))}
                    </select>
                </div>
                {/* Roles Section */}
                
            </div>
            <div className="mt-6 bg-white p-4 shadow rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Roles</h3>
                <div className="mt-2">
                    {roles.map(role => (
                        <div key={role.roleId} className="mb-2">
                            <label className="flex items-center space-x-3">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox h-5 w-5 text-gray-600" 
                                    value={role.roleId}
                                    checked={role.isChecked || false}
                                    onChange={() => handleRoleChange(role.roleId)}
                                />
                                <span className="text-gray-700">{role.roleName}</span>
                            </label>
                        </div>
                    ))}
                </div> 
            </div>

            {/* Save Button */}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                onClick={handleSave}
            >
             Save
            </button>
            {/* Show loading cursor when searching */}
            {isLoading && <style>{`body { cursor: wait; }`}</style>}
        </div>
    );
};

export default UserRoleTagging;