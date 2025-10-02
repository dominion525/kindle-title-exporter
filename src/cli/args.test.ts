import { describe, it, expect } from 'vitest';
import { parseArgs } from './args';

describe('parseArgs', () => {

  it('デフォルト値を返す', () => {
    const result = parseArgs([]);
    expect(result.format).toBe('csv');
    expect(result.dbPath).toContain('BookData.sqlite');
  });

  it('--db-path オプションをパース', () => {
    const result = parseArgs(['--db-path', '/path/to/db.sqlite']);
    expect(result.dbPath).toBe('/path/to/db.sqlite');
  });

  it('-d オプションをパース', () => {
    const result = parseArgs(['-d', '/another/path.sqlite']);
    expect(result.dbPath).toBe('/another/path.sqlite');
  });

  it('--format json をパース', () => {
    const result = parseArgs(['--format', 'json']);
    expect(result.format).toBe('json');
  });

  it('--format csv をパース', () => {
    const result = parseArgs(['--format', 'csv']);
    expect(result.format).toBe('csv');
  });

  it('--format の大文字小文字を無視', () => {
    const result = parseArgs(['--format', 'JSON']);
    expect(result.format).toBe('json');
  });

  it('複数オプションを組み合わせ', () => {
    const result = parseArgs([
      '-d', '/path/to/db',
      '-f', 'json'
    ]);
    expect(result.dbPath).toBe('/path/to/db');
    expect(result.format).toBe('json');
  });

  it('--format に不正な値でエラー', () => {
    expect(() => {
      parseArgs(['--format', 'xml']);
    }).toThrow();
  });

  it('--db-path の値が無い場合エラー', () => {
    expect(() => {
      parseArgs(['--db-path']);
    }).toThrow();
  });

  it('--format の値が無い場合エラー', () => {
    expect(() => {
      parseArgs(['--format']);
    }).toThrow();
  });
});
