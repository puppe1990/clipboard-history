import { COPY_CAPTURE_EVENT, isValidCopyPayload } from '../shared/messaging';
import type { ClipboardCopyPayload } from '../shared/types';

function sendCopyToBackground(payload: ClipboardCopyPayload): void {
  chrome.runtime.sendMessage(
    {
      type: 'CLIPBOARD_COPY',
      payload,
    },
    () => {
      const error = chrome.runtime.lastError;
      if (error) {
        console.warn('[clipboard-history]', error.message);
      }
    }
  );
}

function handleCaptureEvent(event: Event): void {
  const detail = (event as CustomEvent).detail;
  if (!isValidCopyPayload(detail)) {
    return;
  }

  sendCopyToBackground(detail);
}

export function onExecute(): void {
  document.addEventListener(COPY_CAPTURE_EVENT, handleCaptureEvent);
}

onExecute();
