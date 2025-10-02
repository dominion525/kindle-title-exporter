import { describe, it, expect } from 'vitest';
import { rowsToCsv } from './csv';
import type { TableDump } from '../types/index';

describe('rowsToCsv', () => {
  it('空の行配列でヘッダーのみ返す', () => {
    const dump: TableDump = {
      columns: ['title', 'author'],
      rows: []
    };
    const result = rowsToCsv(dump);
    expect(result).toBe('"title","author"\n');
  });

  it('基本的なデータをCSV形式に変換', () => {
    const dump: TableDump = {
      columns: ['title', 'author'],
      rows: [
        { title: 'Book 1', author: 'Author A' },
        { title: 'Book 2', author: 'Author B' }
      ]
    };
    const result = rowsToCsv(dump);
    expect(result).toBe('"title","author"\n"Book 1","Author A"\n"Book 2","Author B"\n');
  });

  it('ダブルクォートをエスケープ', () => {
    const dump: TableDump = {
      columns: ['title'],
      rows: [{ title: 'Book with "quotes"' }]
    };
    const result = rowsToCsv(dump);
    expect(result).toBe('"title"\n"Book with ""quotes"""\n');
  });

  it('nullとundefinedを空文字列に変換', () => {
    const dump: TableDump = {
      columns: ['title', 'author'],
      rows: [
        { title: 'Book 1', author: null },
        { title: 'Book 2', author: undefined }
      ]
    };
    const result = rowsToCsv(dump);
    expect(result).toBe('"title","author"\n"Book 1",\n"Book 2",\n');
  });

  it('配列をカンマ区切りで結合', () => {
    const dump: TableDump = {
      columns: ['authors'],
      rows: [{ authors: ['Author A', 'Author B', 'Author C'] }]
    };
    const result = rowsToCsv(dump);
    expect(result).toBe('"authors"\n"Author A, Author B, Author C"\n');
  });

  it('数値と真偽値を文字列に変換', () => {
    const dump: TableDump = {
      columns: ['count', 'available'],
      rows: [{ count: 42, available: true }]
    };
    const result = rowsToCsv(dump);
    expect(result).toBe('"count","available"\n42,true\n');
  });

  it('日付をISO形式に変換', () => {
    const dump: TableDump = {
      columns: ['date'],
      rows: [{ date: new Date('2024-01-01T00:00:00Z') }]
    };
    const result = rowsToCsv(dump);
    expect(result).toBe('"date"\n2024-01-01T00:00:00.000Z\n');
  });
});
