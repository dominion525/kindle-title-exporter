# シリーズ情報の取得方法

## このドキュメントについて

書籍のシリーズ情報を取得する方法を説明します。シリーズ情報は`ZGROUP`、`ZGROUPITEM`、`ZBOOK`の3つのテーブルを使用して管理されています。

## 関連テーブルの構造

### ZGROUP（シリーズマスタ）

シリーズの基本情報を格納するマスタテーブルです。

| フィールド | 型 | 説明 | 例 |
|-----------|----|----|-----|
| `Z_PK` | INTEGER | プライマリキー | `123` |
| `ZGROUPID` | VARCHAR | グループID（文字列） | `"B01FU3MY2S"` |
| `ZDISPLAYNAME` | VARCHAR | シリーズ名⭐ | `"ワンパンマン"` |
| `ZDISPLAYAUTHOR` | VARCHAR | シリーズ著者 | `"ONE/村田雄介"` |
| `ZSERIESTYPE` | VARCHAR | シリーズタイプ | `"series"` |
| `ZRAWPUBLICATIONDATE` | INTEGER | 出版日 | `1234567890` |
| `ZLASTACCESSTIME` | INTEGER | 最終アクセス時刻 | `1234567890` |
| `ZSERIESCOVERIMAGE` | INTEGER | 表紙画像への外部キー | `456` |

**重要フィールド**:
- `ZDISPLAYNAME`: ユーザーに表示するシリーズ名

### ZGROUPITEM（書籍-シリーズ中間テーブル）

書籍とシリーズを紐付ける中間テーブルです。

| フィールド | 型 | 説明 | 例 |
|-----------|----|----|-----|
| `Z_PK` | INTEGER | プライマリキー | `789` |
| `ZBOOK` | INTEGER | 書籍への外部キー⭐ | `2940` |
| `ZPARENTCONTAINER` | INTEGER | シリーズへの外部キー⭐ | `123` |
| `ZPOSITION` | INTEGER | シリーズ内位置（0始まり）⭐ | `0`, `14`, `33` |
| `ZPOSITIONLABEL` | VARCHAR | 位置ラベル⭐ | `"1"`, `"15"`, `"34"` |
| `ZITEMID` | VARCHAR | アイテムID | `"B01FU3MY2S"` |
| `ZRAWITEMCOLLECTIONTYPE` | VARCHAR | アイテムコレクションタイプ | `"series"` |

**重要フィールド**:
- `ZBOOK`: `ZBOOK.Z_PK`への外部キー
- `ZPARENTCONTAINER`: `ZGROUP.Z_PK`への外部キー
- `ZPOSITION`: シリーズ内の順序（0始まり）
- `ZPOSITIONLABEL`: ユーザーに表示する位置（"1"始まり）

### ZBOOK（書籍テーブル）

書籍情報を格納するメインテーブル。シリーズ関連では以下のフィールドを持ちます。

| フィールド | 型 | 説明 | 例 |
|-----------|----|----|-----|
| `Z_PK` | INTEGER | プライマリキー | `2940` |
| `ZGROUPID` | VARCHAR | グループID | `"B01FU3MY2S"` |
| `ZDISPLAYTITLE` | VARCHAR | タイトル | `"ワンパンマン 1"` |

**注意**: `ZGROUPID`フィールドはありますが、実際のシリーズ情報取得には`ZGROUPITEM`を経由する必要があります。

## リレーション構造

### テーブル間の関係

```
ZBOOK (Z_PK)
  ↓
  ← ZGROUPITEM.ZBOOK (外部キー)
  ↓
ZGROUPITEM (ZPOSITION, ZPOSITIONLABEL)
  ↓
ZGROUPITEM.ZPARENTCONTAINER → ZGROUP.Z_PK (外部キー)
  ↓
ZGROUP (ZDISPLAYNAME)
```

### 関係の特徴

