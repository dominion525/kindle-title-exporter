import type { OutputField, TableDump, PlistData } from '../types/index';
import { decodePlistField, getPlistValue } from './plist';

/**
 * 行データをフィールド定義に基づいて射影
 * @param rows 元の行データ
 * @param fields 出力フィールド定義
 * @returns 射影された行データ
 */
export function projectRows(rows: Record<string, unknown>[], fields: OutputField[]): TableDump {
  const columns = fields.map((field) => field.label);
  const projectedRows = rows.map((row) => {
    const projected: Record<string, unknown> = {};
    const plistCache = new Map<string, PlistData | null>();

    for (const field of fields) {
      if (field.plistPath) {
        // plistフィールドからの抽出
        const columnValue = row[field.column];

        let decoded: PlistData | null;
        if (plistCache.has(field.column)) {
          decoded = plistCache.get(field.column) ?? null;
        } else {
          decoded = decodePlistField(columnValue as Buffer | null);
          plistCache.set(field.column, decoded);
        }

        projected[field.label] = getPlistValue(decoded, field.plistPath);
      } else {
        // 通常のフィールド
        projected[field.label] = row[field.column] ?? null;
      }
    }
    return projected;
  });
  return { columns, rows: projectedRows };
}

/**
 * 利用可能なカラムからフィールドを選択
 * @param availableColumns 利用可能なカラム名
 * @param fields フィールド定義
 * @returns 選択されたフィールド定義
 */
export function selectFields(
  availableColumns: string[],
  fields: OutputField[]
): OutputField[] {
  const available = new Set(availableColumns);
  const selected = fields.filter((field) => available.has(field.column));
  if (selected.length === 0) {
    const expected = fields.map((field) => field.column).join(', ');
    throw new Error(`ZBOOK テーブルに必要な列が見つかりません。期待値: ${expected}`);
  }
  return selected;
}
