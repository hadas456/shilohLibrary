// src/components/BookCatalog.jsx
import React, { useState, useEffect } from 'react';
import { Book, Search, Plus, RefreshCw, Bell } from 'lucide-react';
import BookCard from './BookCard';
import BookDetail from './BookDetail';
import { filterBooks } from '../utils/bookHelpers';
import BookEditor from './BookEditor';
import CatalogSearchFilters from './CatalogSearchFilters';

import {
    updateBook,
    deleteBook,
    addBook,
    getLoanRequests,
    updateLoanRequestStatus
} from '../utils/dbHelpers';
import { useLibrary } from '../context/LibraryContext';


const BookCatalog = ({ onViewChange }) => {
    const { books, setBooks, user, categories, dataLoading } = useLibrary();
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState({ color: '', letter: '', number: '' });
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const [showBookEditor, setShowBookEditor] = useState(false);
    const [loanRequests, setLoanRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [visibleCount, setVisibleCount] = useState(48);

    // טעינת בקשות השאלה לאדמין
    useEffect(() => {
        if (user?.role === 'admin') {
            loadLoanRequests();
        }
    }, [user]);

    const loadLoanRequests = async () => {
        setLoadingRequests(true);
        try {
            const requests = await getLoanRequests();
            setLoanRequests(requests);
            console.log('בקשות השאלה נטענו לקטלוג:', requests.length);
        } catch (error) {
            console.error('שגיאה בטעינת בקשות השאלה:', error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const filteredBooks = filterBooks(
        books,
        searchQuery,
        '',
        false,
        new Set(),
        locationFilter
    );
    const visibleBooks = filteredBooks.slice(0, visibleCount);

    useEffect(() => {
        setVisibleCount(48);
    }, [searchQuery, locationFilter]);

    // פונקציה לקבלת בקשות לספר מסוים
    const getBookRequests = (bookId) => {
        return loanRequests.filter(request =>
            request.bookId === bookId && request.status === 'pending'
        );
    };

    // עריכת ספר
    const handleEditBook = (book) => {
        setEditingBook(book);
        setShowBookEditor(true);
        setSelectedBook(null);
    };

    // הוספת ספר חדש
    const handleAddBook = () => {
        setEditingBook(null);
        setShowBookEditor(true);
    };

    // שמירת ספר (חדש או עריכה)
    const handleSaveBook = async (bookData) => {
        try {
            if (editingBook) {
                // עדכון ספר קיים
                await updateBook(editingBook.id, bookData);
                const updatedBooks = books.map(book =>
                    book.id === editingBook.id ? { ...bookData, id: editingBook.id } : book
                );
                setBooks(updatedBooks);
            } else {
                // הוספת ספר חדש
                const newBook = await addBook(bookData);
                setBooks(prev => [...prev, newBook]);
                console.log('ספר חדש נוסף בהצלחה:', newBook.title);
            }

            // סגירה אוטומטית של החלונית
            setShowBookEditor(false);
            setEditingBook(null);

            const action = editingBook ? 'עודכן' : 'נוסף';
            alert(`הספר "${bookData.title}" ${action} בהצלחה!`);
        } catch (error) {
            alert('שגיאה בשמירת הספר: ' + error.message);
            throw error;
        }
    };

    // מחיקת ספר
    const handleDeleteBook = async (bookId) => {
        if (confirm('האם אתה בטוח שברצונך למחוק את הספר? פעולה זו לא ניתנת לביטול.')) {
            try {
                const book = books.find((item) => item.id === bookId);
                await deleteBook(bookId, { sheetKey: book?.sheetKey });
                setBooks(prev => prev.filter(item => item.id !== bookId));
                setSelectedBook(null);

                console.log('ספר נמחק בהצלחה');
            } catch (error) {
                console.error('שגיאה במחיקת ספר:', error);
                alert('שגיאה במחיקת הספר: ' + error.message);
            }
        }
    };

    // טיפול בבקשת השאלה מהקטלוג
    const handleLoanRequestFromCatalog = async (requestData) => {
        if (user?.role === 'admin') {
            setTimeout(() => {
                loadLoanRequests();
            }, 1000);
        }
    };

    const handleUpdateRequestStatus = async (requestId, newStatus, bookId) => {
        try {
            console.log('מעדכן בקשה בקטלוג:', requestId, newStatus, bookId);

            await updateLoanRequestStatus(requestId, newStatus, '');

            // עדכון סטטוס הספר אם מאושר
            if (newStatus === 'approved' && bookId) {
                const request = loanRequests.find(r => r.id === requestId);
                const returnDate = request?.expectedReturnDate
                    ? new Date(request.expectedReturnDate)
                    : (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 30);
                        return date;
                    })();

                await updateBook(bookId, {
                    status: 'borrowed',
                    borrowedBy: request?.requesterName,
                    borrowDate: new Date().toISOString(),
                    expectedReturnDate: returnDate.toISOString()
                });

                // עדכון רשימת הספרים ב-state המקומי
                setBooks(prev => prev.map(book =>
                    book.id === bookId
                        ? {
                            ...book,
                            status: 'borrowed',
                            borrowedBy: request?.requesterName,
                            borrowDate: new Date().toISOString()
                        }
                        : book
                ));
            }

            // רענון הבקשות
            await loadLoanRequests();

            console.log('עדכון בקשה הושלם בהצלחה');

        } catch (error) {
            console.error('שגיאה בעדכון בקשה:', error);
            alert('שגיאה בעדכון הבקשה: ' + error.message);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* כותרת וכפתורים */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">קטלוג ספרים</h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">חפש וגלה ספרים בספריית שִׁלֹה</p>
                    {user?.role === 'admin' && loadingRequests && (
                        <p className="text-sm text-blue-600">טוען בקשות השאלה...</p>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    {user.role === 'admin' && (
                        <>
                            <button
                                onClick={handleAddBook}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                            >
                                <Plus size={16} />
                                <span className="hidden sm:inline">הוסף ספר חדש</span>
                                <span className="sm:hidden">הוסף ספר</span>
                            </button>
                            <button
                                onClick={loadLoanRequests}
                                disabled={loadingRequests}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
                            >
                                <RefreshCw size={16} className={loadingRequests ? "animate-spin" : ""} />
                                <span className="hidden sm:inline">רענן בקשות</span>
                                <span className="sm:hidden">רענן</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* אינדיקטור בקשות ממתינות לאדמין */}
            {user?.role === 'admin' && loanRequests.filter(r => r.status === 'pending').length > 0 && (
                <button
                    type="button"
                    onClick={() => onViewChange?.('returns')}
                    className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 text-right hover:bg-yellow-100 transition-colors"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                            <span className="font-medium text-yellow-800 text-sm sm:text-base">
                                יש {loanRequests.filter(r => r.status === 'pending').length} בקשות השאלה ממתינות לאישור
                            </span>
                        </div>
                        <span className="text-sm text-yellow-700 underline underline-offset-2">
                            עבור לניהול השאלות
                        </span>
                    </div>
                </button>
            )}

            {/* חיפוש */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="חפש ספרים, מחברים או נושאים..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-sm sm:text-base"
                />
                <Search className="absolute right-4 top-3 sm:top-3.5 text-gray-400" size={18} />
            </div>

            <CatalogSearchFilters value={locationFilter} onChange={setLocationFilter} />

            {/* תוצאות */}
            <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    {dataLoading
                        ? 'טוען את הקטלוג...'
                        : `נמצאו ${filteredBooks.length} ספרים`}
                    {locationFilter.color && ` · ${locationFilter.color}`}
                    {locationFilter.letter && ` · אות ${locationFilter.letter}`}
                    {locationFilter.number && ` · מספר ${locationFilter.number}`}
                </h3>

                {/* רשת ספרים */}
                {filteredBooks.length > 0 ? (
                    <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {visibleBooks.map(book => (
                            <BookCard
                                key={book.id}
                                book={book}
                                setSelectedBook={setSelectedBook}
                                // user={user}
                                onEditBook={handleEditBook}
                                onDeleteBook={handleDeleteBook}
                                categories={categories}
                                pendingRequests={user?.role === 'admin' ? getBookRequests(book.id) : []}
                                onUpdateRequestStatus={handleUpdateRequestStatus}
                            />
                        ))}
                    </div>
                    {visibleCount < filteredBooks.length && (
                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => setVisibleCount((count) => count + 48)}
                                className="min-h-11 rounded-xl border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                            >
                                הצג עוד ({filteredBooks.length - visibleCount} נוספים)
                            </button>
                        </div>
                    )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Book className="mx-auto text-gray-400 mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">לא נמצאו ספרים</h3>
                        <p className="text-gray-500">נסה לשנות את מילות החיפוש או הקטגוריה</p>
                    </div>
                )}
            </div>

            {/* פרטי ספר */}
            {selectedBook && (
                <BookDetail
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                    user={user}
                    onEditBook={handleEditBook}
                    onDeleteBook={handleDeleteBook}
                    categories={categories}
                    onLoanRequest={handleLoanRequestFromCatalog}
                    pendingRequests={user?.role === 'admin' ? getBookRequests(selectedBook.id) : []}
                    onUpdateRequestStatus={handleUpdateRequestStatus}
                />
            )}

            {/* עורך ספרים */}
            {showBookEditor && (
                <BookEditor
                    book={editingBook}
                    isNew={!editingBook}
                    onSave={handleSaveBook}
                    onCancel={() => {
                        setShowBookEditor(false);
                        setEditingBook(null);
                    }}
                    categories={categories}
                />
            )}
        </div>
    );
};

export default BookCatalog;