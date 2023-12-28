const BASE_URL = 'http://localhost:3000';

const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  GET_USER_BY_ID: (userId) => `${BASE_URL}/users/${userId}`,
  GET_ALL_USERS: `${BASE_URL}/users`
};

export { BASE_URL, API_ENDPOINTS };
