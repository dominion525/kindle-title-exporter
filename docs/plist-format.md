# ZSYNCMETADATAATTRIBUTES（plist）詳細リファレンス

## このドキュメントについて

ZBOOKテーブルの`ZSYNCMETADATAATTRIBUTES`フィールドに格納されているplist（Property List）形式のデータについて詳細に説明します。

## plistとは

- **フルネーム**: Property List（プロパティリスト）
- **形式**: NSKeyedArchiver形式のバイナリプロパティリスト
- **プラットフォーム**: macOS/iOSで一般的なデータシリアライゼーション形式
- **用途**: 書籍のメタデータを構造化して格納
- **サイズ**: 通常1,000-2,000 bytes程度

## なぜplistが重要か

以下の情報は**plistからしか取得できません**：

1. **著者名**（人間が読める形式）⭐
   - ZBOOKの`ZDISPLAYAUTHOR`はハッシュ値/ID
   - plistの`authors.author`が実際の著者名
2. **購入日時**（ISO 8601形式）⭐
   - ZBOOKには購入日フィールドがない
3. **純粋なASIN**（プレフィックスなし）
   - ZBOOKの`ZBOOKID`は"A:B009DEMC8W-0"
   - plistの`ASIN`は"B009DEMC8W"

## plistの構造

### NSKeyedArchiveの階層

バイナリplistは以下の階層構造を持ちます：

```
{
  "$version": 100000,
  "$archiver": "NSKeyedArchiver",
  "$top": {
    "root": {
      "UID": 1
    }
  },
  "$objects": [
    "$null",
    {書籍メタデータのルートオブジェクト},
    {属性辞書},
    ...
  ]
}
```

### UID参照の仕組み

- `$objects`配列にすべてのオブジェクトが格納
- 各オブジェクトは`{"UID": n}`形式で他のオブジェクトを参照
- 再帰的に辿ることで完全なデータ構造を復元

### 辞書と配列の表現

**辞書（NSDictionary）**:
```json
{
  "NS.keys": [{"UID": 3}, {"UID": 4}],
  "NS.objects": [{"UID": 5}, {"UID": 6}],
  "$class": {"UID": 7}
}
```

**配列（NSArray）**:
```json
{
  "NS.objects": [{"UID": 8}, {"UID": 9}],
  "$class": {"UID": 10}
}
```

## 含まれる情報の完全リスト

### 基本情報

| フィールド | 型 | 説明 | 例 | ZBOOKとの関係 |
|-----------|----|----|-----|-------------|
| `ASIN` | 文字列 | 純粋なASIN | `"B009DEMC8W"` | `ZBOOKID`から抽出可能だがプレフィックス付き |
| `title` | 文字列 | タイトル | `"一九八四年 (ハヤカワepi文庫)"` | `ZDISPLAYTITLE`と完全一致 |
| `authors.author` | 文字列/配列 | 著者 | `["ONE", "村田雄介"]` | ⭐plistのみ、`ZDISPLAYAUTHOR`はハッシュ値 |
| `publishers.publisher` | 文字列 | 出版社 | `"早川書房"` | `ZRAWPUBLISHER`と完全一致 |
| `purchase_date` | 文字列 | 購入日時 | `"2018-09-24T04:45:07+0000"` | ⭐plistのみ |

### コンテンツ情報

| フィールド | 型 | 説明 | 例 | ZBOOKとの関係 |
|-----------|----|----|-----|-------------|
| `content_type` | 文字列 | MIMEタイプ | `"application/x-mobipocket-ebook"` | `ZMIMETYPE`と同じ |
| `content_tags.tag` | 配列 | コンテンツタグ | `["DICT", "FREE_DICT"]` | `ZCONTENTTAGS`は";DICT;FREE_DICT"形式 |
| `cde_contenttype` | 文字列 | CDEコンテンツタイプ | `"EBOK"` | plistのみ |
| `content_size` | 文字列 | ファイルサイズ | `"18755584"` | `ZRAWFILESIZE`は数値 |
| `target_language` | 文字列 | 対象言語 | `"en"`, `"ja"` | `ZLANGUAGE`と類似 |

### 入手元情報

| フィールド | 型 | 説明 | 例 |
|-----------|----|----|-----|
| `origins.origin.type` | 文字列 | 入手元タイプ | `"KindleDictionary"`, `"Purchase"` |
| `origins.origin.id` | 文字列 | 入手元ID | `"Freebie"`, ASIN |

### その他の情報

