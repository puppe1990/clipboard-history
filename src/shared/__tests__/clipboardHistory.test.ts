import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ClipboardEntry } from '../types';
import {
  addEntry,
  clearHistory,
  deleteEntry,
  entriesFromPayload,
} from '../clipboardHistory';
import { MAX_ENTRIES } from '../constants';

const baseEntry = (
  overrides: Partial<ClipboardEntry> = {}
): ClipboardEntry => ({
  id: 'entry-1',
  type: 'text',
  content: 'hello world',
  preview: 'hello world',
  sourceUrl: 'https://example.com',
  createdAt: 1_000,
  ...overrides,
});

describe('clipboardHistory', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000001'
    );
    vi.spyOn(Date, 'now').mockReturnValue(2_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('entriesFromPayload', () => {
    it('creates a text entry from plain text', () => {
      const entries = entriesFromPayload({
        text: 'hello world',
        sourceUrl: 'https://example.com/page',
      });

      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        id: '00000000-0000-4000-8000-000000000001',
        type: 'text',
        content: 'hello world',
        preview: 'hello world',
        sourceUrl: 'https://example.com/page',
        createdAt: 2_000,
      });
    });

    it('creates an image entry from a data url', () => {
      const imageDataUrl = 'data:image/png;base64,abc';
      const entries = entriesFromPayload({
        imageDataUrl,
        sourceUrl: 'https://example.com',
      });

      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        type: 'image',
        content: imageDataUrl,
        preview: 'Imagem',
      });
    });

    it('returns an empty array when payload has no content', () => {
      expect(entriesFromPayload({ sourceUrl: 'https://example.com' })).toEqual(
        []
      );
    });
  });

  describe('addEntry', () => {
    it('inserts the newest entry at the top', () => {
      const result = addEntry(
        [baseEntry({ id: 'old', content: 'old text' })],
        baseEntry({ id: 'new', content: 'new text' })
      );

      expect(result.map((entry) => entry.id)).toEqual(['new', 'old']);
    });

    it('skips duplicate entries matching the most recent one', () => {
      const existing = [baseEntry({ content: 'same text' })];
      const duplicate = baseEntry({ id: 'duplicate', content: 'same text' });

      const result = addEntry(existing, duplicate);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('entry-1');
    });

    it('keeps only the latest MAX_ENTRIES items', () => {
      const existing = Array.from({ length: MAX_ENTRIES }, (_, index) =>
        baseEntry({ id: `entry-${index}`, content: `text-${index}` })
      );

      const result = addEntry(
        existing,
        baseEntry({ id: 'latest', content: 'latest' })
      );

      expect(result).toHaveLength(MAX_ENTRIES);
      expect(result[0].id).toBe('latest');
      expect(result[MAX_ENTRIES - 1].id).toBe(`entry-${MAX_ENTRIES - 2}`);
    });
  });

  describe('deleteEntry', () => {
    it('removes an entry by id', () => {
      const existing = [baseEntry({ id: 'keep' }), baseEntry({ id: 'remove' })];

      expect(deleteEntry(existing, 'remove').map((entry) => entry.id)).toEqual([
        'keep',
      ]);
    });
  });

  describe('clearHistory', () => {
    it('returns an empty history', () => {
      expect(clearHistory()).toEqual([]);
    });
  });
});
