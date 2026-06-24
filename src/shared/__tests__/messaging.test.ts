import { describe, expect, it } from 'vitest';
import { isCopyCaptureMessage } from '../messaging';

describe('messaging', () => {
  it('accepts valid copy capture messages', () => {
    expect(
      isCopyCaptureMessage({
        source: 'clipboard-history',
        type: 'CLIPBOARD_CAPTURE',
        payload: {
          text: 'hello',
          sourceUrl: 'https://example.com',
        },
      })
    ).toBe(true);
  });

  it('rejects messages from other sources', () => {
    expect(
      isCopyCaptureMessage({
        source: 'other-extension',
        type: 'CLIPBOARD_CAPTURE',
        payload: {
          text: 'hello',
          sourceUrl: 'https://example.com',
        },
      })
    ).toBe(false);
  });

  it('rejects empty payloads', () => {
    expect(
      isCopyCaptureMessage({
        source: 'clipboard-history',
        type: 'CLIPBOARD_CAPTURE',
        payload: {
          sourceUrl: 'https://example.com',
        },
      })
    ).toBe(false);
  });
});
