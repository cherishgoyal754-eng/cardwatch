#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const CARDS_DIR = path.resolve(process.cwd(), 'public', 'cards');

async function optimizeAll() {
  const files = fs
    .readdirSync(CARDS_DIR)
    .filter(f => /\.(png|jpe?g)$/i.test(f));

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const srcPath = path.join(CARDS_DIR, file);
    const outName = file.replace(/\.(png|jpe?g)$/i, '.webp');
    const outPath = path.join(CARDS_DIR, outName);

    const beforeBytes = fs.statSync(srcPath).size;
    totalBefore += beforeBytes;

    const image = sharp(srcPath);
    const meta = await image.metadata();
    const isPortrait = (meta.height || 0) > (meta.width || 0);

    const pipeline = isPortrait
      ? image.resize({ height: 760, withoutEnlargement: true })
      : image.resize({ width: 720, withoutEnlargement: true });

    await pipeline
      .webp({
        quality: 82,
        alphaQuality: 90,
        effort: 6,
      })
      .toFile(outPath);

    const afterBytes = fs.statSync(outPath).size;
    totalAfter += afterBytes;

    const pct = (((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1);
    console.log(
      `${file.padEnd(36)} ${(beforeBytes / 1024).toFixed(1).padStart(7)} KB -> ${outName.padEnd(37)} ${(afterBytes / 1024).toFixed(1).padStart(6)} KB (-${pct}%)`
    );
  }

  console.log('\n====================================================');
  console.log(
    `Total Before: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB | Total After WebP: ${(totalAfter / (1024 * 1024)).toFixed(2)} MB (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`
  );
  console.log('====================================================');
}

optimizeAll().catch(err => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
