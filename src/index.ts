#!/usr/bin/env node

import { parseArgs } from './cli/args';
import { readTableData } from './db/reader';
import { mapRows } from './converters/mapper';
import { rowsToCsv } from './formatters/csv';
import { rowsToJson } from './formatters/json';
import { OUTPUT_FIELDS } from './config/constants';

// EPIPEエラー処理（パイプの途中終了）
process.stdout.on('error', (error) => {
  const err = error as NodeJS.ErrnoException;
  if (err.code === 'EPIPE') {
    process.exit(0);
  }
  throw err;
});

function main(): void {
  try {
    const options = parseArgs(process.argv.slice(2));
    const rawDump = readTableData(options.dbPath);
    const outputRows = mapRows(rawDump.rows);

    const content = options.format === 'csv'
      ? rowsToCsv({ columns: OUTPUT_FIELDS.map(f => f.label), rows: outputRows })
      : rowsToJson(outputRows);

    process.stdout.write(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`エラー: ${message}\n`);
    process.exit(1);
  }
}

void main();
