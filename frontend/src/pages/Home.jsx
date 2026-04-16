import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/articleService';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={fetchArticles}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Articles</h1>
        {isAuthenticated ? (
          <Link
            to="/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create New Article
          </Link>
        ) : (
          <Link
            to="/login"
            state={{ from: { pathname: '/create' } }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login to Create Article
          </Link>
        )}
      </div>

      {/* Articles List */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No articles yet.</p>
          <Link
            to="/create"
            className="text-blue-600 hover:underline"
          >
            Create your first article →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="block border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition"
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {article.content.substring(0, 200)}
                {article.content.length > 200 ? '...' : ''}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>Last updated: {formatDate(article.updated_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Article count */}
      {articles.length > 0 && (
        <div className="mt-8 text-center text-gray-500">
          Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default Home;
