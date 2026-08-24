import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';
import { updateBook } from './books';
import { getEvents, deleteEvent } from './events';
import { validateUserPhoneNumber } from './phone';

const convertTimestamp = (value) => {
    if (!value) return value;
    if (value.toDate && typeof value.toDate === 'function') {
        return value.toDate().toISOString();
    }
    return value;
};

export const getLoanRequests = async () => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryLoanRequests');
        return saved ? JSON.parse(saved) : [];
    }

    try {
        const q = query(collection(db, 'loanRequests'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const requests = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            requests.push({
                id: docSnap.id,
                ...data,
                createdAt: convertTimestamp(data.createdAt),
                updatedAt: convertTimestamp(data.updatedAt)
            });
        });
        return requests;
    } catch (error) {
        console.error('שגיאה בטעינת בקשות השאלה:', error);
        const saved = localStorage.getItem('libraryLoanRequests');
        return saved ? JSON.parse(saved) : [];
    }
};

export const addLoanRequest = async (requestData) => {
    if (!isFirebaseEnabled) {
        const requests = await getLoanRequests();
        const newRequest = {
            id: Date.now().toString(),
            ...requestData,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        requests.unshift(newRequest);
        localStorage.setItem('libraryLoanRequests', JSON.stringify(requests));
        return newRequest;
    }

    try {
        const docRef = await addDoc(collection(db, 'loanRequests'), {
            ...requestData,
            createdAt: serverTimestamp(),
            status: 'pending'
        });
        return { id: docRef.id, ...requestData };
    } catch (error) {
        console.error('שגיאה בהוספת בקשת השאלה:', error);
        throw error;
    }
};

export const updateLoanRequestStatus = async (requestId, newStatus, adminNotes = '') => {
    if (!isFirebaseEnabled) {
        const requests = await getLoanRequests();
        const updatedRequests = requests.map(req =>
            req.id === requestId
                ? {
                    ...req,
                    status: newStatus,
                    adminNotes,
                    updatedAt: new Date().toISOString()
                }
                : req
        );
        localStorage.setItem('libraryLoanRequests', JSON.stringify(updatedRequests));
        return;
    }

    try {
        const requestRef = doc(db, 'loanRequests', requestId);
        await updateDoc(requestRef, {
            status: newStatus,
            adminNotes,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('שגיאה בעדכון סטטוס בקשת השאלה:', error);
        throw error;
    }
};

export const deleteLoanRequest = async (requestId) => {
    if (!isFirebaseEnabled) {
        const requests = await getLoanRequests();
        const filteredRequests = requests.filter(req => req.id !== requestId);
        localStorage.setItem('libraryLoanRequests', JSON.stringify(filteredRequests));
        return;
    }

    try {
        await deleteDoc(doc(db, 'loanRequests', requestId));
    } catch (error) {
        console.error('שגיאה במחיקת בקשת השאלה:', error);
        throw error;
    }
};

export const getUserBorrowedBooks = async (userId) => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryLoanRequests');
        const allRequests = saved ? JSON.parse(saved) : [];

        const borrowed = allRequests.filter(req =>
            req.requesterId === userId &&
            (req.status === 'approved' || req.status === 'pending_return')
        );

        const uniqueBorrowed = borrowed.filter(
            (req, index, self) =>
                index === self.findIndex(r => r.bookId === req.bookId)
        );

        return uniqueBorrowed;
    }

    try {
        const q = query(
            collection(db, 'loanRequests'),
            where('requesterId', '==', userId),
            where('status', 'in', ['approved', 'pending_return'])
        );
        const querySnapshot = await getDocs(q);

        const borrowedBooks = [];
        querySnapshot.forEach((docSnap) => {
            borrowedBooks.push({ id: docSnap.id, ...docSnap.data() });
        });

        const uniqueBorrowed = borrowedBooks.filter(
            (req, index, self) =>
                index === self.findIndex(r => r.bookId === req.bookId)
        );

        return uniqueBorrowed;
    } catch (error) {
        console.error('שגיאה בטעינת ספרים מושאלים:', error);
        return [];
    }
};

export const returnBookByUser = async (loanRequestId, bookId, userId) => {
    try {
        await updateLoanRequestStatus(loanRequestId, 'returned', 'הוחזר על ידי המשתמש באפליקציה');

        await updateBook(bookId, {
            status: 'available',
            borrowedBy: null,
            borrowDate: null,
            returnDate: new Date().toISOString()
        });

        const events = await getEvents();
        const returnEvent = events.find(event =>
            event.type === 'book_return' &&
            event.bookId === bookId &&
            event.userId === userId
        );

        if (returnEvent) {
            await deleteEvent(returnEvent.id);
            console.log('אירוע החזרת הספר נמחק מהלוח שנה');
        }

        console.log('הספר הוחזר בהצלחה');
        return true;
    } catch (error) {
        console.error('שגיאה בהחזרת ספר:', error);
        throw error;
    }
};

export const addLoanRequestWithPhoneValidation = async (requestData) => {
    try {
        const phoneValidation = await validateUserPhoneNumber(
            requestData.requesterId,
            requestData.contactPhone
        );

        if (!phoneValidation.isValid) {
            throw new Error(phoneValidation.error);
        }

        const validatedRequestData = {
            ...requestData,
            contactPhone: phoneValidation.formattedNumber,
            phoneValidated: true,
            validatedAt: new Date().toISOString()
        };

        return await addLoanRequest(validatedRequestData);

    } catch (error) {
        console.error('שגיאה באימות מספר טלפון:', error);
        throw error;
    }
};
