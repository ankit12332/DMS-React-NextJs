const BASE_URL = 'http://localhost:3000';

const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  GET_USER_BY_ID: (userId) => `${BASE_URL}/users/${userId}`,
  GET_ALL_USERS: `${BASE_URL}/users`,
  CREATE_USER: `${BASE_URL}/users`,
  UPDATE_USER: (userId) => `${BASE_URL}/users/${userId}`,
  DELETE_USER: (userId) => `${BASE_URL}/users/${userId}`
};

export { BASE_URL, API_ENDPOINTS };
