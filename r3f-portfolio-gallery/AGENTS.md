<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# プロジェクト概要
3DCGポートフォリオ投稿・閲覧サイト。投稿者は自分のみ。

## 技術スタック
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Neon(Postgres) — @neondatabase/serverless
- Vercel Blob Storage
- React Three Fiber(glTF/VRMビューワー)

## DB設計
### works テーブル
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid | 主キー |
| title | text | 作品タイトル |
| description | text | 説明文 |
| thumbnail_url | text | Blob上のサムネイル画像URL |
| asset_url | text | Blob上のglTF/VRMファイルURL |
| tags | text[] | 使用ツールなど |
| created_at | timestamptz | 作成日時 |

## 機能一覧
- 一覧ページ: works一覧をカードグリッド表示
- 詳細ページ: R3Fで3Dモデルを表示(OrbitControls)
- 管理画面: タイトル・説明・タグ入力 + サムネイル/アセットアップロード
- 簡易認証: 管理画面へのアクセス制限(Middleware)

## コーディング規約
- コード内のコメントは日本語、変数名・関数名は英語で統一する
- MVPパターンを意識したコンポーネント分割
- 型は厳密に(any禁止)
- Server Componentをデフォルトとし、インタラクションが必要な箇所のみ"use client"