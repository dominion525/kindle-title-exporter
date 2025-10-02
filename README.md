# kindle-title-exporter

Export your Kindle library to CSV or JSON format from the local SQLite database.

> **Note**: This tool is macOS only, as it reads from the Kindle for Mac database.

[日本語版 README はこちら](README.ja.md)

## Installation

```bash
npm install -g kindle-title-exporter
```

## Usage

```bash
# Export to CSV (default)
kindle-title-exporter > output.csv

# Export to JSON
kindle-title-exporter -f json > output.json

# Custom database path
kindle-title-exporter -d /path/to/BookData.sqlite > output.csv
```

### Using npx

```bash
npx kindle-title-exporter > output.csv
npx kindle-title-exporter -f json > output.json
```

## Output Fields

The tool exports 12 fields for each book:

- `book_id` - Book ID (e.g., A:B009DEMC8W-0)
- `asin` - Pure ASIN (e.g., B009DEMC8W)
- `display_title` - Display title
- `author` - Author name(s)
- `series_name` - Series name (if applicable)
- `series_position` - Position in series (if applicable)
- `publisher` - Publisher name
- `publication_date` - Publication date (ISO 8601)
- `purchase_date` - Purchase date (ISO 8601)
- `content_tags` - Content tags (array)
- `language` - Language code (e.g., ja, en)
- `sort_title` - Sort title (for Japanese: katakana reading)

## Development

See [README.ja.md](README.ja.md) for detailed documentation in Japanese, including:

- Project structure
- Testing
- Database documentation
- Development guide

## License

MIT
