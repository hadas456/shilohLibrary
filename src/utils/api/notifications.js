import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';
import { getUsers } from './users';
import { getLoanRequests } from './loans';
import { getEvents, deleteEvent, createAllLoanEvents } from './events';

export const getNotifications = async (userId) => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryNotifications');
        const allNotifications = saved ? JSON.parse(saved) : [];
        return allNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    try {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const notifications = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            notifications.push({
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
            });
        });
        return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('שגיאה בטעינת הודעות:', error);
        const saved = localStorage.getItem('libraryNotifications');
        const allNotifications = saved ? JSON.parse(saved) : [];
        return allNotifications.filter(n => n.userId === userId);
    }
};

export const addNotification = async (notificationData) => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryNotifications');
        const notifications = saved ? JSON.parse(saved) : [];
        const newNotification = {
            id: Date.now().toString(),
            ...notificationData,
            createdAt: new Date().toISOString(),
            read: false
        };
        notifications.unshift(newNotification);
        localStorage.setItem('libraryNotifications', JSON.stringify(notifications));
        return newNotification;
    }

    try {
        const docRef = await addDoc(collection(db, 'notifications'), {
            ...notificationData,
            createdAt: serverTimestamp(),
            read: false
        });
        return { id: docRef.id, ...notificationData };
    } catch (error) {
        console.error('שגיאה בהוספת הודעה:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId) => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryNotifications');
        const notifications = saved ? JSON.parse(saved) : [];
        const updatedNotifications = notifications.map(n =>
            n.id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n
        );
        localStorage.setItem('libraryNotifications', JSON.stringify(updatedNotifications));
        return;
    }

    try {
        const notificationRef = doc(db, 'notifications', notificationId);
        await updateDoc(notificationRef, {
            read: true,
            readAt: serverTimestamp()
        });
    } catch (error) {
        console.error('שגיאה בסימון הודעה כנקראה:', error);
        throw error;
    }
};

export const deleteNotification = async (notificationId) => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryNotifications');
        const notifications = saved ? JSON.parse(saved) : [];
        const filteredNotifications = notifications.filter(n => n.id !== notificationId);
        localStorage.setItem('libraryNotifications', JSON.stringify(filteredNotifications));
        return;
    }

    try {
        await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
        console.error('שגיאה במחיקת הודעה:', error);
        throw error;
    }
};

const createNotificationHash = (notificationData) => {
    const hashString = `${notificationData.userId}_${notificationData.title}_${notificationData.relatedType}_${notificationData.relatedId}`;
    return hashString.replace(/\s+/g, '_').toLowerCase();
};

const checkDuplicateNotification = async (notificationData, timeWindowHours = 24) => {
    try {
        const notifications = await getNotifications(notificationData.userId);
        const now = new Date();
        const timeWindow = timeWindowHours * 60 * 60 * 1000;

        return notifications.some(notif => {
            const notifTime = new Date(notif.createdAt);
            const timeDiff = now - notifTime;

            return (
                notif.title === notificationData.title &&
                notif.relatedType === notificationData.relatedType &&
                notif.relatedId === notificationData.relatedId &&
                timeDiff < timeWindow
            );
        });
    } catch (error) {
        console.error('שגיאה בבדיקת כפילות הודעות:', error);
        return false;
    }
};

export const addNotificationSafe = async (notificationData) => {
    try {
        const isDuplicate = await checkDuplicateNotification(notificationData);

        if (isDuplicate) {
            console.log('הודעה דומה כבר קיימת, לא נוצרת הודעה חדשה');
            return null;
        }

        const notificationHash = createNotificationHash(notificationData);

        const enhancedNotification = {
            ...notificationData,
            notificationHash,
            createdAt: new Date().toISOString(),
            read: false
        };

        if (!isFirebaseEnabled) {
            const saved = localStorage.getItem('libraryNotifications');
            const notifications = saved ? JSON.parse(saved) : [];

            const newNotification = {
                id: Date.now().toString(),
                ...enhancedNotification
            };

            notifications.unshift(newNotification);
            localStorage.setItem('libraryNotifications', JSON.stringify(notifications));

            console.log('✅ הודעה חדשה נוצרה:', newNotification.title);
            return newNotification;
        }

        const docRef = await addDoc(collection(db, 'notifications'), {
            ...enhancedNotification,
            createdAt: serverTimestamp()
        });

        console.log('✅ הודעה חדשה נוצרה ב-Firebase:', notificationData.title);
        return { id: docRef.id, ...enhancedNotification };

    } catch (error) {
        console.error('שגיאה בהוספת הודעה:', error);
        throw error;
    }
};

