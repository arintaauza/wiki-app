import api from './api';

/**
 * Revision Service
 * Handles article revision history API calls
 */

/**
 * Get all revisions for an article
 * @param {string} slug - Article slug
 * @returns {Promise} Array of revisions (newest first)
 */
export const getRevisions = async (slug) => {
  const response = await api.get(`/articles/${slug}/revisions`);
  return response.data;
};

/**
 * Get a specific revision by ID
 * @param {string} slug - Article slug
 * @param {number} revisionId - Revision ID
 * @returns {Promise} Revision object
 */
export const getRevision = async (slug, revisionId) => {
  const response = await api.get(`/articles/${slug}/revisions/${revisionId}`);
  return response.data;
};

export default {
  getRevisions,
  getRevision
};
