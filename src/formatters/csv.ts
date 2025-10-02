import type { TableDump } from '../types/index';

/**
 * CSV値のフォーマット
 * @param value 任意の値
 * @returns CSV形式の文字列
 */
function formatCsvValue(value: unknown): string {
  if (value == null) return '';

  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
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
