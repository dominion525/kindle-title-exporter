import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('DEFAULT_DB_PATH', () => {
  const originalHome = process.env.HOME;

  afterEach(() => {
    // 環境変数を復元
    if (originalHome !== undefined) {
      process.env.HOME = originalHome;
    } else {
      delete process.env.HOME;
    }
  });

  it('HOME環境変数が存在する場合、フルパスを返す', async () => {
    process.env.HOME = '/Users/testuser';

    // モジュールキャッシュをクリアして再読み込み
    vi.resetModules();
    const { DEFAULT_DB_PATH } = await import('./constants');

    expect(DEFAULT_DB_PATH).toContain('/Users/testuser');
    expect(DEFAULT_DB_PATH).toContain('Library/Containers/com.amazon.Lassen');
    expect(DEFAULT_DB_PATH).toContain('BookData.sqlite');
  });

  it('HOME環境変数が未定義の場合、相対パスを返す', async () => {
    delete process.env.HOME;

    // モジュールキャッシュをクリアして再読み込み
    vi.resetModules();
    const { DEFAULT_DB_PATH } = await import('./constants');

    expect(DEFAULT_DB_PATH).toBe('BookData.sqlite');
  });
});

describe('OUTPUT_FIELDS', () => {
  it('全12フィールドが定義されている', async () => {
    const { OUTPUT_FIELDS } = await import('./constants');

    expect(OUTPUT_FIELDS).toHaveLength(12);
  });

  it('各フィールドにlabelとcolumnが存在する', async () => {
    const { OUTPUT_FIELDS } = await import('./constants');

    for (const field of OUTPUT_FIELDS) {
      expect(field).toHaveProperty('label');
      expect(field).toHaveProperty('column');
      expect(typeof field.label).toBe('string');
      expect(typeof field.column).toBe('string');
    }
  });
});
