import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import ArticleView from './pages/ArticleView'
import ArticleCreate from './pages/ArticleCreate'
import ArticleEdit from './pages/ArticleEdit'
import SearchResults from './pages/SearchResults'
import RevisionHistory from './pages/RevisionHistory'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<ArticleView />} />
            <Route path="/article/:slug/history" element={<RevisionHistory />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/article/:slug/edit"
              element={
                <ProtectedRoute>
                  <ArticleEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <ArticleCreate />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App
