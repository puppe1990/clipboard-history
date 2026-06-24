import { isCopyCaptureMessage } from '../shared/messaging';
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

function handleWindowMessage(event: MessageEvent): void {
  if (event.source !== window) {
    return;
  }

  if (event.origin !== window.location.origin) {
    return;
  }

  if (!isCopyCaptureMessage(event.data)) {
    return;
  }

  sendCopyToBackground(event.data.payload);
}

export function onExecute(): void {
  window.addEventListener('message', handleWindowMessage);
}

onExecute();
