import Database from 'better-sqlite3';
import type { TableDump } from '../types/index';

/**
 * データベースからテーブルデータを読み取り
 * @param dbPath データベースファイルパス
 * @returns テーブルダンプデータ
 */
export function readTableData(dbPath: string): TableDump {
  const db = new Database(dbPath, { readonly: true });
  try {
    const selectStmt = db.prepare(`
      SELECT
        ZBOOK.*,
        ZGROUP.ZDISPLAYNAME as series_name,
        ZGROUPITEM.ZPOSITION as series_position,
        ZGROUPITEM.ZPOSITIONLABEL as series_position_label
      FROM "ZBOOK" AS ZBOOK
      LEFT JOIN ZGROUPITEM ON ZBOOK.Z_PK = ZGROUPITEM.ZBOOK
      LEFT JOIN ZGROUP ON ZGROUPITEM.ZPARENTCONTAINER = ZGROUP.Z_PK
      ORDER BY ZBOOK.ZSORTTITLE ASC
    `);
    const rows = selectStmt.all() as Record<string, unknown>[];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    return { columns, rows };
  } finally {
    db.close();
  }
}
