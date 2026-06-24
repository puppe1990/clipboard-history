import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatRelativeTime, truncateText } from '../format';

describe('format', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('truncateText', () => {
    it('returns the original text when shorter than the limit', () => {
      expect(truncateText('short text', 20)).toBe('short text');
    });

    it('truncates long text with an ellipsis', () => {
      expect(truncateText('abcdefghijklmnopqrstuvwxyz', 10)).toBe(
        'abcdefghij...'
      );
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "agora" for timestamps within one minute', () => {
      vi.spyOn(Date, 'now').mockReturnValue(120_000);
      expect(formatRelativeTime(90_000)).toBe('agora');
    });

    it('returns minutes in Portuguese', () => {
      vi.spyOn(Date, 'now').mockReturnValue(300_000);
      expect(formatRelativeTime(120_000)).toBe('há 3 min');
    });

    it('returns hours in Portuguese', () => {
      vi.spyOn(Date, 'now').mockReturnValue(7_200_000);
      expect(formatRelativeTime(0)).toBe('há 2 h');
    });
  });
});
