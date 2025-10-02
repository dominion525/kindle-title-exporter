# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

KindleデスクトップアプリのSQLite DBから蔵書リストを取得するCLIツール。
TypeScriptで実装され、CommonJSモジュールとして動作する。

## 開発コマンド

```bash
# ビルド
npm run build

# 開発実行（ts-node使用）
npm run dev

# ビルド後実行
npm start

# CLI実行例
npx kindle-title-exporter -o output.csv
npx kindle-title-exporter --db-path /path/to/BookData.sqlite -o books.json -f json -v
```

## アーキテクチャ

### 単一ファイル構成
全ロジックは `src/index.ts` に集約されている。ビルド後は `dist/index.js` として実行可能なCLIとなる。

### データソース
macOS上のKindleアプリのSQLite DB（`~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite`）から `ZBOOK` テーブルを読み取る。

### 主要処理フロー
1. `parseArgs()` - CLIオプション解析
2. `readTableData()` - SQLite DBから `ZBOOK` テーブル全データ取得
3. `selectFields()` - 出力対象カラムの選択（basic/verbose）
4. `projectRows()` - 出力フィールドへの射影
5. CSV/JSON形式での出力（標準出力またはファイル）

### データベーススキーマ
README.mdに記載されたER図参照。主要テーブル：
- `ZBOOK` - 書籍情報の中心テーブル
- `ZCOLLECTIONV2` / `ZCOLLECTIONITEM` - コレクション管理
- `ZGROUP` / `ZGROUPITEM` - シリーズ管理
- `ZBOOKEXT`, `ZBOOKUPDATE`, `ZARTICLE` など関連テーブル

### 出力フィールド
- Basic: title, asin, categories, publisher
- Verbose: 現在はBasicと同一（拡張可能）

## TypeScript設定
- Target: ES2020
- Module: CommonJS
- Strict mode有効
- 出力先: `dist/`
