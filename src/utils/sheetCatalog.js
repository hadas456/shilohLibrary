import { CATALOG_TOPICS } from '../data/shilohCatalog.js';

const env = import.meta.env || {};
export const SHEET_ID = env.VITE_GOOGLE_SHEETS_ID || '1oWDUW3aeNSeZlS_vkgYoE8eajhXlB720gjt_JQPSFGs';
export const SHEET_GID = env.VITE_GOOGLE_SHEETS_GID || '693032942';

const TOPIC_BY_LETTER = Object.fromEntries(
    CATALOG_TOPICS.map((topic) => [topic.letter, topic])
);

const HEADER_ALIASES = {
    serial: ["מס' סידורי", 'מס סידורי', 'מספר סידורי'],
    copy: ['עותק'],
    title: ['שם הספר'],
    author: ['שם המחבר'],
    alias: ['כינוי המחבר'],
    notes: ['הערות'],
    publisher: ['הוצאה'],
    year: ['שנה'],
    topicId: ['מזהה נושא', 'מזהה'],
    presence: ['נוכחות'],
    room: ['חדר'],
    locationId: ['מזהה מיקום'],
    shelf: ['מדף'],
    nationalId: ['מ ספרייה לאומית', 'מספרייה לאומית', "מ' ספרייה לאומית"]
};

export function normalizeHeader(value) {
    return String(value || '')
        .replace(/['׳’"]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function headerIndex(headers) {
    const normalized = headers.map(normalizeHeader);
    const index = {};

    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
        index[field] = normalized.findIndex((header) =>
            aliases.some((alias) => normalizeHeader(alias) === header)
        );
    }

    return index;
}

export function parseCsv(csv) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < csv.length; i += 1) {
        const char = csv[i];

        if (inQuotes) {
            if (char === '"') {
                if (csv[i + 1] === '"') {
                    cell += '"';
                    i += 1;
                } else {
                    inQuotes = false;
                }
            } else {
                cell += char;
            }
        } else if (char === '"') {
            inQuotes = true;
        } else if (char === ',') {
            row.push(cell);
            cell = '';
        } else if (char === '\n') {
            row.push(cell);
            rows.push(row);
            row = [];
            cell = '';
        } else if (char !== '\r') {
            cell += char;
        }
    }

    if (cell || row.length) {
        row.push(cell);
        rows.push(row);
    }

    return rows.filter((item) => item.some((value) => String(value || '').trim()));
}

export function rowsToObjects(rows) {
    if (!rows.length) return [];

    const headers = rows[0].map((header) => String(header || '').trim());
    const index = headerIndex(headers);

    return rows.slice(1).map((row) => {
        const read = (field) => {
            const column = index[field];
            if (column < 0) return '';
            const value = row[column];
            return value == null ? '' : String(value).trim();
        };

        return {
            serial: read('serial'),
            copy: read('copy'),
            title: read('title'),
            author: read('author'),
            alias: read('alias'),
            notes: read('notes'),
            publisher: read('publisher'),
            year: read('year'),
            topicId: read('topicId'),
            presence: read('presence'),
            room: read('room'),
            locationId: read('locationId'),
            shelf: read('shelf'),
            nationalId: read('nationalId')
        };
    });
}

export function parseTopicId(raw) {
    const text = String(raw || '').trim();
    if (!text) return null;

    const match = text.match(/([א-ת])\s*-?\s*(\d+)\*?/) || text.match(/(\d+)\s*-?\s*([א-ת])/);
    if (!match) return null;

    const letter = /[א-ת]/.test(match[1]) ? match[1] : match[2];
    const number = /[א-ת]/.test(match[1]) ? match[2] : match[1];
    return { letter, number };
}