/** @deprecated Use addNotificationSafe — alias kept for backwards compatibility */
export const addNotificationWithDuplicateCheck = addNotificationSafe;

export const cleanOldNotifications = async (userId, daysToKeep = 30) => {
    try {
        const notifications = await getNotifications(userId);
        const now = new Date();
        const cutoffDate = new Date(now - daysToKeep * 24 * 60 * 60 * 1000);

        let deletedCount = 0;

        for (const notification of notifications) {
            const notifDate = new Date(notification.createdAt);
            if (notifDate < cutoffDate && notification.read) {
                await deleteNotification(notification.id);
                deletedCount++;
            }
        }

        console.log(`🧹 נמחקו ${deletedCount} הודעות ישנות`);
        return deletedCount;

    } catch (error) {
        console.error('שגיאה בניקוי הודעות ישנות:', error);
        return 0;
    }
};

export const getUnreadNotificationsCount = async (userId) => {
    try {
        const notifications = await getNotifications(userId);
        return notifications.filter(n => !n.read).length;
    } catch (error) {
        console.error('שגיאה בספירת הודעות לא נקראות:', error);
        return 0;
    }
};

export const checkAndSendReturnReminders = async () => {
    try {
        console.log('🔔 בודק תזכורות החזרה...');

        const loanRequests = await getLoanRequests();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        let remindersSent = 0;

        for (const request of loanRequests) {
            if (request.status !== 'approved') continue;
            if (!request.expectedReturnDate) continue;

            const returnDate = new Date(request.expectedReturnDate);
            returnDate.setHours(0, 0, 0, 0);

            const daysUntilReturn = Math.ceil((returnDate - now) / (1000 * 60 * 60 * 24));

            if (daysUntilReturn === 1) {
                await addNotificationSafe({
                    userId: request.requesterId,
                    title: '⏰ תזכורת: החזרת ספר מחר',
                    message: `הספר "${request.bookTitle}" אמור להיות מוחזר מחר (${returnDate.toLocaleDateString('he-IL')}).\n\nאנא דאג להחזיר את הספר במועד.`,
                    type: 'warning',
                    relatedId: request.id,
                    relatedType: 'return_reminder_1day',
                    bookId: request.bookId,
                    bookTitle: request.bookTitle
                });
                remindersSent++;
            }

            if (daysUntilReturn < 0) {
                const daysOverdue = Math.abs(daysUntilReturn);

                await addNotificationSafe({
                    userId: request.requesterId,
                    title: '🚨 ספר באיחור!',
                    message: `הספר "${request.bookTitle}" אמור היה להיות מוחזר לפני ${daysOverdue} ימים.\n\nאנא החזר את הספר בהקדם האפשרי.`,
                    type: 'error',
                    relatedId: request.id,
                    relatedType: 'overdue_alert',
                    bookId: request.bookId,
                    bookTitle: request.bookTitle
                });
                remindersSent++;
            }
        }

        console.log(`✅ נשלחו ${remindersSent} תזכורות`);
        return remindersSent;

    } catch (error) {
        console.error('שגיאה בבדיקת תזכורות:', error);
        return 0;
    }
};

