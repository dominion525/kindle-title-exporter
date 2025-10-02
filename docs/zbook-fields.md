# ZBOOKテーブル 全フィールドリファレンス

## このドキュメントについて

ZBOOKテーブルの全67フィールドを詳細に説明します。各フィールドの型、説明、実際のデータ例を含みます。

## フィールド一覧（カテゴリ別）

### システム項目（3フィールド）

#### Z_ENT
- **型**: INTEGER
- **説明**: Core Dataのエンティティタイプ識別子
- **値**: 通常 `2`
- **用途**: システム内部で使用

#### Z_OPT
- **型**: INTEGER
- **説明**: 最適化・バージョン管理用
- **値**: 通常 `1`
- **用途**: 競合検出、楽観的ロック

#### Z_PK
- **型**: INTEGER PRIMARY KEY
- **説明**: プライマリキー
- **値**: 1から始まる連番
- **用途**: レコードの一意識別
- **例**: `2940`

---

### 識別情報（5フィールド）

#### ZBOOKID
- **型**: VARCHAR
- **説明**: Book ID / ASIN（プレフィックス・サフィックス付き）
- **形式**: `"A:{ASIN}-0"`
- **例**: `"A:B009DEMC8W-0"`, `"A:B01FU3MY2S-0"`
- **注**: 純粋なASINはplistの`ASIN`フィールドにあり（`plist-format.md`参照）

#### ZPARENTASIN
- **型**: VARCHAR
- **説明**: 親ASIN（シリーズやバンドルの親書籍）
- **値**: ASINまたは`NULL`
- **例**: `NULL`（多くの書籍）

#### ZPERASINGUID
- **型**: VARCHAR
- **説明**: ASIN別のGUID（グローバル一意識別子）
- **値**: GUIDまたは`NULL`
- **例**: `NULL`（多くの書籍）

#### ZMANIFESTGUID
- **型**: VARCHAR
- **説明**: マニフェストファイルのGUID
- **値**: GUIDまたは`NULL`
- **例**: `NULL`（多くの書籍）

#### ZGROUPID
- **型**: VARCHAR
- **説明**: グループID（シリーズID）
- **値**: シリーズIDまたは`NULL`
- **例**: `NULL`（シリーズに属さない書籍）
- **詳細**: `series-relations.md`参照

---

### 書誌情報（8フィールド）

#### ZDISPLAYTITLE
- **型**: VARCHAR
- **説明**: 表示用タイトル
- **例**: `"一九八四年 (ハヤカワepi文庫)"`
- **注**: plistの`title`と完全一致

#### ZSORTTITLE
- **型**: VARCHAR
- **説明**: ソート用タイトル（カタカナ表記など）
- **例**: `"センキュウヒャクハチジュウヨネン"` (一九八四年のソート用)
- **用途**: 書籍のソート順決定

#### ZALTERNATESORTTITLE
- **型**: VARCHAR
- **説明**: 代替ソートタイトル
- **例**: `"一九八四年"`
- **値**: 多くの場合`ZDISPLAYTITLE`と同じ、または`NULL`

#### ZRAWPUBLISHER
- **型**: VARCHAR
- **説明**: 出版社名
- **例**: `"早川書房"`, `"集英社"`, `"Amazon Dictionaries"`
- **注**: plistの`publishers.publisher`と完全一致

#### ZLANGUAGE
- **型**: VARCHAR
- **説明**: 書籍の言語コード
- **値**: ISO 639言語コードまたは`"Unknown"`
- **例**: `"ja"`, `"en"`, `"Unknown"`

#### ZRAWPUBLICATIONDATE
- **型**: INTEGER
- **説明**: 出版日（Unix タイムスタンプ）
- **形式**: 1970-01-01 00:00:00 UTCからの秒数
- **例**: `1353283200` (2012-11-19)
- **注**: `0`は「データなし」を意味する

#### ZCONTENTTAGS
- **型**: VARCHAR
- **説明**: コンテンツタグ（セミコロン区切り）
- **形式**: `;TAG1;TAG2;TAG3`
- **例**: `";DICT;FREE_DICT"`, `";MANGA"`, `""`（空文字列）

#### ZGROUPID
- **型**: VARCHAR
- **説明**: グループID（シリーズを識別）
- **値**: グループIDまたは`NULL`
- **用途**: `ZGROUP`テーブルとの紐付け
- **詳細**: `series-relations.md`参照

---

### ファイル情報（4フィールド）

