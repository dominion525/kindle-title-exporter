import { decodePlistField, getPlistValue } from './plist';
import { OUTPUT_FIELDS } from '../config/constants';
import type { OutputField } from '../types/index';

/**
 * フィールド値を変換
 * @param rawValue データベースから取得した生の値
 * @param field フィールド定義
 * @returns 変換された値
 */
export function convertFieldValue(rawValue: unknown, field: OutputField): unknown {
  switch (true) {
    case field.plistPath && !!rawValue:
      const plist = decodePlistField(rawValue as Buffer);
      return getPlistValue(plist, field.plistPath);
    case !!field.plistPath:
      return null;
    case field.type === 'unix-timestamp' && typeof rawValue === 'number':
      return rawValue === 0 ? null : new Date(rawValue * 1000).toISOString();
    default:
      return rawValue;
  }
}

/**
 * データベース行をOUTPUT_FIELDSに従って出力形式に変換
 * @param rows データベースから取得した行データ
 * @returns 変換された出力行データ
 */
export function mapRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map(row => {
    const output: Record<string, unknown> = {};
    for (const field of OUTPUT_FIELDS) {
      output[field.label] = convertFieldValue(row[field.column], field);
    }
    return output;
  });
}
