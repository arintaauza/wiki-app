import api from './api';

/**
 * Article Service
 * Handles all article-related API calls
 */

/**
 * Get list of all articles
 * @param {number} skip - Number of articles to skip (pagination)
 * @param {number} limit - Maximum number of articles to return
 * @returns {Promise} Array of articles
 */
export const getArticles = async (skip = 0, limit = 100) => {
  const response = await api.get('/articles/', {
    params: { skip, limit }
  });
  return response.data;
};

/**
 * Get a single article by slug
 * @param {string} slug - Article slug (e.g., "python-programming")
 * @returns {Promise} Article object
 */
export const getArticle = async (slug) => {
  const response = await api.get(`/articles/${slug}`);
  return response.data;
};

/**
 * Create a new article
 * @param {Object} articleData - Article data
 * @param {string} articleData.title - Article title
 * @param {string} articleData.content - Article content (markdown)
 * @param {string} articleData.summary - Optional change summary
 * @returns {Promise} Created article object
 */
export const createArticle = async (articleData) => {
  const response = await api.post('/articles/', articleData);
  return response.data;
};

/**
 * Update an existing article
 * @param {string} slug - Article slug to update
 * @param {Object} updateData - Updated data
 * @param {string} updateData.title - Optional new title
 * @param {string} updateData.content - Optional new content
 * @param {string} updateData.summary - Optional change summary
 * @returns {Promise} Updated article object
 */
export const updateArticle = async (slug, updateData) => {
  const response = await api.put(`/articles/${slug}`, updateData);
  return response.data;
};

/**
 * Delete an article
 * @param {string} slug - Article slug to delete
 * @returns {Promise} void
 */
export const deleteArticle = async (slug) => {
  await api.delete(`/articles/${slug}`);
};

export default {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
};
