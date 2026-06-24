import { parseClipboardData } from '../shared/clipboardParser';
import { COPY_MESSAGE_SOURCE, COPY_MESSAGE_TYPE } from '../shared/messaging';
import type { ClipboardCopyPayload } from '../shared/types';

function relayCopyPayload(payload: ClipboardCopyPayload): void {
  window.postMessage(
    {
      source: COPY_MESSAGE_SOURCE,
      type: COPY_MESSAGE_TYPE,
      payload,
    },
    window.location.origin
  );
}

function handleClipboardEvent(event: ClipboardEvent): void {
  const dataTransfer = event.clipboardData;
  if (!dataTransfer) {
    return;
  }

  const selection = window.getSelection();
  void parseClipboardData(dataTransfer, selection).then((parsed) => {
    if (!parsed.text && !parsed.imageDataUrl) {
      return;
    }

    relayCopyPayload({
      text: parsed.text,
      imageDataUrl: parsed.imageDataUrl,
      sourceUrl: location.href,
    });
  });
}

function registerListeners(): void {
  document.addEventListener('copy', handleClipboardEvent, true);
  document.addEventListener('cut', handleClipboardEvent, true);
}

export function onExecute(): void {
  registerListeners();
}

onExecute();
