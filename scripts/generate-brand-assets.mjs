// Generates the logo files from the mark defined in src/lib/mark.ts:
//   - brand/neynix-mark.svg       vector master of the mark
//   - public/icon.svg             favicon: the mark on a dark rounded tile
//   - public/icon.png             512px app icon
//   - public/apple-icon.png       180px Apple touch icon (square; iOS rounds it)
//   - public/favicon.ico          16/32/48px icon at the site root, where Google
//                                 and other crawlers look when no link is followed
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

/** An .ico holding one PNG per size (the PNG-in-ICO form every browser reads). */
async function icoFile(sizes) {
  const pngs = await Promise.all(
    sizes.map((size) => sharp(Buffer.from(tileSvg(size, size * 0.22))).png({ compressionLevel: 9 }).toBuffer()),
  );
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry); // width and height; 0 would mean 256
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4); // colour planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(pngs[i].length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += pngs[i].length;
  });
  return Buffer.concat([header, ...pngs]);
}

await writeFile("brand/neynix-mark.svg", markSvg("nx"));
await writeFile("public/icon.svg", tileSvg(64, 14));
await sharp(Buffer.from(tileSvg(512, 112))).png({ compressionLevel: 9 }).toFile("public/icon.png");
await sharp(Buffer.from(tileSvg(180, 0))).png({ compressionLevel: 9 }).toFile("public/apple-icon.png");
await writeFile("public/favicon.ico", await icoFile([16, 32, 48]));

console.log("Wrote brand/neynix-mark.svg, public/icon.svg, public/icon.png, public/apple-icon.png, public/favicon.ico.");
