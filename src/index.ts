#!/usr/bin/env node

import { parseArgs } from './cli/args';
import { readTableData } from './db/reader';
import { mapRows } from './converters/mapper';
import { rowsToCsv } from './formatters/csv';
import { rowsToJson } from './formatters/json';
import { OUTPUT_FIELDS } from './config/constants';

export function isMacOS(): boolean {
  return process.platform === 'darwin';
}

/**
 * EPIPEエラーハンドラーを設定
 * パイプの途中終了時に正常終了させる
 */
export function setupStdoutErrorHandler(): void {
  process.stdout.on('error', (error) => {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'EPIPE') {
      process.exit(0);
    }
    throw err;
  });
}

/**
 * 出力文字列を生成（ビジネスロジック）
 * @param args コマンドライン引数
 * @returns 出力文字列（CSV/JSON）
 */
export function generateOutput(args: string[]): string {
  if (!isMacOS()) {
    throw new Error('This tool is only supported on macOS');
  }

  const options = parseArgs(args);
  const rawDump = readTableData(options.dbPath);
  const outputRows = mapRows(rawDump.rows);

  return options.format === 'csv'
    ? rowsToCsv({ columns: OUTPUT_FIELDS.map(f => f.label), rows: outputRows })
    : rowsToJson(outputRows);
}

export function main(): void {
  try {
    const content = generateOutput(process.argv.slice(2));
    process.stdout.write(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`エラー: ${message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  setupStdoutErrorHandler();
  void main();
}
