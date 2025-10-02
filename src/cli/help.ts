/**
 * ヘルプメッセージを標準出力に表示
 */
export function printHelp(): void {
  const text = `KindleデスクトップアプリのSQLite DB (ZBOOK テーブル) をダンプしてファイルに保存するPoC CLI

使用例:
  npx kindle-title-exporter -o output.csv
  npx kindle-title-exporter --db-path /path/to/BookData.sqlite -o books.json -f json -v
  npx kindle-title-exporter -f json -o -

オプション:
  -d, --db-path <path>   SQLiteファイルへのパス (デフォルト: ~/Library/Containers/com.amazon.Lassen/Data/Library/Protected/BookData.sqlite)
  -o, --output <path>    出力先 (未指定または - なら標準出力)
  -f, --format <type>    出力フォーマット (csv | json, デフォルト: csv)
  -v, --verbose          既定項目に加えて拡張項目を含めて出力
  -h, --help             このヘルプを表示

備考:
  デフォルト出力項目: タイトル、ASIN、カテゴリ、出版社、著者、購入日、シリーズ名、シリーズ内位置
  verbose モード追加項目: plist内の出版社/タイトル、コンテンツタイプ
  著者情報はZSYNCMETADATAATTRIBUTESフィールド（plist形式）からデコードされます。
  シリーズ情報はZGROUP/ZGROUPITEMテーブルからLEFT JOINで取得されます。
  出力対象テーブルは ZBOOK 固定です。
`;
  process.stdout.write(text);
}
