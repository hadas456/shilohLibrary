import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import TimePicker from './TimePicker';
import { fmtHebDate } from '../utils/dateHelpers';
import { useLibrary } from '../context/LibraryContext';

export default function EventCreateModal({
  open,
  selectedDate,
  user,
  onClose
}) {
  const { addEvent } = useLibrary();
  const [newEvent, setNewEvent] = useState({ title: '', description: '', time: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setNewEvent({ title: '', description: '', time: '' });
      setLoading(false);
    }
  }, [open]);

  if (!open || user?.role !== 'admin') return null;

  const handleClose = () => {
    setNewEvent({ title: '', description: '', time: '' });
    onClose();
  };

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) return;
    setLoading(true);

    try {
      await addEvent({
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        time: newEvent.time.trim(),
        date: selectedDate.toISOString(),
        createdAt: new Date().toISOString(),
        createdBy: user.name,
        createdById: user.id || user.username,
        type: 'admin_event',
        eventType: 'admin_event',
        visibility: 'all',
        isPersonal: false,
        forAdminsOnly: false
      });
      handleClose();
    } catch (error) {
      console.error('שגיאה בשמירת האירוע:', error);
      alert(`שגיאה בשמירת האירוע: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <div className="text-xl font-bold text-stone-800">אירוע חדש</div>
            <div className="text-xs text-stone-500 mt-0.5">{fmtHebDate.format(selectedDate)}</div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              כותרת
            </label>
            <input
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              value={newEvent.title}
              onChange={(e) => setNewEvent((s) => ({ ...s, title: e.target.value }))}
              placeholder="שם האירוע (למשל: השקת ספר)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              שעה (אופציונלי)
            </label>
            <div className="mt-1">
              <TimePicker
                value={newEvent.time}
                onChange={(time) => setNewEvent((s) => ({ ...s, time }))}
                placeholder="בחר שעה"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              תיאור
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              value={newEvent.description}
              onChange={(e) => setNewEvent((s) => ({ ...s, description: e.target.value }))}
              placeholder="פרטים נוספים, כתובת, קישור להרשמה וכו'"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-end gap-3 bg-stone-50/30">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors"
          >
            ביטול
          </button>
          <button
            type="button"
            onClick={handleAddEvent}
            disabled={loading || !newEvent.title.trim()}
            className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'שומר...' : 'שמור אירוע'}
          </button>
        </div>
      </div>
    </div>
  );
}
