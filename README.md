# NEXUS - 次世代タスク管理プラットフォーム

## 🚀 概要

NEXUSは、個人とチームの生産性を最大化する革新的なタスク管理アプリケーションです。直感的なワークスペース管理、リアルタイムコラボレーション、美しいKanbanボードを統合した次世代プラットフォームです。

## ✨ 主な機能

### 🏢 ワークスペース管理
- **個人ワークスペース**: プライベート・共有設定可能
- **チームワークスペース**: 複数チーム作成・管理
- **階層構造**: Workspace → Board → Task の明確な関係性

### 📋 Kanbanボード
- **ドラッグ&ドロップ**: 直感的なタスク管理
- **カスタムカラム**: ワークフローに合わせた柔軟な設定
- **優先度管理**: 視覚的な優先度表示

### 💬 リアルタイムコミュニケーション
- **チャット機能**: ワークスペース別チャット
- **タスクコメント**: タスクごとのディスカッション
- **通知システム**: リアルタイム更新

### 📱 レスポンシブデザイン
- **デスクトップ**: 効率的なサイドバーナビゲーション
- **モバイル**: 直感的なタブバー操作
- **PWA対応**: アプリライクな体験

## 🛠 技術スタック

### フロントエンド
- **Next.js 14** - React フレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - ユーティリティファーストCSS
- **Shadcn/ui** - 美しいUIコンポーネント
- **Lucide React** - アイコンライブラリ

### バックエンド
- **FastAPI** - 高性能Python Webフレームワーク
- **SQLAlchemy** - ORM
- **SQLite** - データベース
- **Pydantic** - データバリデーション

## 🚀 セットアップ

### 前提条件
- Node.js 18+
- Python 3.8+
- npm または yarn

### フロントエンド setup

\`\`\`bash
cd front
npm install
npm run dev
\`\`\`

フロントエンドは http://localhost:3000 で起動します。

### バックエンド setup

\`\`\`bash
cd back
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

バックエンドは http://localhost:8000 で起動します。

## 📁 プロジェクト構造

\`\`\`
tasuku/
├── front/                  # Next.js フロントエンド
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # React コンポーネント
│   │   ├── types/         # TypeScript 型定義
│   │   └── lib/           # ユーティリティ
│   └── public/            # 静的ファイル
│
├── back/                   # FastAPI バックエンド
│   ├── main.py            # メインアプリケーション
│   ├── models.py          # データベースモデル
│   ├── schemas.py         # Pydantic スキーマ
│   ├── crud.py           # CRUD操作
│   └── database.py        # データベース設定
│
└── README.md
\`\`\`

## 🎯 開発ロードマップ

### Phase 1: 基盤機能 ✅
- [x] ワークスペース・ボード・タスク階層
- [x] Kanbanボード
- [x] サイドバーナビゲーション
- [x] モバイル対応

### Phase 2: 拡張機能（開発中）
- [ ] カレンダー統合
- [ ] ファイル共有
- [ ] リアルタイム通知
- [ ] 勤務表管理
- [ ] Outlook/Teams連携

### Phase 3: エンタープライズ機能
- [ ] 高度な権限管理
- [ ] API連携
- [ ] レポート・分析
- [ ] 監査ログ

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (\`git checkout -b feature/AmazingFeature\`)
3. 変更をコミット (\`git commit -m 'Add some AmazingFeature'\`)
4. ブランチにプッシュ (\`git push origin feature/AmazingFeature\`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 👥 開発チーム

- **Miyamoto** - プロジェクトリード & フルスタック開発

---

**NEXUS** - Where productivity meets innovation ⚡