# kindle-title-exporter

[English](README.md) | [日本語](README.ja.md)

Export your Kindle for Mac library metadata (titles, authors, purchase dates, etc.) to CSV or JSON format. This tool reads book information only—it does not access or extract book content. The output includes 12 fields with a header row.

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

- `bookId` - Book ID (e.g., A:B009DEMC8W-0)
- `asin` - Pure ASIN (e.g., B009DEMC8W)
- `title` - Title
- `author` - Author name(s)
- `seriesName` - Series name (if applicable)
- `seriesNumber` - Series number (if applicable)
- `publisher` - Publisher name
- `publicationDate` - Publication date (ISO 8601)
- `purchaseDate` - Purchase date (ISO 8601)
- `contentTags` - Content tags (array)
- `language` - Language code (e.g., ja, en)
- `sortTitle` - Sort title (for Japanese: katakana reading)

## Author

[dominion525](https://github.com/dominion525)

## Disclaimer

This is an **unofficial** tool and is not affiliated with, endorsed by, or connected to Amazon or Kindle in any way.

"Kindle" is a registered trademark of Amazon.com, Inc. This software uses the name "Kindle" solely to describe its functionality (reading Kindle for Mac database files) under nominative fair use principles. This tool does not modify, circumvent, or interfere with any digital rights management (DRM) or copy protection mechanisms.

## License

MIT
