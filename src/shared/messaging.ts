import type { ClipboardCopyPayload } from './types';

export const COPY_CAPTURE_EVENT = 'clipboard-history:capture';

export function isValidCopyPayload(
  payload: unknown
): payload is ClipboardCopyPayload {
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
