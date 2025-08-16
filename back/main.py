from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import crud
from database import SessionLocal, engine, get_db
from init_db import init_database

# データベーステーブルを作成
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TaskFlow API", version="2.0.0", description="データベース統合版タスク管理API")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """アプリケーション起動時の初期化"""
    init_database()

@app.get("/")
async def root():
    return {"message": "TaskFlow API v2.0", "status": "データベース統合完了"}

# ============== Task API ==============

@app.get("/tasks", response_model=List[schemas.Task])
async def get_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """全てのタスクを取得"""
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks

@app.post("/tasks", response_model=schemas.Task)
async def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    """新しいタスクを作成"""
    return crud.create_task(db=db, task=task)

@app.get("/tasks/{task_id}", response_model=schemas.Task)
async def get_task(task_id: str, db: Session = Depends(get_db)):
    """特定のタスクを取得"""
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")
    return db_task

@app.put("/tasks/{task_id}", response_model=schemas.Task)
async def update_task(task_id: str, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    """タスクを更新"""
    db_task = crud.update_task(db, task_id=task_id, task_update=task_update)
    if db_task is None:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")
    return db_task

@app.patch("/tasks/{task_id}/toggle", response_model=schemas.Task)
async def toggle_task(task_id: str, db: Session = Depends(get_db)):
    """タスクの完了状態を切り替え"""
    db_task = crud.toggle_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")
    return db_task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str, db: Session = Depends(get_db)):
    """タスクを削除"""
    success = crud.delete_task(db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")
    return {"message": "タスクを削除しました"}

# ============== Project API ==============

@app.get("/projects", response_model=List[schemas.Project])
async def get_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """全てのプロジェクトを取得"""
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.post("/projects", response_model=schemas.Project)
async def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    """新しいプロジェクトを作成"""
    return crud.create_project(db=db, project=project)

@app.get("/projects/{project_id}", response_model=schemas.Project)
async def get_project(project_id: str, db: Session = Depends(get_db)):
    """特定のプロジェクトを取得"""
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="プロジェクトが見つかりません")
    return db_project

@app.put("/projects/{project_id}", response_model=schemas.Project)
async def update_project(project_id: str, project_update: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    """プロジェクトを更新"""
    db_project = crud.update_project(db, project_id=project_id, project_update=project_update)
    if db_project is None:
        raise HTTPException(status_code=404, detail="プロジェクトが見つかりません")
    return db_project

@app.delete("/projects/{project_id}")
async def delete_project(project_id: str, db: Session = Depends(get_db)):
    """プロジェクトを削除"""
    success = crud.delete_project(db, project_id=project_id)
    if not success:
        raise HTTPException(status_code=404, detail="プロジェクトが見つかりません")
    return {"message": "プロジェクトを削除しました"}

# ============== Category API ==============

@app.get("/categories", response_model=List[schemas.Category])
async def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """全てのカテゴリを取得"""
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories

@app.post("/categories", response_model=schemas.Category)
async def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    """新しいカテゴリを作成"""
    return crud.create_category(db=db, category=category)

@app.get("/categories/{category_id}", response_model=schemas.Category)
async def get_category(category_id: str, db: Session = Depends(get_db)):
    """特定のカテゴリを取得"""
    db_category = crud.get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="カテゴリが見つかりません")
    return db_category

@app.put("/categories/{category_id}", response_model=schemas.Category)
async def update_category(category_id: str, category_update: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    """カテゴリを更新"""
    db_category = crud.update_category(db, category_id=category_id, category_update=category_update)
    if db_category is None:
        raise HTTPException(status_code=404, detail="カテゴリが見つかりません")
    return db_category

@app.delete("/categories/{category_id}")
async def delete_category(category_id: str, db: Session = Depends(get_db)):
    """カテゴリを削除"""
    success = crud.delete_category(db, category_id=category_id)
    if not success:
        raise HTTPException(status_code=404, detail="カテゴリが見つかりません")
    return {"message": "カテゴリを削除しました"}

# ============== 統計API ==============

@app.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """統計情報を取得"""
    total_tasks = len(crud.get_tasks(db))
    completed_tasks = len([t for t in crud.get_tasks(db) if t.completed])
    total_projects = len(crud.get_projects(db))
    total_categories = len(crud.get_categories(db))
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": total_tasks - completed_tasks,
        "completion_rate": round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 2),
        "total_projects": total_projects,
        "total_categories": total_categories
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)