from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/articles",
    tags=["revisions"]
)

@router.get("/{slug}/revisions", response_model=List[schemas.Revision])
def get_article_revisions(slug: str, db: Session = Depends(get_db)):
    """
    Get revision history for an article

    Returns all revisions for the specified article, ordered by newest first.
    Each revision includes the content snapshot, summary, author, and timestamp.
    """
    # Find article
    article = db.query(models.Article).filter(models.Article.slug == slug).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Article '{slug}' not found"
        )

    # Get all revisions for this article, ordered by newest first
    revisions = db.query(models.Revision)\
        .filter(models.Revision.article_id == article.id)\
        .order_by(models.Revision.created_at.desc())\
        .all()

    return revisions

@router.get("/{slug}/revisions/{revision_id}", response_model=schemas.Revision)
def get_specific_revision(slug: str, revision_id: int, db: Session = Depends(get_db)):
    """
    Get a specific revision by ID

    Returns the content and metadata for a specific revision of an article.
    Useful for viewing historical versions or comparing changes.
    """
    # Find article
    article = db.query(models.Article).filter(models.Article.slug == slug).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Article '{slug}' not found"
        )

    # Find specific revision
    revision = db.query(models.Revision).filter(
        models.Revision.id == revision_id,
        models.Revision.article_id == article.id
    ).first()

    if not revision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Revision {revision_id} not found for article '{slug}'"
        )

    return revision
