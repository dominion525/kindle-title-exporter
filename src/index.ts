#!/usr/bin/env node

import { parseArgs } from './cli/args';
import { readTableData } from './db/reader';
import { projectRows, selectFields } from './converters/projection';
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

async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv.slice(2));
    const rawDump = readTableData(options.dbPath);
    const fields = selectFields(rawDump.columns, OUTPUT_FIELDS);
    const projected = projectRows(rawDump.rows, fields);
    const content = options.format === 'csv' ? rowsToCsv(projected) : rowsToJson(projected.rows);

    process.stdout.write(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`エラー: ${message}\n`);
    process.exit(1);
  }
}

void main();
