import React, { useEffect, useMemo, useState } from 'react';
import {
  fmtGregDate,
  fmtGregShort,
  toISODateKey,
  startOfDay,
  isEventInPast,
  monthMatrix,
  getHebrewDate,
  formatHebrewDateTraditional,
  holidayTypesHebrew,
  getShabbatTimes,
  isShabbat,
  isErevShabbat,
  getCachedJewishEventsForMonth,
  getHebrewDayLetter,
  getHebrewHolidayName
} from '../utils/dateHelpers';
import { weekdays } from '../constants';
import EventCreateModal from './EventCreateModal';
import { useLibrary } from '../context/LibraryContext';
import { isCalendarEventVisible } from '../utils/dbHelpers';

export default function HebrewCalendar() {
  const { user, events, deleteEvent: onDeleteEvent } = useLibrary();
  const [today] = useState(new Date());
  const [cursor, setCursor] = useState(startOfDay(new Date()));
  const [selected, setSelected] = useState(startOfDay(new Date()));
  const [monthlyHolidays, setMonthlyHolidays] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const grid = useMemo(() => monthMatrix(cursor), [cursor]);

  useEffect(() => {
    try {
      const holidays = getCachedJewishEventsForMonth(cursor.getFullYear(), cursor.getMonth());
      setMonthlyHolidays(holidays);
    } catch (error) {
      console.error('שגיאה בטעינת חגים יהודיים:', error);
      setMonthlyHolidays([]);
    }
  }, [cursor]);

  const eventsByKey = useMemo(() => {
    const map = new Map();
    if (!user) return map;

    for (const ev of events) {
      if (!isCalendarEventVisible(ev, user)) {
        continue;
      }

      const jsDate = ev.date?.toDate ? ev.date.toDate() : new Date(ev.date);
      const key = toISODateKey(jsDate);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    return map;
  }, [events, user]);

  const holidaysByKey = useMemo(() => {
    const map = new Map();
    for (const holiday of monthlyHolidays) {
      const key = holiday.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(holiday);
    }
    return map;
  }, [monthlyHolidays]);

  const headerHeb = formatHebrewDateTraditional(today);
  const headerGreg = fmtGregDate.format(today);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <section className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">ברוך הבא {user.name}</h2>
            <p className="text-stone-700 mb-4 text-sm sm:text-base">
              {user.role === 'admin'
                ? 'כאן תוכל לנהל אוספים, אירועים ולוח השנה היהודי. יש לך גישה מלאה לכלל הפונקציות.'
                : 'כאן תוכל לראות את לוח השנה היהודי עם חגים, אירועים ותאריכים עבריים.'}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {user.role === 'admin' && (
                <button
                  className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 bg-emerald-700 text-white hover:bg-emerald-800 text-sm"
                  onClick={() => setPanelOpen(true)}
                >
                  הוספת אירוע חדש
                </button>
              )}
              <button
                className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 border border-stone-300 hover:bg-stone-100 text-sm"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              >
                חודש קודם
              </button>
              <button
                className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 border border-stone-300 hover:bg-stone-100 text-sm"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              >
                חודש הבא
              </button>
              <button
                className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 border border-stone-300 hover:bg-stone-100 text-sm"
                onClick={() => setCursor(startOfDay(new Date()))}
              >
                היום
              </button>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white overflow-hidden mx-0 sm:mx-4 md:mx-8 shadow-lg">
            <div className="flex items-start justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 border-b border-stone-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="text-right">
                <div className="text-sm sm:text-lg font-semibold text-stone-800">{headerHeb}</div>
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-lg font-semibold text-stone-800">{headerGreg}</div>
              </div>
            </div>

            <div className="p-2 sm:p-4 md:p-6">
              <div className="grid grid-cols-7 gap-px bg-stone-200 rounded-lg overflow-hidden">
                {weekdays.map((d) => (
                  <div key={d} className="bg-stone-50 text-center text-[10px] sm:text-xs font-medium py-2 sm:py-3">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px bg-stone-200 mt-1 sm:mt-2 rounded-lg overflow-hidden">
                {grid.map(({ date, inCurrent }, idx) => {
                  const isToday = toISODateKey(date) === toISODateKey(today);
                  const isSelected = toISODateKey(date) === toISODateKey(selected);
                  const key = toISODateKey(date);
                  const dayGreg = fmtGregShort.format(date);
                  const dayHebrewLetter = getHebrewDayLetter(date);
                  const dayEvents = eventsByKey.get(key) || [];
                  const holidays = holidaysByKey.get(key) || [];
                  const shabbatTimes = getShabbatTimes(date);
                  const isShabbatDay = isShabbat(date);
                  const isFridayDay = isErevShabbat(date);

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelected(startOfDay(date))}
                      className={[
                        'relative min-h-[60px] sm:min-h-[90px] md:min-h-[120px] bg-white p-1 sm:p-2 text-right transition-all hover:bg-stone-50',
                        inCurrent ? '' : 'bg-stone-50 text-stone-400',
                        isSelected ? 'ring-2 ring-emerald-600 z-10 bg-emerald-50' : '',
                        isToday ? 'outline outline-2 outline-emerald-500' : '',
                        isShabbatDay ? 'bg-blue-50 border-r-2 border-blue-300' : '',
                        isFridayDay ? 'bg-yellow-50 border-r-2 border-yellow-300' : ''
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between mb-0.5 sm:mb-2">
                        <div className="flex items-baseline gap-0.5 sm:gap-1">
                          <span className="text-sm sm:text-lg font-bold text-stone-800">{dayGreg}</span>
                          <span className="text-[10px] sm:text-sm text-blue-600 font-medium">{dayHebrewLetter}</span>
                        </div>
                        {isToday && <span className="text-[8px] sm:text-xs text-emerald-600 font-bold">היום</span>}
                      </div>

                      {shabbatTimes && (
                        <div className="hidden sm:block text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded mb-1">
                          {shabbatTimes.name} {shabbatTimes.time}
                        </div>
                      )}

                      <div className="space-y-0.5 mb-1 hidden sm:block">
                        {holidays.slice(0, 2).map((holiday) => {
                          const hebrewName = getHebrewHolidayName(holiday.fullEvent);
                          return (
                            <div
                              key={holiday.name}
                              className={`text-[9px] px-1.5 py-0.5 rounded border truncate ${holidayTypesHebrew[holiday.type].color}`}
                              title={hebrewName}
                            >
                              <span className="ml-0.5">{holidayTypesHebrew[holiday.type].icon}</span>
                              {hebrewName}
                            </div>
                          );
                        })}
                      </div>

                      {holidays.length > 0 && (
                        <div className="sm:hidden flex gap-0.5 flex-wrap">
                          {holidays.slice(0, 2).map((holiday) => (
                            <span key={holiday.name} className="text-[10px]" title={getHebrewHolidayName(holiday.fullEvent)}>
                              {holidayTypesHebrew[holiday.type].icon}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="space-y-0.5 hidden sm:block">
                        {dayEvents.slice(0, holidays.length > 0 ? 1 : 2).map((ev) => {
                          const past = isEventInPast(ev);
                          return (
                          <div
                            key={ev.id}
                            className={`truncate rounded-md px-1.5 py-0.5 text-[9px] border ${
                              past
                                ? 'bg-stone-100 border-stone-200 text-stone-500'
                                : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                            }`}
                          >
                            {past ? 'עבר · ' : ''}{ev.time ? `${ev.time} ` : ''}{ev.title}
                          </div>
                          );
                        })}
                      </div>

                      {dayEvents.length > 0 && (
                        <div className="sm:hidden">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto mt-1"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4 sm:space-y-6">
          <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-4 sm:p-5">
            <div className="text-sm text-stone-500">תאריך נבחר</div>
            <div className="mt-1 flex items-start justify-between gap-2 sm:gap-3">
              <div className="text-right">
                <div className="text-sm sm:text-lg font-semibold text-stone-800">
                  {formatHebrewDateTraditional(selected)}
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-lg font-semibold text-stone-800">{fmtGregDate.format(selected)}</div>
                <div className="text-xs sm:text-sm text-stone-500">
                  {selected.toLocaleDateString('he-IL', { weekday: 'long' })}
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 flex gap-2">
              {user.role === 'admin' && (
                <button
                  onClick={() => setPanelOpen(true)}
                  className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 bg-emerald-700 text-white hover:bg-emerald-800 text-sm"
                >
                  אירוע חדש
                </button>
              )}
            </div>

            <div className="mt-4 sm:mt-6">
              <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">אירועים וחגים בתאריך זה</h3>

              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs sm:text-sm text-blue-800 font-medium mb-1">
                  {getHebrewDate(selected)}
                </div>
                {getShabbatTimes(selected) && (
                  <div className="text-xs text-blue-600">
                    {getShabbatTimes(selected).name} - {getShabbatTimes(selected).time}
                  </div>
                )}
              </div>

              <ul className="space-y-2">
                {(holidaysByKey.get(toISODateKey(selected)) || []).map((holiday) => (
                  <li
                    key={holiday.name}
                    className={`rounded-lg sm:rounded-xl border p-2 sm:p-3 ${holidayTypesHebrew[holiday.type].color}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg">{holidayTypesHebrew[holiday.type].icon}</span>
                      <div className="flex-1">
                        <div className="text-xs sm:text-sm font-medium">
                          {getHebrewHolidayName(holiday.fullEvent)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}

                {(eventsByKey.get(toISODateKey(selected)) || []).map((ev) => {
                  const past = isEventInPast(ev);
                  return (
                  <li
                    key={ev.id}
                    className={`rounded-lg sm:rounded-xl border p-2 sm:p-3 ${
                      past ? 'border-stone-200 bg-stone-50' : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`text-xs sm:text-sm font-medium ${past ? 'text-stone-500' : ''}`}>{ev.title}</div>
                          {past && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-600">
                              עבר
                            </span>
                          )}
                        </div>
                        {ev.time && <div className="text-xs text-stone-500">{ev.time}</div>}
                        {ev.description && (
                          <div className="text-xs text-stone-500 mt-1 whitespace-pre-line line-clamp-2 sm:line-clamp-none">{ev.description}</div>
                        )}
                      </div>
                      {user.role === 'admin' && (
                        <button
                          type="button"
                          onClick={() => onDeleteEvent(ev.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          aria-label="מחיקת אירוע"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <EventCreateModal
        open={panelOpen}
        selectedDate={selected}
        user={user}
        onClose={() => setPanelOpen(false)}
      />
    </>
  );
}
