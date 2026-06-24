import './index.css';
import { formatRelativeTime } from '../shared/format';
import type { ClipboardEntry } from '../shared/types';

const root = document.getElementById('app');
if (!root) {
  throw new Error('Popup root element not found');
}
const app: HTMLElement = root;

let toastTimeout: ReturnType<typeof setTimeout> | undefined;

function getHostname(sourceUrl: string): string {
  try {
    return new URL(sourceUrl).hostname;
  } catch {
    return 'origem desconhecida';
  }
}

function showToast(message: string): void {
  const existing = document.getElementById('toast');
  existing?.remove();
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className =
    'fixed bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-sm px-3 py-1.5 rounded-full shadow-lg';
  toast.textContent = message;
  app.appendChild(toast);

  toastTimeout = setTimeout(() => toast.remove(), 1500);
}

async function copyEntry(entry: ClipboardEntry): Promise<void> {
  if (entry.type === 'text') {
    await navigator.clipboard.writeText(entry.content);
    showToast('Copiado!');
    return;
  }

  const response = await fetch(entry.content);
  const blob = await response.blob();
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
  showToast('Copiado!');
}

function renderEntry(entry: ClipboardEntry): HTMLElement {
  const item = document.createElement('article');
  item.className =
    'group px-4 py-3 hover:bg-zinc-100 transition-colors border-b border-zinc-100 last:border-b-0';

  const row = document.createElement('div');
  row.className = 'flex items-start gap-3';

  const content = document.createElement('button');
  content.type = 'button';
  content.className = 'flex-1 min-w-0 text-left';
  content.addEventListener('click', () => {
    void copyEntry(entry);
  });

  if (entry.type === 'image') {
    const image = document.createElement('img');
    image.src = entry.content;
    image.alt = 'Imagem copiada';
    image.className = 'w-12 h-12 rounded object-cover border border-zinc-200';

    const meta = document.createElement('div');
    meta.className = 'mt-2 space-y-1';

    const badge = document.createElement('span');
    badge.className =
      'inline-flex text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded';
    badge.textContent = 'Imagem';

    const details = document.createElement('p');
    details.className = 'text-xs text-zinc-500';
    details.textContent = `${formatRelativeTime(entry.createdAt)} · ${getHostname(entry.sourceUrl)}`;

    meta.append(badge, details);
    content.append(image, meta);
  } else {
    const preview = document.createElement('p');
    preview.className = 'text-sm line-clamp-2 text-zinc-700';
    preview.textContent = entry.preview;

    const details = document.createElement('p');
    details.className = 'mt-1 text-xs text-zinc-500';
    details.textContent = `${formatRelativeTime(entry.createdAt)} · ${getHostname(entry.sourceUrl)}`;

    content.append(preview, details);
  }

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className =
    'text-xs text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity';
  deleteButton.textContent = 'Excluir';
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    chrome.runtime.sendMessage(
      { type: 'DELETE_ENTRY', entryId: entry.id },
      () => void loadHistory()
    );
  });

  row.append(content, deleteButton);
  item.append(row);
  return item;
}

function renderEmptyState(): HTMLElement {
  const empty = document.createElement('div');
  empty.className =
    'flex flex-col items-center justify-center h-full text-zinc-400 text-sm px-6 text-center';
  empty.textContent = 'Nada copiado ainda';
  return empty;
}

function renderHistory(entries: ClipboardEntry[]): void {
  app.replaceChildren();

  const shell = document.createElement('div');
  shell.className =
    'w-[360px] h-[480px] flex flex-col bg-zinc-50 text-zinc-900';

  const header = document.createElement('header');
  header.className =
    'flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white';

  const title = document.createElement('h1');
  title.className = 'text-sm font-semibold text-zinc-900';
  title.textContent = 'Histórico de cópia';

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'text-xs font-medium text-red-600 hover:text-red-700';
  clearButton.textContent = 'Limpar tudo';
  clearButton.addEventListener('click', () => {
    chrome.runtime.sendMessage(
      { type: 'CLEAR_HISTORY' },
      () => void loadHistory()
    );
  });

  header.append(title, clearButton);

  const list = document.createElement('section');
  list.className = 'flex-1 overflow-y-auto';

  if (entries.length === 0) {
    list.append(renderEmptyState());
  } else {
    for (const entry of entries) {
      list.append(renderEntry(entry));
    }
  }

  shell.append(header, list);
  app.append(shell);
}

function loadHistory(): void {
  chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (response) => {
    if (response?.success && Array.isArray(response.data)) {
      renderHistory(response.data as ClipboardEntry[]);
      return;
    }

    renderHistory([]);
  });
}

loadHistory();
