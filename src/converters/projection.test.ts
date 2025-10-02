import { describe, it, expect } from 'vitest';
import { selectFields } from './projection';
import type { OutputField } from '../types/index';

describe('selectFields', () => {
  const basicFields: OutputField[] = [
    { column: 'TITLE', label: 'title' },
    { column: 'AUTHOR', label: 'author' }
  ];

  const verboseFields: OutputField[] = [
    ...basicFields,
    { column: 'PUBLISHER', label: 'publisher' },
    { column: 'DATE', label: 'date' }
  ];

  it('基本モードで利用可能なフィールドを選択', () => {
    const available = ['TITLE', 'AUTHOR', 'OTHER'];
    const result = selectFields(false, available, basicFields, verboseFields);
    expect(result).toEqual(basicFields);
  });

  it('詳細モードで利用可能なフィールドを選択', () => {
    const available = ['TITLE', 'AUTHOR', 'PUBLISHER', 'DATE'];
    const result = selectFields(true, available, basicFields, verboseFields);
    expect(result).toEqual(verboseFields);
  });

  it('利用可能でないフィールドを除外', () => {
    const available = ['TITLE'];
    const result = selectFields(false, available, basicFields, verboseFields);
    expect(result).toEqual([{ column: 'TITLE', label: 'title' }]);
  });

  it('必要なカラムが1つも見つからない場合エラー', () => {
    const available = ['UNKNOWN'];
    expect(() => {
      selectFields(false, available, basicFields, verboseFields);
    }).toThrow('ZBOOK テーブルに必要な列が見つかりません');
  });
});
