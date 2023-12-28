const BASE_URL = 'http://localhost:3000';

const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  GET_USER: (userId) => `${BASE_URL}/users/${userId}`,
};

export { BASE_URL, API_ENDPOINTS };