#### ZPATH
- **型**: VARCHAR
- **説明**: 書籍ファイルのパス（相対パス）
- **形式**: `Library/eBooks/{ASIN}/{GUID}`
- **例**: `"Library/eBooks/B00P6OA1MC/0889F48F-DE39-46E2-AAF9-FA825EB14..."`

#### ZBUNDLEPATH
- **型**: VARCHAR
- **説明**: バンドルファイルのパス
- **値**: 多くの場合`NULL`
- **例**: `NULL`

#### ZMIMETYPE
- **型**: VARCHAR
- **説明**: ファイルのMIMEタイプ
- **値**: `"application/x-mobipocket-ebook"`, `"application/pdf"`など
- **例**: `"application/x-mobipocket-ebook"`
- **注**: plistの`content_type`と同じ

#### ZRAWFILESIZE
- **型**: INTEGER
- **説明**: ファイルサイズ（バイト単位）
- **例**: `2746368` (約2.6MB)

---

### 読書進捗（5フィールド）

#### ZRAWCURRENTPOSITION
- **型**: INTEGER
- **説明**: 現在の読書位置
- **値**: 位置またはNULL（未読の場合）
- **例**: `NULL`, `0`, `523`

#### ZRAWMAXPOSITION
- **型**: INTEGER
- **説明**: 書籍の最大位置
- **例**: `0`, `1000`, `5280`

#### ZLONGCURRENTPOSITION
- **型**: VARCHAR
- **説明**: 現在位置（長整数として文字列保存）
- **値**: 大きな値の場合に使用、通常`NULL`
- **例**: `NULL`

#### ZLONGMAXPOSITION
- **型**: VARCHAR
- **説明**: 最大位置（長整数として文字列保存）
- **値**: 大きな値の場合に使用、通常`NULL`
- **例**: `NULL`

#### ZRAWMAXLOCATION
- **型**: INTEGER
- **説明**: 最大ロケーション
- **例**: `0`

---

### 状態・フラグ（10フィールド）

#### ZRAWISUNREAD
- **型**: INTEGER
- **説明**: 未読フラグ
- **値**: `1` = 未読, `0` = 既読, `NULL`
- **例**: `1`（未読）

#### ZRAWREADSTATE
- **型**: INTEGER
- **説明**: 読書状態
- **値**: `0`, `1`, `2`など（詳細不明）
- **例**: `0`

#### ZRAWBOOKSTATE
- **型**: INTEGER
- **説明**: 書籍の状態
- **値**: `0`, `1`, `2`など（詳細不明）
- **例**: `0`

#### ZRAWISKEPT
- **型**: INTEGER
- **説明**: 保持フラグ（デバイスに保持するかどうか）
- **値**: `1` = 保持, `NULL` = デフォルト
- **例**: `NULL`

#### ZRAWISHIDDEN
- **型**: INTEGER
- **説明**: 非表示フラグ（システムによる非表示）
- **値**: `1` = 非表示, `0` = 表示
- **例**: `0`

#### ZISHIDDENBYUSER
- **型**: INTEGER
- **説明**: ユーザーによる非表示フラグ
- **値**: `1` = 非表示, `0` = 表示
- **例**: `0`

#### ZRAWISARCHIVABLE
- **型**: INTEGER
- **説明**: アーカイブ可能フラグ
- **値**: `1` = 可能, `0` = 不可
- **例**: `1`

#### ZRAWISDICTIONARY
- **型**: INTEGER
- **説明**: 辞書フラグ
- **値**: `1` = 辞書, `NULL` = 通常書籍
- **例**: `NULL`（通常書籍）, `1`（辞書）

#### ZRAWISMULTIMEDIA
- **型**: INTEGER
- **説明**: マルチメディアフラグ
- **値**: `1` = マルチメディア, `0` = テキスト
- **例**: `0`

#### ZRAWISENCRYPTED
- **型**: INTEGER
- **説明**: 暗号化フラグ
- **値**: `1` = 暗号化, `0` = 非暗号化
- **例**: `0`

---

### 時刻情報（2フィールド）

#### ZRAWLASTACCESSTIME
- **型**: INTEGER
- **説明**: 最終アクセス日時（Core Data形式）
- **形式**: 2001-01-01 00:00:00 UTCからの秒数
- **例**: `1537257205`
- **変換**: Unix timestamp = `1537257205 + 978307200`

#### ZRAWTIMEDURATIONRESTRICTIONENDDATE
- **型**: TIMESTAMP
- **説明**: 時間制限の終了日
- **値**: 多くの場合`NULL`
- **例**: `NULL`

---

### 書籍種別（1フィールド）

