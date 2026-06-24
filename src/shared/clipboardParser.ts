import { MAX_IMAGE_BYTES } from './constants';

export interface ParsedClipboardContent {
  text?: string;
  imageDataUrl?: string;
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Failed to convert blob to data URL'));
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

export async function readImageItem(
  dataTransfer: DataTransfer
): Promise<string | null> {
  const imageItem = Array.from(dataTransfer.items).find((item) =>
    item.type.startsWith('image/')
  );

  if (!imageItem) {
    return null;
  }

  const file = imageItem.getAsFile();
  if (!file || file.size > MAX_IMAGE_BYTES) {
    return null;
  }

  return blobToDataUrl(file);
}

function readSelectedText(selection: Selection | null | undefined): string {
  const text = selection?.toString().trim();
  return text ?? '';
}

export async function parseClipboardData(
  dataTransfer: DataTransfer,
  selection?: Selection | null
): Promise<ParsedClipboardContent> {
  const text =
    dataTransfer.getData('text/plain').trim() || readSelectedText(selection);
  const imageDataUrl = await readImageItem(dataTransfer);
  const result: ParsedClipboardContent = {};

  if (text) {
    result.text = text;
  }

  if (imageDataUrl) {
    result.imageDataUrl = imageDataUrl;
  }

  return result;
}
