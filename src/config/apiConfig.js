const BASE_URL = 'http://localhost:3000';

const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  GET_USER_BY_ID: (userId) => `${BASE_URL}/users/${userId}`,
  GET_ALL_USERS: `${BASE_URL}/users`,
  CREATE_USER: `${BASE_URL}/users`,
  UPDATE_USER: (userId) => `${BASE_URL}/users/${userId}`,
  DELETE_USER: (userId) => `${BASE_URL}/users/${userId}`,

  //Module_Master
  GET_ALL_MODULES: `${BASE_URL}/modules`,
  CREATE_MODULE: `${BASE_URL}/modules`,
  UPDATE_MODULE:(moduleId) => `${BASE_URL}/modules/${moduleId}`,
  DELETE_MODULE:(moduleId) => `${BASE_URL}/modules/${moduleId}`,

  //Program_Master
  GET_ALL_PROGRAMS: `${BASE_URL}/programs`,
  CREATE_PROGRAM: `${BASE_URL}/programs`,
  UPDATE_PROGRAM:(programId) => `${BASE_URL}/programs/${programId}`,
  DELETE_PROGRAM:(programId) => `${BASE_URL}/programs/${programId}`,

  // Role
  CREATE_ROLE: `${BASE_URL}/roles`,
  GET_ALL_ROLES: `${BASE_URL}/roles`,
  UPDATE_ROLE: (roleId) => `${BASE_URL}/roles/${roleId}`,
  DELETE_ROLE: (roleId) => `${BASE_URL}/roles/${roleId}`,
  UPDATE_ROLE_PROGRAMS: (roleId) => `${BASE_URL}/roles/roles/${roleId}`,
};


export { BASE_URL, API_ENDPOINTS };
