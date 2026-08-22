import React, { useState } from 'react';

import LoginScreen from './components/LoginScreen';
import Navigation from './components/Navigation';
import SystemAnnouncements from './components/SystemAnnouncements';
import AdminPanel from './components/AdminPanel';
import BorrowedBooks from './components/BorrowedBooks';
import ReturnRequestsManagement from './components/ReturnRequestsManagement';
import BookCatalog from './components/BookCatalog';
import ContactSection from './components/ContactSection';
import HebrewCalendar from './components/HebrewCalendar';
import AppHeader from './components/AppHeader';
import { useLibrary } from './context/LibraryContext';

export default function LibrarySystem() {
  const { user, login, logout } = useLibrary();
  const [currentView, setCurrentView] = useState('calendar');

  const handleLogin = (userData) => {
    try {
      login(userData);
      console.log('התחברות מוצלחת למערכת:', userData.name);
    } catch (error) {
      console.error('שגיאה בטיפול בהתחברות:', error);
      alert(`שגיאה בהתחברות למערכת: ${error.message}`);
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-900">
      <Navigation />
      <SystemAnnouncements />
      <AppHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={logout}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {currentView === 'calendar' && <HebrewCalendar />}

        {currentView === 'catalog' && (
          <BookCatalog onViewChange={setCurrentView} />
        )}

        {currentView === 'borrowed' && user.role !== 'admin' && (
          <BorrowedBooks
            onBookReturned={(bookId) => console.log('ספר הוחזר:', bookId)}
          />
        )}

        {currentView === 'returns' && user.role === 'admin' && (
          <ReturnRequestsManagement />
        )}

        {currentView === 'admin' && user.role === 'admin' && <AdminPanel />}

        {user.role !== 'admin' && <ContactSection />}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-stone-500">
        מערכת ספריית שילה • נבנה ב-React + Firebase • לוח שנה יהודי אוטומטי עם @hebcal/core • ניהול הרשאות מתקדם
      </footer>
    </div>
  );
}
