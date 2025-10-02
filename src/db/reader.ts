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
    // ZBOOKの基本カラムを取得
    const pragmaStmt = db.prepare(`PRAGMA table_info("ZBOOK")`);
    const pragmaInfo = pragmaStmt.all() as Array<{ name: string }>;
    const baseColumns = pragmaInfo.map(({ name }) => String(name));
    if (baseColumns.length === 0) {
      throw new Error(`テーブル ZBOOK は存在しないか、列がありません`);
    }

    // シリーズ情報を含むカラムリスト
    const columns = [
      ...baseColumns,
      'series_name',
      'series_position',
      'series_position_label'
    ];

    // LEFT JOINでシリーズ情報を結合
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
    return { columns, rows };
  } finally {
    db.close();
  }
}
