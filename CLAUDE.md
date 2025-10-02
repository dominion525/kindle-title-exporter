# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

KindleデスクトップアプリのSQLite DBから蔵書リストを取得するCLIツール。
TypeScriptで実装され、CommonJSモジュールとして動作する。macOS専用。

## 開発コマンド

```bash
# ビルド
npm run build

# 開発実行（ts-node使用）
npm run dev

# ビルド後実行
npm start > output.csv

# CLI実行例
npx kindle-title-exporter > output.csv
npx kindle-title-exporter -f json > output.json
npx kindle-title-exporter -d /path/to/BookData.sqlite > books.csv
```

## アーキテクチャ

### モジュラー構成
機能ごとにモジュール分割された構造：
- `src/index.ts` - エントリーポイント（macOSチェック、メイン処理フロー）
- `src/cli/args.ts` - CLI引数パース（commander使用）
- `src/db/reader.ts` - SQLite読み込み（better-sqlite3使用）
- `src/converters/plist.ts` - plist（NSKeyedArchive）デコーダー
- `src/converters/mapper.ts` - DB行から出力行へのマッピング
- `src/formatters/csv.ts` - CSV出力（RFC 4180準拠）
- `src/formatters/json.ts` - JSON出力
- `src/config/constants.ts` - 定数定義（DBパス、フィールド定義）
- `src/types/index.ts` - 共通型定義

### データソース
macOS上のKindleアプリのSQLite DB（`~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite`）から以下のデータを取得：
- `ZBOOK` - 書籍基本情報
- `ZGROUP` + `ZGROUPITEM` - シリーズ情報（LEFT JOIN）

### 主要処理フロー
1. `isMacOS()` - macOSプラットフォームチェック
2. `parseArgs()` - CLIオプション解析（`-d`, `-f`）
3. `readTableData()` - SQLite DBから書籍データ取得（シリーズ情報含む）
4. `mapRows()` - フィールドマッピング
   - plistデコード（`ZSYNCMETADATAATTRIBUTES`列）
   - Unix timestamp変換（`ZRAWPUBLICATIONDATE`）
   - ASINなどのメタデータ抽出
5. `rowsToCsv()` / `rowsToJson()` - フォーマット変換
6. 標準出力への出力

### データベーススキーマ
README.mdに記載されたER図参照。主要テーブル：
- `ZBOOK` - 書籍情報の中心テーブル
- `ZGROUP` / `ZGROUPITEM` - シリーズ管理
- `ZCOLLECTIONV2` / `ZCOLLECTIONITEM` - コレクション管理
- その他関連テーブル（`ZBOOKEXT`, `ZBOOKUPDATE`, `ZARTICLE`など）

### 出力フィールド（全12項目）

**識別情報**
- `book_id` - 書籍ID（例：A:B009DEMC8W-0）
- `asin` - 純粋なASIN（plistから抽出、例：B009DEMC8W）

**コンテンツ情報**
- `display_title` - 表示用タイトル
- `author` - 著者名（plistから抽出）
- `series_name` - シリーズ名（ZGROUP JOIN）
- `series_position` - シリーズ内順序（position_label）

**出版情報**
- `publisher` - 出版社名
- `publication_date` - 出版日（Unix timestamp → ISO 8601変換）

**メタ情報**
- `purchase_date` - 購入日時（plistから抽出）
- `content_tags` - コンテンツタグ配列（plistから抽出、例：["DICT", "FREE_DICT"]）
- `language` - 言語コード（例：ja, en, Unknown）
- `sort_title` - ソート用タイトル（カタカナ表記など）

## TypeScript設定
- Target: ES2020
- Module: CommonJS
- Strict mode有効
- 出力先: `dist/`
