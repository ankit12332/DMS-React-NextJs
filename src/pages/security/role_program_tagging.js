import { API_ENDPOINTS } from "@/config/apiConfig";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState, useCallback, useMemo } from "react";

const RoleProgramTagging = () => {
    const [data, setData] = useState({
        roles: [],
        groupedPrograms: {},
        selectedRole: '',
        selectedPrograms: []
    });

    const fetchRoles = useCallback(async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.GET_ALL_ROLES);
            setData(prev => ({ ...prev, roles: res.data }));
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }, []);

    const fetchPrograms = useCallback(async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.GET_ALL_PROGRAMS);
            const grouped = res.data.reduce((acc, program) => {
                const moduleName = program.module.moduleName;
                acc[moduleName] = acc[moduleName] || [];
                acc[moduleName].push(program);
                return acc;
            }, {});
            setData(prev => ({ ...prev, groupedPrograms: grouped }));
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
        fetchPrograms();
    }, [fetchRoles, fetchPrograms]);

    const handleRoleChange = useCallback((e) => {
        const selectedRoleId = e.target.value;
        const selectedRoleData = data.roles.find(role => role.roleId === selectedRoleId);
        const assignedProgramIds = selectedRoleData?.modules.flatMap(module => module.programs.map(program => program.programId)) || [];

        setData(prev => ({
            ...prev,
            selectedRole: selectedRoleId,
            selectedPrograms: assignedProgramIds
        }));
    }, [data.roles]);

    const handleProgramChange = useCallback((programId) => {
        setData(prev => ({
            ...prev,
            selectedPrograms: prev.selectedPrograms.includes(programId) ? prev.selectedPrograms.filter(id => id !== programId) : [...prev.selectedPrograms, programId]
        }));
    }, []);

    const handleSubmit = useCallback(async () => {
        const submissionData = { programIds: data.selectedPrograms };
        try {
            await axios.post(API_ENDPOINTS.UPDATE_ROLE_PROGRAMS(data.selectedRole), submissionData);
            await fetchRoles(); // Refetch roles to get updated data
            setData(prev => ({ ...prev, selectedRole: '', selectedPrograms: [] }));
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    }, [data.selectedPrograms, data.selectedRole, fetchRoles]);
    

    // Memoize options to avoid re-rendering
    const roleOptions = useMemo(() => data.roles.map(role => (
        <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
    )), [data.roles]);


    return (
        <div className="p-6">
            <Head>
                <title>Role Program Tagging</title>
            </Head>

            <h2 className="text-2xl font-semibold text-gray-800">Role Program Tagging</h2>
            <p>Manage Your Role Program Tagging</p>

            <div className="mb-4 mt-1.5 flex justify-between items-center">
                <select
                    onChange={handleRoleChange}
                    value={data.selectedRole}
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                    <option value=''>Select a Role</option>
                    {roleOptions}
                </select>
            </div>

            {/* Display Grouped Programs by Module */}
            {Object.entries(data.groupedPrograms).map(([moduleName, programs]) => (
                <div key={moduleName} className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{moduleName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {programs.map(program => (
                            <label key={program._id} className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={data.selectedPrograms.includes(program._id)}
                                    onChange={() => handleProgramChange(program._id)}
                                    className="form-checkbox h-5 w-5 text-gray-600"
                                />
                                <span className="text-gray-700">{program.title}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
            Save
            </button>
        </div>
    );
}
export default RoleProgramTagging;
