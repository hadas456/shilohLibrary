import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';
import {
    SHEET_GID,
    SHEET_ID,
    bookDocId,
    catalogFieldsChanged,
    catalogUpdatePayload,
    mapSheetRows,
    newBookPayload,
    parseCsv,
    rowsToObjects
} from '../sheetCatalog';
import { getDeletedSheetKeys } from './books';

const SYNC_COLLECTION = 'settings';
const SYNC_DOC = 'sheetSync';
const BATCH_SIZE = 400;
const PAGE_SIZE = 2000;
const DAY_MS = 24 * 60 * 60 * 1000;

function sheetCsvUrl() {
    return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;
}

function sheetJsonpUrl(limit, offset, callbackName) {
    const query = encodeURIComponent(`limit ${limit} offset ${offset}`);
    const tqx = encodeURIComponent(`out:json;responseHandler:${callbackName}`);
    return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${SHEET_GID}&tq=${query}&tqx=${tqx}`;
}

function loadJsonp(url, callbackName) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const timer = setTimeout(() => {
            cleanup();
            reject(new Error('פג הזמן בטעינת גוגל שיטס'));
        }, 90000);

        const cleanup = () => {
            clearTimeout(timer);
            delete window[callbackName];
            script.remove();
        };

        window[callbackName] = (response) => {
            cleanup();
            if (!response || response.status === 'error') {
                const message = response?.errors?.[0]?.detailed_message || 'שגיאה בקריאת השיטס';
                reject(new Error(message));
                return;
            }
            resolve(response);
        };

        script.src = url;
        script.onerror = () => {
            cleanup();
            reject(new Error('לא ניתן לקרוא את השיטס. ודאי שהוא משותף לצפייה.'));
        };
        document.body.appendChild(script);
    });
}

function tableToRows(table) {
    const headers = (table.cols || []).map((col) => String(col.label || col.id || '').trim());
    const rows = (table.rows || []).map((row) =>
        headers.map((_, index) => {
            const cell = row.c?.[index];
            if (!cell || cell.v == null) return '';
            return cell.f != null ? String(cell.f) : String(cell.v);
        })
    );
    return [headers, ...rows];
}

async function fetchSheetRowsFromCsv() {
    const response = await fetch(sheetCsvUrl());
    if (!response.ok) {
        throw new Error('לא ניתן לקרוא את גוגל שיטס');
    }
    return rowsToObjects(parseCsv(await response.text()));
}

async function fetchSheetRowsFromJsonp() {
    const allRows = [];
    let offset = 0;
    let headers = null;

    while (true) {
        const callbackName = `sheetSync_${Date.now()}_${offset}`;
        const response = await loadJsonp(sheetJsonpUrl(PAGE_SIZE, offset, callbackName), callbackName);
        const tableRows = tableToRows(response.table);
        if (!headers) headers = tableRows[0];
        const dataRows = offset === 0 ? tableRows.slice(1) : tableRows.slice(1);
        allRows.push(...dataRows);
        if (dataRows.length < PAGE_SIZE) break;
        offset += PAGE_SIZE;
    }

    return rowsToObjects([headers, ...allRows]);
}

export async function fetchSheetCatalogRows() {
    if (typeof window === 'undefined') {
        return fetchSheetRowsFromCsv();
    }

    try {
        return await fetchSheetRowsFromJsonp();
    } catch (jsonpError) {
        try {
            return await fetchSheetRowsFromCsv();
        } catch {
            throw jsonpError;
        }
    }
}

function readLocalSyncState() {
    const saved = localStorage.getItem('sheetSyncState');
    return saved ? JSON.parse(saved) : null;
}

function writeLocalSyncState(state) {
    localStorage.setItem('sheetSyncState', JSON.stringify(state));
}

export async function getSheetSyncState() {
    if (!isFirebaseEnabled) {
        return readLocalSyncState();
    }

    try {
        const snapshot = await getDoc(doc(db, SYNC_COLLECTION, SYNC_DOC));
        return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
        console.error('שגיאה בטעינת מצב סנכרון:', error);
        return readLocalSyncState();
    }
}

export function shouldRunDailySync(state, now = Date.now()) {
    if (!state?.lastSyncedAt) return false;
    const last = new Date(state.lastSyncedAt).getTime();
    if (Number.isNaN(last)) return false;
    return now - last >= DAY_MS;
}

async function saveSyncState(state) {
    writeLocalSyncState(state);

    if (!isFirebaseEnabled) return;

    await setDoc(doc(db, SYNC_COLLECTION, SYNC_DOC), {
        ...state,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

async function loadExistingBooks() {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryBooks');
        return saved ? JSON.parse(saved) : [];
    }

    const snapshot = await getDocs(collection(db, 'books'));
    const books = [];
    snapshot.forEach((docSnap) => {
        books.push({ id: docSnap.id, ...docSnap.data() });
    });
    return books;
}

function indexExistingBooks(books) {
    const byKey = new Map();
    for (const book of books) {
        if (book.sheetKey) byKey.set(book.sheetKey, book);
    }
    return byKey;
}

async function commitBatches(operations, onProgress) {
    for (let i = 0; i < operations.length; i += BATCH_SIZE) {
        const chunk = operations.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(db);

        chunk.forEach(({ type, ref, data }) => {
            if (type === 'set') batch.set(ref, data);
            else batch.update(ref, data);
        });

        await batch.commit();
        onProgress?.(Math.min(i + chunk.length, operations.length), operations.length);
    }
}

async function syncLocalBooks(existingBooks, incomingBooks, onProgress) {
    const byKey = indexExistingBooks(existingBooks);
    let created = 0;
    let updated = 0;
    let unchanged = 0;
    const nextBooks = [...existingBooks];

    incomingBooks.forEach((incoming, index) => {
        const existing = byKey.get(incoming.sheetKey);
        if (!existing) {
            const createdBook = {
                id: bookDocId(incoming.sheetKey),
                ...newBookPayload(incoming),
                createdAt: new Date().toISOString()
            };
            nextBooks.push(createdBook);
            byKey.set(incoming.sheetKey, createdBook);
            created += 1;
        } else if (catalogFieldsChanged(existing, incoming)) {
            const payload = {
                ...catalogUpdatePayload(incoming),
                updatedAt: new Date().toISOString()
            };
            const bookIndex = nextBooks.findIndex((book) => book.id === existing.id);
            if (bookIndex >= 0) {
                nextBooks[bookIndex] = { ...nextBooks[bookIndex], ...payload };
            }
            updated += 1;
        } else {
            unchanged += 1;
        }

        if ((index + 1) % 500 === 0) {
            onProgress?.(index + 1, incomingBooks.length);
        }
    });

    localStorage.setItem('libraryBooks', JSON.stringify(nextBooks));
    onProgress?.(incomingBooks.length, incomingBooks.length);
    return { created, updated, unchanged };
}

export async function syncBooksFromSheet({ onProgress } = {}) {
    const rows = await fetchSheetCatalogRows();
    const incomingBooks = mapSheetRows(rows);
    const [existingBooks, deletedKeys] = await Promise.all([
        loadExistingBooks(),
        getDeletedSheetKeys()
    ]);
    const deleted = new Set(deletedKeys);
    const syncableBooks = incomingBooks.filter((book) => !deleted.has(book.sheetKey));

    onProgress?.(0, syncableBooks.length);

    let created = 0;
    let updated = 0;
    let unchanged = 0;

    if (!isFirebaseEnabled) {
        ({ created, updated, unchanged } = await syncLocalBooks(existingBooks, syncableBooks, onProgress));
    } else {
        const byKey = indexExistingBooks(existingBooks);
        const operations = [];

        for (const incoming of syncableBooks) {
            const existing = byKey.get(incoming.sheetKey);
            if (!existing) {
                operations.push({
                    type: 'set',
                    ref: doc(db, 'books', bookDocId(incoming.sheetKey)),
                    data: {
                        ...newBookPayload(incoming),
                        createdAt: serverTimestamp()
                    }
                });
                created += 1;
            } else if (catalogFieldsChanged(existing, incoming)) {
                operations.push({
                    type: 'update',
                    ref: doc(db, 'books', existing.id),
                    data: {
                        ...catalogUpdatePayload(incoming),
                        updatedAt: serverTimestamp()
                    }
                });
                updated += 1;
            } else {
                unchanged += 1;
            }
        }

        if (operations.length > 0) {
            await commitBatches(operations, onProgress);
        } else {
            onProgress?.(syncableBooks.length, syncableBooks.length);
        }
    }

    const result = {
        lastSyncedAt: new Date().toISOString(),
        totalRows: rows.length,
        imported: incomingBooks.length,
        created,
        updated,
        unchanged
    };

    await saveSyncState(result);
    return result;
}
