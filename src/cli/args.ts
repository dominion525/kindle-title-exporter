import type { CliOptions, OutputFormat } from '../types/index';
import { DEFAULT_DB_PATH } from '../config/constants';
import { printHelp } from './help';

/**
 * コマンドライン引数をパース
 * @param argv 引数配列（process.argv.slice(2)相当）
 * @returns パース済みのCLIオプション
 */
export function parseArgs(argv: string[]): CliOptions {
  const args = [...argv];
  let dbPath: string | undefined;
  let format: OutputFormat | undefined;

  while (args.length > 0) {
    const arg = args.shift();
    if (!arg) {
      continue;
    }
    switch (arg) {
      case '--db-path':
      case '-d': {
        const value = args.shift();
        if (!value) {
          throw new Error(`${arg} の直後にパスを指定してください`);
        }
        dbPath = value;
        break;
      }
      case '--format':
      case '-f': {
        const value = args.shift();
        if (!value) {
          throw new Error(`${arg} の直後にフォーマットを指定してください (csv または json)`);
        }
        const normalized = value.toLowerCase();
        if (normalized !== 'csv' && normalized !== 'json') {
          throw new Error(`--format は csv または json を指定してください (指定値: ${value})`);
        }
        format = normalized as OutputFormat;
        break;
      }
      case '--help':
      case '-h': {
        printHelp();
        process.exit(0);
      }
      default: {
        throw new Error(`不明な引数 ${arg} が指定されました`);
      }
    }
  }

  return {
    dbPath: dbPath ?? DEFAULT_DB_PATH,
    format: format ?? 'csv',
  };
}
