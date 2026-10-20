// Generates web-ready logo assets from the supplied raster logo.
// Source: brand/neynix-logo-source.webp (monochrome N on a white background).
//
// The logo is greyscale, so luminance maps cleanly to an alpha mask:
//   - neynix-mark.png        black + alpha  -> identical to the source on light backgrounds
//   - neynix-mark-light.png  white + alpha  -> reversed treatment for dark backgrounds
//
// Run with: npm run assets
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SOURCE = "brand/neynix-logo-source.webp";
const WHITE_POINT = 250; // anything lighter is treated as background

const { data, info } = await sharp(SOURCE)
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Tight bounding box around the symbol, with a little breathing room.
let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[y * info.width + x] < 235) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
}
const PAD = 6;
const left = Math.max(0, minX - PAD);
const top = Math.max(0, minY - PAD);
const width = Math.min(info.width, maxX + PAD + 1) - left;
const height = Math.min(info.height, maxY + PAD + 1) - top;

function maskedMark(channelValue) {
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const lum = data[(y + top) * info.width + (x + left)];
      const alpha = Math.max(0, Math.min(255, Math.round(((WHITE_POINT - lum) / WHITE_POINT) * 255)));
      const i = (y * width + x) * 4;
      out[i] = out[i + 1] = out[i + 2] = channelValue;
      out[i + 3] = alpha;
    }
  }
  return sharp(out, { raw: { width, height, channels: 4 } });
}

await mkdir("public/brand", { recursive: true });

await maskedMark(0).png({ compressionLevel: 9 }).toFile("public/brand/neynix-mark.png");
await maskedMark(255).png({ compressionLevel: 9 }).toFile("public/brand/neynix-mark-light.png");

// App icons: the symbol on a white tile, so it reads in light and dark browser chrome.
async function appIcon(size, radius, file) {
  const inner = Math.round(size * 0.68);
  const mark = await maskedMark(0)
    .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const tile = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#ffffff"/></svg>`,
  );
  await sharp(tile)
    .composite([{ input: mark, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(file);
}

await appIcon(512, 112, "app/icon.png");
await appIcon(180, 0, "app/apple-icon.png");

console.log(`Mark cropped to ${width}x${height} (from ${info.width}x${info.height}).`);
