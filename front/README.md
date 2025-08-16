# タスク管理アプリ（フロントエンド）

Next.js + React + ShadcN UI + TailwindCSSで構築されたタスク管理アプリケーションです。

## 技術スタック

- **Next.js 15** - Reactフレームワーク
- **TypeScript** - 型安全な開発
- **TailwindCSS** - ユーティリティファーストのCSS
- **ShadcN UI** - 美しいUIコンポーネント
- **Lucide React** - アイコンライブラリ
- **Axios** - APIクライアント

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. 開発サーバーを起動:
```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で起動します。

## 機能

- ✅ タスクの作成・表示・更新・削除
- ✅ タスクの完了状態切り替え
- ✅ レスポンシブデザイン
- ✅ リアルタイム更新
- ✅ エラーハンドリング

## API接続

バックエンドAPIは `http://localhost:8000` で起動している必要があります。

## ビルド

```bash
npm run build
```

## プロジェクト構造

```
src/
├── app/
│   └── page.tsx              # メインページ
├── components/
│   ├── ui/                   # ShadcN UIコンポーネント
│   └── TaskManager.tsx       # タスク管理メインコンポーネント
├── lib/
│   ├── api.ts               # API クライアント
│   └── utils.ts             # ユーティリティ関数
└── types/
    └── task.ts              # 型定義
```