export const notifyAdminsAboutOverdueBooks = async () => {
    try {
        const loanRequests = await getLoanRequests();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const overdueBooks = loanRequests.filter(request => {
            if (request.status !== 'approved' || !request.expectedReturnDate) return false;

            const returnDate = new Date(request.expectedReturnDate);
            returnDate.setHours(0, 0, 0, 0);

            return returnDate < now;
        }).map(request => {
            const returnDate = new Date(request.expectedReturnDate);
            const daysOverdue = Math.ceil((now - returnDate) / (1000 * 60 * 60 * 24));
            return { ...request, daysOverdue };
        });

        if (overdueBooks.length === 0) {
            console.log('✅ אין ספרים באיחור');
            return;
        }

        const users = await getUsers();
        const admins = users.filter(user => user.role === 'admin' && user.isActive !== false);

        const message = `📚 דוח ספרים באיחור - ${now.toLocaleDateString('he-IL')}

סה"כ ${overdueBooks.length} ספרים באיחור:

${overdueBooks.map(book =>
            `• "${book.bookTitle}" - ${book.requesterName}\n  📞 ${book.contactPhone} | ⏱️ איחור: ${book.daysOverdue} ימים`
        ).join('\n\n')}

יש ליצור קשר עם המשאילים להחזרת הספרים.`;

        for (const admin of admins) {
            await addNotificationSafe({
                userId: admin.id,
                title: `📊 דוח איחורים - ${overdueBooks.length} ספרים`,
                message,
                type: 'warning',
                relatedType: 'overdue_report',
                relatedId: `overdue_${now.toISOString().split('T')[0]}`
            });
        }

        console.log(`✅ דוח איחורים נשלח ל-${admins.length} מנהלים`);

    } catch (error) {
        console.error('שגיאה בשליחת דוח איחורים:', error);
    }
};

export const notifyAdminNewLoanRequest = async (requestData) => {
    try {
        const users = await getUsers();
        const admins = users.filter(user => user.role === 'admin' && user.isActive !== false);

        const message = `📖 בקשת השאלה חדשה התקבלה

ספר: "${requestData.bookTitle}"
מבקש: ${requestData.requesterName}
טלפון: ${requestData.contactPhone}
${requestData.expectedReturnDate ? `\nתאריך החזרה מבוקש: ${new Date(requestData.expectedReturnDate).toLocaleDateString('he-IL')}` : ''}
${requestData.notes ? `\n\nהערות המשתמש:\n${requestData.notes}` : ''}

⏳ הבקשה ממתינה לאישורך במערכת הניהול.`;

        for (const admin of admins) {
            await addNotificationSafe({
                userId: admin.id,
                title: '🆕 בקשת השאלה חדשה',
                message,
                type: 'info',
                relatedId: requestData.id,
                relatedType: 'new_loan_request',
                bookId: requestData.bookId,
                bookTitle: requestData.bookTitle
            });
        }

        console.log(`✅ הודעה על בקשה חדשה נשלחה ל-${admins.length} מנהלים`);

    } catch (error) {
        console.error('שגיאה בשליחת הודעה למנהלים:', error);
    }
};

/** Alias kept for BookDetail and other callers */
export const notifyAdminNewRequest = notifyAdminNewLoanRequest;

export const notifyUserLoanApproved = async (userId, requestData, adminNotes = '') => {
    try {
        const returnDate = requestData.expectedReturnDate
            ? new Date(requestData.expectedReturnDate).toLocaleDateString('he-IL')
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL');

        const location = requestData.bookLocation
            ? `${requestData.bookLocation.color} ${requestData.bookLocation.letter}${requestData.bookLocation.number}`
            : 'פנה לספרן לקבלת המיקום';

        const message = `הבקשה שלך אושרה!

הספר "${requestData.bookTitle}" זמין להשאלה עד תאריך ${returnDate}.

מיקום הספר: ${location}


${adminNotes ? `💬 הערת הספרן:\n${adminNotes}` : ''}

תקבל תזכורת יום לפני מועד ההחזרה.

בהצלחה בלימודים! `;

        await addNotificationSafe({
            userId,
            title: 'בקשת ההשאלה אושרה!',
            message,
            type: 'success',
            relatedId: requestData.id,
            relatedType: 'loan_approved',
            bookId: requestData.bookId,
            bookTitle: requestData.bookTitle
        });

        console.log(`הודעת אישור נשלחה למשתמש ${requestData.requesterName}`);

    } catch (error) {
        console.error('שגיאה בשליחת הודעת אישור:', error);
    }
};

