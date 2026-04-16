import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo/Title */}
            <Link
              to="/"
              className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-blue-600 transition flex-shrink-0"
            >
              Wikipedia Clone
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </form>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Article
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {user?.username} ({user?.role})
                    </span>
                    <button
                      onClick={logout}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2 mt-3">
            <Link
              to="/"
              className="flex-1 text-center px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="flex-1 text-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create
                </Link>
                <button
                  onClick={logout}
                  className="flex-1 text-center px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex-1 text-center px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              <p>&copy; 2026 Wikipedia Clone. Built with React & FastAPI.</p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
                Home
              </Link>
              <Link to="/create" className="text-gray-600 hover:text-blue-600 transition">
                Create Article
              </Link>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                API Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
