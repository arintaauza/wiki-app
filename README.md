# Wikipedia Clone

A full-stack Wikipedia-style application with user authentication, article management, and revision tracking.

## Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite (Database)
- JWT (Authentication)
- Bcrypt (Password hashing)

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Vite

## Features

- User authentication (signup/login) with JWT tokens
- Role-based access control (Admin & Editor roles)
- Article CRUD operations
- Full-text search
- Revision history tracking
- Responsive design

## Database Structure

### Tables

#### 1. **users**
Stores user account information and authentication details.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique user identifier |
| username | STRING | UNIQUE, NOT NULL, INDEXED | Login username |
| email | STRING | UNIQUE, NOT NULL, INDEXED | User email address |
| hashed_password | STRING | NOT NULL | Bcrypt-hashed password |
| role | STRING | DEFAULT 'editor' | User role: 'admin' or 'editor' |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | DATETIME | DEFAULT NOW | Account creation timestamp |

**Relationships:**
- One-to-Many with `articles` (via created_by)
- One-to-Many with `revisions` (via author_id)

#### 2. **articles**
Stores the current version of each article.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique article identifier |
| title | STRING | UNIQUE, INDEXED | Article title |
| slug | STRING | UNIQUE, INDEXED | URL-friendly identifier |
| content | TEXT | NOT NULL | Current article content |
| created_at | DATETIME | DEFAULT NOW | Article creation timestamp |
| updated_at | DATETIME | DEFAULT NOW | Last update timestamp |
| created_by | INTEGER | FOREIGN KEY → users.id, NULLABLE | Creator user ID |

**Relationships:**
- One-to-Many with `revisions` (article_id)
- Many-to-One with `users` (created_by)

**Indexes:**
- `title` (for search)
- `slug` (for URL lookups)

#### 3. **revisions**
Stores the complete history of article changes.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique revision identifier |
| article_id | INTEGER | FOREIGN KEY → articles.id | Associated article |
| content | TEXT | NOT NULL | Article content at this revision |
| summary | STRING | | Change summary/commit message |
| author | STRING | DEFAULT 'Anonymous' | Author name (for backward compatibility) |
| author_id | INTEGER | FOREIGN KEY → users.id, NULLABLE | Author user ID |
| created_at | DATETIME | DEFAULT NOW | Revision creation timestamp |

**Relationships:**
- Many-to-One with `articles` (article_id)
- Many-to-One with `users` (author_id)

### Database Schema Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    users     │         │   articles   │         │  revisions   │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │─────┐   │ id (PK)      │─────┐   │ id (PK)      │
│ username     │     │   │ title        │     │   │ article_id(FK)│
│ email        │     │   │ slug         │     │   │ content      │
│ hashed_pwd   │     │   │ content      │     │   │ summary      │
│ role         │     │   │ created_at   │     │   │ author       │
│ is_active    │     │   │ updated_at   │     │   │ author_id(FK)│
│ created_at   │     │   │ created_by(FK)│◄────┤   │ created_at   │
└──────────────┘     │   └──────────────┘     │   └──────────────┘
        │            │                        │            │
        │            └────────────────────────┘            │
        └───────────────────────────────────────────────────┘
```

## Authentication System

### JWT Token-Based Authentication

The application uses **JSON Web Tokens (JWT)** for stateless authentication:

1. **Signup/Login**: User provides credentials
2. **Token Generation**: Server creates JWT with user info
3. **Token Storage**: Frontend stores token in localStorage
4. **Token Usage**: Token sent in Authorization header for protected routes
5. **Token Expiration**: Tokens expire after 30 minutes

### Roles & Permissions

| Role | Create Articles | Edit Articles | Delete Articles |
|------|----------------|---------------|-----------------|
| **Editor** | ✅ Yes | ✅ Yes | ❌ No |
| **Admin** | ✅ Yes | ✅ Yes | ✅ Yes |

### Password Security

- Passwords hashed with **bcrypt** (salt factor: 12)
- Never stored or transmitted in plain text
- Minimum password length: 6 characters

### Protected Routes

**Backend (API):**
- `POST /articles/` - Requires authentication
- `PUT /articles/{slug}` - Requires authentication
- `DELETE /articles/{slug}` - Requires admin role

**Frontend (Pages):**
- `/create` - Redirects to login if not authenticated
- `/article/:slug/edit` - Redirects to login if not authenticated

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/login` | Public | Login and get JWT token |
| GET | `/auth/me` | Protected | Get current user info |

**Example: Signup**
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "role": "editor"
  }'
```

**Example: Login**
```bash
curl -X POST http://localhost:8000/auth/login \
  -F "username=john" \
  -F "password=password123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### Articles

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/articles/` | Public | List all articles |
| GET | `/articles/{slug}` | Public | Get single article |
| POST | `/articles/` | Protected | Create new article |
| PUT | `/articles/{slug}` | Protected | Update article |
| DELETE | `/articles/{slug}` | Admin | Delete article |

**Example: Create Article** (with auth token)
```bash
curl -X POST http://localhost:8000/articles/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Programming",
    "content": "Python is a high-level programming language...",
    "summary": "Initial version"
  }'
