import type { ClipboardCopyPayload } from './types';

export const COPY_MESSAGE_SOURCE = 'clipboard-history';
export const COPY_MESSAGE_TYPE = 'CLIPBOARD_CAPTURE';

export interface CopyCaptureMessage {
  source: typeof COPY_MESSAGE_SOURCE;
  type: typeof COPY_MESSAGE_TYPE;
  payload: ClipboardCopyPayload;
}

export function isCopyCaptureMessage(
  data: unknown
): data is CopyCaptureMessage {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const message = data as Partial<CopyCaptureMessage>;
  if (
    message.source !== COPY_MESSAGE_SOURCE ||
    message.type !== COPY_MESSAGE_TYPE
  ) {
    return false;
  }

  const payload = message.payload;
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const { text, imageDataUrl, sourceUrl } = payload as ClipboardCopyPayload;
  const hasText = typeof text === 'string' && text.length > 0;
  const hasImage = typeof imageDataUrl === 'string' && imageDataUrl.length > 0;

  return (
    (hasText || hasImage) &&
    typeof sourceUrl === 'string' &&
    sourceUrl.length > 0
  );
}
