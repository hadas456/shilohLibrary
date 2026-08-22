import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';

const DELETED_KEYS_STORAGE = 'deletedSheetKeys';
const DELETED_KEYS_COLLECTION = 'settings';
const DELETED_KEYS_DOC = 'deletedSheetKeys';

function readLocalDeletedKeys() {
    try {
        const saved = localStorage.getItem(DELETED_KEYS_STORAGE);
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
        return [];
    }
}

function writeLocalDeletedKeys(keys) {
    localStorage.setItem(DELETED_KEYS_STORAGE, JSON.stringify([...new Set(keys)]));
}

export async function getDeletedSheetKeys() {
    const localKeys = readLocalDeletedKeys();
    if (!isFirebaseEnabled || !db) return localKeys;

    try {
        const snapshot = await getDoc(doc(db, DELETED_KEYS_COLLECTION, DELETED_KEYS_DOC));
        const remoteKeys = snapshot.exists() && Array.isArray(snapshot.data()?.keys)
            ? snapshot.data().keys.filter(Boolean)
            : [];
        const merged = [...new Set([...remoteKeys, ...localKeys])];
        writeLocalDeletedKeys(merged);
        return merged;
    } catch (error) {
        console.error('שגיאה בטעינת ספרים שנמחקו מהקטלוג:', error);
        return localKeys;
    }
}

export async function rememberDeletedSheetKey(sheetKey) {
    if (!sheetKey) return;

    const keys = await getDeletedSheetKeys();
    if (keys.includes(sheetKey)) return;

    const next = [...keys, sheetKey];
    writeLocalDeletedKeys(next);

    if (!isFirebaseEnabled || !db) return;

    await setDoc(doc(db, DELETED_KEYS_COLLECTION, DELETED_KEYS_DOC), {
        keys: next,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

export const getBooks = async () => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryBooks');
        return saved ? JSON.parse(saved) : [];
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        const books = [];
        querySnapshot.forEach((docSnap) => {
            books.push({ id: docSnap.id, ...docSnap.data() });
        });
        return books;
    } catch (error) {
        console.error('שגיאה בטעינת ספרים:', error);
        const saved = localStorage.getItem('libraryBooks');
        return saved ? JSON.parse(saved) : [];
    }
};

export const addBook = async (bookData) => {
    if (!isFirebaseEnabled) {
        const books = await getBooks();
        const newBook = {
            id: Date.now().toString(),
            ...bookData,
            createdAt: new Date().toISOString()
        };
        books.push(newBook);
        localStorage.setItem('libraryBooks', JSON.stringify(books));
        return newBook;
    }

    try {
        const docRef = await addDoc(collection(db, 'books'), {
            ...bookData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...bookData };
    } catch (error) {
        console.error('שגיאה בהוספת ספר:', error);
        throw error;
    }
};

export const updateBook = async (bookId, bookData) => {
    if (!isFirebaseEnabled) {
        const books = await getBooks();
        const updatedBooks = books.map(book =>
            book.id === bookId ? { ...book, ...bookData, updatedAt: new Date().toISOString() } : book
        );
        localStorage.setItem('libraryBooks', JSON.stringify(updatedBooks));
        return;
    }

    try {
        const bookRef = doc(db, 'books', bookId);
        await updateDoc(bookRef, {
            ...bookData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('שגיאה בעדכון ספר:', error);
        throw error;
    }
};

export const deleteBook = async (bookId, { sheetKey } = {}) => {
    let keyToRemember = sheetKey;
    if (!keyToRemember) {
        const books = await getBooks();
        const book = books.find((item) => item.id === bookId);
        keyToRemember = book?.sheetKey;
    }

    if (keyToRemember) {
        await rememberDeletedSheetKey(keyToRemember);
    }

    if (!isFirebaseEnabled) {
        const books = await getBooks();
        const filteredBooks = books.filter(book => book.id !== bookId);
        localStorage.setItem('libraryBooks', JSON.stringify(filteredBooks));
        return;
    }

    try {
        await deleteDoc(doc(db, 'books', bookId));
    } catch (error) {
        console.error('שגיאה במחיקת ספר:', error);
        throw error;
    }
};
