from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="editor")  # "admin" or "editor"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    articles_created = relationship("Article", back_populates="creator")
    revisions = relationship("Revision", back_populates="author_user")

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    revisions = relationship("Revision", back_populates="article")
    creator = relationship("User", back_populates="articles_created")

class Revision(Base):
    __tablename__ = "revisions"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.id"))
    content = Column(Text)
    summary = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    author = Column(String, default="Anonymous")  # Keep for backward compatibility
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    article = relationship("Article", back_populates="revisions")
    author_user = relationship("User", back_populates="revisions")
