import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { searchArticles } from '../services/searchService';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchArticles(searchQuery);
      setResults(data);
    } catch (err) {
      setError('Failed to search articles. Please try again.');
      console.error('Error searching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
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

  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ?
        <mark key={index} className="bg-yellow-200 font-semibold">{part}</mark> :
        part
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search Form */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Articles</h1>

        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for articles..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search Results */}
      {query && (
        <div className="mb-4">
          <h2 className="text-xl text-gray-700">
            Search results for: <span className="font-semibold">"{query}"</span>
          </h2>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Searching...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* No Query */}
      {!query && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Enter a search term to find articles</p>
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      )}

      {/* Results */}
      {!loading && query && (
        <>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No articles found for "{query}"
              </p>
              <p className="text-gray-400 mb-4">Try different keywords or</p>
              <Link to="/" className="text-blue-600 hover:underline">
                Browse all articles →
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Found {results.length} article{results.length !== 1 ? 's' : ''}
              </div>

              <div className="space-y-4">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="block border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition"
                  >
                    <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                      {highlightText(article.title, query)}
                    </h3>
                    <p className="text-gray-600 mb-2 line-clamp-3">
                      {highlightText(
                        article.content.substring(0, 300),
                        query
                      )}
                      {article.content.length > 300 ? '...' : ''}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Last updated: {formatDate(article.updated_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Back to Home Link */}
      {query && results.length > 0 && (
        <div className="mt-8 text-center">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
