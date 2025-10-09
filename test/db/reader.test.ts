import { describe, it, expect } from 'vitest';
import { readTableData } from '../../src/db/reader';
import { resolve } from 'path';

const TEST_DB_PATH = resolve(__dirname, '../fixtures/test-db.sqlite');
const EMPTY_DB_PATH = resolve(__dirname, '../fixtures/empty-db.sqlite');
const INVALID_DB_PATH = resolve(__dirname, '../fixtures/non-existent.sqlite');

describe('readTableData', () => {
  it('テストDBから3件のレコードを取得できる', () => {
    const result = readTableData(TEST_DB_PATH);
    expect(result.rows).toHaveLength(3);
  });

  it('columns配列に必須フィールドが含まれる', () => {
    const result = readTableData(TEST_DB_PATH);
    expect(result.columns).toContain('Z_PK');
    expect(result.columns).toContain('ZBOOKID');
    expect(result.columns).toContain('ZDISPLAYTITLE');
    expect(result.columns).toContain('ZRAWPUBLISHER');
    expect(result.columns).toContain('series_name');
    expect(result.columns).toContain('series_position');
    expect(result.columns).toContain('series_position_label');
  });

  it('シリーズ情報がLEFT JOINで正しく結合される', () => {
    const result = readTableData(TEST_DB_PATH);

    // Z_PK=1: シリーズなし（series_nameがnull）
    const book1 = result.rows.find(row => row.Z_PK === 1);
    expect(book1).toBeDefined();
    expect(book1?.series_name).toBeNull();
    expect(book1?.series_position).toBeNull();
    expect(book1?.series_position_label).toBeNull();

    // Z_PK=2: シリーズあり（"Test Series" 第1巻）
    const book2 = result.rows.find(row => row.Z_PK === 2);
    expect(book2).toBeDefined();
    expect(book2?.series_name).toBe('Test Series');
    expect(book2?.series_position).toBe(0);
    expect(book2?.series_position_label).toBe('1');

    // Z_PK=3: シリーズあり（"Test Series" 第2巻）
    const book3 = result.rows.find(row => row.Z_PK === 3);
    expect(book3).toBeDefined();
    expect(book3?.series_name).toBe('Test Series');
    expect(book3?.series_position).toBe(1);
    expect(book3?.series_position_label).toBe('2');
  });

  it('ZSORTTITLEの昇順でソートされる', () => {
    const result = readTableData(TEST_DB_PATH);
    const titles = result.rows.map(row => row.ZSORTTITLE);

    // "TEST BOOK", "テストシリーズ", "テストシリーズ" の順
    expect(titles[0]).toBe('TEST BOOK');
    expect(titles[1]).toBe('テストシリーズ');
    expect(titles[2]).toBe('テストシリーズ');
  });

  it('各行にZBOOKの全フィールドが含まれる', () => {
    const result = readTableData(TEST_DB_PATH);
    const book1 = result.rows[0];

    expect(book1).toHaveProperty('Z_PK');
    expect(book1).toHaveProperty('Z_ENT');
    expect(book1).toHaveProperty('Z_OPT');
    expect(book1).toHaveProperty('ZBOOKID');
    expect(book1).toHaveProperty('ZDISPLAYTITLE');
    expect(book1).toHaveProperty('ZRAWPUBLISHER');
    expect(book1).toHaveProperty('ZRAWPUBLICATIONDATE');
    expect(book1).toHaveProperty('ZLANGUAGE');
    expect(book1).toHaveProperty('ZSORTTITLE');
    expect(book1).toHaveProperty('ZSYNCMETADATAATTRIBUTES');
  });

  it('存在しないDBパスを渡すとエラーが投げられる', () => {
    expect(() => {
      readTableData(INVALID_DB_PATH);
    }).toThrow();
  });

  it('空のDBの場合、columnsは空配列を返す', () => {
    const result = readTableData(EMPTY_DB_PATH);
    expect(result.rows).toHaveLength(0);
    expect(result.columns).toEqual([]);
  });
});
