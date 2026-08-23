import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, User, CheckCircle, X, RefreshCw, Phone, MapPin, Clock } from 'lucide-react';
import {
    getLoanRequests,
    updateLoanRequestStatus,
    updateBook,
    sendLoanRequestNotification,
    deleteAllLoanEvents,
    notifyUserLoanApproved,
    notifyUserLoanRejected,
    createAllLoanEvents
} from '../utils/dbHelpers';
import { formatBookLocation } from '../utils/bookHelpers';
import { useLibrary } from '../context/LibraryContext';

export default function ReturnRequestsManagement() {
    const { user: currentUser, books, setBooks } = useLibrary();
    const [loanRequests, setLoanRequests] = useState([]);
    const [returnRequests, setReturnRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingRequestId, setProcessingRequestId] = useState(null);
    const [adminNotes, setAdminNotes] = useState({});

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const allRequests = await getLoanRequests();
            setLoanRequests(allRequests.filter((req) => req.status === 'pending'));
            setReturnRequests(allRequests.filter((req) => req.status === 'pending_return'));
        } catch (error) {
            console.error('שגיאה בטעינת בקשות:', error);
            alert('שגיאה בטעינת בקשות');
        } finally {
            setLoading(false);
        }
    };

    const getBookDetails = (bookId) => books.find((book) => book.id === bookId);

    const getLocationText = (request, bookDetails) => {
        if (bookDetails?.location) return formatBookLocation(bookDetails.location);
        if (!request.bookLocation) return '';
        if (typeof request.bookLocation === 'string') return request.bookLocation;
        return formatBookLocation(request.bookLocation);
    };

    const updateLocalBook = (bookId, updates) => {
        setBooks((prev) => prev.map((book) => (
            book.id === bookId ? { ...book, ...updates } : book
        )));
    };

    const handleApproveLoan = async (request) => {
        if (!confirm(`לאשר את השאלת הספר "${request.bookTitle}" ל${request.requesterName}?`)) {
            return;
        }

        setProcessingRequestId(request.id);
        try {
            const notes = adminNotes[request.id] || '';
            const book = getBookDetails(request.bookId);
            const returnDate = request.expectedReturnDate
                ? new Date(request.expectedReturnDate)
                : (() => {
                    const date = new Date();
                    date.setDate(date.getDate() + 30);
                    return date;
                })();

            await updateLoanRequestStatus(request.id, 'approved', notes);
            await notifyUserLoanApproved(request.requesterId, request, notes);

            const bookUpdates = {
                status: 'borrowed',
                borrowedBy: request.requesterName,
                borrowDate: new Date().toISOString(),
                expectedReturnDate: returnDate.toISOString(),
                processingBy: null,
                processingDate: null
            };
            await updateBook(request.bookId, bookUpdates);
            updateLocalBook(request.bookId, bookUpdates);

            if (book) {
                await createAllLoanEvents(request.requesterId, { ...request, expectedReturnDate: returnDate.toISOString() }, book);
            }

            const otherPending = loanRequests.filter((other) => (
                other.id !== request.id && other.bookId === request.bookId
            ));
            await Promise.all(otherPending.map(async (other) => {
                await updateLoanRequestStatus(other.id, 'rejected', 'הספר הושאל למשתמש אחר');
                await notifyUserLoanRejected(other.requesterId, other, 'הספר הושאל למשתמש אחר');
            }));

            setLoanRequests((prev) => prev.filter((req) => req.bookId !== request.bookId));
            setAdminNotes((prev) => {
                const next = { ...prev };
                delete next[request.id];
                return next;
            });
            alert('ההשאלה אושרה בהצלחה');
        } catch (error) {
            console.error('שגיאה באישור השאלה:', error);
            alert('שגיאה באישור ההשאלה: ' + error.message);
        } finally {
            setProcessingRequestId(null);
        }
    };

    const handleRejectLoan = async (request) => {
        if (!confirm(`לדחות את בקשת ההשאלה של ${request.requesterName} לספר "${request.bookTitle}"?`)) {
            return;
        }

        setProcessingRequestId(request.id);
        try {
            const notes = adminNotes[request.id] || '';
            await updateLoanRequestStatus(request.id, 'rejected', notes);
            await notifyUserLoanRejected(request.requesterId, request, notes);

            const remainingForBook = loanRequests.filter((other) => (
                other.id !== request.id && other.bookId === request.bookId
            ));
            if (remainingForBook.length === 0) {
                const bookUpdates = {
                    status: 'available',
                    processingBy: null,
                    processingDate: null
                };
                await updateBook(request.bookId, bookUpdates);
                updateLocalBook(request.bookId, bookUpdates);
            }

            setLoanRequests((prev) => prev.filter((req) => req.id !== request.id));
            setAdminNotes((prev) => {
                const next = { ...prev };
                delete next[request.id];
                return next;
            });
            alert('הבקשה נדחתה והמשתמש יקבל הודעה');
        } catch (error) {
            console.error('שגיאה בדחיית השאלה:', error);
            alert('שגיאה בדחיית הבקשה: ' + error.message);
        } finally {
            setProcessingRequestId(null);
        }
    };

    const handleApproveReturn = async (requestId, bookId, bookTitle, requesterName, requesterId) => {
        if (!confirm(`האם אתה בטוח שברצונך לאשר את החזרת הספר "${bookTitle}"?`)) {
            return;
        }

        setProcessingRequestId(requestId);
        try {
            await updateLoanRequestStatus(requestId, 'returned', 'החזרה אושרה על ידי האדמין');

            const bookUpdates = {
                status: 'available',
                borrowedBy: null,
                borrowDate: null,
                returnDate: new Date().toISOString(),
                returnApprovedBy: currentUser.name
            };
            await updateBook(bookId, bookUpdates);
            updateLocalBook(bookId, bookUpdates);
            await deleteAllLoanEvents(requestId);
            setReturnRequests((prev) => prev.filter((req) => req.id !== requestId));

            const request = returnRequests.find((r) => r.id === requestId);
            if (request) {
                await sendLoanRequestNotification(
                    requesterId,
                    request,
                    'returned',
                    'החזרת הספר אושרה בהצלחה. תודה על השימוש בשירותי הספרייה!'
                );
            }

            alert('החזרת הספר אושרה בהצלחה!');
        } catch (error) {
            console.error('שגיאה באישור החזרה:', error);
            alert('שגיאה באישור החזרה: ' + error.message);
        } finally {
            setProcessingRequestId(null);
        }
    };

    const calculateBorrowDuration = (borrowDate) => {
        if (!borrowDate) return 'לא ידוע';

        const borrowed = new Date(borrowDate);
        const now = new Date();
        const diffTime = now - borrowed;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'הושאל היום';
        if (diffDays === 1) return 'הושאל אתמול';

        return `הושאל לפני ${diffDays} ימים`;
    };

    const todayCount = [...loanRequests, ...returnRequests].filter((req) => {
        const reqDate = new Date(req.updatedAt || req.createdAt);
        return reqDate.toDateString() === new Date().toDateString();
    }).length;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                        <h2 className="text-lg sm:text-2xl font-semibold">ניהול השאלות</h2>
                        {loading && <div className="text-xs sm:text-sm text-emerald-700">טוען...</div>}
                    </div>
                    <button
                        type="button"
                        onClick={loadRequests}
                        disabled={loading}
                        className="flex min-h-10 sm:min-h-11 items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-50 text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">רענן</span>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="bg-amber-50 rounded-xl p-3 sm:p-4 border border-amber-200">
                        <div className="text-xl sm:text-2xl font-bold text-amber-900">{loanRequests.length}</div>
                        <div className="text-xs sm:text-sm text-amber-800">בקשות השאלה</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 sm:p-4 border border-purple-200">
                        <div className="text-xl sm:text-2xl font-bold text-purple-900">{returnRequests.length}</div>
                        <div className="text-xs sm:text-sm text-purple-700">בקשות החזרה</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 sm:p-4 border border-green-200">
                        <div className="text-xl sm:text-2xl font-bold text-green-900">{todayCount}</div>
                        <div className="text-xs sm:text-sm text-green-700">התקבלו היום</div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">בקשות השאלה ממתינות לאישור</h3>

                {loanRequests.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                        <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">אין בקשות השאלה ממתינות</h3>
                        <p className="text-gray-500 text-sm sm:text-base">כל הבקשות טופלו או שאין בקשות חדשות</p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {loanRequests.map((request) => {
                            const bookDetails = getBookDetails(request.bookId);
                            const isProcessing = processingRequestId === request.id;
                            const locationText = getLocationText(request, bookDetails);

                            return (
                                <div
                                    key={request.id}
                                    className="border rounded-xl p-3 sm:p-4 bg-amber-50 border-amber-200 transition-all hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-3 sm:gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-start sm:items-center gap-2 sm:gap-3 mb-2">
                                                <h4 className="font-semibold text-base sm:text-lg">{request.bookTitle}</h4>
                                                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm bg-amber-100 text-amber-800 border border-amber-300">
                                                    ממתין לאישור
                                                </span>
                                            </div>

                                            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span><strong>מבקש:</strong> {request.requesterName}</span>
                                                </div>

                                                {(bookDetails?.author || request.bookAuthor) && (
                                                    <div><strong>מחבר:</strong> {bookDetails?.author || request.bookAuthor}</div>
                                                )}

                                                {locationText && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span><strong>מיקום:</strong> {locationText}</span>
                                                    </div>
                                                )}

                                                {request.contactPhone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span dir="ltr"><strong>טלפון:</strong> {request.contactPhone}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span>
                                                        <strong>תאריך בקשה:</strong>{' '}
                                                        {new Date(request.createdAt).toLocaleDateString('he-IL')}
                                                    </span>
                                                </div>

                                                {request.expectedReturnDate && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span>
                                                            <strong>החזרה משוערת:</strong>{' '}
                                                            {new Date(request.expectedReturnDate).toLocaleDateString('he-IL')}
                                                        </span>
                                                    </div>
                                                )}

                                                {request.notes && (
                                                    <div className="text-blue-700 bg-blue-50 p-2 rounded mt-2 text-xs sm:text-sm">
                                                        <strong>הערות המשתמש:</strong> {request.notes}
                                                    </div>
                                                )}
                                            </div>

                                            <label className="block mt-3">
                                                <span className="block text-xs sm:text-sm font-medium text-stone-700 mb-1">הערות אדמין (אופציונלי)</span>
                                                <textarea
                                                    value={adminNotes[request.id] || ''}
                                                    onChange={(e) => setAdminNotes((prev) => ({ ...prev, [request.id]: e.target.value }))}
                                                    className="w-full rounded-lg border border-amber-200 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                                    rows={2}
                                                    placeholder="הערות שיישלחו למשתמש..."
                                                    disabled={isProcessing}
                                                />
                                            </label>
                                        </div>

                                        <div className="flex gap-2 sm:gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleApproveLoan(request)}
                                                disabled={isProcessing}
                                                className="flex flex-1 sm:flex-none min-h-10 sm:min-h-11 items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                        <span className="hidden sm:inline">מעדכן...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>אשר</span>
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleRejectLoan(request)}
                                                disabled={isProcessing}
                                                className="flex flex-1 sm:flex-none min-h-10 sm:min-h-11 items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>דחה</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">בקשות החזרה ממתינות לאישור</h3>

                {returnRequests.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                        <RefreshCw className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">אין בקשות החזרה ממתינות</h3>
                        <p className="text-gray-500 text-sm sm:text-base">כל הבקשות טופלו או שאין בקשות חדשות</p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {returnRequests.map((request) => {
                            const bookDetails = getBookDetails(request.bookId);
                            const isProcessing = processingRequestId === request.id;
                            const locationText = getLocationText(request, bookDetails);

                            return (
                                <div
                                    key={request.id}
                                    className="border rounded-xl p-3 sm:p-4 bg-purple-50 border-purple-200 transition-all hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-3 sm:gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-start sm:items-center gap-2 sm:gap-3 mb-2">
                                                <h4 className="font-semibold text-base sm:text-lg">{request.bookTitle}</h4>
                                                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm bg-purple-100 text-purple-700 border border-purple-300">
                                                    ממתין לאישור החזרה
                                                </span>
                                            </div>

                                            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span><strong>מחזיר:</strong> {request.requesterName}</span>
                                                </div>

                                                {bookDetails && (
                                                    <div><strong>מחבר:</strong> {bookDetails.author}</div>
                                                )}

                                                {locationText && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span><strong>מיקום:</strong> {locationText}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span>
                                                        <strong>בקשת החזרה:</strong>{' '}
                                                        {new Date(request.updatedAt || request.createdAt).toLocaleDateString('he-IL')}
                                                    </span>
                                                </div>

                                                <div>
                                                    <strong>משך השאלה:</strong> {calculateBorrowDuration(request.createdAt)}
                                                </div>

                                                {request.contactPhone && (
                                                    <div><strong>טלפון:</strong> {request.contactPhone}</div>
                                                )}

                                                {request.notes && (
                                                    <div className="text-blue-700 bg-blue-50 p-2 rounded mt-2 text-xs sm:text-sm">
                                                        <strong>הערות המשתמש:</strong> {request.notes}
                                                    </div>
                                                )}

                                                {request.adminNotes && (
                                                    <div className="text-green-700 bg-green-50 p-2 rounded mt-2 text-xs sm:text-sm">
                                                        <strong>הערות קודמות:</strong> {request.adminNotes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 sm:gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleApproveReturn(
                                                    request.id,
                                                    request.bookId,
                                                    request.bookTitle,
                                                    request.requesterName,
                                                    request.requesterId
                                                )}
                                                disabled={isProcessing}
                                                className="flex flex-1 sm:flex-none min-h-10 sm:min-h-11 items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                        <span className="hidden sm:inline">מאשר...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>אשר החזרה</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-emerald-200 bg-emerald-50 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-emerald-900 mb-2 sm:mb-3">הנחיות לטיפול בהשאלות</h3>
                <div className="text-emerald-800 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div>• אשר השאלה רק אם הספר פנוי ונמצא במדף</div>
                    <div>• לאחר אישור, הספר יסומן כמושאל והמשתמש יקבל הודעה</div>
                    <div>• אם אושרה השאלה, בקשות ממתינות אחרות לאותו ספר יידחו אוטומטית</div>
                    <div>• בדוק את מצב הספר לפני אישור החזרה</div>
                    <div>• לאחר אישור החזרה, הספר יהיה זמין להשאלה מחדש</div>
                </div>
            </div>
        </div>
    );
}