export const notifyUserLoanRejected = async (userId, requestData, adminNotes = '') => {
    try {
        const message = `בקשת ההשאלה נדחתה

הבקשה לספר "${requestData.bookTitle}" לא אושרה.

${adminNotes ? ` סיבת הדחיה:\n${adminNotes}\n\n` : ''}הספר עשוי להיות מושאל כרגע או בתחזוקה.

 מה אפשר לעשות?
• פנה לספרן לברר פרטים נוספים
• בקש ספר חלופי בנושא דומה
• נסה שוב במועד מאוחר יותר`;

        await addNotificationSafe({
            userId,
            title: 'בקשת השאלה נדחתה',
            message,
            type: 'error',
            relatedId: requestData.id,
            relatedType: 'loan_rejected',
            bookId: requestData.bookId,
            bookTitle: requestData.bookTitle
        });

        console.log(`הודעת דחייה נשלחה למשתמש ${requestData.requesterName}`);

    } catch (error) {
        console.error('שגיאה בשליחת הודעת דחייה:', error);
    }
};

export const notifyReturnRequest = async (requestData) => {
    try {
        await addNotificationSafe({
            userId: requestData.requesterId,
            title: 'בקשת החזרה התקבלה',
            message: `בקשת ההחזרה שלך לספר "${requestData.bookTitle}" התקבלה במערכת.\n\n הספרן יבדוק את הבקשה ויאשר את ההחזרה בהקדם.\n\nתקבל הודעה כאשר ההחזרה תאושר.`,
            type: 'info',
            relatedId: requestData.id,
            relatedType: 'return_request_received',
            bookId: requestData.bookId,
            bookTitle: requestData.bookTitle
        });

        const users = await getUsers();
        const admins = users.filter(user => user.role === 'admin' && user.isActive !== false);

        for (const admin of admins) {
            await addNotificationSafe({
                userId: admin.id,
                title: 'בקשת החזרת ספר',
                message: `המשתמש ${requestData.requesterName} ביקש להחזיר ספר:\n\n "${requestData.bookTitle}"\n ${requestData.contactPhone}\n\n יש לבדוק ולאשר את החזרת הספר במערכת.`,
                type: 'info',
                relatedId: requestData.id,
                relatedType: 'return_request_admin',
                bookId: requestData.bookId,
                bookTitle: requestData.bookTitle
            });
        }

        console.log(` הודעות החזרה נשלחו למשתמש ול-${admins.length} מנהלים`);

    } catch (error) {
        console.error('שגיאה בשליחת הודעות החזרה:', error);
    }
};

export const notifyReturnCompleted = async (userId, requestData, adminNotes = '') => {
    try {
        const message = ` הספר הוחזר בהצלחה!

הספר "${requestData.bookTitle}" הוחזר לספרייה.

תודה רבה על השימוש בשירותי הספרייה! 🙏

${adminNotes ? `💬 הערת הספרן:\n${adminNotes}` : ''}

מוזמן לשאול ספרים נוספים בכל עת.`;

        await addNotificationSafe({
            userId,
            title: ' החזרה הושלמה',
            message,
            type: 'success',
            relatedId: requestData.id,
            relatedType: 'return_completed',
            bookId: requestData.bookId,
            bookTitle: requestData.bookTitle
        });

        console.log(` הודעת החזרה הושלמה נשלחה למשתמש`);

    } catch (error) {
        console.error('שגיאה בשליחת הודעת החזרה:', error);
    }
};

