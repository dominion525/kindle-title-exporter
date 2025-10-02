export type OutputFormat = 'csv' | 'json';

export type CliOptions = {
  dbPath: string;
  format: OutputFormat;
};

export type OutputField = {
  label: string;
  column: string;
  plistPath?: string; // plistフィールドからの抽出パス (例: "authors.author")
  type?: 'unix-timestamp'; // Unixタイムスタンプ（1970-01-01からの秒数）
};

export type TableDump = {
  columns: string[];
  rows: Record<string, unknown>[];
};

export type PlistData = Record<string, unknown>;
