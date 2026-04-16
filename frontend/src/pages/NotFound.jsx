import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <p className="text-gray-500">
            The article or page you requested might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
          <Link
            to="/search"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Search Articles
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might want to:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link to="/" className="text-blue-600 hover:underline">
              Browse all articles
            </Link>
            <Link to="/create" className="text-blue-600 hover:underline">
              Create a new article
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
