import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('isMacOS', () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
  });

  it('macOSの場合にtrueを返す', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
      writable: true,
      configurable: true,
    });

    const { isMacOS } = await import('./index');
    expect(isMacOS()).toBe(true);
  });

  it('Windowsの場合にfalseを返す', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      writable: true,
      configurable: true,
    });

    // モジュールキャッシュをクリアして再読み込み
    vi.resetModules();
    const { isMacOS } = await import('./index');
    expect(isMacOS()).toBe(false);
  });

  it('Linuxの場合にfalseを返す', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
      writable: true,
      configurable: true,
    });

    vi.resetModules();
    const { isMacOS } = await import('./index');
    expect(isMacOS()).toBe(false);
  });
});
