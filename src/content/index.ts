import { parseClipboardData } from '../shared/clipboardParser';

document.addEventListener(
  'copy',
  (event) => {
    const dataTransfer = event.clipboardData;
    if (!dataTransfer) {
      return;
    }

    void handleCopy(dataTransfer);
  },
  true
);

async function handleCopy(dataTransfer: DataTransfer): Promise<void> {
  const parsed = await parseClipboardData(dataTransfer, window.getSelection());
  if (!parsed.text && !parsed.imageDataUrl) {
    return;
  }

  chrome.runtime.sendMessage({
    type: 'CLIPBOARD_COPY',
    payload: {
      text: parsed.text,
      imageDataUrl: parsed.imageDataUrl,
      sourceUrl: location.href,
    },
  });
}
