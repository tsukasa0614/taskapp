from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import crud
import schemas

def init_database():
    """データベースの初期化と初期データの作成"""
    # テーブルを作成
    models.Base.metadata.create_all(bind=engine)
    
    # セッションを作成
    db = SessionLocal()
    
    try:
        # 既存データがあるかチェック
        existing_projects = crud.get_projects(db)
        existing_categories = crud.get_categories(db)
        
        if not existing_projects and not existing_categories:
            print("初期データを作成中...")
            
            # デフォルトプロジェクトを作成
            default_project = schemas.ProjectCreate(
                name="チームプロジェクト",
                description="チームで共有するプロジェクト",
                type="team",
                color="bg-green-500",
                icon="Users"
            )
            crud.create_project(db, default_project)
            
            # デフォルトカテゴリを作成
            categories_data = [
                {
                    "name": "仕事",
                    "description": "仕事関連のタスク",
                    "color": "bg-blue-500",
                    "icon": "Building2",
                    "workspace_type": "personal"
                },
                {
                    "name": "家庭",
                    "description": "家庭・プライベートのタスク",
                    "color": "bg-pink-500",
                    "icon": "Heart",
                    "workspace_type": "personal"
                },
                {
                    "name": "その他",
                    "description": "その他のタスク",
                    "color": "bg-gray-500",
                    "icon": "Star",
                    "workspace_type": "personal"
                }
            ]
            
            for category_data in categories_data:
                category = schemas.CategoryCreate(**category_data)
                crud.create_category(db, category)
            
            print("初期データの作成が完了しました！")
        else:
            print("既存のデータが見つかりました。初期化をスキップします。")
            
    except Exception as e:
        print(f"初期化中にエラーが発生しました: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
