import React, { useEffect, useRef, useState } from 'react';
import { User, Settings, Calendar, LogOut, Book, BookOpen, ChevronDown, Mail, Phone, Shield } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { useLibrary } from '../context/LibraryContext';

function ProfileField({ label, value }) {
  if (!value) return null;

  return (
    <div>
      <dt className="text-xs text-stone-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-stone-900">{value}</dd>
    </div>
  );
}

export default function AppHeader({ currentView, onViewChange, onLogout }) {
  const { user, isFirebaseEnabled } = useLibrary();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  const roleLabel = user.role === 'admin' ? 'מנהל' : 'משתמש';
  const statusLabel = user.isActive === false ? 'לא פעיל' : 'פעיל';

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-stone-200">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm text-stone-500">
              {user.role === 'admin' ? 'פאנל ניהול' : 'לוח שנה עברי ואירועי הספריה'}
            </p>
            {!isFirebaseEnabled && (
              <p className="text-xs text-amber-600">רץ במצב מקומי</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => onViewChange('calendar')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                currentView === 'calendar'
                  ? 'bg-emerald-700 text-white'
                  : 'border border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              לוח שנה
            </button>

            <button
              onClick={() => onViewChange('catalog')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                currentView === 'catalog'
                  ? 'bg-emerald-700 text-white'
                  : 'border border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Book className="w-4 h-4" />
              קטלוג ספרים
            </button>

            {user.role !== 'admin' && (
              <button
                onClick={() => onViewChange('borrowed')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                  currentView === 'borrowed'
                    ? 'bg-emerald-700 text-white'
                    : 'border border-stone-300 hover:bg-stone-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                הספרים שלי
              </button>
            )}

            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => onViewChange('returns')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                    currentView === 'returns'
                      ? 'bg-emerald-700 text-white'
                      : 'border border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  ניהול השאלות
                </button>

                <button
                  onClick={() => onViewChange('admin')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                    currentView === 'admin'
                      ? 'bg-emerald-700 text-white'
                      : 'border border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  ניהול
                </button>
              </>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-haspopup="dialog"
              aria-label={`פרופיל של ${user.name}`}
              className={`flex min-h-11 items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                profileOpen
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-stone-200 hover:bg-stone-100'
              }`}
            >
              <User className="h-4 w-4" />
              <span className="font-medium">{user.name}</span>
              {user.role === 'admin' && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                  מנהל
                </span>
              )}
              <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div
                role="dialog"
                aria-label="פרטי פרופיל"
                className="absolute left-0 z-30 mt-2 w-80 rounded-2xl border border-stone-200 bg-white p-4 text-right shadow-lg"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${
                    user.role === 'admin' ? 'bg-emerald-700' : 'bg-stone-600'
                  }`}>
                    {user.role === 'admin' ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">{user.name}</h3>
                    <p className="text-sm text-stone-500">{roleLabel}</p>
                  </div>
                </div>

                <dl className="space-y-3">
                  <ProfileField label="שם משתמש" value={user.username ? `@${user.username}` : null} />
                  <ProfileField label="תפקיד" value={roleLabel} />
                  {user.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                      <div>
                        <dt className="text-xs text-stone-500">אימייל</dt>
                        <dd className="mt-0.5 text-sm font-medium text-stone-900">{user.email}</dd>
                      </div>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                      <div>
                        <dt className="text-xs text-stone-500">טלפון</dt>
                        <dd className="mt-0.5 text-sm font-medium text-stone-900" dir="ltr">{user.phone}</dd>
                      </div>
                    </div>
                  )}
                  <ProfileField label="סטטוס" value={statusLabel} />
                </dl>
              </div>
            )}
          </div>

          <NotificationCenter />

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-sm"
          >
            <LogOut className="w-4 h-4" />
            יציאה
          </button>
        </div>
      </div>
    </header>
  );
}