function categoryFromTopicName(name = '') {
    if (/שו["״]?ת/.test(name)) return 'responsa';
    if (/תפיל|חסיד|קבל/.test(name)) return 'prayer';
    if (/מחשב|מוסר/.test(name)) return 'thought';
    if (/מדרש/.test(name)) return 'midrash';
    if (/משנ|גמרא|ש["״]ס|תלמוד/.test(name)) return 'talmud';
    if (/נביא|כתובים/.test(name)) return 'nevi';
    if (/הלכ|שולחן|אורח|יורה|חושן|אבן העזר|טור|רמב"?ם/.test(name)) return 'halacha';
    if (/היסטור|ארץ ישראל|זכרון|מילון|כתבי עת|עברית/.test(name)) return 'history';
    if (/תורה/.test(name)) return 'torah';
    return 'thought';
}

function buildDescription(row) {
    return [row.alias, row.publisher, row.year, row.notes]
        .map((value) => String(value || '').trim())
        .filter(Boolean)
        .join(' · ');
}

export function buildSheetKey(row, duplicateIndex = 1) {
    const serial = String(row.serial || '').trim();
    const copy = String(row.copy || '1').trim() || '1';
    const title = String(row.title || '').replace(/\s+/g, ' ').trim();
    const base = `${serial}__${copy}__${title}`;
    return duplicateIndex > 1 ? `${base}__${duplicateIndex}` : base;
}

export function bookDocId(sheetKey) {
    return `sheet_${sheetKey}`.replace(/\//g, '_').slice(0, 1400);
}

export function mapSheetRow(row, duplicateIndex = 1) {
    const title = String(row.title || '').replace(/\s+/g, ' ').trim();
    const serial = String(row.serial || '').trim();
    if (!title || !serial) return null;

    const parsedTopic = parseTopicId(row.topicId);
    const topic = parsedTopic ? TOPIC_BY_LETTER[parsedTopic.letter] : null;
    const sheetKey = buildSheetKey(row, duplicateIndex);

    return {
        sheetKey,
        serialNumber: serial,
        copyNumber: String(row.copy || '').trim(),
        title,
        author: String(row.author || '').trim() || 'לא צוין',
        authorAlias: String(row.alias || '').trim(),
        notes: String(row.notes || '').trim(),
        publisher: String(row.publisher || '').trim(),
        year: String(row.year || '').trim(),
        topicId: parsedTopic ? `${parsedTopic.letter}${parsedTopic.number}` : String(row.topicId || '').trim(),
        location: {
            color: topic?.color || '',
            letter: parsedTopic?.letter || '',
            number: parsedTopic?.number || ''
        },
        category: categoryFromTopicName(topic?.name),
        catalogTopic: topic?.name || '',
        description: buildDescription(row),
        room: String(row.room || '').trim(),
        shelf: String(row.shelf || '').trim(),
        locationId: String(row.locationId || '').trim(),
        sheetPresence: String(row.presence || '').trim(),
        nationalLibraryId: String(row.nationalId || '').trim(),
        source: 'google-sheets'
    };
}

export function mapSheetRows(rows) {
    const seen = new Map();
    const books = [];

    for (const row of rows) {
        const baseKey = buildSheetKey(row, 1);
        const count = (seen.get(baseKey) || 0) + 1;
        seen.set(baseKey, count);
        const mapped = mapSheetRow(row, count);
        if (mapped) books.push(mapped);
    }

    return books;
}

export function catalogFieldsChanged(existing, incoming) {
    const currentLocation = existing.location || {};
    const nextLocation = incoming.location || {};

    return (
        existing.title !== incoming.title ||
        existing.author !== incoming.author ||
        existing.description !== incoming.description ||
        existing.category !== incoming.category ||
        currentLocation.color !== nextLocation.color ||
        currentLocation.letter !== nextLocation.letter ||
        currentLocation.number !== nextLocation.number ||
        existing.publisher !== incoming.publisher ||
        existing.year !== incoming.year ||
        existing.topicId !== incoming.topicId ||
        existing.room !== incoming.room ||
        existing.shelf !== incoming.shelf ||
        existing.sheetPresence !== incoming.sheetPresence ||
        existing.copyNumber !== incoming.copyNumber
    );
}

export function catalogUpdatePayload(incoming) {
    return {
        sheetKey: incoming.sheetKey,
        serialNumber: incoming.serialNumber,
        copyNumber: incoming.copyNumber,
        title: incoming.title,
        author: incoming.author,
        authorAlias: incoming.authorAlias,
        notes: incoming.notes,
        publisher: incoming.publisher,
        year: incoming.year,
        topicId: incoming.topicId,
        location: incoming.location,
        category: incoming.category,
        catalogTopic: incoming.catalogTopic,
        description: incoming.description,
        room: incoming.room,
        shelf: incoming.shelf,
        locationId: incoming.locationId,
        sheetPresence: incoming.sheetPresence,
        nationalLibraryId: incoming.nationalLibraryId,
        source: 'google-sheets'
    };
}

export function newBookPayload(incoming) {
    return {
        ...catalogUpdatePayload(incoming),
        images: [],
        image: '/api/placeholder/200/250',
        rating: 4.0,
        status: 'available'
    };
}

export function toCatalogBook(incoming) {
    return {
        id: bookDocId(incoming.sheetKey),
        ...newBookPayload(incoming)
    };
}

export function mergeCatalogBooks(sheetBooks, storedBooks = [], deletedKeys = []) {
    const deleted = new Set((deletedKeys || []).filter(Boolean));
    const byKey = new Map();

    for (const book of sheetBooks) {
        if (book?.sheetKey && !deleted.has(book.sheetKey)) {
            byKey.set(book.sheetKey, book);
        }
    }

    const extras = [];
    for (const book of storedBooks) {
        if (book?.sheetKey && deleted.has(book.sheetKey)) {
            continue;
        }
        if (book?.sheetKey && byKey.has(book.sheetKey)) {
            byKey.set(book.sheetKey, { ...byKey.get(book.sheetKey), ...book });
        } else {
            extras.push(book);
        }
    }

    return [...byKey.values(), ...extras];
}

export async function loadPublishedSheetBooks() {
    const response = await fetch('/shiloh-books.json', { cache: 'no-cache' });
    if (!response.ok) {
        throw new Error('לא נמצא קובץ הקטלוג');
    }
    const books = await response.json();
    return Array.isArray(books) ? books : [];
}