1. **1対多の関係**:
   - 1つのシリーズ（ZGROUP）は複数の書籍（ZBOOK）を持つ
   - 1つの書籍は1つのシリーズにのみ属する（または属さない）

2. **中間テーブルの役割**:
   - `ZGROUPITEM`が書籍とシリーズを紐付け
   - シリーズ内の位置情報も保持

3. **NULL値の意味**:
   - シリーズ情報が未設定の書籍は、LEFT JOINの結果として`NULL`となる
   - 注意: 実際にはシリーズ作品でもデータベースに登録されていない場合がある

## シリーズ情報の取得SQL

### 基本クエリ

```sql
SELECT
  ZBOOK.Z_PK,
  ZBOOK.ZDISPLAYTITLE,
  ZGROUP.ZDISPLAYNAME as series_name,
  ZGROUPITEM.ZPOSITION as series_position,
  ZGROUPITEM.ZPOSITIONLABEL as series_position_label
FROM ZBOOK
LEFT JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
LEFT JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK
ORDER BY ZBOOK.ZSORTTITLE ASC;
```

### クエリの説明

1. **LEFT JOINの理由**:
   - シリーズに属さない書籍も取得するため
   - `INNER JOIN`だとシリーズに属する書籍のみになる

2. **結合条件**:
   - `ZBOOK.Z_PK = ZGROUPITEM.ZBOOK`: 書籍と中間テーブルを紐付け
   - `ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK`: 中間テーブルとシリーズマスタを紐付け

3. **取得フィールド**:
   - `series_name`: シリーズ名（`ZGROUP.ZDISPLAYNAME`）
   - `series_position`: シリーズ内位置（0始まり、`ZGROUPITEM.ZPOSITION`）
   - `series_position_label`: 位置ラベル（"1"始まり、`ZGROUPITEM.ZPOSITIONLABEL`）

### 全フィールドを含むクエリ

```sql
SELECT
  ZBOOK.*,
  ZGROUP.ZDISPLAYNAME as series_name,
  ZGROUPITEM.ZPOSITION as series_position,
  ZGROUPITEM.ZPOSITIONLABEL as series_position_label
FROM ZBOOK
LEFT JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
LEFT JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK
ORDER BY ZBOOK.ZSORTTITLE ASC;
```

### シリーズのみを取得するクエリ

```sql
SELECT
  ZBOOK.ZDISPLAYTITLE,
  ZGROUP.ZDISPLAYNAME as series_name,
  ZGROUPITEM.ZPOSITIONLABEL as series_position_label
FROM ZBOOK
INNER JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
INNER JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK
WHERE ZGROUP.ZDISPLAYNAME IS NOT NULL
ORDER BY ZGROUP.ZDISPLAYNAME, ZGROUPITEM.ZPOSITION;
```

## フィールド詳細

### series_name（ZGROUP.ZDISPLAYNAME）

- **型**: VARCHAR
- **説明**: シリーズの表示名
- **例**: `"ワンパンマン"`, `"LIAR GAME"`, `"明日の敵と今日の握手を【電子単行本】"`
- **NULL値**: シリーズに属さない書籍の場合

### series_position（ZGROUPITEM.ZPOSITION）

- **型**: INTEGER
- **説明**: シリーズ内の位置（0始まり）
- **値**: `0`, `1`, `14`, `33`
- **用途**: プログラムでのソート処理
- **NULL値**: シリーズに属さない書籍の場合

### series_position_label（ZGROUPITEM.ZPOSITIONLABEL）

- **型**: VARCHAR
- **説明**: ユーザー表示用の位置ラベル
- **値**: `"1"`, `"15"`, `"34"`
- **特徴**: `series_position + 1`の文字列表現（多くの場合）
- **用途**: ユーザーへの表示
- **NULL値**: シリーズに属さない書籍の場合

### 位置とラベルの関係

