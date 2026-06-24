import { describe, it, expect } from 'vitest';
import {
  blobToDataUrl,
  parseClipboardData,
  readImageItem,
} from '../clipboardParser';
import { MAX_IMAGE_BYTES } from '../constants';

function createDataTransfer(init: {
  text?: string;
  imageBlob?: Blob;
}): DataTransfer {
  const dataTransfer = new DataTransfer();
  if (init.text) {
    dataTransfer.setData('text/plain', init.text);
  }
  if (init.imageBlob) {
    dataTransfer.items.add(init.imageBlob as File);
  }
  return dataTransfer;
}

describe('clipboardParser', () => {
  describe('parseClipboardData', () => {
    it('extracts plain text from clipboard data', async () => {
      const dataTransfer = createDataTransfer({ text: '  copied text  ' });

      await expect(parseClipboardData(dataTransfer)).resolves.toEqual({
        text: 'copied text',
      });
    });

    it('extracts image data as a data url', async () => {
      const imageBlob = new Blob(['fake-image'], { type: 'image/png' });
      const dataTransfer = createDataTransfer({ imageBlob });

      const result = await parseClipboardData(dataTransfer);

      expect(result.imageDataUrl).toMatch(/^data:image\/png;base64,/);
    });

    it('rejects images larger than MAX_IMAGE_BYTES', async () => {
      const largeBytes = new Uint8Array(MAX_IMAGE_BYTES + 1);
      const imageBlob = new Blob([largeBytes], { type: 'image/png' });
      const dataTransfer = createDataTransfer({ imageBlob });

      await expect(parseClipboardData(dataTransfer)).resolves.toEqual({});
    });

    it('falls back to selected text when clipboard text is empty', async () => {
      const selection = window.getSelection();
      if (!selection) {
        throw new Error('Selection API unavailable in test environment');
      }

      const range = document.createRange();
      const node = document.createElement('div');
      node.textContent = 'selected text';
      document.body.appendChild(node);
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);

      const dataTransfer = createDataTransfer({});

      await expect(
        parseClipboardData(dataTransfer, selection)
      ).resolves.toEqual({
        text: 'selected text',
      });

      selection.removeAllRanges();
      node.remove();
    });
  });

  describe('readImageItem', () => {
    it('returns null when clipboard has no image item', async () => {
      const dataTransfer = createDataTransfer({ text: 'only text' });
      await expect(readImageItem(dataTransfer)).resolves.toBeNull();
    });
  });

  describe('blobToDataUrl', () => {
    it('converts a blob into a data url', async () => {
      const blob = new Blob(['abc'], { type: 'image/png' });
      await expect(blobToDataUrl(blob)).resolves.toMatch(
        /^data:image\/png;base64,/
      );
    });
  });
});
