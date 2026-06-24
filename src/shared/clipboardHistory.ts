import { MAX_ENTRIES, TEXT_PREVIEW_LENGTH } from './constants';
import type { ClipboardCopyPayload, ClipboardEntry } from './types';
import { truncateText } from './format';

function isDuplicate(
  existing: ClipboardEntry[],
  candidate: ClipboardEntry
): boolean {
  const latest = existing[0];
  if (!latest) {
    return false;
  }

  return latest.type === candidate.type && latest.content === candidate.content;
}

function createTextEntry(
  text: string,
  sourceUrl: string,
  createdAt: number
): ClipboardEntry {
  return {
    id: crypto.randomUUID(),
    type: 'text',
    content: text,
    preview: truncateText(text, TEXT_PREVIEW_LENGTH),
    sourceUrl,
    createdAt,
  };
}

function createImageEntry(
  imageDataUrl: string,
  sourceUrl: string,
  createdAt: number
): ClipboardEntry {
  return {
    id: crypto.randomUUID(),
    type: 'image',
    content: imageDataUrl,
    preview: 'Imagem',
    sourceUrl,
    createdAt,
  };
}

export function entriesFromPayload(
  payload: ClipboardCopyPayload
): ClipboardEntry[] {
  const createdAt = Date.now();
  const entries: ClipboardEntry[] = [];
  const text = payload.text?.trim();

  if (text) {
    entries.push(createTextEntry(text, payload.sourceUrl, createdAt));
  }

  if (payload.imageDataUrl) {
    entries.push(
      createImageEntry(payload.imageDataUrl, payload.sourceUrl, createdAt)
    );
  }

  return entries;
}

export function addEntry(
  existing: ClipboardEntry[],
  entry: ClipboardEntry,
  maxEntries = MAX_ENTRIES
): ClipboardEntry[] {
  if (isDuplicate(existing, entry)) {
    return existing;
  }

  return [entry, ...existing].slice(0, maxEntries);
}

export function deleteEntry(
  existing: ClipboardEntry[],
  entryId: string
): ClipboardEntry[] {
  return existing.filter((entry) => entry.id !== entryId);
}

export function clearHistory(): ClipboardEntry[] {
  return [];
}