export const sendLoanStatusNotification = async (userId, requestData, newStatus, adminNotes = '') => {
    try {
        switch (newStatus) {
            case 'approved':
                await notifyUserLoanApproved(userId, requestData, adminNotes);
                await createAllLoanEvents(userId, requestData, {
                    id: requestData.bookId,
                    title: requestData.bookTitle,
                    author: requestData.bookAuthor,
                    location: requestData.bookLocation
                });
                break;

            case 'rejected':
                await notifyUserLoanRejected(userId, requestData, adminNotes);
                break;

            case 'pending_return':
                await notifyReturnRequest(requestData);
                break;

            case 'returned':
                await notifyReturnCompleted(userId, requestData, adminNotes);

                const events = await getEvents();
                const userBookEvents = events.filter(event =>
                    event.userId === userId &&
                    event.bookId === requestData.bookId &&
                    (event.type === 'book_loan' || event.type === 'book_return')
                );

                for (const event of userBookEvents) {
                    await deleteEvent(event.id);
                }
                break;
        }

    } catch (error) {
        console.error('שגיאה בשליחת הודעת סטטוס:', error);
    }
};

export const runDailyNotificationTasks = async () => {
    try {
        console.log(' מפעיל משימות הודעות יומיות...');

        const reminders = await checkAndSendReturnReminders();

        await notifyAdminsAboutOverdueBooks();

        const users = await getUsers();
        let totalCleaned = 0;

        for (const user of users) {
            const cleaned = await cleanOldNotifications(user.id, 30);
            totalCleaned += cleaned;
        }

        console.log(` משימות יומיות הושלמו: ${reminders} תזכורות, ${totalCleaned} הודעות נוקו`);
    } catch (error) {
        console.error('שגיאה במשימות יומיות:', error);
    }
};

export const notifyAdminReturnRequest = async (returnData) => {
    try {
        const users = await getUsers();
        const admins = users.filter(user => user.role === 'admin' && user.isActive !== false);

        const message = `בקשת החזרת ספר חדשה:

ספר: "${returnData.bookTitle}"
מחזיר: ${returnData.requesterName}
תאריך בקשת החזרה: ${new Date().toLocaleDateString('he-IL')}

יש לבדוק ולאשר את החזרת הספר במערכת הניהול.`;

        for (const admin of admins) {
            const notificationData = {
                userId: admin.id,
                title: 'בקשת החזרת ספר חדשה',
                message,
                type: 'info',
                relatedId: returnData.loanRequestId,
                relatedType: 'return_request',
                bookTitle: returnData.bookTitle,
                bookId: returnData.bookId,
                createdAt: new Date().toISOString(),
                read: false
            };

            await addNotification(notificationData);
        }

        console.log(`הודעה על בקשת החזרה נשלחה ל-${admins.length} מנהלים`);
    } catch (error) {
        console.error('שגיאה בשליחת הודעה למנהלים:', error);
    }
};

