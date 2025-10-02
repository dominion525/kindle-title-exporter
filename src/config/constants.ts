import path from 'node:path';
import type { OutputField } from '../types/index';

export const DEFAULT_DB_PATH = (() => {
  const home = process.env.HOME;
  if (home) {
    return path.join(
      home,
      'Library',
      'Containers',
      'com.amazon.Lassen',
      'Data',
      'Library',
      'Protected',
      'BookData.sqlite'
    );
  }
  return 'BookData.sqlite';
})();

export const OUTPUT_FIELDS: OutputField[] = [
  // 識別情報
  { label: 'book_id', column: 'ZBOOKID' }, // 書籍ID (例: A:B009DEMC8W-0)
  { label: 'asin', column: 'ZSYNCMETADATAATTRIBUTES', plistPath: 'ASIN' }, // 純粋なASIN (例: B009DEMC8W)
  // コンテンツ情報
  { label: 'display_title', column: 'ZDISPLAYTITLE' }, // 表示用タイトル
  { label: 'author', column: 'ZSYNCMETADATAATTRIBUTES', plistPath: 'authors.author' }, // 著者名
  { label: 'series_name', column: 'series_name' }, // シリーズ名
  { label: 'series_position', column: 'series_position_label' }, // シリーズ内順序
  // 出版情報
  { label: 'publisher', column: 'ZRAWPUBLISHER' }, // 出版社名
  { label: 'publication_date', column: 'ZRAWPUBLICATIONDATE', type: 'unix-timestamp' }, // 出版日
  // メタ情報
  { label: 'purchase_date', column: 'ZSYNCMETADATAATTRIBUTES', plistPath: 'purchase_date' }, // 購入日時
  { label: 'content_tags', column: 'ZSYNCMETADATAATTRIBUTES', plistPath: 'content_tags.tag' }, // コンテンツタグ配列 (例: ["DICT", "FREE_DICT"])
  { label: 'language', column: 'ZLANGUAGE' }, // 言語コード (例: ja, en, Unknown)
  { label: 'sort_title', column: 'ZSORTTITLE' }, // ソート用タイトル (カタカナ表記など)
];
