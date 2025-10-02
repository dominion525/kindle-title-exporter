import { Command } from 'commander';
import type { CliOptions, OutputFormat } from '../types/index';
import { DEFAULT_DB_PATH } from '../config/constants';

/**
 * コマンドライン引数をパース
 * @param argv 引数配列（process.argv.slice(2)相当）
 * @returns パース済みのCLIオプション
 */
export function parseArgs(argv: string[]): CliOptions {
  const program = new Command();

  program
    .option('-d, --db-path <path>', 'Path to SQLite database file', DEFAULT_DB_PATH)
    .option('-f, --format <type>', 'Output format (csv or json)', 'csv')
    .addHelpText('after', `
Examples:
  $ npx kindle-title-exporter > output.csv
  $ npx kindle-title-exporter -f json > output.json
  $ npx kindle-title-exporter -d /path/to/BookData.sqlite > books.csv
`)
    .parse(argv, { from: 'user' });

  const options = program.opts();

  // フォーマット検証
  const format = options.format.toLowerCase();
  if (format !== 'csv' && format !== 'json') {
    program.error(`error: format must be either 'csv' or 'json' (got '${options.format}')`);
  }

  return {
    dbPath: options.dbPath,
    format: format as OutputFormat,
  };
}
