# kindle-title-exporter

[English](README.md) | [日本語](README.ja.md)

Kindle for Macの蔵書情報（タイトル、著者、購入日など）をCSV/JSON形式でエクスポートするツールです。本ツールは書籍のメタデータのみを読み取り、書籍の本文やコンテンツには一切アクセスしません。ヘッダー行を含む12項目のフィールドを出力します。

## インストール

```bash
npm install
```

## 開発

```bash
# ビルド
npm run build

# 開発モード（ts-node）
npm run dev -- -o output.csv

# テスト実行
npm test

# テストカバレッジ
npm run test:coverage

# テストUI
npm run test:ui
```

## 使用方法

```bash
# CSV出力（デフォルト、標準出力）
npm start > output.csv

# JSON出力
npm start -- -f json > output.json

# カスタムDBパス
npm start -- -d /path/to/BookData.sqlite > output.csv

# npxで直接実行
npx kindle-title-exporter > output.csv
npx kindle-title-exporter -f json > output.json
```

## 出力フィールド

以下のフィールドが出力されます（全12項目）：

### 識別情報
- `bookId` - 書籍ID (例: A:B009DEMC8W-0)
- `asin` - 純粋なASIN (例: B009DEMC8W)

### コンテンツ情報
- `title` - タイトル
- `author` - 著者名
- `seriesName` - シリーズ名
- `seriesNumber` - シリーズ番号

### 出版情報
- `publisher` - 出版社名
- `publicationDate` - 出版日 (ISO 8601形式)

### メタ情報
- `purchaseDate` - 購入日時 (ISO 8601形式)
- `contentTags` - コンテンツタグ (配列)
- `language` - 言語コード (例: ja, en, Unknown)
- `sortTitle` - ソート用タイトル (カタカナ表記など)

> **Note**: CSVはヘッダー付きで出力されるため、必要に応じて列の並べ替えは利用側で行ってください。

## プロジェクト構造

```
src/
├── index.ts              # エントリーポイント
├── cli/                  # CLI関連
│   └── args.ts          # 引数パーサー
├── db/                   # データベース関連
│   └── reader.ts        # SQLiteリーダー
├── converters/           # データ変換
│   ├── plist.ts         # plistデコーダー
│   └── mapper.ts        # フィールドマッピング
├── formatters/           # 出力フォーマット
│   ├── csv.ts           # CSV出力
│   └── json.ts          # JSON出力
├── config/               # 設定
│   └── constants.ts     # 定数定義
└── types/                # 型定義
    └── index.ts         # 共通型
```

## テスト

各モジュールは`*.test.ts`ファイルでテストされています：

- `cli/args.test.ts` - CLI引数パーサー
- `converters/plist.test.ts` - plistデコーダー
- `converters/mapper.test.ts` - フィールドマッピング
- `formatters/csv.test.ts` - CSV出力
- `formatters/json.test.ts` - JSON出力

## ドキュメント

データベース構造の詳細は `docs/` ディレクトリを参照してください：

- [README.md](docs/README.md) - 概要とクイックスタート
- [database-overview.md](docs/database-overview.md) - データベース全体構造（ER図含む）
- [zbook-fields.md](docs/zbook-fields.md) - ZBOOKテーブルフィールド詳細
- [plist-format.md](docs/plist-format.md) - plist形式の詳細
- [series-relations.md](docs/series-relations.md) - シリーズ情報の取得方法

## Author

[dominion525](https://github.com/dominion525)

## 免責事項

本ツールは**非公式**であり、AmazonまたはKindleとは一切関係がなく、承認や推奨を受けたものではありません。

「Kindle」はAmazon.com, Inc.の登録商標です。本ソフトウェアは、機能説明のためにのみ（Kindle for Macのデータベースファイルを読み取る）「Kindle」という名称を使用しています（nominative fair use）。本ツールは、デジタル著作権管理（DRM）やコピープロテクション機構を改変、回避、妨害するものではありません。

## License

MIT