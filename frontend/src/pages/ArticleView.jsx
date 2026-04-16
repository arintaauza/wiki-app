import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, deleteArticle } from '../services/articleService';
import { useAuth } from '../contexts/AuthContext';

function ArticleView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticle(slug);
      setArticle(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Article not found');
      } else {
        setError('Failed to load article. Please try again later.');
      }
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteArticle(slug);
      navigate('/');
    } catch (err) {
      alert('Failed to delete article. Please try again.');
      console.error('Error deleting article:', err);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
          <span>Created: {formatDate(article.created_at)}</span>
          <span>•</span>
          <span>Last updated: {formatDate(article.updated_at)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isAuthenticated && (
            <Link
              to={`/article/${slug}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Edit
            </Link>
          )}
          <Link
            to={`/article/${slug}/history`}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            View History
          </Link>
          {isAdmin && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          )}
          <Link
            to="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <div className="border-t border-gray-200 pt-6">
        <div className="prose max-w-none">
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {article.content}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{article.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleView;
