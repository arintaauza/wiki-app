from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# User schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "editor"

class User(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Article schemas
class ArticleBase(BaseModel):
    title: str
    content: str

class ArticleCreate(ArticleBase):
    summary: Optional[str] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None

class Article(ArticleBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None

    class Config:
        from_attributes = True

class RevisionBase(BaseModel):
    content: str
    summary: Optional[str] = None
    author: str = "Anonymous"

class Revision(RevisionBase):
    id: int
    article_id: int
    created_at: datetime

    class Config:
        from_attributes = True
