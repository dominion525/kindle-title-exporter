import type { TableDump } from '../types/index';

/**
 * CSV値のフォーマット
 * @param value 任意の値
 * @returns CSV形式の文字列
 */
function formatCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Buffer.isBuffer(value)) {
    return `0x${value.toString('hex')}`;
  }
  if (Array.isArray(value)) {
    // 配列はカンマ区切りで結合
    const joined = value.map(v => String(v ?? '')).join(', ');
    const escaped = joined.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  const text = String(value);
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * 行データをCSV形式に変換
 * @param dump テーブルダンプデータ
 * @returns CSV形式の文字列
 */
export function rowsToCsv({ columns, rows }: TableDump): string {
  const header = columns.map((col) => `"${col.replace(/"/g, '""')}"`).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((col) => formatCsvValue(row[col]))
        .join(',')
    )
    .join('\n');
  return body ? `${header}\n${body}\n` : `${header}\n`;
}
