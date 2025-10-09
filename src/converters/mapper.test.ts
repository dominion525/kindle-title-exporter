import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { mapRows, convertFieldValue } from './mapper';
import type { OutputField } from '../types/index';

describe('mapRows', () => {
  it('基本的なフィールドをマップ', () => {
    const rows = [
      {
        ZBOOKID: 'A:B001-0',
        ZDISPLAYTITLE: 'Test Book',
        ZSORTTITLE: 'テストブック',
        ZRAWPUBLISHER: 'Test Publisher',
        ZLANGUAGE: 'ja',
        ZRAWPUBLICATIONDATE: 0,
        ZSYNCMETADATAATTRIBUTES: null,
        series_name: null,
        series_position_label: null,
      },
    ];

    const result = mapRows(rows);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      bookId: 'A:B001-0',
      asin: null,
      title: 'Test Book',
      author: null,
      seriesName: null,
      seriesNumber: null,
      publisher: 'Test Publisher',
      publicationDate: null,
      purchaseDate: null,
      contentTags: null,
      language: 'ja',
      sortTitle: 'テストブック',
    });
  });

  it('複数行をマップ', () => {
    const rows = [
      { ZBOOKID: 'A:B001-0', ZDISPLAYTITLE: 'Book 1', ZSORTTITLE: null, ZRAWPUBLISHER: null, ZLANGUAGE: null, ZRAWPUBLICATIONDATE: 0, ZSYNCMETADATAATTRIBUTES: null, series_name: null, series_position_label: null },
      { ZBOOKID: 'A:B002-0', ZDISPLAYTITLE: 'Book 2', ZSORTTITLE: null, ZRAWPUBLISHER: null, ZLANGUAGE: null, ZRAWPUBLICATIONDATE: 0, ZSYNCMETADATAATTRIBUTES: null, series_name: null, series_position_label: null },
    ];

    const result = mapRows(rows);

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Book 1');
    expect(result[1].title).toBe('Book 2');
  });

  it('空の配列を処理', () => {
    const result = mapRows([]);
    expect(result).toEqual([]);
  });

  it('シリーズ情報をマップ', () => {
    const rows = [
      {
        ZBOOKID: 'A:B003-0',
        ZDISPLAYTITLE: 'Series Book',
        ZSORTTITLE: null,
        ZRAWPUBLISHER: null,
        ZLANGUAGE: null,
        ZRAWPUBLICATIONDATE: 0,
        ZSYNCMETADATAATTRIBUTES: null,
        series_name: 'Test Series',
        series_position_label: '1',
      },
    ];

    const result = mapRows(rows);

    expect(result[0].seriesName).toBe('Test Series');
    expect(result[0].seriesNumber).toBe('1');
  });

  it('Unixタイムスタンプを変換', () => {
    const rows = [
      {
        ZBOOKID: 'A:B004-0',
        ZDISPLAYTITLE: 'Book with Date',
        ZSORTTITLE: null,
        ZRAWPUBLISHER: null,
        ZLANGUAGE: null,
        ZRAWPUBLICATIONDATE: 1353283200, // 2012-11-19
        ZSYNCMETADATAATTRIBUTES: null,
        series_name: null,
        series_position_label: null,
      },
    ];

    const result = mapRows(rows);

    expect(result[0].publicationDate).toBe('2012-11-19T00:00:00.000Z');
  });

  it('出版日が0の場合はnullに変換', () => {
    const rows = [
      {
        ZBOOKID: 'A:B005-0',
        ZDISPLAYTITLE: 'Dictionary',
        ZSORTTITLE: null,
        ZRAWPUBLISHER: null,
        ZLANGUAGE: null,
        ZRAWPUBLICATIONDATE: 0,
        ZSYNCMETADATAATTRIBUTES: null,
        series_name: null,
        series_position_label: null,
      },
    ];

    const result = mapRows(rows);

    expect(result[0].publicationDate).toBe(null);
  });
});

describe('convertFieldValue', () => {
  it('通常の値はそのまま返す', () => {
    const field: OutputField = { label: 'title', column: 'TITLE' };
    expect(convertFieldValue('Test Book', field)).toBe('Test Book');
    expect(convertFieldValue(123, field)).toBe(123);
  });

  it('plistPath指定時に値がnullならnull', () => {
    const field: OutputField = { label: 'author', column: 'COL', plistPath: 'authors.author' };
    expect(convertFieldValue(null, field)).toBe(null);
    expect(convertFieldValue(undefined, field)).toBe(null);
  });

  it('plistPath指定時に実際のplistデータから値を取得', () => {
    const samplePlistPath = resolve(__dirname, '../../test/fixtures/sample-plist.bin');
    const plistBuffer = readFileSync(samplePlistPath);

    // ASINフィールドを取得
    const asinField: OutputField = { label: 'asin', column: 'COL', plistPath: 'ASIN' };
    expect(convertFieldValue(plistBuffer, asinField)).toBe('B06W9KK63F');

    // 著者フィールドを取得
    const authorField: OutputField = { label: 'author', column: 'COL', plistPath: 'authors.author' };
    expect(convertFieldValue(plistBuffer, authorField)).toBe('Prabhat Prakashan');

    // 存在しないフィールドはnullを返す
    const nonExistentField: OutputField = { label: 'test', column: 'COL', plistPath: 'non.existent.field' };
    expect(convertFieldValue(plistBuffer, nonExistentField)).toBe(null);
  });

  it('plistPath指定時にfalsyな値（0, false, 空文字）ならnull', () => {
    const field: OutputField = { label: 'author', column: 'COL', plistPath: 'authors.author' };
    expect(convertFieldValue(0, field)).toBe(null);
    expect(convertFieldValue(false, field)).toBe(null);
    expect(convertFieldValue('', field)).toBe(null);
  });

  it('unix-timestamp型で値が0ならnull', () => {
    const field: OutputField = { label: 'date', column: 'DATE', type: 'unix-timestamp' };
    expect(convertFieldValue(0, field)).toBe(null);
  });

  it('unix-timestamp型で値があればISO8601形式に変換', () => {
    const field: OutputField = { label: 'date', column: 'DATE', type: 'unix-timestamp' };
    expect(convertFieldValue(1353283200, field)).toBe('2012-11-19T00:00:00.000Z');
  });

  it('unix-timestamp型で値が数値以外なら変換しない', () => {
    const field: OutputField = { label: 'date', column: 'DATE', type: 'unix-timestamp' };
    expect(convertFieldValue('not a number', field)).toBe('not a number');
    expect(convertFieldValue(null, field)).toBe(null);
  });
});
