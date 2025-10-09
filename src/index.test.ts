import { describe, it, expect, vi, afterEach } from 'vitest';
import { resolve } from 'path';

const TEST_DB_PATH = resolve(__dirname, '../test/fixtures/test-db.sqlite');

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

describe('generateOutput', () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
  });

  it('macOS環境でCSV出力を生成できる', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
      writable: true,
      configurable: true,
    });

    vi.resetModules();
    const { generateOutput } = await import('./index');

    const result = generateOutput(['-d', TEST_DB_PATH, '-f', 'csv']);

    expect(result).toContain('title');
    expect(result).toContain('Test Book');
  });

  it('macOS環境でJSON出力を生成できる', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
      writable: true,
      configurable: true,
    });

    vi.resetModules();
    const { generateOutput } = await import('./index');

    const result = generateOutput(['-d', TEST_DB_PATH, '-f', 'json']);

    expect(result).toContain('"title"');
    expect(result).toContain('Test Book');
  });

  it('macOS以外の環境でエラーを投げる', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      writable: true,
      configurable: true,
    });

    vi.resetModules();
    const { generateOutput } = await import('./index');

    expect(() => {
      generateOutput(['-d', TEST_DB_PATH, '-f', 'csv']);
    }).toThrow('This tool is only supported on macOS');
  });
});

describe('setupStdoutErrorHandler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.stdout.removeAllListeners('error');
  });

  it('EPIPEエラー時にexit(0)を呼ぶ', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    vi.resetModules();
    const { setupStdoutErrorHandler } = await import('./index');
    setupStdoutErrorHandler();

    const epipeError = new Error('EPIPE') as NodeJS.ErrnoException;
    epipeError.code = 'EPIPE';

    // エラーハンドラー内でexitが呼ばれるが、エラーは投げられない
    try {
      process.stdout.emit('error', epipeError);
    } catch {
      // EPIPEの場合はexitが呼ばれて例外は投げられないはず
    }

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('EPIPE以外のエラーは再スローする', async () => {
    vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    vi.resetModules();
    const { setupStdoutErrorHandler } = await import('./index');
    setupStdoutErrorHandler();

    const otherError = new Error('Other error') as NodeJS.ErrnoException;
    otherError.code = 'OTHER';

    let thrownError: Error | null = null;
    try {
      process.stdout.emit('error', otherError);
    } catch (error) {
      thrownError = error as Error;
    }

    expect(thrownError).not.toBeNull();
    expect(thrownError?.message).toBe('Other error');
  });
});

describe('main', () => {
  const originalPlatform = process.platform;
  const originalArgv = process.argv;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
    process.argv = originalArgv;
  });

  it('正常系: CSV形式で標準出力に書き込む', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
      writable: true,
      configurable: true,
    });

    const stdoutWriteSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    process.argv = ['node', 'index.js', '-d', TEST_DB_PATH, '-f', 'csv'];

    vi.resetModules();
    const { main } = await import('./index');
    main();

    expect(stdoutWriteSpy).toHaveBeenCalledTimes(1);
    const output = stdoutWriteSpy.mock.calls[0][0] as string;
    expect(output).toContain('title');
    expect(output).toContain('Test Book');
  });

  it('正常系: JSON形式で標準出力に書き込む', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
      writable: true,
      configurable: true,
    });

    const stdoutWriteSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    process.argv = ['node', 'index.js', '-d', TEST_DB_PATH, '-f', 'json'];

    vi.resetModules();
    const { main } = await import('./index');
    main();

    expect(stdoutWriteSpy).toHaveBeenCalledTimes(1);
    const output = stdoutWriteSpy.mock.calls[0][0] as string;
    expect(output).toContain('"title"');
    expect(output).toContain('Test Book');
  });

  it('異常系: エラー時に標準エラー出力に書き込みexit(1)を呼ぶ', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32', // macOS以外
      writable: true,
      configurable: true,
    });

    const stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    process.argv = ['node', 'index.js', '-d', TEST_DB_PATH, '-f', 'csv'];

    vi.resetModules();
    const { main } = await import('./index');
    main();

    expect(stderrWriteSpy).toHaveBeenCalledTimes(1);
    expect(stderrWriteSpy).toHaveBeenCalledWith('エラー: This tool is only supported on macOS\n');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
