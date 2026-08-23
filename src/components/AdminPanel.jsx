import React, { useState, useMemo } from 'react';
import { Shield, Trash2, Calendar, Bell, Users, Settings, Book, Tag, Mail } from 'lucide-react';
import UserManagement from './UserManagement';
import CategoryManagement from './CategoryManagement';
import FirebaseStatus from './FirebaseStatus';
import AdminContactMessages from './AdminContactMessages';
import SheetSyncPanel from './SheetSyncPanel';
import { useLibrary } from '../context/LibraryContext';
import { isEventInPast, parseEventDate } from '../utils/dateHelpers';

const dummyMessages = [
  {
    id: 'dummy1',
    name: 'אלעד כהן',
    email: 'elad@gmail.com',
    message: 'שלום, אשמח לדעת האם הספר \'חומש רש"י\' פנוי להשאלה מחר בבוקר?',
    createdAt: new Date().toISOString(),
    status: 'new'
  },
  {
    id: 'dummy2',
    name: 'מיכל אברהם',
    email: 'michal@outlook.com',
    message: 'היי, יש לי שאלה לגבי שעות הפתיחה של הספרייה בערבי חגים. תודה!',
    createdAt: new Date().toISOString(),
    status: 'new'
  }
];

export default function AdminPanel() {
  const {
    user: currentUser,
    events,
    announcements,
    books,
    categories,
    users,
    dataLoading,
    deleteEvent
  } = useLibrary();

  const [activeTab, setActiveTab] = useState('overview');

  const stats = useMemo(() => {
    const activeUsers = users.filter((u) => u.isActive !== false).length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const regularUsers = users.filter((u) => u.role === 'user').length;

    return {
      users: users.length,
      books: books.length,
      categories: categories.length,
      events: events.length,
      announcements: announcements.length,
      activeUsers,
      admins,
      regularUsers
    };
  }, [users, books, categories, events, announcements]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">פאנל ניהול מתקדם</h2>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 mb-4 sm:mb-6">
          <div className="flex gap-2 min-w-max sm:flex-wrap">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'border border-stone-300 hover:bg-stone-100'}`}
            >
              <Settings className="w-4 h-4" />
              סקירה כללית
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'border border-stone-300 hover:bg-stone-100'}`}
            >
              <Users className="w-4 h-4" />
              משתמשים
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'categories' ? 'bg-blue-600 text-white' : 'border border-stone-300 hover:bg-stone-100'}`}
            >
              <Tag className="w-4 h-4" />
              קטגוריות
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'border border-stone-300 hover:bg-stone-100'}`}
            >
              <Calendar className="w-4 h-4" />
              אירועים
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'announcements' ? 'bg-blue-600 text-white' : 'border border-stone-300 hover:bg-stone-100'}`}
            >
              <Bell className="w-4 h-4" />
              הודעות
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'messages' ? 'bg-blue-600 text-white' : 'border border-stone-300 hover:bg-stone-100'}`}
            >
              <Mail className="w-4 h-4" />
              פניות
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="font-medium text-blue-900 text-sm sm:text-base">משתמשים</h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-900">
                {dataLoading ? '...' : stats.users}
              </div>
              <div className="text-xs sm:text-sm text-blue-700">
                {dataLoading ? 'טוען...' : `${stats.activeUsers} פעילים`}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 border border-green-200">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Book className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <h3 className="font-medium text-green-900 text-sm sm:text-base">ספרים</h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-900">
                {dataLoading ? '...' : stats.books}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3 sm:p-4 border border-purple-200">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <h3 className="font-medium text-purple-900 text-sm sm:text-base">אירועים</h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-purple-900">
                {dataLoading ? '...' : stats.events}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-3 sm:p-4 border border-orange-200">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                <h3 className="font-medium text-orange-900 text-sm sm:text-base">הודעות</h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-orange-900">
                {dataLoading ? '...' : stats.announcements}
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'users' && <UserManagement currentUser={currentUser} />}
      {activeTab === 'categories' && <CategoryManagement />}
      {activeTab === 'messages' && <AdminContactMessages defaultMessages={dummyMessages} />}

      {activeTab === 'events' && (
        <div className="rounded-3xl border border-stone-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="font-medium">ניהול אירועים</h3>
          </div>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-2">
              {events.length === 0 && (
                <div className="text-sm text-stone-500 text-center py-8">
                  אין אירועים במערכת. אפשר להוסיף אירוע מלוח השנה.
                </div>
              )}
              {[...events]
                .sort((a, b) => {
                  const aPast = isEventInPast(a);
                  const bPast = isEventInPast(b);
                  if (aPast !== bPast) return aPast ? 1 : -1;
                  return (parseEventDate(b)?.getTime() || 0) - (parseEventDate(a)?.getTime() || 0);
                })
                .map((event) => {
                  const past = isEventInPast(event);
                  const eventDate = parseEventDate(event);
                  return (
                    <div
                      key={event.id}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        past ? 'border-stone-200 bg-stone-50' : 'border-stone-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-medium ${past ? 'text-stone-500' : ''}`}>
                            {event.title}
                          </div>
                          {past && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-600">
                              עבר
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500">
                          {eventDate ? eventDate.toLocaleDateString('he-IL') : 'ללא תאריך'}
                          {event.time ? ` · ${event.time}` : ''}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 p-2"
                        aria-label="מחיקת אירוע"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="rounded-3xl border border-stone-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium">ניהול הודעות מערכת</h3>
          </div>
          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-center justify-between p-3 border border-stone-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{announcement.title}</div>
                    <div className="text-xs text-stone-500">{announcement.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <SheetSyncPanel />
          <FirebaseStatus />
          <div className="rounded-3xl border border-stone-200 bg-white p-5">
            <h3 className="font-medium mb-4">סיכום פעילות המערכת</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">משתמשים</h4>
                <div className="text-sm text-gray-600">
                  <div>מנהלים: {stats.admins}</div>
                  <div>משתמשים רגילים: {stats.regularUsers}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
