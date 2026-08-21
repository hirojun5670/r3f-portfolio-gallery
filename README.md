# r3f-portfolio-gallery
 
3DCG作品(glTF)を投稿・閲覧できる、自分専用のポートフォリオギャラリーサイトです。
Next.js + React Three Fiber を用いたフルスタックWebアプリを、GitHub Copilot によるAI駆動開発で構築してみました。
 
🔗 **Live Demo**: [https://r3f-portfolio-gallery.vercel.app](https://r3f-portfolio-gallery.vercel.app)
 
---
 
## 概要
 
- 作品(3Dモデル・画像)を一覧・詳細表示できるギャラリーサイト
- 詳細ページでは React Three Fiber による3Dビューワーでモデルを閲覧可能
- 管理画面から作品の投稿・削除が可能(投稿者は自分のみを想定した簡易認証付き)
## 主な機能
 
| 機能 | 概要 |
|---|---|
| 作品一覧 | Postgres(Neon)から取得した作品をカードグリッドで表示 |
| 3Dビューワー | glTFモデルをReact Three Fiberで表示。KTX2圧縮テクスチャに対応 |
| 管理画面 | Basic認証で保護された投稿・削除UI |
| ファイルアップロード | サムネイル画像・3DアセットをVercel Blobに保存 |
 
## 技術スタック
 
- **Framework**: Next.js 16 (App Router) / TypeScript
- **Styling**: Tailwind CSS
- **3D**: React Three Fiber, drei, three-stdlib(KTX2Loader)
- **Database**: Neon (Serverless Postgres)
- **Storage**: Vercel Blob
- **Auth**: Basic認証(Next.js proxy.ts)
- **Deploy**: Vercel
- **AI駆動開発**: GitHub Copilot
## アーキテクチャ
 
```
ブラウザ
  │
  ▼
proxy.ts ── /admin, /api/works を Basic認証で保護
  │
  ├─ Server Component (一覧・詳細ページ)
  │     └─ Neon(Postgres) から直接データ取得
  │
  └─ API Route (/api/works)
        ├─ Vercel Blob へファイルアップロード
        └─ Neon(Postgres) へメタデータ保存
```
 
## AI駆動開発について
 
このプロジェクトは、実装のほぼ全てを GitHub Copilot に委任し、以下のワークフローで開発しました。
 
1. `AGENTS.md` にプロジェクト仕様・DB設計・コーディング規約を記述し、AIの共通コンテキストとして参照させる
2. 機能をGitHub Issue単位に分解し、Copilotに実装を委任
3. 生成されたPRをレビューし、必要に応じて自分で修正・議論を加えてマージ
4. 得られた技術的知見は `AGENTS.md` に随時反映し、以降の実装精度を高める
開発者自身の役割は「コードを書くこと」ではなく、**要件定義・設計判断・レビュー・トラブルシューティング**に置き、AIを実装担当として活用する体制を意識しました。
 
### 実際に発生し、対応した技術的課題
 
- Three.js本体と `three-stdlib` のクラス型不一致によるTypeScriptエラーの解消
- KTX2テクスチャ対応(WebGLRendererを用いた`detectSupport`のタイミング設計)
- Next.js 16 での `middleware` → `proxy` への破壊的変更への追従
## セットアップ(ローカル開発)
 
```bash
npm install
vercel link
vercel env pull .env.local
npm run dev
```
 
`works` テーブルの作成には `migrations/` 配下のSQLをNeonのSQL Editorで実行してください。
 
## License
 
MIT