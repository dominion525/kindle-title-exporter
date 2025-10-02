#!/usr/bin/env node

import { parseArgs } from './cli/args';
import { readTableData } from './db/reader';
import { decodePlistField, getPlistValue } from './converters/plist';
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

    // OUTPUT_FIELDSに従って各行をマップ
    const outputRows = rawDump.rows.map(row => {
      const output: Record<string, unknown> = {};
      for (const field of OUTPUT_FIELDS) {
        let value = row[field.column];

        // plistPathが指定されている場合はデコード
        if (field.plistPath && value) {
          const plist = decodePlistField(value as Buffer);
          value = getPlistValue(plist, field.plistPath);
        }

        output[field.label] = value;
      }
      return output;
    });

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
