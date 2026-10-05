/** Reproducible asset QA. Run the dev server, then node scripts/audit-assets.mjs. */
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' });
const page = await browser.newPage();
await page.goto(`${process.env.ART_PREVIEW_URL || 'http://127.0.0.1:5173'}/assets/manifest.json`);
const result = await page.evaluate(async () => {
 const manifest = await (await fetch('/assets/manifest.json')).json();
 const issues = [], sheets = [];
 for (const [key, asset] of Object.entries(manifest.assets)) {
  const image = new Image(); image.src = asset.path;
  try { await image.decode(); } catch { issues.push({ key, error: 'SVG cannot be decoded' }); continue; }
  if (image.naturalWidth !== asset.width || image.naturalHeight !== asset.height) issues.push({ key, error: 'Manifest dimension mismatch' });
  if (asset.frames <= 1) continue;
  const canvas = document.createElement('canvas'); canvas.width = asset.width; canvas.height = asset.height;
  const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let touched = 0, empty = 0;
  for (let frame = 0; frame < asset.frames; frame++) {
   let opaque = 0, border = 0;
   for (let y = 0; y < asset.frameHeight; y++) for (let x = 0; x < asset.frameWidth; x++) {
    const alpha = pixels[(y * asset.width + frame * asset.frameWidth + x) * 4 + 3];
    if (alpha > 8) { opaque++; if (x === 0 || x === asset.frameWidth - 1 || y === 0 || y === asset.frameHeight - 1) border++; }
   }
   if (!opaque) empty++; if (border) touched++;
  }
  if (empty || touched) issues.push({ key, emptyFrames: empty, clippedFrames: touched });
  sheets.push({ key, frames: asset.frames });
 }
 return { assets: Object.keys(manifest.assets).length, sheets: sheets.length, frames: sheets.reduce((n, sheet) => n + sheet.frames, 0), issues };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
if (result.issues.length) process.exitCode = 1;
