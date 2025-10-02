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
  { label: 'title', column: 'ZDISPLAYTITLE' },
  { label: 'asin', column: 'ZBOOKID' },
  { label: 'categories', column: 'ZCONTENTTAGS' },
  { label: 'publisher', column: 'ZRAWPUBLISHER' },
  { label: 'author', column: 'ZSYNCMETADATAATTRIBUTES', plistPath: 'authors.author' },
  { label: 'purchase_date', column: 'ZSYNCMETADATAATTRIBUTES', plistPath: 'purchase_date' },
  { label: 'series_name', column: 'series_name' },
  { label: 'series_position', column: 'series_position_label' },
];
