import { describe, expect, it } from 'vitest';
import { extractCopyTextSync } from '../copyCapture';

function createDataTransfer(text?: string): DataTransfer {
  const dataTransfer = new DataTransfer();
  if (text) {
    dataTransfer.setData('text/plain', text);
  }
  return dataTransfer;
}

describe('copyCapture', () => {
  it('prefers clipboard text over selection', () => {
    const selection = {
      toString: () => 'selected text',
    } as Selection;

    expect(
      extractCopyTextSync(createDataTransfer('clipboard text'), selection)
    ).toBe('clipboard text');
  });

  it('falls back to selected text when clipboard text is empty', () => {
    const selection = {
      toString: () => 'selected text',
    } as Selection;

    expect(extractCopyTextSync(createDataTransfer(), selection)).toBe(
      'selected text'
    );
  });
});
