from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List

from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/search",
    tags=["search"]
)

@router.get("/", response_model=List[schemas.Article])
def search_articles(
    q: str = Query(..., min_length=1, description="Search query"),
    db: Session = Depends(get_db)
):
    """
    Search articles by title and content

    - **q**: Search query (required, minimum 1 character)

    Returns articles that match the search query in either title or content.
    Results are ordered by relevance (title matches first, then content matches).
    """
    if not q or q.strip() == "":
        return []

    search_term = f"%{q}%"

    # Search in both title and content using LIKE (case-insensitive)
    # Articles with title matches appear first
    articles = db.query(models.Article).filter(
        or_(
            models.Article.title.ilike(search_term),
            models.Article.content.ilike(search_term)
        )
    ).order_by(
        # Title matches ranked higher than content matches
        models.Article.title.ilike(search_term).desc(),
        models.Article.updated_at.desc()
    ).all()

    return articles
