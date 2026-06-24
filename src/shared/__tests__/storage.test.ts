import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ClipboardEntry } from '../types';
import { readHistory, writeHistory } from '../storage';
import { STORAGE_KEY } from '../constants';

const mockStorage: Record<string, unknown> = {};
const mockChrome = {
  storage: {
    local: {
      get: vi.fn(
        (
          keys: string | string[] | null,
          callback: (result: Record<string, unknown>) => void
        ) => {
          const result: Record<string, unknown> = {};
          if (keys === null || keys === undefined) {
            Object.assign(result, mockStorage);
          } else if (typeof keys === 'string') {
            result[keys] = mockStorage[keys];
          } else if (Array.isArray(keys)) {
            for (const key of keys) {
              result[key] = mockStorage[key];
            }
          }
          callback(result);
        }
      ),
      set: vi.fn((items: Record<string, unknown>, callback: () => void) => {
        Object.assign(mockStorage, items);
        callback();
      }),
    },
  },
};

(globalThis as Record<string, unknown>).chrome = mockChrome;

const makeEntry = (id: string): ClipboardEntry => ({
  id,
  type: 'text',
  content: `content-${id}`,
  preview: `content-${id}`,
  sourceUrl: 'https://example.com',
  createdAt: Date.now(),
});

describe('storage', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    vi.clearAllMocks();
  });

  it('returns an empty array when no history is stored', async () => {
    await expect(readHistory()).resolves.toEqual([]);
  });

  it('returns stored history entries', async () => {
    mockStorage[STORAGE_KEY] = [makeEntry('one')];
    await expect(readHistory()).resolves.toHaveLength(1);
  });

  it('writes and reads history entries', async () => {
    const entries = [makeEntry('one'), makeEntry('two')];
    await writeHistory(entries);
    await expect(readHistory()).resolves.toEqual(entries);
  });
});
