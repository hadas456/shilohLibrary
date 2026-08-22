import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getBooks,
  getCategories,
  getAnnouncements,
  getEvents,
  getUsers,
  addAnnouncement as addAnnouncementApi,
  deleteAnnouncement as deleteAnnouncementApi,
  deleteEvent as deleteEventApi,
  subscribeToCollection,
  initializeDefaultData
} from '../utils/dbHelpers';
import { db, isFirebaseEnabled } from '../utils/firebase';
import {
  initialCategories,
  defaultAnnouncements,
  localModeAnnouncement
} from '../constants';
import { loadPublishedSheetBooks, mergeCatalogBooks } from '../utils/sheetCatalog';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const initializeData = async () => {
      setDataLoading(true);
      try {
        await initializeDefaultData();

        const [booksData, categoriesData, announcementsData, eventsData, usersData] =
          await Promise.all([
            getBooks(),
            getCategories(),
            getAnnouncements(),
            getEvents(),
            getUsers()
          ]);

        let sheetBooks = [];
        try {
          sheetBooks = await loadPublishedSheetBooks();
        } catch (sheetError) {
          console.warn('לא נטען קטלוג השיטס:', sheetError);
        }

        if (cancelled) return;

        setBooks(mergeCatalogBooks(sheetBooks, booksData));
        setCategories(categoriesData.length > 0 ? categoriesData : initialCategories);
        setAnnouncements(
          announcementsData.length > 0 ? announcementsData : defaultAnnouncements
        );
        setEvents(eventsData);
        setUsers(usersData);
      } catch (error) {
        console.error('שגיאה בטעינת נתונים:', error);
        if (!cancelled) {
          setBooks([]);
          setCategories(initialCategories);
          setAnnouncements([localModeAnnouncement]);
          setEvents([]);
          setUsers([]);
        }
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    };

    initializeData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isFirebaseEnabled || !db) return;

    const unsubscribers = [
      subscribeToCollection('books', (storedBooks) => {
        setBooks((current) => {
          const sheetBooks = current.filter((book) => book.source === 'google-sheets');
          return mergeCatalogBooks(sheetBooks, storedBooks);
        });
      }),
      subscribeToCollection('categories', (data) => {
        setCategories(data.length > 0 ? data : initialCategories);
      }),
      subscribeToCollection('events', setEvents),
      subscribeToCollection('announcements', setAnnouncements),
      subscribeToCollection('users', setUsers)
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const login = (userData) => {
    if (!userData || !userData.name) {
      throw new Error('נתוני משתמש לא תקינים');
    }
    setUser(userData);
  };

  const logout = () => setUser(null);

  const deleteEvent = async (eventId) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את האירוע?')) return;
    try {
      await deleteEventApi(eventId);
      if (!isFirebaseEnabled) {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
      }
    } catch (error) {
      console.error('שגיאה במחיקת אירוע:', error);
      alert(`שגיאה במחיקת האירוע: ${error.message}`);
    }
  };

  const addAnnouncement = async (announcementData) => {
    try {
      const created = await addAnnouncementApi(announcementData);
      if (!isFirebaseEnabled && created) {
        setAnnouncements((prev) => [created, ...prev]);
      }
      return created;
    } catch (error) {
      console.error('שגיאה בהוספת הודעה:', error);
      alert(`שגיאה בהוספת ההודעה: ${error.message}`);
      throw error;
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    try {
      await deleteAnnouncementApi(announcementId);
      if (!isFirebaseEnabled) {
        setAnnouncements((prev) =>
          prev.filter((announcement) => announcement.id !== announcementId)
        );
      }
    } catch (error) {
      console.error('שגיאה במחיקת הודעה:', error);
      alert(`שגיאה במחיקת ההודעה: ${error.message}`);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      books,
      setBooks,
      categories,
      setCategories,
      events,
      setEvents,
      announcements,
      setAnnouncements,
      users,
      setUsers,
      dataLoading,
      deleteEvent,
      addAnnouncement,
      deleteAnnouncement,
      isFirebaseEnabled
    }),
    [
      user,
      books,
      categories,
      events,
      announcements,
      users,
      dataLoading
    ]
  );

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
}
