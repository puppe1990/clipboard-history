import { STORAGE_KEY } from './constants';
import type { ClipboardEntry } from './types';

function chromeStorageGet(
  keys: string | string[] | null
): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    const normalized = typeof keys === 'string' ? [keys] : keys;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chrome.storage.local.get(normalized as any, resolve);
  });
}

function chromeStorageSet(items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(items, resolve);
  });
}

export async function readHistory(): Promise<ClipboardEntry[]> {
  const result = await chromeStorageGet(STORAGE_KEY);
  const history = result[STORAGE_KEY];
  return Array.isArray(history) ? (history as ClipboardEntry[]) : [];
}

export async function writeHistory(history: ClipboardEntry[]): Promise<void> {
  await chromeStorageSet({ [STORAGE_KEY]: history });
}
