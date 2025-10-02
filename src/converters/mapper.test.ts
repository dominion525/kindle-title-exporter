import { describe, it, expect } from 'vitest';
import { mapRows } from './mapper';

describe('mapRows', () => {
  it('基本的なフィールドをマップ', () => {
    const rows = [
      {
        ZDISPLAYTITLE: 'Test Book',
        ZBOOKID: 'B001',
        ZCONTENTTAGS: 'Fiction',
        ZRAWPUBLISHER: 'Test Publisher',
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
      series_name: null,
      series_position: null,
    });
  });

  it('複数行をマップ', () => {
    const rows = [
      { ZDISPLAYTITLE: 'Book 1', ZBOOKID: 'B001', ZCONTENTTAGS: null, ZRAWPUBLISHER: null, series_name: null, series_position_label: null },
      { ZDISPLAYTITLE: 'Book 2', ZBOOKID: 'B002', ZCONTENTTAGS: null, ZRAWPUBLISHER: null, series_name: null, series_position_label: null },
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
        series_name: 'Test Series',
        series_position_label: '1',
      },
    ];

    const result = mapRows(rows);

    expect(result[0].series_name).toBe('Test Series');
    expect(result[0].series_position).toBe('1');
  });
});
