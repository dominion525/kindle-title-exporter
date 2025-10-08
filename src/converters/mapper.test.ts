import { describe, it, expect } from 'vitest';
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
      book_id: 'A:B001-0',
      asin: null,
      title: 'Test Book',
      author: null,
      series_name: null,
      series_number: null,
      publisher: 'Test Publisher',
      publication_date: null,
      purchase_date: null,
      content_tags: null,
      language: 'ja',
      sort_title: 'テストブック',
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

    expect(result[0].series_name).toBe('Test Series');
    expect(result[0].series_number).toBe('1');
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

    expect(result[0].publication_date).toBe('2012-11-19T00:00:00.000Z');
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

    expect(result[0].publication_date).toBe(null);
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
