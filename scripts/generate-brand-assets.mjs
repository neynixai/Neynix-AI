// Generates the logo files from the mark defined in src/lib/mark.ts:
//   - brand/neynix-mark.svg       vector master of the mark
//   - public/icon.svg             favicon: the mark on a dark rounded tile
//   - public/icon.png             512px app icon
//   - public/apple-icon.png       180px Apple touch icon (square; iOS rounds it)
//
// public/og-image.png (the social preview) is a capture of the site's 3D mark;
// see README.md.
//
// Run with: npm run assets   (Node strips the TypeScript types on import)
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { markSvg } from "../src/lib/mark.ts";

const OBSIDIAN = "#111310";

/** The mark centred on a dark tile; `radius` 0 gives a square tile. */
function tileSvg(size, radius) {
  const inner = size * 0.66;
  const height = inner * 0.88; // the mark's viewBox is 100 × 88
  const mark = markSvg("icon", `x="${(size - inner) / 2}" y="${(size - height) / 2}" width="${inner}" height="${height}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${OBSIDIAN}"/>
  ${mark}
</svg>
`;
}

await writeFile("brand/neynix-mark.svg", markSvg("nx"));
await writeFile("public/icon.svg", tileSvg(64, 14));
await sharp(Buffer.from(tileSvg(512, 112))).png({ compressionLevel: 9 }).toFile("public/icon.png");
await sharp(Buffer.from(tileSvg(180, 0))).png({ compressionLevel: 9 }).toFile("public/apple-icon.png");

console.log("Wrote brand/neynix-mark.svg, public/icon.svg, public/icon.png, public/apple-icon.png.");
