import { describe, expect, it } from 'vitest';
import { isValidCopyPayload } from '../messaging';

describe('messaging', () => {
  it('accepts valid copy payloads', () => {
    expect(
      isValidCopyPayload({
        text: 'hello',
        sourceUrl: 'https://example.com',
      })
    ).toBe(true);
  });

  it('accepts file urls as source', () => {
    expect(
      isValidCopyPayload({
        text: 'hello',
        sourceUrl: 'file:///Users/test/page.html',
      })
    ).toBe(true);
  });

  it('rejects empty payloads', () => {
    expect(
      isValidCopyPayload({
        sourceUrl: 'https://example.com',
      })
    ).toBe(false);
  });
});
