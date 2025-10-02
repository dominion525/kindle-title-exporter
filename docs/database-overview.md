# Kindle BookData.sqlite データベース構造概要

## このドキュメントについて

Kindle for macOSが使用する`BookData.sqlite`データベースの全体構造を説明します。

## データベースの基本情報

- **データベース種別**: Core Data管理のSQLiteデータベース
- **保存場所**: `~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite`
- **主要テーブル数**: 10テーブル + システムテーブル3つ
- **文字エンコーディング**: UTF-8

## テーブル一覧

### 書籍関連テーブル

#### ZBOOK（書籍メインテーブル）

- **役割**: 書籍の主要情報を格納する中心テーブル
- **レコード数**: 蔵書数に応じて変動
- **主要フィールド**:
  - タイトル（ZDISPLAYTITLE）
  - 出版社（ZRAWPUBLISHER）
  - 言語（ZLANGUAGE）
  - ファイルパス（ZPATH）
  - plist形式メタデータ（ZSYNCMETADATAATTRIBUTES）
- **詳細**: `zbook-fields.md` 参照

#### ZBOOKEXT（書籍拡張情報）

- **役割**: 書籍の補助情報を格納
- **主要フィールド**:
  - 書籍ID（ZBOOKID）
  - ダウンロード元（ZDOWNLOADORIGIN）

#### ZBOOKUPDATE（書籍アップデート情報）

- **役割**: 書籍のアップデート状態を管理
- **主要フィールド**:
  - 書籍ID（ZBOOKID）
  - 更新状態（ZRAWUPDATESTATE）
  - 最終更新試行日時（ZLASTUPDATEATTEMPT）

#### ZARTICLE（記事情報）

- **役割**: 書籍内の記事・章情報を格納
- **主要フィールド**:
  - インデックス（ZRAWINDEX）
  - 未読フラグ（ZRAWISUNREAD）
- **リレーション**: `ZBOOK.Z_PK = ZARTICLE.Z2RAWARTICLES`

### シリーズ関連テーブル

#### ZGROUP（シリーズマスタ）

- **役割**: シリーズ情報を格納
- **主要フィールド**:
  - シリーズID（ZGROUPID）
  - シリーズ名（ZDISPLAYNAME）
  - シリーズ著者（ZDISPLAYAUTHOR）
  - シリーズタイプ（ZSERIESTYPE）
  - 出版日（ZRAWPUBLICATIONDATE）
- **詳細**: `series-relations.md` 参照

#### ZGROUPITEM（書籍-シリーズ中間テーブル）

- **役割**: 書籍とシリーズを紐付ける
- **主要フィールド**:
  - 書籍への外部キー（ZBOOK）
  - シリーズへの外部キー（ZPARENTCONTAINER）
  - シリーズ内位置（ZPOSITION）
  - 位置ラベル（ZPOSITIONLABEL）
- **リレーション**: `ZBOOK ←→ ZGROUPITEM ←→ ZGROUP`
- **詳細**: `series-relations.md` 参照

#### ZSERIESAUTHOR（シリーズ著者情報）

- **役割**: シリーズの著者情報を格納（複数著者対応）
- **主要フィールド**:
  - シリーズへの外部キー（ZSERIES）
  - 著者名（ZAUTHORNAME）
  - 著者名読み（ZAUTHORPRONUNCIATION）
- **リレーション**: `ZGROUP ←→ ZSERIESAUTHOR`

#### ZSERIESIMAGE（シリーズ画像情報）

- **役割**: シリーズの表紙画像情報を格納
- **主要フィールド**:
  - シリーズへの外部キー（ZSERIES）
  - 画像ID（ZIMAGEID）
  - 拡張子（ZEXTENSION）
- **リレーション**: `ZGROUP ←→ ZSERIESIMAGE`

### コレクション関連テーブル

#### ZCOLLECTIONV2（コレクションマスタ）

- **役割**: ユーザーが作成したコレクション情報を格納
- **主要フィールド**:
  - コレクションID（ZCOLLECTIONID）
  - コレクション名（ZNAME）
  - コンテンツタイプ（ZCONTENTTYPE）
  - 最終アクセス時刻（ZRAWLASTACCESSTIME）

#### ZCOLLECTIONITEM（書籍-コレクション中間テーブル）

- **役割**: 書籍とコレクションを紐付ける
- **主要フィールド**:
  - 書籍への外部キー（ZBOOK）
  - コレクションへの外部キー（ZCOLLECTION）
  - 表示順（ZRAWORDER）
  - コレクションID（ZCOLLECTIONID）
  - アイテムID（ZITEMID）
