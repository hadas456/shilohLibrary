import {
    collection,
    doc,
    getDocs,
    addDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';
import { getUsers } from './users';
import { getBooks } from './books';

export const getEvents = async () => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryEvents');
        return saved ? JSON.parse(saved) : [];
    }

    try {
        const q = query(collection(db, 'events'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const events = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            events.push({
                id: docSnap.id,
                ...data,
                date: data.date?.toDate ? data.date.toDate().toISOString() : data.date
            });
        });
        return events;
    } catch (error) {
        console.error('שגיאה בטעינת אירועים:', error);
        const saved = localStorage.getItem('libraryEvents');
        return saved ? JSON.parse(saved) : [];
    }
};

export const addEvent = async (eventData) => {
    if (!isFirebaseEnabled) {
        const events = await getEvents();
        const newEvent = {
            id: Date.now().toString(),
            ...eventData,
            createdAt: new Date().toISOString()
        };
        events.unshift(newEvent);
        localStorage.setItem('libraryEvents', JSON.stringify(events));
        return newEvent;
    }

    try {
        const docRef = await addDoc(collection(db, 'events'), {
            ...eventData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...eventData };
    } catch (error) {
        console.error('שגיאה בהוספת אירוע:', error);
        throw error;
    }
};

export const deleteEvent = async (eventId) => {
    if (!isFirebaseEnabled) {
        const events = await getEvents();
        const filteredEvents = events.filter(event => event.id !== eventId);
        localStorage.setItem('libraryEvents', JSON.stringify(filteredEvents));
        return;
    }

    try {
        await deleteDoc(doc(db, 'events', eventId));
    } catch (error) {
        console.error('שגיאה במחיקת אירוע:', error);
        throw error;
    }
};

export const EVENT_TYPES = {
    ADMIN_EVENT: {
        type: 'admin_event',
        name: 'אירוע מנהל',
        color: 'bg-blue-100 border-blue-200 text-blue-800',
        icon: '👑',
        visibility: 'all'
    },
    BOOK_RETURN: {
        type: 'book_return',
        name: 'החזרת ספר',
        color: 'bg-orange-100 border-orange-200 text-orange-800',
        icon: '📚',
        visibility: 'owner_and_admin'
    },
    PERSONAL: {
        type: 'personal',
        name: 'אירוע אישי',
        color: 'bg-green-100 border-green-200 text-green-800',
        icon: '👤',
        visibility: 'creator_and_admin'
    }
};

export const getEventColor = (eventType) => {
    const eventTypeConfig = Object.values(EVENT_TYPES).find(
        config => config.type === eventType
    );
    return eventTypeConfig ? eventTypeConfig.color : 'bg-gray-100 border-gray-200 text-gray-800';
};

export const getEventIcon = (eventType) => {
    const eventTypeConfig = Object.values(EVENT_TYPES).find(
        config => config.type === eventType
    );
    return eventTypeConfig ? eventTypeConfig.icon : '📅';
};

export const isEventVisibleToUser = (event, userId, userRole) => {
    const eventTypeConfig = Object.values(EVENT_TYPES).find(
        config => config.type === event.type
    );

    if (!eventTypeConfig) {
        return false;
    }

    switch (eventTypeConfig.visibility) {
        case 'all':
            return true;

        case 'owner_and_admin':
            return userRole === 'admin' ||
                event.userId === userId ||
                event.bookOwnerId === userId;

        case 'creator_and_admin':
            return userRole === 'admin' ||
                event.createdBy === userId ||
                event.userId === userId;

        default:
            return false;
    }
};

export const filterEventsByVisibility = (events, userId, userRole) => {
    return events.filter(event => isEventVisibleToUser(event, userId, userRole));
};

export const createEventWithType = async (eventData, eventType = 'personal') => {
    try {
        const eventTypeConfig = EVENT_TYPES[eventType.toUpperCase()] || EVENT_TYPES.PERSONAL;

        const enhancedEventData = {
            ...eventData,
            type: eventTypeConfig.type,
            eventType: eventTypeConfig.type,
            color: eventTypeConfig.color,
            icon: eventTypeConfig.icon,
            visibility: eventTypeConfig.visibility,
            createdAt: new Date().toISOString()
        };

        return await addEvent(enhancedEventData);
    } catch (error) {
        console.error('שגיאה ביצירת אירוע עם סוג:', error);
        throw error;
    }
};

export const CALENDAR_EVENT_TYPES = {
    BOOK_LOAN: {
        type: 'book_loan',
        name: 'השאלת ספר',
        color: '#10b981',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-400',
        textColor: 'text-green-800',
        icon: '📚'
    },
    BOOK_RETURN: {
        type: 'book_return',
        name: 'החזרת ספר',
        color: '#f59e0b',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-400',
        textColor: 'text-orange-800',
        icon: '📖'
    },
    ADMIN_PUBLIC: {
        type: 'admin_public',
        name: 'אירוע ציבורי',
        color: '#3b82f6',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-400',
        textColor: 'text-blue-800',
        icon: '📢'
    },
    ADMIN_TRACKING: {
        type: 'admin_tracking',
        name: 'מעקב אדמין',
        color: '#8b5cf6',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-400',
        textColor: 'text-purple-800',
        icon: '👁️'
    },
    OVERDUE_ALERT: {
        type: 'overdue_alert',
        name: 'ספר באיחור',
        color: '#ef4444',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-400',
        textColor: 'text-red-800',
        icon: '⚠️'
    }
};

export const createReturnEvent = async (userId, bookData, returnDate) => {
    try {
        const eventData = {
            title: `החזרת ספר: ${bookData.title}`,
            description: `מועד החזרה של הספר "${bookData.title}" לספרייה\nמחבר: ${bookData.author}\nמיקום: ${bookData.location?.color || ''} ${bookData.location?.letter || ''}${bookData.location?.number || ''}`,
            date: returnDate.toISOString(),
            time: '18:00',
            createdBy: 'מערכת אוטומטית',
            bookId: bookData.id,
            bookTitle: bookData.title,
            userId: userId,
            bookOwnerId: userId,
            isPersonal: true,
            returnDate: returnDate.toISOString()
        };

        const event = await createEventWithType(eventData, 'book_return');
        console.log(`אירוע החזרת ספר נוצר עבור משתמש ${userId}: ${bookData.title}`);
        return event;
    } catch (error) {
        console.error('שגיאה ביצירת אירוע החזרת ספר:', error);
        throw error;
    }
};

export const createAdminReturnEvent = async (adminUserId, bookData, borrowerName, returnDate) => {
    try {
        const eventData = {
            title: `החזרה מתוכננת: ${bookData.title}`,
            description: `ספר "${bookData.title}" אמור להיות מוחזר על ידי ${borrowerName}\nתאריך החזרה: ${returnDate.toLocaleDateString('he-IL')}\nמחבר: ${bookData.author}`,
            date: returnDate.toISOString(),
            time: '18:00',
            createdBy: 'מערכת אוטומטית',
            bookId: bookData.id,
            bookTitle: bookData.title,
            userId: adminUserId,
            borrowerName: borrowerName,
            isPersonal: false,
            returnDate: returnDate.toISOString()
        };

        const event = await createEventWithType(eventData, 'admin_event');
        console.log(`אירוע מעקב החזרה נוצר עבור מנהל ${adminUserId}: ${bookData.title}`);
        return event;
    } catch (error) {
        console.error('שגיאה ביצירת אירוע מעקב החזרה:', error);
        throw error;
    }
};

export const createAdminLoanEvent = async (requestData, adminUser) => {
    try {
        const eventData = {
            title: `השאלה: ${requestData.bookTitle}`,
            description: `ספר הושאל ל${requestData.requesterName}\nטלפון: ${requestData.contactPhone}`,
            date: new Date().toISOString(),
            time: '09:00',
            createdAt: new Date().toISOString(),
            createdBy: 'מערכת ניהול',
            type: 'admin_loan_tracking',
            eventType: 'admin_book_tracking',
            bookId: requestData.bookId,
            userId: adminUser.id,
            loanRequestId: requestData.id,
            isPersonal: false,
            requesterName: requestData.requesterName
        };

        await addEvent(eventData);
        console.log('אירוע מעקב השאלה נוצר עבור מנהלים');
    } catch (error) {
        console.error('שגיאה ביצירת אירוע מעקב השאלה:', error);
    }
};

export const createAllLoanEvents = async (userId, loanRequest, bookData) => {
    try {
        console.log('יוצר אירועי לוח שנה עבור השאלת ספר...');

        const returnDate = loanRequest.expectedReturnDate
            ? new Date(loanRequest.expectedReturnDate)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await addEvent({
            title: `החזרה: ${bookData.title}`,
            description: `תזכורת להחזרת ספר לספרייה\n📚 ${bookData.title}\n✍️ ${bookData.author}\n📅 יש להחזיר היום!`,
            date: returnDate.toISOString(),
            time: '09:00',
            type: CALENDAR_EVENT_TYPES.BOOK_RETURN.type,
            color: CALENDAR_EVENT_TYPES.BOOK_RETURN.color,
            icon: CALENDAR_EVENT_TYPES.BOOK_RETURN.icon,
            userId: userId,
            bookId: bookData.id,
            bookTitle: bookData.title,
            loanRequestId: loanRequest.id,
            isPersonal: true,
            createdBy: 'מערכת אוטומטית'
        });

        const users = await getUsers();
        const admins = users.filter(u => u.role === 'admin' && u.isActive !== false);

        await addEvent({
            title: `מעקב: ${bookData.title}`,
            description: `ספר מושאל\n📚 ${bookData.title}\n👤 ${loanRequest.requesterName}\n📅 החזרה: ${returnDate.toLocaleDateString('he-IL')}`,
            date: returnDate.toISOString(),
            time: '18:00',
            type: CALENDAR_EVENT_TYPES.ADMIN_TRACKING.type,
            color: CALENDAR_EVENT_TYPES.ADMIN_TRACKING.color,
            icon: CALENDAR_EVENT_TYPES.ADMIN_TRACKING.icon,
            userId: null,
            bookId: bookData.id,
            bookTitle: bookData.title,
            borrowerName: loanRequest.requesterName,
            loanRequestId: loanRequest.id,
            isPersonal: false,
            forAdminsOnly: true,
            createdBy: 'מערכת מעקב'
        });

        console.log('✅ אירועים נוצרו בהצלחה');
    } catch (error) {
        console.error('שגיאה ביצירת אירועים:', error);
    }
};

export const deleteAllLoanEvents = async (loanRequestId) => {
    try {
        const events = await getEvents();
        const loanEvents = events.filter(event => event.loanRequestId === loanRequestId);

        for (const event of loanEvents) {
            await deleteEvent(event.id);
        }

        console.log(`✅ נמחקו ${loanEvents.length} אירועים`);
    } catch (error) {
        console.error('שגיאה במחיקת אירועים:', error);
    }
};

export const createOverdueAlerts = async () => {
    try {
        // Lazy import avoids circular dependency with loans.js
        const { getLoanRequests } = await import('./loans.js');
        const loanRequests = await getLoanRequests();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const overdueRequests = loanRequests.filter(request => {
            if (request.status !== 'approved' || !request.expectedReturnDate) return false;
            const returnDate = new Date(request.expectedReturnDate);
            returnDate.setHours(0, 0, 0, 0);
            return returnDate < today;
        });

        const books = await getBooks();
        const users = await getUsers();
        const admins = users.filter(u => u.role === 'admin' && u.isActive !== false);

        for (const request of overdueRequests) {
            const book = books.find(b => b.id === request.bookId);
            if (!book) continue;

            const daysOverdue = Math.ceil((today - new Date(request.expectedReturnDate)) / (1000 * 60 * 60 * 24));

            for (const admin of admins) {
                await addEvent({
                    title: `איחור! ${book.title}`,
                    description: `ספר באיחור של ${daysOverdue} ימים!
📚 ${book.title}
👤 ${request.requesterName}
📞 ${request.contactPhone}
🚨 יש ליצור קשר בהקדם!`,
                    date: new Date().toISOString(),
                    time: '10:00',
                    type: CALENDAR_EVENT_TYPES.OVERDUE_ALERT.type,
                    color: CALENDAR_EVENT_TYPES.OVERDUE_ALERT.color,
                    icon: CALENDAR_EVENT_TYPES.OVERDUE_ALERT.icon,
                    userId: admin.id,
                    bookId: book.id,
                    loanRequestId: request.id,
                    daysOverdue: daysOverdue,
                    isPersonal: false,
                    createdBy: 'מערכת התראות'
                });
            }
        }
    } catch (error) {
        console.error('שגיאה ביצירת התראות איחור:', error);
    }
};
