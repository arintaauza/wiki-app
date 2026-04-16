from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import re
from datetime import datetime

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_active_user, require_admin

router = APIRouter(
    prefix="/articles",
    tags=["articles"]
)

def slugify(text: str) -> str:
    """Convert title to URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

@router.post("/", response_model=schemas.Article, status_code=status.HTTP_201_CREATED)
def create_article(
    article: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a new article - requires authentication"""
    # Generate slug from title
    slug = slugify(article.title)

    # Check if article with same slug already exists
    existing = db.query(models.Article).filter(models.Article.slug == slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Article with title '{article.title}' already exists"
        )

    # Create new article with user tracking
    db_article = models.Article(
        title=article.title,
        slug=slug,
        content=article.content,
        created_by=current_user.id
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)

    # Create first revision with user tracking
    revision = models.Revision(
        article_id=db_article.id,
        content=article.content,
        summary=article.summary or "Initial version",
        author=current_user.username,
        author_id=current_user.id
    )
    db.add(revision)
    db.commit()

    return db_article

@router.get("/", response_model=List[schemas.Article])
def list_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get list of all articles with pagination"""
    articles = db.query(models.Article)\
        .order_by(models.Article.updated_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return articles

@router.get("/{slug}", response_model=schemas.Article)
def get_article(slug: str, db: Session = Depends(get_db)):
    """Get a single article by slug"""
    article = db.query(models.Article).filter(models.Article.slug == slug).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Article '{slug}' not found"
        )
    return article

@router.put("/{slug}", response_model=schemas.Article)
def update_article(
    slug: str,
    article_update: schemas.ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Update an existing article - requires authentication"""
    # Find article
    db_article = db.query(models.Article).filter(models.Article.slug == slug).first()
    if not db_article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Article '{slug}' not found"
        )

    # Update fields if provided
    update_data = article_update.dict(exclude_unset=True)

    # Handle title change (regenerate slug)
    if "title" in update_data and update_data["title"] != db_article.title:
        new_slug = slugify(update_data["title"])
        # Check if new slug conflicts with another article
        existing = db.query(models.Article).filter(
            models.Article.slug == new_slug,
            models.Article.id != db_article.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Article with title '{update_data['title']}' already exists"
            )
        db_article.slug = new_slug
        db_article.title = update_data["title"]

    # Update content
    if "content" in update_data and update_data["content"] != db_article.content:
        db_article.content = update_data["content"]

        # Create revision for content change with user tracking
        revision = models.Revision(
            article_id=db_article.id,
            content=update_data["content"],
            summary=update_data.get("summary", "Updated article"),
            author=current_user.username,
            author_id=current_user.id
        )
        db.add(revision)

    # Update timestamp
    db_article.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(db_article)

    return db_article

@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(
    slug: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin)
):
    """Delete an article - requires admin role"""
    article = db.query(models.Article).filter(models.Article.slug == slug).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Article '{slug}' not found"
        )

    # Delete associated revisions first (cascade)
    db.query(models.Revision).filter(models.Revision.article_id == article.id).delete()

    # Delete article
    db.delete(article)
    db.commit()

    return None