export const sendLoanRequestNotification = async (userId, requestData, newStatus, adminNotes = '', returnDate = null) => {
    let title, message, type;

    const getReturnDate = () => {
        if (returnDate) return returnDate;
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        return futureDate.toLocaleDateString('he-IL');
    };

    const getBookLocation = () => {
        if (requestData.bookLocation) {
            return `${requestData.bookLocation.color} ${requestData.bookLocation.letter}${requestData.bookLocation.number}`;
        }
        return 'פנה לספרן לקבלת המיקום';
    };

    switch (newStatus) {
        case 'approved':
            title = `${requestData.requesterName}, הספר "${requestData.bookTitle}" אושר להשאלה!`;
            message = `הספר אושר להשאלה עד תאריך ${getReturnDate()}
      
מיקום הספר: ${getBookLocation()}
פנה לספרן עם תעודת זהות לאיסוף

${adminNotes ? `הערת הספרן: ${adminNotes}` : 'בהצלחה בלימודים!'}`;
            type = 'success';

            try {
                // Was createAutomaticReturnEvents (undefined); wire to createAllLoanEvents
                await createAllLoanEvents(userId, requestData, {
                    id: requestData.bookId,
                    title: requestData.bookTitle,
                    author: requestData.bookAuthor,
                    location: requestData.bookLocation
                });
            } catch (error) {
                console.error('שגיאה ביצירת אירועי החזרה אוטומטיים:', error);
            }
            break;

        case 'rejected':
            title = `${requestData.requesterName}, בקשת ההשאלה נדחתה`;
            message = `הבקשה לספר "${requestData.bookTitle}" נדחתה.

${adminNotes ? `סיבת הדחיה: ${adminNotes}` : 'ייתכן שהספר כבר מושאל או בתחזוקה.'}

ניתן לפנות לספרן לקבלת מידע נוסף או לבקש ספר חלופי.`;
            type = 'error';
            break;

        case 'returned':
            title = `${requestData.requesterName}, הספר הוחזר בהצלחה`;
            message = `הספר "${requestData.bookTitle}" הוחזר בהצלחה לספרייה.

תודה שהשתמשת בשירותי הספרייה!
${adminNotes ? `הערת הספרן: ${adminNotes}` : ''}`;
            type = 'success';

            try {
                const events = await getEvents();
                const userBookEvents = events.filter(event =>
                    event.userId === userId &&
                    event.bookId === requestData.bookId &&
                    (event.type === 'book_loan' || event.type === 'book_return')
                );

                for (const event of userBookEvents) {
                    await deleteEvent(event.id);
                }
                console.log('אירועי השאלה והחזרה נמחקו מלוח השנה של המשתמש');
            } catch (error) {
                console.error('שגיאה במחיקת אירועים:', error);
            }
            break;

        case 'pending_return':
            title = `${requestData.requesterName}, בקשת החזרה התקבלה`;
            message = `בקשת החזרה לספר "${requestData.bookTitle}" התקבלה במערכת.

הספרן יבדוק את הבקשה ויאשר את החזרת הספר בהקדם.
תקבל הודעה כאשר החזרה תאושר.`;
            type = 'info';
            break;

        default:
            return;
    }

    try {
        const notificationData = {
            userId,
            title,
            message,
            type,
            relatedId: requestData.id || null,
            relatedType: 'loan_request',
            bookTitle: requestData.bookTitle,
            bookId: requestData.bookId,
            createdAt: new Date().toISOString(),
            read: false
        };

        await addNotification(notificationData);
        console.log(`הודעה נשלחה למשתמש ${requestData.requesterName}: ${title}`);
    } catch (error) {
        console.error('שגיאה בשליחת הודעה:', error);
        console.log(`הודעה (לא נשמרה): ${title} - ${message}`);
    }
};

export const sendReturnReminder = async (userId, loanData, daysUntilReturn) => {
    const message = daysUntilReturn <= 0
        ? `הספר "${loanData.bookTitle}" אמור היה להיות מוחזר. אנא החזר בהקדם.`
        : `הספר "${loanData.bookTitle}" אמור להיות מוחזר בעוד ${daysUntilReturn} ימים.`;

    await addNotification({
        userId,
        title: 'תזכורת החזרת ספר',
        message,
        type: 'warning',
        relatedId: loanData.id,
        relatedType: 'return_reminder'
    });
};

export const checkOverdueBooks = async () => {
    try {
        const today = new Date();
        const loanRequests = await getLoanRequests();
        const overdueBooks = [];

        for (const request of loanRequests) {
            if (request.status === 'approved' && request.expectedReturnDate) {
                const returnDate = new Date(request.expectedReturnDate);
                if (returnDate < today) {
                    overdueBooks.push({
                        ...request,
                        daysOverdue: Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24))
                    });
                }
            }
        }

        if (overdueBooks.length > 0) {
            // Live notifyAdminsAboutOverdueBooks ignores args — preserve call signature
            await notifyAdminsAboutOverdueBooks(overdueBooks);
        }

        return overdueBooks;
    } catch (error) {
        console.error('שגיאה בבדיקת ספרים שפג תוקפם:', error);
        return [];
    }
};
