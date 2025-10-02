import { decodePlistField, getPlistValue } from './plist';
import { OUTPUT_FIELDS } from '../config/constants';

/**
 * データベース行をOUTPUT_FIELDSに従って出力形式に変換
 * @param rows データベースから取得した行データ
 * @returns 変換された出力行データ
 */
export function mapRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map(row => {
    const output: Record<string, unknown> = {};
    for (const field of OUTPUT_FIELDS) {
      let value = row[field.column];

      // plistPathが指定されている場合はデコード
      if (field.plistPath && value) {
        const plist = decodePlistField(value as Buffer);
        value = getPlistValue(plist, field.plistPath);
      } else if (field.plistPath) {
        // plistPathが指定されているがvalueがない場合はnull
        value = null;
      }

      output[field.label] = value;
    }
    return output;
  });
}
