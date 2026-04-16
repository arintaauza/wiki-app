# wiki_cc — Project Overview

## What It Is

A Wikipedia-style web application with a working backend API and a functional frontend. Users can create, read, edit, and delete articles with full revision history and search. Authentication (signup/login with JWT) is implemented and wired up on both sides.

This is the most complete of the wiki projects — the core app actually works end to end.

---

## Tech Stack

### Backend — Python + FastAPI

| Technology | Role |
|---|---|
| **Python** | Language |
| **FastAPI** | HTTP framework — async, auto-generates Swagger UI at `/docs` |
| **SQLAlchemy 2.0** | ORM for database access |
| **SQLite** | Database (file-based, no server needed — `database.db`) |
| **Pydantic 2** | Request/response validation and serialisation |
| **python-jose** | JWT creation and verification |
| **passlib + bcrypt** | Password hashing |
| **uvicorn** | ASGI server to run FastAPI |

Backend entry point: `backend/app/main.py`  
Models: `backend/app/models.py`  
Auth utilities: `backend/app/auth.py`  
Routers: `backend/app/routers/` (articles, search, revisions, auth)

### Frontend — React + JavaScript

| Technology | Role |
|---|---|
| **React 18** | UI framework |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Dev server and bundler |

Frontend entry: `frontend/src/main.jsx`  
Pages: `frontend/src/pages/` (Home, ArticleView, ArticleEdit, ArticleCreate, SearchResults, RevisionHistory, Login, Signup, NotFound)  
Services: `frontend/src/services/` (articleService, authService, searchService, revisionService)  
Auth: `frontend/src/contexts/AuthContext.jsx` + `ProtectedRoute.jsx`

---

## Does It Use SQL?

**Yes — SQLite via SQLAlchemy ORM.**

- All database access goes through SQLAlchemy, which generates SQL under the hood
- Three tables: `users`, `articles`, `revisions` (with foreign keys and relationships)
- SQLite stores data in `backend/database.db` — no separate database server needed
- The ORM handles querying, inserting, and updating; raw SQL is not written directly

---

## Data Models

```
User          id, username (unique), email (unique), hashed_password, role, is_active, created_at
Article       id, title (unique), slug (unique), content, created_by (FK→users), created_at, updated_at
Revision      id, article_id (FK→articles), content, summary, author, author_id (FK→users), created_at
```

Every article edit creates a new Revision, preserving the full change history.

---

## API Endpoints

| Method | Path | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Create account | No |
| POST | `/auth/login` | Login, get JWT | No |
| GET | `/auth/me` | Current user info | Yes |
| GET | `/articles` | List articles (paginated) | No |
| GET | `/articles/{slug}` | Get single article | No |
| POST | `/articles` | Create article | Yes |
| PUT | `/articles/{slug}` | Update article (saves revision) | Yes |
| DELETE | `/articles/{slug}` | Delete article | Yes (admin) |
| GET | `/search?q=query` | Search articles | No |
| GET | `/articles/{slug}/revisions` | Revision history | No |
| GET | `/articles/{slug}/revisions/{id}` | Specific revision | No |
| GET | `/articles/{slug}/revisions/{id}/diff` | Diff vs current | No |

Swagger UI is auto-generated at `http://localhost:8000/docs`.

---

## Running Locally

```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python -m app.init_db          # create tables (first time only)
uvicorn app.main:app --reload
# API at http://localhost:8000
# Docs at http://localhost:8000/docs

# Frontend
cd frontend
npm install
npm run dev
# App at http://localhost:5173
```

---

## What's Done vs What's Remaining

### Done
- Full backend: auth, articles CRUD, search, revisions, JWT middleware
- Full frontend pages: Home, Article view/edit/create, Search results, Revision history, Login, Signup
- Auth context and protected routes on frontend
- API service layer (articleService, authService, etc.)

### Still to do (from BUILD_CHECKLIST.md)
- Backend error handling middleware and input edge cases
- Shared frontend components: Layout wrapper, Navigation, ArticleCard, MarkdownRenderer, Loading spinner, Error component
- Routing in `App.jsx` needs all routes properly connected
- Tailwind styling across all pages (mostly unstyled)
- Markdown rendering for article content
- UX: loading states, toast notifications, confirmation dialogs
- Testing (no tests exist yet)
- Move secret key to environment variable (currently hardcoded in `auth.py`)
