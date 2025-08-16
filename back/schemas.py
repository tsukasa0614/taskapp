from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Task schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[str] = None
    category_id: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class Task(TaskBase):
    id: str
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Project schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str  # 'personal' or 'team'
    color: str
    icon: str

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class Project(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime
    tasks: List[Task] = []
    
    class Config:
        from_attributes = True

# Category schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    color: str
    icon: str
    workspace_type: str  # 'personal' or 'team'

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class Category(CategoryBase):
    id: str
    created_at: datetime
    updated_at: datetime
    tasks: List[Task] = []
    
    class Config:
        from_attributes = True
