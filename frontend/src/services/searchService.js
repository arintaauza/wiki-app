import api from './api';

/**
 * Search Service
 * Handles search-related API calls
 */

/**
 * Search articles by query
 * @param {string} query - Search query
 * @returns {Promise} Array of matching articles
 */
export const searchArticles = async (query) => {
  if (!query || query.trim() === '') {
    return [];
  }

  const response = await api.get('/search/', {
    params: { q: query }
  });
  return response.data;
};

export default {
  searchArticles
};
