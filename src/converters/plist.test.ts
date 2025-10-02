import { describe, it, expect } from 'vitest';
import { getPlistValue } from './plist';
import type { PlistData } from '../types/index';

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
