from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import articles, search, revisions, auth

app = FastAPI(title="Wikipedia Clone API")

# Include routers
app.include_router(auth.router)
app.include_router(articles.router)
app.include_router(search.router)
app.include_router(revisions.router)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Wikipedia Clone API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