| series_position | series_position_label | 意味 |
|----------------|---------------------|------|
| `0` | `"1"` | シリーズ第1巻 |
| `14` | `"15"` | シリーズ第15巻 |
| `33` | `"34"` | シリーズ第34巻 |
| `NULL` | `NULL` | シリーズなし |

## 実例

### ワンパンマンシリーズ

```sql
SELECT
  ZBOOK.ZDISPLAYTITLE,
  ZGROUP.ZDISPLAYNAME as series_name,
  ZGROUPITEM.ZPOSITION,
  ZGROUPITEM.ZPOSITIONLABEL
FROM ZBOOK
INNER JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
INNER JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK
WHERE ZGROUP.ZDISPLAYNAME = 'ワンパンマン'
ORDER BY ZGROUPITEM.ZPOSITION;
```

**結果例**:
```
タイトル                                    | series_name | ZPOSITION | ZPOSITIONLABEL
-------------------------------------------|-------------|-----------|---------------
ワンパンマン 1 (ジャンプコミックスDIGITAL)  | ワンパンマン | 0         | 1
ワンパンマン 2 (ジャンプコミックスDIGITAL)  | ワンパンマン | 1         | 2
...
ワンパンマン 34 (ジャンプコミックスDIGITAL) | ワンパンマン | 33        | 34
```

### LIAR GAMEシリーズ

```
タイトル                                   | series_name | ZPOSITION | ZPOSITIONLABEL
------------------------------------------|-------------|-----------|---------------
LIAR GAME 9 (ヤングジャンプコミックスDIGITAL)  | LIAR GAME   | 8         | 9
LIAR GAME 10 (ヤングジャンプコミックスDIGITAL) | LIAR GAME   | 9         | 10
LIAR GAME 15 (ヤングジャンプコミックスDIGITAL) | LIAR GAME   | 14        | 15
LIAR GAME 17 (ヤングジャンプコミックスDIGITAL) | LIAR GAME   | 16        | 17
```

### シリーズなしの書籍

```
タイトル                          | series_name | ZPOSITION | ZPOSITIONLABEL
---------------------------------|-------------|-----------|---------------
一九八四年 (ハヤカワepi文庫)      | NULL        | NULL      | NULL
アンチマン　岡田索雲短編集        | NULL        | NULL      | NULL
```

## 関連テーブル

### ZSERIESAUTHOR（シリーズ著者情報）

シリーズの著者情報を格納します（複数著者対応）。

```sql
SELECT
  ZGROUP.ZDISPLAYNAME,
  ZSERIESAUTHOR.ZAUTHORNAME,
  ZSERIESAUTHOR.ZAUTHORPRONUNCIATION
FROM ZGROUP
LEFT JOIN ZSERIESAUTHOR ON ZGROUP.Z_PK = ZSERIESAUTHOR.ZSERIES
WHERE ZGROUP.ZDISPLAYNAME = 'ワンパンマン';
```

### ZSERIESIMAGE（シリーズ画像情報）

シリーズの表紙画像情報を格納します。

```sql
SELECT
  ZGROUP.ZDISPLAYNAME,
  ZSERIESIMAGE.ZIMAGEID,
  ZSERIESIMAGE.ZEXTENSION
FROM ZGROUP
LEFT JOIN ZSERIESIMAGE ON ZGROUP.Z_PK = ZSERIESIMAGE.ZSERIES
WHERE ZGROUP.ZDISPLAYNAME = 'ワンパンマン';
```

## TypeScript実装例

