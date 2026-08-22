import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getBooks,
  getCategories,
  getAnnouncements,
  getEvents,
  getUsers,
  getDeletedSheetKeys,
  getDeletedAnnouncements,
  filterDeletedAnnouncements,
  addAnnouncement as addAnnouncementApi,
  deleteAnnouncement as deleteAnnouncementApi,
  addEvent as addEventApi,
  deleteEvent as deleteEventApi,
  subscribeToCollection,
  initializeDefaultData
} from '../utils/dbHelpers';
import { db, isFirebaseEnabled } from '../utils/firebase';
import {
  initialCategories,
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

        const [booksData, categoriesData, announcementsData, eventsData, usersData, deletedKeys] =
          await Promise.all([
            getBooks(),
            getCategories(),
            getAnnouncements(),
            getEvents(),
            getUsers(),
            getDeletedSheetKeys()
          ]);

        let sheetBooks = [];
        try {
          sheetBooks = await loadPublishedSheetBooks();
        } catch (sheetError) {
          console.warn('לא נטען קטלוג השיטס:', sheetError);
        }

        if (cancelled) return;

        setBooks(mergeCatalogBooks(sheetBooks, booksData, deletedKeys));
        setCategories(categoriesData.length > 0 ? categoriesData : initialCategories);
        setAnnouncements(announcementsData);
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
        getDeletedSheetKeys().then((deletedKeys) => {
          setBooks((current) => {
            const sheetBooks = current.filter((book) => book.source === 'google-sheets');
            return mergeCatalogBooks(sheetBooks, storedBooks, deletedKeys);
          });
        });
      }),
      subscribeToCollection('categories', (data) => {
        setCategories(data.length > 0 ? data : initialCategories);
      }),
      subscribeToCollection('events', setEvents),
      subscribeToCollection('announcements', (data) => {
        getDeletedAnnouncements().then((deleted) => {
          setAnnouncements(filterDeletedAnnouncements(data, deleted));
        });
      }),
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

  const addEvent = async (eventData) => {
    try {
      const created = await addEventApi(eventData);
      if (created) {
        setEvents((prev) => {
          if (prev.some((event) => String(event.id) === String(created.id))) {
            return prev;
          }
          return [created, ...prev];
        });
      }
      return created;
    } catch (error) {
      console.error('שגיאה בהוספת אירוע:', error);
      alert(`שגיאה בשמירת האירוע: ${error.message}`);
      throw error;
    }
  };

  const deleteEvent = async (eventId) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את האירוע?')) return;
    try {
      await deleteEventApi(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
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

  const deleteAnnouncement = async (announcementId, announcement) => {
    try {
      await deleteAnnouncementApi(announcementId, announcement);
      setAnnouncements((prev) =>
        prev.filter((item) => String(item.id) !== String(announcementId))
      );
    } catch (error) {
      console.error('שגיאה במחיקת הודעה:', error);
      setAnnouncements((prev) =>
        prev.filter((item) => String(item.id) !== String(announcementId))
      );
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
      addEvent,
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
