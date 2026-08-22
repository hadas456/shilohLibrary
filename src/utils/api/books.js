import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';

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

export const deleteBook = async (bookId) => {
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