| フィールド | 型 | 説明 | 例 |
|-----------|----|----|-----|
| `short_item_name` | 文字列 | 短縮名 | `"Hindi-English"` |
| `accessibility_description` | 文字列 | アクセシビリティ説明 | `"Hindi to English"` |
| `bisac_subject_description_code.code` | 文字列/配列 | BISAC分類コード | `["BUS000000", "BUS010000"]` |
| `default_dict_for_locales` | 文字列 | 辞書のデフォルトロケール | `"hi_IN"`, `"es_ES, es_MX"` |

## ZBOOKフィールドとの比較

### plistのみに存在する情報

1. **著者名（文字列形式）**
   - plist: `authors.author` → `"ジョージ・オーウェル"` または `["ONE", "村田雄介"]`
   - ZBOOK: `ZDISPLAYAUTHOR` → ハッシュ値（`6946abd8...`）

2. **購入日時**
   - plist: `purchase_date` → `"2018-09-24T04:45:07+0000"`
   - ZBOOK: 該当フィールドなし

3. **純粋なASIN**
   - plist: `ASIN` → `"B009DEMC8W"`
   - ZBOOK: `ZBOOKID` → `"A:B009DEMC8W-0"`（プレフィックス・サフィックス付き）

### 完全一致する情報

1. **タイトル**
   - plist: `title` → `"一九八四年 (ハヤカワepi文庫)"`
   - ZBOOK: `ZDISPLAYTITLE` → `"一九八四年 (ハヤカワepi文庫)"`
   - **差異**: 0件/3,833件（100%一致）

2. **出版社**
   - plist: `publishers.publisher` → `"早川書房"`
   - ZBOOK: `ZRAWPUBLISHER` → `"早川書房"`
   - **差異**: 0件/3,833件（100%一致）

### 形式が異なる情報

1. **コンテンツタグ**
   - plist: `content_tags.tag` → `["DICT", "FREE_DICT"]`（配列）
   - ZBOOK: `ZCONTENTTAGS` → `";DICT;FREE_DICT"`（セミコロン区切り文字列）
   - **先頭のセミコロンの有無**が異なる

2. **ファイルサイズ**
   - plist: `content_size` → `"18755584"`（文字列）
   - ZBOOK: `ZRAWFILESIZE` → `18755584`（整数）

## 著者情報の詳細

### ZDISPLAYAUTHORとの違い

**ZDISPLAYAUTHOR（BLOB）**:
- ハッシュ値またはID
- サイズ: 16-48 bytes
- 例: `6946abd8db4a0ba12ca67a5ded9830876eae4caa1b46c47e044bdd79535aef0b`
- **人間が読めない**

**plist authors.author**:
- 実際の著者名
- 文字列または配列
- 例: `"ジョージ・オーウェル"` または `["ONE", "村田雄介"]`
- **人間が読める**

### 単一著者の場合

**データ型**: 文字列

**例**:
```json
{
  "authors": {
    "author": "ジョージ・オーウェル"
  }
}
```

**実例**:
- 一九八四年: `"ジョージ・オーウェル"`
- LIAR GAME 15: `"甲斐谷忍"`
- 路傍のフジイ（５）: `"鍋倉夫"`

### 複数著者の場合

**データ型**: 配列

**例**:
```json
{
  "authors": {
    "author": ["ONE", "村田雄介"]
  }
}
```

**実例**:
- ワンパンマン 34: `["ONE", "村田雄介"]`
- 株式会社マジルミエ 18: `["岩田雪花", "青木 裕"]`
- ケーキの切れない非行少年たち 11巻: `["宮口幸治", "鈴木マサカズ"]`
- 明日の敵と今日の握手を 7: `["フクダイクミ", "カルロ・ゼン"]`
- 怪談和尚 妖異の声: `["三木大雲", "森野達弥"]`

### 統計

- サンプル30件中、複数著者: 7件（約23%）
- 著者情報あり: 3,832件/3,833件（99.9%）

## デコード方法

### 必要なライブラリ

```bash
npm install bplist-parser
```

### TypeScript実装例

