/**
 * ヘルプメッセージを標準出力に表示
 */
export function printHelp(): void {
  const text = `KindleデスクトップアプリのSQLite DB (ZBOOK テーブル) をダンプするCLI

使用例:
  npx kindle-title-exporter > output.csv
  npx kindle-title-exporter -f json > output.json
  npx kindle-title-exporter --db-path /path/to/BookData.sqlite -f json > books.json

オプション:
  -d, --db-path <path>   SQLiteファイルへのパス (デフォルト: ~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite)
  -f, --format <type>    出力フォーマット (csv | json, デフォルト: csv)
  -h, --help             このヘルプを表示

備考:
  出力は常に標準出力に書き出されます。ファイル保存はリダイレクト (>) を使用してください。
  出力項目: タイトル、ASIN、カテゴリ、出版社、著者、購入日、シリーズ名、シリーズ内位置
  著者情報はZSYNCMETADATAATTRIBUTESフィールド（plist形式）からデコードされます。
  シリーズ情報はZGROUP/ZGROUPITEMテーブルからLEFT JOINで取得されます。
`;
  process.stdout.write(text);
}
