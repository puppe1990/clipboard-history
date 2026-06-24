import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ICON_NAME = 'clipboard-list';
const ICON_COLOR = '#2563eb';
const SIZES = [16, 48, 128];

const sourcePath = path.join(
  __dirname,
  '../node_modules/lucide-static/icons',
  `${ICON_NAME}.svg`
);
const outputDir = path.join(__dirname, '../icons');

function buildSvg(size) {
  const raw = fs.readFileSync(sourcePath, 'utf8');
  return raw
    .replace(/stroke="currentColor"/g, `stroke="${ICON_COLOR}"`)
    .replace(/width="24"/, `width="${size}"`)
    .replace(/height="24"/, `height="${size}"`);
}

for (const size of SIZES) {
  const svg = buildSvg(size);
  const outputPath = path.join(outputDir, `icon${size}.png`);
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outputPath);
  console.log(`Generated ${outputPath}`);
}
