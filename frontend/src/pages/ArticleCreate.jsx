import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createArticle } from '../services/articleService';

function ArticleCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const newArticle = await createArticle({
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim() || 'Initial version'
      });

      // Redirect to the newly created article
      navigate(`/article/${newArticle.slug}`);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.detail || 'Article with this title already exists');
      } else {
        setError('Failed to create article. Please try again.');
      }
      console.error('Error creating article:', err);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Article</h1>
        <p className="text-gray-600">Fill in the details below to create a new article.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter article title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            A descriptive title for your article (e.g., "Python Programming")
          </p>
        </div>

        {/* Content Field */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your article content here..."
            rows={15}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            disabled={submitting}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            The main content of your article. You can use plain text or markdown.
          </p>
        </div>

        {/* Summary Field */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
            Summary
          </label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Brief description of this article (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting}
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional: A brief summary or note about this article version
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating...' : 'Create Article'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <Link
            to="/"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition inline-block"
          >
            Back to Home
          </Link>
        </div>
      </form>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Article titles must be unique</li>
          <li>• Your article will be automatically saved with a URL-friendly slug</li>
          <li>• All changes are tracked in the revision history</li>
          <li>• You can edit your article anytime after creating it</li>
        </ul>
      </div>
    </div>
  );
}

export default ArticleCreate;
