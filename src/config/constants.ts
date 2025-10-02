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

export const TARGET_TABLE_NAME = 'ZBOOK';

export const BASIC_FIELDS: OutputField[] = [
  { column: 'ZDISPLAYTITLE', label: 'title' },
  { column: 'ZBOOKID', label: 'asin' },
  { column: 'ZCONTENTTAGS', label: 'categories' },
  { column: 'ZRAWPUBLISHER', label: 'publisher' },
  { column: 'ZSYNCMETADATAATTRIBUTES', label: 'author', plistPath: 'authors.author' },
  { column: 'ZSYNCMETADATAATTRIBUTES', label: 'purchase_date', plistPath: 'purchase_date' },
  { column: 'series_name', label: 'series_name' },
  { column: 'series_position_label', label: 'series_position' },
];

export const VERBOSE_FIELDS: OutputField[] = [
  ...BASIC_FIELDS,
  { column: 'ZSYNCMETADATAATTRIBUTES', label: 'plist_publisher', plistPath: 'publishers.publisher' },
  { column: 'ZSYNCMETADATAATTRIBUTES', label: 'plist_title', plistPath: 'title' },
  { column: 'ZSYNCMETADATAATTRIBUTES', label: 'content_type', plistPath: 'content_type' },
];
