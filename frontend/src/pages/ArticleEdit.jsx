import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, updateArticle } from '../services/articleService';

function ArticleEdit() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticle(slug);

      // Save original data
      setOriginalData(data);

      // Populate form
      setFormData({
        title: data.title,
        content: data.content,
        summary: ''
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Article not found');
      } else {
        setError('Failed to load article. Please try again.');
      }
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

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

    // Check if anything changed
    if (formData.title === originalData.title &&
        formData.content === originalData.content) {
      setError('No changes detected. Please modify the article before saving.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await updateArticle(slug, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim() || 'Updated article'
      });

      // Redirect to the article (may have new slug if title changed)
      // For now, redirect to home since slug might change
      navigate('/');
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.detail || 'Failed to update article');
      } else if (err.response?.status === 404) {
        setError('Article not found');
      } else {
        setError('Failed to update article. Please try again.');
      }
      console.error('Error updating article:', err);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Check for unsaved changes
    const hasChanges =
      formData.title !== originalData?.title ||
      formData.content !== originalData?.content ||
      formData.summary.trim() !== '';

    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(`/article/${slug}`);
      }
    } else {
      navigate(`/article/${slug}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (error && !originalData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Article</h1>
        <p className="text-gray-600">Modify the article details below.</p>
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
            Original title: "{originalData?.title}"
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
            Edit the content above. Changes will be tracked in revision history.
          </p>
        </div>

        {/* Summary Field */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
            Change Summary <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Describe what you changed (e.g., 'Fixed typos', 'Added new section')"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            <strong>Required:</strong> Briefly describe your changes for the revision history
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
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
            to={`/article/${slug}`}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition inline-block"
          >
            Back to Article
          </Link>
        </div>
      </form>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Editing Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All changes are saved as a new revision</li>
          <li>• Previous versions can be viewed in the revision history</li>
          <li>• If you change the title, the article URL (slug) will also change</li>
          <li>• Always add a meaningful change summary to help track edits</li>
        </ul>
      </div>
    </div>
  );
}

export default ArticleEdit;
