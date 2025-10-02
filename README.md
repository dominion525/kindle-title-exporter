# kindle-title-exporter

[English](README.md) | [日本語](README.ja.md)

Export your Kindle for Mac library to CSV or JSON format. The output includes 12 fields with a header row.

> **Requirements**:
> - macOS only
> - Kindle for Mac must be installed

## Usage

### Using npx (No installation required)

```bash
# Export to CSV (default)
npx kindle-title-exporter > output.csv

# Export to JSON
npx kindle-title-exporter -f json > output.json

# Custom database path
npx kindle-title-exporter -d /path/to/BookData.sqlite > output.csv
```

### Global installation

```bash
npm install -g kindle-title-exporter

# Then use:
kindle-title-exporter > output.csv
kindle-title-exporter -f json > output.json
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

## Author

[dominion525](https://github.com/dominion525)

## License

MIT
