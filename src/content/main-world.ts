import { parseClipboardData } from '../shared/clipboardParser';
import { COPY_CAPTURE_EVENT } from '../shared/messaging';
import type { ClipboardCopyPayload } from '../shared/types';

function relayCopyPayload(payload: ClipboardCopyPayload): void {
  document.dispatchEvent(
    new CustomEvent(COPY_CAPTURE_EVENT, { detail: payload })
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
