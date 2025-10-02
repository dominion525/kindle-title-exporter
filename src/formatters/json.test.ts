import { describe, it, expect } from 'vitest';
import { rowsToJson } from './json';

describe('rowsToJson', () => {
  it('空の配列をJSON形式に変換', () => {
    const result = rowsToJson([]);
    expect(result).toBe('[]\n');
  });

  it('基本的なデータをJSON形式に変換', () => {
    const rows = [
      { title: 'Book 1', author: 'Author A' },
      { title: 'Book 2', author: 'Author B' }
    ];
    const result = rowsToJson(rows);
    const parsed = JSON.parse(result);
    expect(parsed).toEqual(rows);
  });

  it('インデント付きでフォーマット', () => {
    const rows = [{ title: 'Book 1' }];
    const result = rowsToJson(rows);
    expect(result).toContain('  ');
    expect(result.endsWith('\n')).toBe(true);
  });

  it('nullとundefinedを保持', () => {
    const rows = [
      { title: 'Book 1', author: null, publisher: undefined }
    ];
    const result = rowsToJson(rows);
    const parsed = JSON.parse(result);
    expect(parsed[0].author).toBeNull();
    expect(parsed[0].publisher).toBeUndefined();
  });
});
