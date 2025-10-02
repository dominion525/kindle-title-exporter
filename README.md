# kindle-title-exporter

Kindleの蔵書リストを取得するツールです。

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
# CSV出力（デフォルト）
npm start -- -o output.csv

# JSON出力
npm start -- -f json -o output.json

# 詳細モード
npm start -- -v -o output.csv

# 標準出力
npm start -- -o -

# カスタムDBパス
npm start -- -d /path/to/BookData.sqlite -o output.csv
```

## 出力フィールド

以下のフィールドが出力されます（全12項目）：

### 識別情報
- `book_id` - 書籍ID (例: A:B009DEMC8W-0)
- `asin` - 純粋なASIN (例: B009DEMC8W)

### コンテンツ情報
- `display_title` - 表示用タイトル
- `author` - 著者名
- `series_name` - シリーズ名
- `series_position` - シリーズ内順序

### 出版情報
- `publisher` - 出版社名
- `publication_date` - 出版日 (ISO 8601形式)

### メタ情報
- `purchase_date` - 購入日時 (ISO 8601形式)
- `content_tags` - コンテンツタグ (配列)
- `language` - 言語コード (例: ja, en, Unknown)
- `sort_title` - ソート用タイトル (カタカナ表記など)

> **Note**: CSVはヘッダー付きで出力されるため、必要に応じて列の並べ替えは利用側で行ってください。

## プロジェクト構造

```
src/
├── index.ts              # エントリーポイント
├── cli/                  # CLI関連
│   ├── args.ts          # 引数パーサー
│   └── help.ts          # ヘルプ表示
├── db/                   # データベース関連
│   └── reader.ts        # SQLiteリーダー
├── converters/           # データ変換
│   ├── plist.ts         # plistデコーダー
│   └── projection.ts    # フィールド射影
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
- `converters/projection.test.ts` - フィールド射影
- `formatters/csv.test.ts` - CSV出力
- `formatters/json.test.ts` - JSON出力

## ドキュメント

データベース構造の詳細は `docs/` ディレクトリを参照してください：

- [README.md](docs/README.md) - 概要とクイックスタート
- [database-overview.md](docs/database-overview.md) - データベース全体構造
- [zbook-fields.md](docs/zbook-fields.md) - ZBOOKテーブルフィールド詳細
- [plist-format.md](docs/plist-format.md) - plist形式の詳細
- [series-relations.md](docs/series-relations.md) - シリーズ情報の取得方法

```
erDiagram
    ZBOOK ||--o| ZCOMPANION : "has"
    ZBOOK ||--o{ ZCOLLECTIONITEM : "belongs to"
    ZBOOK ||--o{ ZGROUPITEM : "belongs to"
    ZBOOK ||--o| ZBOOKEXT : "extended by"
    ZBOOK ||--o| ZBOOKUPDATE : "has update"
    
    ZCOLLECTIONV2 ||--o{ ZCOLLECTIONITEM : "contains"
    
    ZGROUP ||--o{ ZGROUPITEM : "contains"
    ZGROUP ||--o| ZSERIESIMAGE : "has cover"
    ZGROUP ||--o{ ZSERIESAUTHOR : "has authors"
    
    ZARTICLE }o--|| ZBOOK : "raw articles"

    ZBOOK {
        int Z_PK PK
        varchar ZBOOKID "Book ID"
        varchar ZDISPLAYTITLE "Title"
        blob ZDISPLAYAUTHOR "Author"
        varchar ZPATH "File Path"
        varchar ZPARENTASIN "ASIN"
        varchar ZRAWPUBLISHER "Publisher"
        varchar ZLANGUAGE "Language"
        int ZRAWPUBLICATIONDATE "Publication Date"
        int ZRAWBOOKSTATE "Book State"
        int ZRAWCURRENTPOSITION "Reading Position"
        int ZRAWMAXPOSITION "Max Position"
        int ZRAWLASTACCESSTIME "Last Access"
        int ZRAWISUNREAD "Is Unread"
        blob ZEXTENDEDMETADATA "Extended Metadata"
    }

    ZBOOKEXT {
        int Z_PK PK
        varchar ZBOOKID FK
        varchar ZDOWNLOADORIGIN "Download Origin"
    }

    ZBOOKUPDATE {
        int Z_PK PK
        varchar ZBOOKID FK
        int ZRAWUPDATESTATE "Update State"
        timestamp ZLASTUPDATEATTEMPT "Last Update"
    }

    ZCOLLECTIONITEM {
        int Z_PK PK
        int ZBOOK FK
        int ZCOLLECTION FK
        float ZRAWORDER "Order"
        varchar ZCOLLECTIONID "Collection ID"
        varchar ZITEMID "Item ID"
    }

    ZCOLLECTIONV2 {
        int Z_PK PK
        varchar ZCOLLECTIONID "Collection ID"
        varchar ZNAME "Collection Name"
        varchar ZCONTENTTYPE "Content Type"
        int ZRAWLASTACCESSTIME "Last Access"
    }

    ZGROUP {
        int Z_PK PK
        varchar ZGROUPID "Group/Series ID"
        varchar ZDISPLAYNAME "Series Name"
        varchar ZDISPLAYAUTHOR "Author"
        varchar ZSERIESTYPE "Series Type"
        int ZLASTACCESSTIME "Last Access"
        int ZRAWPUBLICATIONDATE "Publication Date"
    }

    ZGROUPITEM {
        int Z_PK PK
        int ZBOOK FK
        int ZPARENTCONTAINER FK
        int ZPOSITION "Position in Series"
        varchar ZPOSITIONLABEL "Position Label"
    }

    ZSERIESAUTHOR {
        int Z_PK PK
        int ZSERIES FK
        varchar ZAUTHORNAME "Author Name"
        varchar ZAUTHORPRONUNCIATION "Pronunciation"
    }

    ZSERIESIMAGE {
        int Z_PK PK
        int ZSERIES FK
        varchar ZIMAGEID "Image ID"
        varchar ZEXTENSION "File Extension"
    }

    ZARTICLE {
        int Z_PK PK
        int Z2RAWARTICLES FK
        int ZRAWINDEX "Index"
        int ZRAWISUNREAD "Is Unread"
    }
```