# Kindle BookData.sqlite ドキュメント

## このドキュメントについて

このディレクトリには、Kindle for macOSが使用する`BookData.sqlite`データベースに関する詳細なドキュメントが含まれています。

## BookData.sqliteとは

**BookData.sqlite**は、Kindle for macOSアプリケーションが書籍情報を管理するために使用するSQLiteデータベースファイルです。

### ファイルの場所

```
~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite
```

**フルパス例**:
```
~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite
```

### アクセス方法

#### SQLiteコマンドラインツール

```bash
sqlite3 ~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite
```

#### プログラムから（better-sqlite3）

```javascript
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(
  process.env.HOME,
  'Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite'
);

const db = new Database(dbPath, { readonly: true });
```

### データベースの特徴

- **形式**: SQLiteデータベース（Core Data管理）
- **文字エンコーディング**: UTF-8
- **主要テーブル数**: 10テーブル + システムテーブル3つ
- **サイズ**: 蔵書数に応じて変動（通常数MB〜数十MB）
- **更新**: Kindleアプリの起動・同期時に自動更新

### 注意事項

⚠️ **重要な注意点**:

1. **読み取り専用で扱う**
   - データベースの直接編集は推奨されません
   - 読み取り専用モード（`readonly: true`）で開くこと

2. **バックアップ推奨**
   - 解析前にデータベースファイルをバックアップ
   - Kindleアプリの動作中は変更される可能性あり

3. **macOS専用**
   - このドキュメントはmacOS版Kindleアプリを対象
   - Windows版やモバイル版は構造が異なる可能性

## ドキュメント一覧

### 📘 [database-overview.md](./database-overview.md)
**データベース全体構造の概要**

- 10テーブルの一覧と役割
- 主要なリレーション構造
- Core Dataのタイムスタンプ形式
- BLOBフィールドの扱い

**こんな時に読む**:
- データベースの全体像を把握したい
- どのテーブルに何が格納されているか知りたい
- テーブル間の関係を理解したい

---

### 📗 [zbook-fields.md](./zbook-fields.md)
**ZBOOKテーブル 全フィールドリファレンス**

- 全67フィールドの詳細説明
- カテゴリ別整理（識別情報、書誌情報、読書進捗など）
- 実データ例
- タイムスタンプ変換方法

**こんな時に読む**:
- ZBOOKテーブルのフィールドを調べたい
- 各フィールドの意味を知りたい
- 実際のデータ例を見たい

---

### 📕 [plist-format.md](./plist-format.md)
**ZSYNCMETADATAATTRIBUTES（plist）詳細**

- NSKeyedArchive形式の構造
- 含まれる情報の完全リスト
- ZBOOKフィールドとの比較
- 著者情報の扱い（単一/複数著者）
- デコード実装例（TypeScript）

**こんな時に読む**:
- 著者名を取得したい（plistからのみ取得可能）
- 購入日時を取得したい（plistからのみ取得可能）
- plistのデコード方法を知りたい
- ZBOOKフィールドとの違いを理解したい

---

### 📙 [series-relations.md](./series-relations.md)
**シリーズ情報の取得方法**

- ZGROUP/ZGROUPITEMテーブル構造
- LEFT JOINクエリの詳細
- 実例（ワンパンマン、LIAR GAMEなど）
- TypeScript実装例
- 活用例（進捗可視化など）

**こんな時に読む**:
- シリーズ情報を取得したい
- シリーズ内の巻数を知りたい
- シリーズごとに書籍を一覧したい
- 読書進捗を可視化したい

---

### 📄 [BookData.sqlite.sql](./BookData.sqlite.sql)
**データベーススキーマ定義**

- 全テーブルのCREATE TABLE文
- フィールド定義の完全な記述

**こんな時に読む**:
- テーブル定義の詳細を確認したい
- フィールドの型を正確に知りたい

## クイックスタート

### 1. データベースの確認

```bash
# データベースファイルの存在確認
ls -lh ~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite

# テーブル一覧を表示
sqlite3 ~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite ".tables"
```

### 2. 書籍一覧の取得

```bash
sqlite3 ~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite << EOF
SELECT ZDISPLAYTITLE, ZRAWPUBLISHER
FROM ZBOOK
LIMIT 10;
EOF
```

### 3. シリーズ情報付きで取得

```bash
sqlite3 ~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite << EOF
SELECT
  ZBOOK.ZDISPLAYTITLE,
  ZGROUP.ZDISPLAYNAME as series_name,
  ZGROUPITEM.ZPOSITIONLABEL as series_position
FROM ZBOOK
LEFT JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
LEFT JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK
LIMIT 10;
EOF
```

## よくある質問

### Q1. 著者名を取得するには？

**A**: plist（`ZSYNCMETADATAATTRIBUTES`）からデコードする必要があります。

- `ZDISPLAYAUTHOR`はハッシュ値で人間が読めません
- 詳細は [plist-format.md](./plist-format.md) を参照

### Q2. 購入日時を取得するには？

**A**: plistの`purchase_date`フィールドから取得します。

- ZBOOKテーブルには購入日フィールドがありません
- 詳細は [plist-format.md](./plist-format.md) を参照

### Q3. シリーズ情報を取得するには？

**A**: ZGROUP、ZGROUPITEMテーブルをLEFT JOINで結合します。

```sql
SELECT
  ZBOOK.*,
  ZGROUP.ZDISPLAYNAME as series_name,
  ZGROUPITEM.ZPOSITIONLABEL as series_position
FROM ZBOOK
LEFT JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
LEFT JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK;
```

詳細は [series-relations.md](./series-relations.md) を参照

### Q4. タイムスタンプの形式は？

**A**: Unix timestamp（1970-01-01からの秒数）です。

```javascript
// Unix timestamp → JavaScript Date
const date = new Date(unixTimestamp * 1000);
```

**例**:
- Unix timestamp: `1353283200`
- 日時: `2012-11-19T00:00:00.000Z`

詳細は [database-overview.md](./database-overview.md) または [zbook-fields.md](./zbook-fields.md) を参照

### Q5. このデータベースを直接編集してもいい？

**A**: 推奨されません。

- データベースの破損リスクがあります
- Kindleアプリの同期で上書きされる可能性があります
- 読み取り専用での利用を推奨します

## 貢献

このドキュメントは調査結果をまとめたものです。不明確な点や誤りがあれば、Issueまたはプルリクエストでお知らせください。

## 参考資料

- [Core Data Programming Guide - Apple Developer](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CoreData/)
- [Property List Programming Guide - Apple Developer](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/PropertyLists/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [bplist-parser - npm](https://www.npmjs.com/package/bplist-parser)
