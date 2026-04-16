import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticle } from '../services/articleService';
import { getRevisions } from '../services/revisionService';

function RevisionHistory() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRevision, setSelectedRevision] = useState(null);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both article and revisions
      const [articleData, revisionsData] = await Promise.all([
        getArticle(slug),
        getRevisions(slug)
      ]);

      setArticle(articleData);
      setRevisions(revisionsData);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Article not found');
      } else {
        setError('Failed to load revision history. Please try again.');
      }
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
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

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const handleViewRevision = (revision) => {
    setSelectedRevision(selectedRevision?.id === revision.id ? null : revision);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading revision history...</div>
      </div>
    );
  }

  if (error) {
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Revision History
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {article?.title}
        </p>
        <div className="flex gap-3">
          <Link
            to={`/article/${slug}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ← Back to Article
          </Link>
          <Link
            to={`/article/${slug}/edit`}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Edit Article
          </Link>
        </div>
      </div>

      {/* Revision Count */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <p className="text-gray-600">
          {revisions.length} revision{revisions.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* Revisions List */}
      {revisions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No revision history available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {revisions.map((revision, index) => (
            <div
              key={revision.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition"
            >
              {/* Revision Header */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded">
                        {index === 0 ? 'Current' : `Version ${revisions.length - index}`}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatRelativeTime(revision.created_at)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Author:</strong> {revision.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Summary:</strong> {revision.summary}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewRevision(revision)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition text-sm"
                  >
                    {selectedRevision?.id === revision.id ? 'Hide Content' : 'View Content'}
                  </button>
                </div>
              </div>

              {/* Revision Content (Expandable) */}
              {selectedRevision?.id === revision.id && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-3">Content at this revision:</h4>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                      {revision.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📜 About Revision History</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Every edit to an article creates a new revision</li>
          <li>• The current version is always shown first</li>
          <li>• Click "View Content" to see what the article looked like at that time</li>
          <li>• All revisions are preserved - you can always see old versions</li>
        </ul>
      </div>
    </div>
  );
}

export default RevisionHistory;
