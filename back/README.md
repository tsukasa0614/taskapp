# TaskFlow API v2.0（バックエンド）

SQLite + SQLAlchemy + FastAPIを使用したタスク管理アプリケーションのバックエンドです。

## 🚀 新機能 (v2.0)

- ✅ **データベース永続化**: SQLiteデータベースでデータを永続的に保存
- ✅ **プロジェクト管理**: チーム用プロジェクトの完全CRUD
- ✅ **カテゴリ管理**: 個人用カテゴリの完全CRUD  
- ✅ **リレーション**: タスク ↔ プロジェクト/カテゴリの関連付け
- ✅ **統計API**: タスク完了率などの統計情報
- ✅ **自動初期化**: 初回起動時の初期データ作成

## セットアップ

1. 仮想環境を作成（推奨）:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# または
venv\Scripts\activate  # Windows
```

2. 依存関係をインストール:
```bash
pip install -r requirements.txt
```

3. サーバーを起動:
```bash
uvicorn main:app --reload
```

サーバーは `http://localhost:8000` で起動します。
初回起動時に `taskflow.db` ファイルが作成され、初期データが自動挿入されます。

## 📊 データベース構造

### テーブル
- **tasks**: タスク情報
- **projects**: プロジェクト情報（チーム用）
- **categories**: カテゴリ情報（個人用）

### リレーション
- Task N:1 Project (チームワークスペース)
- Task N:1 Category (個人ワークスペース)

## 🔗 API仕様

### Task API
- `GET /tasks` - 全タスク取得
- `POST /tasks` - タスク作成
- `GET /tasks/{task_id}` - 特定タスク取得
- `PUT /tasks/{task_id}` - タスク更新
- `PATCH /tasks/{task_id}/toggle` - 完了状態切り替え
- `DELETE /tasks/{task_id}` - タスク削除

### Project API (チーム用)
- `GET /projects` - 全プロジェクト取得
- `POST /projects` - プロジェクト作成
- `GET /projects/{project_id}` - 特定プロジェクト取得
- `PUT /projects/{project_id}` - プロジェクト更新
- `DELETE /projects/{project_id}` - プロジェクト削除

### Category API (個人用)
- `GET /categories` - 全カテゴリ取得
- `POST /categories` - カテゴリ作成
- `GET /categories/{category_id}` - 特定カテゴリ取得
- `PUT /categories/{category_id}` - カテゴリ更新
- `DELETE /categories/{category_id}` - カテゴリ削除

### Stats API
- `GET /stats` - 統計情報取得

## 📝 データモデル

**Task**:
- `id`: string (UUID)
- `title`: string (必須)
- `description`: string (オプション)
- `completed`: boolean
- `project_id`: string (オプション)
- `category_id`: string (オプション)
- `created_at`: datetime
- `updated_at`: datetime

**Project** (チーム用):
- `id`: string (UUID)
- `name`: string (必須)
- `description`: string (オプション)
- `type`: string ('team')
- `color`: string (必須)
- `icon`: string (必須)
- `created_at`: datetime
- `updated_at`: datetime

**Category** (個人用):
- `id`: string (UUID)
- `name`: string (必須)
- `description`: string (オプション)
- `color`: string (必須)
- `icon`: string (必須)
- `workspace_type`: string ('personal')
- `created_at`: datetime
- `updated_at`: datetime

## 🛠️ 開発

- **FastAPI自動生成ドキュメント**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **データベースファイル**: `./taskflow.db` (SQLite)

## 📁 プロジェクト構造

```
back/
├── main.py              # FastAPI アプリケーション
├── database.py          # データベース設定
├── models.py           # SQLAlchemy モデル
├── schemas.py          # Pydantic スキーマ
├── crud.py             # CRUD 操作
├── init_db.py          # データベース初期化
├── requirements.txt    # 依存関係
├── taskflow.db         # SQLite データベース (自動生成)
└── README.md           # このファイル
```
