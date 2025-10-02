/**
 * 行データをJSON形式に変換
 * @param rows 行データ
 * @returns JSON形式の文字列
 */
export function rowsToJson(rows: Record<string, unknown>[]): string {
  return `${JSON.stringify(rows, null, 2)}\n`;
}
