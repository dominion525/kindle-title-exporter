import { describe, it, expect, vi } from 'vitest';
import { parseArgs } from './args';

// printHelpをモック化してprocess.exitを防ぐ
vi.mock('./help', () => ({
  printHelp: vi.fn()
}));

describe('parseArgs', () => {
  it('デフォルト値を返す', () => {
    const result = parseArgs([]);
    expect(result.format).toBe('csv');
    expect(result.verbose).toBe(false);
    expect(result.useStdout).toBe(true);
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

  it('--output オプションをパース', () => {
    const result = parseArgs(['--output', 'output.csv']);
    expect(result.outputPath).toBe('output.csv');
    expect(result.useStdout).toBe(false);
  });

  it('--output - で標準出力', () => {
    const result = parseArgs(['--output', '-']);
    expect(result.useStdout).toBe(true);
    expect(result.outputPath).toBeUndefined();
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

  it('--verbose をパース', () => {
    const result = parseArgs(['--verbose']);
    expect(result.verbose).toBe(true);
  });

  it('-v をパース', () => {
    const result = parseArgs(['-v']);
    expect(result.verbose).toBe(true);
  });

  it('複数オプションを組み合わせ', () => {
    const result = parseArgs([
      '-d', '/path/to/db',
      '-o', 'out.json',
      '-f', 'json',
      '-v'
    ]);
    expect(result.dbPath).toBe('/path/to/db');
    expect(result.outputPath).toBe('out.json');
    expect(result.format).toBe('json');
    expect(result.verbose).toBe(true);
  });

  it('不明な引数でエラー', () => {
    expect(() => {
      parseArgs(['--unknown']);
    }).toThrow('不明な引数 --unknown が指定されました');
  });

  it('--db-path の値が無い場合エラー', () => {
    expect(() => {
      parseArgs(['--db-path']);
    }).toThrow('--db-path の直後にパスを指定してください');
  });

  it('--format の値が無い場合エラー', () => {
    expect(() => {
      parseArgs(['--format']);
    }).toThrow('--format の直後にフォーマットを指定してください');
  });

  it('--format に不正な値でエラー', () => {
    expect(() => {
      parseArgs(['--format', 'xml']);
    }).toThrow('--format は csv または json を指定してください');
  });
});
