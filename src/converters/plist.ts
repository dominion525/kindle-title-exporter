// @ts-ignore - no type definitions available
import bplistParser from 'bplist-parser';
import type { PlistData } from '../types/index';

function decodeNSKeyedArchive(parsed: unknown[]): PlistData | null {
  if (!parsed || !parsed[0] || typeof parsed[0] !== 'object' || !parsed[0]) {
    return null;
  }

  const firstObj = parsed[0] as Record<string, unknown>;
  const objects = firstObj.$objects as unknown[];
  const top = firstObj.$top as Record<string, unknown> | undefined;
  const root = top?.root as Record<string, unknown> | undefined;

  if (!root || typeof root.UID !== 'number' || !objects) {
    return null;
  }

  function decodeObject(obj: unknown, visited = new Set<number>()): unknown {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const objRecord = obj as Record<string, unknown>;

    if ('UID' in objRecord) {
      const uid = objRecord.UID as number;
      if (visited.has(uid)) {
        return null;
      }
      visited.add(uid);
      const resolved = objects[uid];
      return decodeObject(resolved, visited);
    }

    // 配列の場合
    if ('NS.objects' in objRecord && !('NS.keys' in objRecord)) {
      const items = objRecord['NS.objects'] as unknown[];
      return items.map(item => decodeObject(item, new Set()));
    }

    // 辞書の場合
    if ('NS.keys' in objRecord && 'NS.objects' in objRecord) {
      const result: Record<string, unknown> = {};
      const keys = objRecord['NS.keys'] as unknown[];
      const values = objRecord['NS.objects'] as unknown[];

      for (let i = 0; i < keys.length; i++) {
        const key = decodeObject(keys[i], new Set());
        const value = decodeObject(values[i], new Set());
        if (typeof key === 'string') {
          result[key] = value;
        }
      }
      return result;
    }

    return obj;
  }

  const rootObj = objects[root.UID] as Record<string, unknown>;
  if (rootObj && rootObj.attributes) {
    const attrsUID = rootObj.attributes;
    const attrs = decodeObject(attrsUID, new Set());
    return attrs as PlistData | null;
  }

  return null;
}

export function decodePlistField(buffer: Buffer | null): PlistData | null {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return null;
  }

  try {
    const parsed = bplistParser.parseBuffer(buffer) as unknown[];
    return decodeNSKeyedArchive(parsed);
  } catch {
    return null;
  }
}

/**
 * plistデータから指定されたパスの値を取得
 * @param plist plistデータ
 * @param path ドット区切りのパス（例: "authors.author"）
 * @returns 取得した値、見つからない場合はnull
 */
export function getPlistValue(plist: PlistData | null, path: string): unknown {
  if (!plist) {
    return null;
  }

  const pathParts = path.split('.');
  let value: unknown = plist;

  for (const part of pathParts) {
    if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return null;
    }
  }

  return value;
}