```typescript
import Database from 'better-sqlite3';

type BookWithSeries = {
  Z_PK: number;
  ZDISPLAYTITLE: string;
  series_name: string | null;
  series_position: number | null;
  series_position_label: string | null;
};

function getBooksWithSeries(dbPath: string): BookWithSeries[] {
  const db = new Database(dbPath, { readonly: true });

  const query = `
    SELECT
      ZBOOK.Z_PK,
      ZBOOK.ZDISPLAYTITLE,
      ZGROUP.ZDISPLAYNAME as series_name,
      ZGROUPITEM.ZPOSITION as series_position,
      ZGROUPITEM.ZPOSITIONLABEL as series_position_label
    FROM ZBOOK
    LEFT JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
    LEFT JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK
    ORDER BY ZBOOK.ZSORTTITLE ASC
  `;

  const rows = db.prepare(query).all() as BookWithSeries[];
  db.close();

  return rows;
}

function getSeriesOnly(dbPath: string): BookWithSeries[] {
  const db = new Database(dbPath, { readonly: true });

  const query = `
    SELECT
      ZBOOK.Z_PK,
      ZBOOK.ZDISPLAYTITLE,
      ZGROUP.ZDISPLAYNAME as series_name,
      ZGROUPITEM.ZPOSITION as series_position,
      ZGROUPITEM.ZPOSITIONLABEL as series_position_label
    FROM ZBOOK
    INNER JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
    INNER JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK
    WHERE ZGROUP.ZDISPLAYNAME IS NOT NULL
    ORDER BY ZGROUP.ZDISPLAYNAME, ZGROUPITEM.ZPOSITION
  `;

  const rows = db.prepare(query).all() as BookWithSeries[];
  db.close();

  return rows;
}
```

## 活用例

### シリーズ別の書籍一覧

```typescript
const books = getBooksWithSeries(dbPath);

// シリーズでグループ化
const seriesMap = new Map<string, BookWithSeries[]>();

books.forEach(book => {
  if (book.series_name) {
    if (!seriesMap.has(book.series_name)) {
      seriesMap.set(book.series_name, []);
    }
    seriesMap.get(book.series_name)!.push(book);
  }
});

// シリーズごとに表示
seriesMap.forEach((books, seriesName) => {
  console.log(`\n${seriesName} (${books.length}巻)`);
  books
    .sort((a, b) => (a.series_position || 0) - (b.series_position || 0))
    .forEach(book => {
      console.log(`  ${book.series_position_label}. ${book.ZDISPLAYTITLE}`);
    });
});
```

### 読書進捗の可視化

```typescript
const series = getSeriesOnly(dbPath);

// シリーズごとの既読数を計算
const seriesProgress = new Map<string, { total: number; read: number }>();

series.forEach(book => {
  if (book.series_name) {
    if (!seriesProgress.has(book.series_name)) {
      seriesProgress.set(book.series_name, { total: 0, read: 0 });
    }
    const progress = seriesProgress.get(book.series_name)!;
    progress.total++;
    // ZRAWISUNREAD = 0 の場合は既読
    // （実際のクエリではこの情報も取得する必要あり）
  }
});

// 進捗率を表示
seriesProgress.forEach((progress, seriesName) => {
  const percentage = (progress.read / progress.total * 100).toFixed(1);
  console.log(`${seriesName}: ${progress.read}/${progress.total}巻 (${percentage}%)`);
});
```

### 未読シリーズの検出

```sql
SELECT DISTINCT
  ZGROUP.ZDISPLAYNAME,
  COUNT(*) as total_books,
  SUM(CASE WHEN ZBOOK.ZRAWISUNREAD = 1 THEN 1 ELSE 0 END) as unread_books
FROM ZBOOK
INNER JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
INNER JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK
GROUP BY ZGROUP.ZDISPLAYNAME
HAVING unread_books > 0
ORDER BY unread_books DESC;
```

## 注意点

### NULL値の扱い

- シリーズ情報が未設定の書籍は`series_name`が`NULL`
- `NULL`チェックを忘れずに行う
- TypeScriptでは`string | null`型で扱う
- 注意: 実際にはシリーズ作品でもデータベースに登録されていない場合がある

### 位置とラベルの関係

- 常に`series_position + 1 = series_position_label`の関係が成立すると思われる
- 表示には`series_position_label`を使った方が分かりやすい
