# Clipboard History

Chrome extension that automatically saves what you copy in the browser and shows the history in the popup.

> Portuguese version: [README.pt-BR.md](./README.pt-BR.md)

## Features

- Captures **text** and **images** when you copy on any site
- Persistent history with `chrome.storage.local`
- Popup to view, re-copy, delete items, or clear all
- Deduplicates repeated entries
- Keeps up to 100 items in history

## Development install

```bash
npm install
npm run build
```

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder

## Usage

1. Copy text or an image on any page
2. Click the extension icon
3. Select an item to copy it back to the clipboard

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Dev server with hot reload       |
| `npm run build`        | Build extension to `dist/`       |
| `npm test`             | Run tests in watch mode (Vitest) |
| `npm run test:run`     | Run tests once                   |
| `npm run lint`         | ESLint                           |
| `npm run format`       | Prettier (write)                 |
| `npm run format:check` | Check formatting                 |
| `npm run typecheck`    | TypeScript                       |
| `npm run icons`        | Regenerate extension icons       |

## Architecture

```
src/
├── content/      # Listens for copy events on pages
├── background/   # Persists history to storage
├── popup/        # History UI (Tailwind CSS)
└── shared/       # Testable logic (history, parser, storage)
```

## Local files (`file://`)

To capture copies from HTML opened from disk (e.g. `file:///Users/.../page.html`), Chrome requires a manual permission:

1. Open `chrome://extensions`
2. Find **Clipboard History**
3. Enable **Allow access to file URLs**
4. Reload the HTML page

The popup shows a yellow warning when you are on a local file without that permission.

## Limitations

- Does not work on restricted pages (`chrome://`, Chrome Web Store, etc.)
- Does not capture copies made outside the browser
- Images larger than 500 KB are ignored
- Some sites do not expose images in the `copy` event

## Quality

- Vitest tests (TDD)
- ESLint + Prettier
- Husky + lint-staged pre-commit hooks
- GitHub Actions CI

## License

MIT