```

### Search

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/search/?q={query}` | Public | Search articles |

**Example:**
```bash
curl http://localhost:8000/search/?q=python
```

### Revisions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/articles/{slug}/revisions` | Public | Get article revision history |

## Frontend Routes

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/` | Home | Public | List all articles |
| `/article/:slug` | ArticleView | Public | View single article |
| `/article/:slug/edit` | ArticleEdit | Protected | Edit article |
| `/article/:slug/history` | RevisionHistory | Public | View revision history |
| `/create` | ArticleCreate | Protected | Create new article |
| `/search` | SearchResults | Public | Search results |
| `/login` | Login | Public | Login page |
| `/signup` | Signup | Public | Registration page |

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database:**
   ```bash
   python -m app.init_db
   ```

5. **Run the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

   Backend will be available at: http://localhost:8000
   API docs at: http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at: http://localhost:5173

## Usage Guide

### 1. Create an Account

1. Visit http://localhost:5173/signup
2. Fill in username, email, password
3. Select role (Editor or Admin)
4. Click "Sign Up"
5. You'll be automatically logged in

### 2. Create an Article

1. Make sure you're logged in
2. Click "Create New Article" from the home page
3. Enter title and content
4. Add an optional summary
5. Click "Create Article"

### 3. Edit an Article

1. View any article
2. Click "Edit" button (visible only when logged in)
3. Modify title or content
4. Add a summary describing your changes
5. Click "Save Changes"

### 4. View Revision History

1. View any article
2. Click "View History" button
3. See all past versions
4. Click "View Content" to see what the article looked like at that time

### 5. Delete an Article (Admin Only)

1. Log in with an admin account
2. View the article
3. Click "Delete" button (visible only to admins)
4. Confirm deletion in the modal

## Security Notes

### Current Implementation

✅ Passwords hashed with bcrypt
✅ JWT tokens with 30-minute expiration
✅ Role-based access control
✅ Protected API endpoints
✅ CORS configured for localhost

### Production Considerations

⚠️ **Move SECRET_KEY to environment variable**
```python
# backend/app/auth.py
import os
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-for-dev-only")
```

⚠️ **Use HTTPS in production**
⚠️ **Consider HTTPOnly cookies instead of localStorage** (prevents XSS attacks)
⚠️ **Add rate limiting to auth endpoints**
⚠️ **Implement password strength requirements**
⚠️ **Add email verification**
⚠️ **Implement password reset flow**
⚠️ **Add refresh token mechanism**

## Project Structure

```
wikipedia/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── database.py        # Database configuration
│   │   ├── auth.py            # Authentication utilities
│   │   ├── init_db.py         # Database initialization
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── articles.py    # Article endpoints
│   │       ├── search.py      # Search endpoints
│   │       ├── revisions.py   # Revision endpoints
│   │       └── auth.py        # Auth endpoints
│   ├── requirements.txt
│   └── wiki.db               # SQLite database file
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx         # App layout with header/footer
    │   │   └── ProtectedRoute.jsx # Auth route guard
    │   ├── contexts/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── pages/
    │   │   ├── Home.jsx           # Article list
    │   │   ├── ArticleView.jsx    # Single article
    │   │   ├── ArticleCreate.jsx  # Create article form
    │   │   ├── ArticleEdit.jsx    # Edit article form
    │   │   ├── SearchResults.jsx  # Search results
    │   │   ├── RevisionHistory.jsx # Revision history
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Signup.jsx         # Signup page
    │   │   └── NotFound.jsx       # 404 page
    │   ├── services/
    │   │   ├── api.js            # Axios instance with interceptors
    │   │   ├── articleService.js # Article API calls
    │   │   ├── searchService.js  # Search API calls
    │   │   ├── revisionService.js # Revision API calls
    │   │   └── authService.js    # Auth API calls
    │   ├── App.jsx               # Main app component
    │   └── main.jsx              # React entry point
    └── package.json
```

## Troubleshooting

### Backend Issues

**Problem**: `ImportError: No module named 'fastapi'`
**Solution**: Make sure virtual environment is activated and dependencies are installed

**Problem**: `Database is locked`
**Solution**: Close any other applications accessing the database

**Problem**: `401 Unauthorized` on protected routes
**Solution**: Check if token is being sent in Authorization header

### Frontend Issues

**Problem**: CORS error when calling API
**Solution**: Ensure backend is running and CORS is configured in `main.py`

**Problem**: Token not persisting after refresh
**Solution**: Check browser's localStorage for the 'token' key

**Problem**: Protected routes not redirecting to login
**Solution**: Verify AuthProvider wraps the entire app in App.jsx

## License

MIT License

## Contributors

Built with Claude Code