#### ZRAWBOOKTYPE
- **型**: INTEGER
- **説明**: 書籍のタイプ
- **値**: `10` = 通常書籍、その他の値は用途不明
- **例**: `10`

---

### その他（3フィールド）

#### ZSHELF
- **型**: VARCHAR
- **説明**: 本棚情報
- **値**: 多くの場合`NULL`
- **例**: `NULL`

#### ZWATERMARK
- **型**: VARCHAR
- **説明**: 透かし情報
- **値**: 多くの場合`NULL`
- **例**: `NULL`

#### ZRAWADS
- **型**: VARCHAR
- **説明**: 広告情報
- **値**: 多くの場合`NULL`
- **例**: `NULL`

---

### 辞書専用項目（5フィールド）

これらのフィールドは`ZRAWISDICTIONARY = 1`の場合のみ使用されます。

#### ZDICTIONARYLOCALEID
- **型**: VARCHAR
- **説明**: 辞書のロケールID
- **例**: `NULL`（通常書籍）, `"hi_IN"`（ヒンディー語辞書）

#### ZDICTIONARYSHORTTITLE
- **型**: VARCHAR
- **説明**: 辞書の短縮タイトル
- **例**: `NULL`（通常書籍）

#### ZDICTIONARYSOURCELANG
- **型**: VARCHAR
- **説明**: 辞書のソース言語
- **例**: `NULL`（通常書籍）

#### ZRAWISTRANSLATIONDICTIONARY
- **型**: INTEGER
- **説明**: 翻訳辞書フラグ
- **値**: `1` = 翻訳辞書, `NULL` = その他
- **例**: `NULL`

#### ZRAWISSMDCREATEDDICTIONARY
- **型**: INTEGER
- **説明**: SMD作成辞書フラグ（詳細不明）
- **値**: `1` = SMD作成, `NULL` = その他
- **例**: `NULL`

---

### コンパニオン関連（2フィールド）

#### ZCOMPANION
- **型**: INTEGER
- **説明**: コンパニオンID（外部キー）
- **値**: 外部キーまたは`NULL`
- **例**: `NULL`

#### ZRAWHASCOMPANION
- **型**: INTEGER
- **説明**: コンパニオン有無フラグ
- **値**: `1` = あり, `NULL` = なし
- **例**: `NULL`

---

### 読書・表示モード（3フィールド）

#### ZRAWREADINGMODE
- **型**: INTEGER
- **説明**: 読書モード
- **値**: `0`, `1`, `2`など（詳細不明）
- **例**: `0`

#### ZRAWLASTVIEW
- **型**: INTEGER
- **説明**: 最終表示モード
- **値**: `0`, `1`, `2`など（詳細不明）
- **例**: `0`

#### ZRAWLASTOPENSUCCEEDED
- **型**: INTEGER
- **説明**: 最終オープン成功フラグ
- **値**: `1` = 成功, `0` = 失敗
- **例**: `1`

---

### アップグレード・検証（2フィールド）

#### ZRAWBOOKUPGRADESNEEDED
- **型**: INTEGER
- **説明**: アップグレード必要フラグ
- **値**: `1` = 必要, `NULL` = 不要
- **例**: `NULL`

#### ZRAWISPENDINGVERIFICATION
- **型**: INTEGER
- **説明**: 検証待ちフラグ
- **値**: `1` = 検証待ち, `0` = 検証済み
- **例**: `0`

---

### 自動整理・分類（3フィールド）

#### ZRAWAUTOSHELVE
- **型**: INTEGER
- **説明**: 自動本棚配置フラグ
- **値**: `1` = 自動配置, `NULL` = 手動
- **例**: `NULL`

#### ZRAWPROGRESSDOTCATEGORY
- **型**: INTEGER
- **説明**: 進捗ドットカテゴリ
- **値**: 数値（用途不明）
- **例**: `32767`

#### ZRAWUSERVISIBLELABELING
- **型**: INTEGER
- **説明**: ユーザー表示ラベリング
- **値**: `0`, `1`など（詳細不明）
- **例**: `0`

---

### 技術的フラグ（5フィールド）

#### ZRAWERL
- **型**: INTEGER
- **説明**: ERL（詳細不明）
- **値**: 通常`-1`
- **例**: `-1`

#### ZRAWHASFIXEDMOPHIGHLIGHTS
- **型**: INTEGER
- **説明**: 固定MOPハイライトフラグ（詳細不明）
- **値**: `1` = あり, `NULL` = なし
- **例**: `NULL`

#### ZRAWINBOOKCOVERCHECKED
- **型**: INTEGER
- **説明**: ブック内カバーチェック済みフラグ
- **値**: `1` = チェック済み, `0` = 未チェック
- **例**: `0`

