import { describe, it, expect } from 'vitest';
import { selectFields } from './projection';
import type { OutputField } from '../types/index';

describe('selectFields', () => {
  const fields: OutputField[] = [
    { column: 'TITLE', label: 'title' },
    { column: 'AUTHOR', label: 'author' },
    { column: 'PUBLISHER', label: 'publisher' }
  ];

  it('利用可能なフィールドを選択', () => {
    const available = ['TITLE', 'AUTHOR', 'PUBLISHER', 'OTHER'];
    const result = selectFields(available, fields);
    expect(result).toEqual(fields);
  });

  it('利用可能でないフィールドを除外', () => {
    const available = ['TITLE'];
    const result = selectFields(available, fields);
    expect(result).toEqual([{ column: 'TITLE', label: 'title' }]);
  });

  it('必要なカラムが1つも見つからない場合エラー', () => {
    const available = ['UNKNOWN'];
    expect(() => {
      selectFields(available, fields);
    }).toThrow('ZBOOK テーブルに必要な列が見つかりません');
  });
});
