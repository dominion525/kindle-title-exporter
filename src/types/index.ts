export type OutputFormat = 'csv' | 'json';

export type CliOptions = {
  dbPath: string;
  format: OutputFormat;
};

export type OutputField = {
  column: string;
  label: string;
  plistPath?: string; // plistフィールドからの抽出パス (例: "authors.author")
};

export type TableDump = {
  columns: string[];
  rows: Record<string, unknown>[];
};

export type PlistData = Record<string, unknown>;
