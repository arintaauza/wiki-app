import api from './api';

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {Promise} Token data
 */
export const loginUser = async (username, password) => {
  // OAuth2 expects form data, not JSON
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Signup new user
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} role - "admin" or "editor"
 * @returns {Promise} User data
 */
export const signupUser = async (username, email, password, role = 'editor') => {
  const response = await api.post('/auth/signup', {
    username,
    email,
    password,
    role,
  });
  return response.data;
};

/**
 * Get current user info
 * @returns {Promise} User data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default {
  loginUser,
  signupUser,
  getCurrentUser,
};