#### ZRAWNCXINFOSTORED
- **型**: INTEGER
- **説明**: NCX情報格納済みフラグ（ePubのナビゲーション）
- **値**: `1` = 格納済み, `0` = 未格納
- **例**: `0`

#### ZRAWREADSTATEORIGIN
- **型**: INTEGER
- **説明**: 読書状態の起源（同期元など）
- **値**: `0`, `1`, `2`など（詳細不明）
- **例**: `0`

---

### BLOB項目（7フィールド）⭐重要

これらのフィールドはバイナリデータとして保存されており、直接読み取ることができません。

#### ZDISPLAYAUTHOR
- **型**: BLOB
- **説明**: 表示著者のハッシュ値またはID
- **サイズ**: 16-48 bytes
  - 単一著者: 16 bytes
  - 複数著者: 32-48 bytes
- **例**: `6946abd8db4a0ba12ca67a5ded9830876eae4caa1b46c47e044bdd79535aef0b`（16進数）
- **注**: 人間が読める著者名はplistの`authors.author`にあり（`plist-format.md`参照）

#### ZSORTAUTHOR
- **型**: BLOB
- **説明**: ソート用著者情報
- **サイズ**: 16-48 bytes
- **用途**: 著者名によるソート

#### ZALTERNATESORTAUTHOR
- **型**: BLOB
- **説明**: 代替ソート著者情報
- **サイズ**: 16-48 bytes

#### ZEXTENDEDMETADATA
- **型**: BLOB
- **説明**: 拡張メタデータ
- **値**: 多くの場合`NULL`
- **例**: `NULL`

#### ZORIGINS
- **型**: BLOB
- **説明**: 入手元情報
- **サイズ**: 251 bytes程度
- **例**: バイナリデータ

#### ZSYNCMETADATAATTRIBUTES
- **型**: BLOB
- **説明**: 同期メタデータ属性（NSKeyedArchiver形式のplist）⭐最重要
- **サイズ**: 1,000-2,000 bytes程度
- **含まれる情報**:
  - 著者名（文字列または配列）
  - 購入日時（ISO 8601形式）
  - 純粋なASIN
  - 出版社
  - コンテンツタイプ
  - その他多数
- **デコード**: `bplist-parser`が必要
- **詳細**: `plist-format.md`を参照

#### ZRAWTITLEDETAILSJSON
- **型**: BLOB
- **説明**: タイトル詳細のJSON
- **値**: 多くの場合`NULL`
- **例**: `NULL`

---

## 実データ例

### 例1: 通常書籍（一九八四年）

```
Z_PK: 2940
ZBOOKID: A:B00P6OA1MC-0
ZDISPLAYTITLE: 一九八四年
ZSORTTITLE: センキュウヒャクハチジュウヨネン
ZRAWPUBLISHER: オープンシェルフパブリッシング
ZLANGUAGE: Unknown
ZRAWPUBLICATIONDATE: 1414863211
ZMIMETYPE: application/x-mobipocket-ebook
ZRAWFILESIZE: 2746368
ZRAWISUNREAD: 1
ZRAWISDICTIONARY: NULL
ZGROUPID: NULL
```

### 例2: シリーズ書籍（ワンパンマン 34）

```
Z_PK: 1234
ZBOOKID: A:B0FGBZ6BLM-0
ZDISPLAYTITLE: ワンパンマン 34 (ジャンプコミックスDIGITAL)
ZRAWPUBLISHER: 集英社
ZCONTENTTAGS: ;MANGA
ZGROUPID: (シリーズID)
```
シリーズ情報の取得方法は`series-relations.md`を参照。

---

## フィールド使用上の注意点

### タイムスタンプの変換

`ZRAWPUBLICATIONDATE`などのタイムスタンプフィールドは、Unix タイムスタンプ（1970-01-01 00:00:00 UTC からの秒数）形式です。

```javascript
const date = new Date(unixTimestamp * 1000);
```

**注意**: `0`の値は「データなし」を意味するため、`null`として扱うべきです。

### BLOB項目の扱い

BLOB項目は基本的に直接読み取ることができません。ただし、一部のBLOBフィールド（`ZSYNCMETADATAATTRIBUTES`など）はplist形式であることが判明しており、plistデコーダーを使用することで内容を取得できます。

### NULL値の意味

- `NULL`は「未設定」「該当なし」「デフォルト値」を意味します
- 多くのフラグフィールドでは、`NULL`が最も一般的な値です
- シリーズやコレクションに属さない書籍では、関連フィールドが`NULL`になります