- **リレーション**: `ZBOOK ←→ ZCOLLECTIONITEM ←→ ZCOLLECTIONV2`

### システムテーブル

#### Z_PRIMARYKEY

- **役割**: 各テーブルのプライマリキー最大値を管理
- **構造**: エンティティタイプごとの最大PK値を保持

#### Z_METADATA

- **役割**: Core Dataのメタデータを格納
- **主要フィールド**:
  - バージョン（Z_VERSION）
  - UUID（Z_UUID）
  - メタデータplist（Z_PLIST）

#### Z_MODELCACHE

- **役割**: Core Dataモデルのキャッシュ
- **構造**: モデル情報をBLOBで格納

## 主要なリレーション

### 書籍とシリーズの関係

```
ZBOOK (Z_PK)
  ↓
  ← ZGROUPITEM.ZBOOK (外部キー)
  ↓
ZGROUPITEM (ZPARENTCONTAINER)
  ↓
  → ZGROUP.Z_PK (外部キー)
  ↓
ZGROUP (シリーズマスタ)
```

**特徴**:
- LEFT JOINで取得することで、シリーズに属さない書籍も含めて取得可能
- シリーズに属さない書籍は`NULL`値となる

**詳細**: `series-relations.md` 参照

### 書籍とコレクションの関係

```
ZBOOK (Z_PK)
  ↓
  ← ZCOLLECTIONITEM.ZBOOK (外部キー)
  ↓
ZCOLLECTIONITEM (ZCOLLECTION)
  ↓
  → ZCOLLECTIONV2.Z_PK (外部キー)
  ↓
ZCOLLECTIONV2 (コレクションマスタ)
```

**特徴**:
- 1つの書籍が複数のコレクションに属することが可能
- LEFT JOINで取得することで、コレクションに属さない書籍も含めて取得可能

### 書籍と記事の関係

```
ZBOOK (Z_PK)
  ↓
  ← ZARTICLE.Z2RAWARTICLES (外部キー)
  ↓
ZARTICLE (記事情報)
```

## ER図

詳細なER図は`README.md`を参照してください。主要なリレーションは以下の通りです：

- `ZBOOK ←→ ZGROUPITEM ←→ ZGROUP` (シリーズ)
- `ZBOOK ←→ ZCOLLECTIONITEM ←→ ZCOLLECTIONV2` (コレクション)
- `ZBOOK → ZARTICLE` (記事)
- `ZGROUP ←→ ZSERIESAUTHOR` (シリーズ著者)
- `ZGROUP ←→ ZSERIESIMAGE` (シリーズ画像)

## 重要な注意点

### タイムスタンプ形式

`ZRAWPUBLICATIONDATE`などのタイムスタンプフィールドは、**Unix タイムスタンプ（1970-01-01 00:00:00 UTC からの秒数）**で保存されています。

**変換方法**:
```javascript
// Unix timestamp → JavaScript Date
const date = new Date(unixTimestamp * 1000);
```

**例**:
- Unix timestamp: `1353283200`
- 日時: `2012-11-19T00:00:00.000Z`

**注意**: `0`の値は「データなし」を意味する。

### BLOBフィールドの扱い

多くのフィールドがBLOB型で保存されており、直接読み取ることができません。

**主要なBLOBフィールド**:
- `ZDISPLAYAUTHOR`: 著者のハッシュ値/ID（16-48 bytes）
- `ZSYNCMETADATAATTRIBUTES`: plist形式のメタデータ（1,000-2,000 bytes）⭐重要
- `ZEXTENDEDMETADATA`: 拡張メタデータ
- `ZORIGINS`: 入手元情報

**ZSYNCMETADATAATTRIBUTES**は最も重要なフィールドで、以下の情報を含みます：
- 著者名（人間が読める形式）
- 購入日時
- 純粋なASIN
- その他多数のメタデータ

詳細は`plist-format.md`を参照してください。

### 外部キーの命名規則

- `Z_PK`: 各テーブルのプライマリキー（INTEGER型）
- `Z{テーブル名}`: 外部キー（例：`ZBOOK`、`ZCOLLECTION`）
- テーブル名を含むフィールドは、そのテーブルへの外部キーを示す

### NULL値の意味

- 多くのフィールドでNULLが許可されている
- NULLは「未設定」または「該当なし」を意味する
- 特にシリーズ情報やコレクション情報では、LEFT JOINの結果としてNULLになることが多い

## データベーススキーマの確認

完全なテーブル定義は`BookData.sqlite.sql`を参照してください。
