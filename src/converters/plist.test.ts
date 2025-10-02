import { describe, it, expect } from 'vitest';
import { decodePlistField, getPlistValue } from './plist';
import type { PlistData } from '../types/index';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('getPlistValue', () => {
  it('nullのplistからnullを返す', () => {
    const result = getPlistValue(null, 'any.path');
    expect(result).toBeNull();
  });

  it('トップレベルの値を取得', () => {
    const plist: PlistData = { title: 'Test Book' };
    const result = getPlistValue(plist, 'title');
    expect(result).toBe('Test Book');
  });

  it('ネストした値を取得', () => {
    const plist: PlistData = {
      authors: {
        author: 'Test Author'
      }
    };
    const result = getPlistValue(plist, 'authors.author');
    expect(result).toBe('Test Author');
  });

  it('深くネストした値を取得', () => {
    const plist: PlistData = {
      level1: {
        level2: {
          level3: 'deep value'
        }
      }
    };
    const result = getPlistValue(plist, 'level1.level2.level3');
    expect(result).toBe('deep value');
  });

  it('存在しないパスでnullを返す', () => {
    const plist: PlistData = { title: 'Test' };
    const result = getPlistValue(plist, 'nonexistent.path');
    expect(result).toBeNull();
  });

  it('配列値を取得', () => {
    const plist: PlistData = {
      authors: {
        author: ['Author A', 'Author B']
      }
    };
    const result = getPlistValue(plist, 'authors.author');
    expect(result).toEqual(['Author A', 'Author B']);
  });

  it('途中でnullの場合にnullを返す', () => {
    const plist: PlistData = {
      authors: null
    };
    const result = getPlistValue(plist, 'authors.author');
    expect(result).toBeNull();
  });
});

describe('decodePlistField', () => {
  it('nullを渡した場合にnullを返す', () => {
    const result = decodePlistField(null);
    expect(result).toBeNull();
  });

  it('Bufferでないものを渡した場合にnullを返す', () => {
    // @ts-expect-error - testing invalid input
    const result = decodePlistField('not a buffer');
    expect(result).toBeNull();
  });

  it('空のBufferを渡した場合にnullを返す', () => {
    const emptyBuffer = Buffer.alloc(0);
    const result = decodePlistField(emptyBuffer);
    expect(result).toBeNull();
  });

  it('不正なバイナリを渡した場合にnullを返す', () => {
    const invalidBuffer = Buffer.from('invalid data');
    const result = decodePlistField(invalidBuffer);
    expect(result).toBeNull();
  });

  it('不正なplist形式（$objectsなし）を渡した場合にnullを返す', () => {
    // 正しいbplist形式だが、NSKeyedArchive構造を持たないデータ
    const buffer = Buffer.from('bplist00_\x08\x00\x00\x00\x00\x00\x00\x01\x01\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x09', 'binary');
    const result = decodePlistField(buffer);
    expect(result).toBeNull();
  });

  it('実際のKindleメタデータplistをデコードできる', () => {
    const samplePath = resolve(__dirname, '../../test/fixtures/sample-plist.bin');
    const buffer = readFileSync(samplePath);
    const result = decodePlistField(buffer);

    // 基本的なフィールドが存在することを確認
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('ASIN');
    expect(result).toHaveProperty('title');
  });

  it('デコードされたplistからauthorsフィールドを取得できる', () => {
    const samplePath = resolve(__dirname, '../../test/fixtures/sample-plist.bin');
    const buffer = readFileSync(samplePath);
    const result = decodePlistField(buffer);

    expect(result).not.toBeNull();

    // authorsフィールドの取得
    const authors = getPlistValue(result, 'authors.author');

    // 著者は文字列または配列のいずれか
    expect(authors).toBeDefined();
  });
});
