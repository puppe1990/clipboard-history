export function extractCopyTextSync(
  dataTransfer: DataTransfer,
  selection?: Selection | null
): string {
  const clipboardText = dataTransfer.getData('text/plain').trim();
  if (clipboardText) {
    return clipboardText;
  }

  return selection?.toString().trim() ?? '';
}