```typescript
import bplistParser from 'bplist-parser';

function decodeNSKeyedArchive(parsed: unknown[]): Record<string, unknown> | null {
  if (!parsed || !parsed[0] || typeof parsed[0] !== 'object') {
    return null;
  }

  const firstObj = parsed[0] as Record<string, unknown>;
  const objects = firstObj.$objects as unknown[];
  const top = firstObj.$top as Record<string, unknown> | undefined;
  const root = top?.root as Record<string, unknown> | undefined;

  if (!root || typeof root.UID !== 'number' || !objects) {
    return null;
  }

  function decodeObject(obj: unknown, visited = new Set<number>()): unknown {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const objRecord = obj as Record<string, unknown>;

    // UID参照の解決
    if ('UID' in objRecord) {
      const uid = objRecord.UID as number;
      if (visited.has(uid)) {
        return null; // 循環参照回避
      }
      visited.add(uid);
      return decodeObject(objects[uid], visited);
    }

    // 配列の場合
    if ('NS.objects' in objRecord && !('NS.keys' in objRecord)) {
      const items = objRecord['NS.objects'] as unknown[];
      return items.map(item => decodeObject(item, new Set()));
    }

    // 辞書の場合
    if ('NS.keys' in objRecord && 'NS.objects' in objRecord) {
      const result: Record<string, unknown> = {};
      const keys = objRecord['NS.keys'] as unknown[];
      const values = objRecord['NS.objects'] as unknown[];

      for (let i = 0; i < keys.length; i++) {
        const key = decodeObject(keys[i], new Set());
        const value = decodeObject(values[i], new Set());
        if (typeof key === 'string') {
          result[key] = value;
        }
      }
      return result;
    }

    return obj;
  }

  const rootObj = objects[root.UID] as Record<string, unknown>;
  if (rootObj && rootObj.attributes) {
    return decodeObject(rootObj.attributes, new Set()) as Record<string, unknown> | null;
  }

  return null;
}

function decodePlistField(buffer: Buffer | null): Record<string, unknown> | null {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return null;
  }

  try {
    const parsed = bplistParser.parseBuffer(buffer) as unknown[];
    return decodeNSKeyedArchive(parsed);
  } catch {
    return null;
  }
}
```

### 使用例

```typescript
import Database from 'better-sqlite3';

const db = new Database('BookData.sqlite', { readonly: true });
const row = db.prepare('SELECT ZSYNCMETADATAATTRIBUTES FROM ZBOOK WHERE Z_PK = ?').get(1);

const plist = decodePlistField(row.ZSYNCMETADATAATTRIBUTES as Buffer);

console.log(plist?.title);              // "一九八四年 (ハヤカワepi文庫)"
console.log(plist?.authors?.author);    // ["ジョージ・オーウェル", "高橋 和久"]
console.log(plist?.purchase_date);      // "2018-09-24T04:45:07+0000"
console.log(plist?.ASIN);               // "B009DEMC8W"
```

## 実データ例

### 例1: 単一著者（一九八四年）

```json
{
  "ASIN": "B009DEMC8W",
  "title": "一九八四年 (ハヤカワepi文庫)",
  "authors": {
    "author": "ジョージ・オーウェル"
  },
  "publishers": {
    "publisher": "早川書房"
  },
  "purchase_date": "2018-09-24T04:45:07+0000",
  "content_type": "application/x-mobipocket-ebook",
  "content_size": "2746368"
}
```

### 例2: 複数著者（ワンパンマン 34）

```json
{
  "ASIN": "B0FGBZ6BLM",
  "title": "ワンパンマン 34 (ジャンプコミックスDIGITAL)",
  "authors": {
    "author": ["ONE", "村田雄介"]
  },
  "publishers": {
    "publisher": "集英社"
  },
  "purchase_date": "2025-09-03T15:04:26+0000",
  "content_type": "application/x-mobipocket-ebook",
  "content_tags": {
    "tag": ["MANGA"]
  },
  "content_size": "15350784"
}
```

### 例3: 辞書（Prabhat Advanced Hindi English Dictionary）

```json
{
  "ASIN": "B06W9KK63F",
  "title": "Prabhat Advanced Hindi English Dictionary (Hindi Edition)",
  "authors": {
    "author": "Prabhat Prakashan"
  },
  "publishers": {
    "publisher": "Amazon Dictionaries"
  },
  "purchase_date": "2017-12-08T17:56:30+0000",
  "target_language": "en",
  "content_tags": {
    "tag": ["DICT", "FREE_DICT"]
  },
  "origins": {
    "origin": {
      "type": "KindleDictionary",
      "id": "Freebie"
    }
  },
  "content_type": "application/x-mobipocket-ebook",
  "short_item_name": "Hindi-English",
  "accessibility_description": "Hindi to English",
  "bisac_subject_description_code": {
    "code": ["BUS000000", "BUS010000"]
  },
  "content_size": "18755584",
  "default_dict_for_locales": "hi_IN"
}
```

## 注意点

### エラー処理

- バイナリplistが破損している場合がある
- デコード失敗時は`null`を返す
- 必ずtry-catchで囲む

### パフォーマンス

- plistのデコードは比較的重い処理
- 大量のレコードを処理する場合はキャッシュを活用
- 同じplistを複数回デコードしない

### 著者の扱い

- `authors.author`は文字列**または**配列
- 必ず型チェックを行う
- 配列の場合でも1要素の可能性がある

```typescript
const author = plist?.authors?.author;
const authorArray = Array.isArray(author) ? author : [author];
```
