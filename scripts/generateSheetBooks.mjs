import { writeFile, mkdir, stat } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
    SHEET_GID,
    SHEET_ID,
    mapSheetRows,
    parseCsv,
    rowsToObjects,
    toCatalogBook
} from '../src/utils/sheetCatalog.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const outputPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'shiloh-books.json');

async function isFresh(maxAgeMs = DAY_MS) {
    try {
        const info = await stat(outputPath);
        return Date.now() - info.mtimeMs < maxAgeMs;
    } catch {
        return false;
    }
}

const force = process.argv.includes('--force');
if (!force && await isFresh()) {
    console.log('shiloh-books.json is less than a day old — skipping');
    process.exit(0);
}

const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;
console.log('Downloading catalog from Google Sheets...');
const response = await fetch(url);
if (!response.ok) {
    throw new Error(`Sheet download failed: ${response.status}`);
}

const books = mapSheetRows(rowsToObjects(parseCsv(await response.text()))).map(toCatalogBook);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(books));
console.log(`Wrote ${books.length} books to public/shiloh-books.json`);
