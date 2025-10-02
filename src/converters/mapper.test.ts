import { describe, it, expect } from 'vitest';
import { mapRows, convertFieldValue } from './mapper';
import type { OutputField } from '../types/index';

describe('mapRows', () => {
  it('基本的なフィールドをマップ', () => {
    const rows = [
      {
        ZDISPLAYTITLE: 'Test Book',
        ZBOOKID: 'B001',
        ZCONTENTTAGS: 'Fiction',
        ZRAWPUBLISHER: 'Test Publisher',
        ZRAWPUBLICATIONDATE: 0,
        series_name: null,
        series_position_label: null,
      },
    ];

    const result = mapRows(rows);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      title: 'Test Book',
      asin: 'B001',
      categories: 'Fiction',
      publisher: 'Test Publisher',
      author: null,
      purchase_date: null,
      publication_date: null,
      series_name: null,
      series_position: null,
    });
  });

  it('複数行をマップ', () => {
    const rows = [
      { ZDISPLAYTITLE: 'Book 1', ZBOOKID: 'B001', ZCONTENTTAGS: null, ZRAWPUBLISHER: null, ZRAWPUBLICATIONDATE: 0, series_name: null, series_position_label: null },
      { ZDISPLAYTITLE: 'Book 2', ZBOOKID: 'B002', ZCONTENTTAGS: null, ZRAWPUBLISHER: null, ZRAWPUBLICATIONDATE: 0, series_name: null, series_position_label: null },
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
        ZDISPLAYTITLE: 'Series Book',
        ZBOOKID: 'B003',
        ZCONTENTTAGS: null,
        ZRAWPUBLISHER: null,
        ZRAWPUBLICATIONDATE: 0,
        series_name: 'Test Series',
        series_position_label: '1',
      },
    ];

    const result = mapRows(rows);

    expect(result[0].series_name).toBe('Test Series');
    expect(result[0].series_position).toBe('1');
  });

  it('Unixタイムスタンプを変換', () => {
    const rows = [
      {
        ZDISPLAYTITLE: 'Book with Date',
        ZBOOKID: 'B004',
        ZCONTENTTAGS: null,
        ZRAWPUBLISHER: null,
        ZRAWPUBLICATIONDATE: 1353283200, // 2012-11-19
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
        ZDISPLAYTITLE: 'Dictionary',
        ZBOOKID: 'B005',
        ZCONTENTTAGS: null,
        ZRAWPUBLISHER: null,
        ZRAWPUBLICATIONDATE: 0,
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
