export type ClipboardEntryType = 'text' | 'image';

export interface ClipboardEntry {
  id: string;
  type: ClipboardEntryType;
  content: string;
  preview: string;
  sourceUrl: string;
  createdAt: number;
}

export interface ClipboardCopyPayload {
  text?: string;
  imageDataUrl?: string;
  sourceUrl: string;
}
