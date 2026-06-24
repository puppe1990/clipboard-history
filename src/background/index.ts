import {
  addEntry,
  clearHistory,
  deleteEntry,
  entriesFromPayload,
} from '../shared/clipboardHistory';
import type { ClipboardCopyPayload } from '../shared/types';
import { readHistory, writeHistory } from '../shared/storage';

type RuntimeMessage =
  | { type: 'CLIPBOARD_COPY'; payload: ClipboardCopyPayload }
  | { type: 'GET_HISTORY' }
  | { type: 'DELETE_ENTRY'; entryId: string }
  | { type: 'CLEAR_HISTORY' };

chrome.runtime.onMessage.addListener(
  (message: RuntimeMessage, _sender, sendResponse) => {
    void handleMessage(message)
      .then((response) => sendResponse(response))
      .catch((error: unknown) => {
        console.error('[clipboard-history]', error);
        sendResponse({ success: false });
      });

    return true;
  }
);

async function handleMessage(message: RuntimeMessage) {
  switch (message.type) {
    case 'CLIPBOARD_COPY': {
      const history = await readHistory();
      const newEntries = entriesFromPayload(message.payload);
      if (newEntries.length === 0) {
        return { success: true };
      }

      const updated = newEntries.reduce(
        (current, entry) => addEntry(current, entry),
        history
      );
      await writeHistory(updated);

      return { success: true };
    }
    case 'GET_HISTORY':
      return { success: true, data: await readHistory() };
    case 'DELETE_ENTRY': {
      const history = await readHistory();
      await writeHistory(deleteEntry(history, message.entryId));
      return { success: true };
    }
    case 'CLEAR_HISTORY':
      await writeHistory(clearHistory());
      return { success: true };
    default:
      return { success: false };
  }
}
