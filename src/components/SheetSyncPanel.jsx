import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { getSheetSyncState, shouldRunDailySync, syncBooksFromSheet } from '../utils/api/sheetSync';
import { getBooks } from '../utils/api/books';
import { useLibrary } from '../context/LibraryContext';

function formatSyncTime(value) {
    if (!value) return 'עדיין לא רץ';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'עדיין לא רץ';
    return date.toLocaleString('he-IL');
}

export default function SheetSyncPanel() {
    const { setBooks, isFirebaseEnabled } = useLibrary();
    const [state, setState] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const ranDaily = useRef(false);

    const loadState = async () => {
        const saved = await getSheetSyncState();
        setState(saved);
        return saved;
    };

    const runSync = async (isAutomatic = false) => {
        if (syncing) return;

        setSyncing(true);
        setError('');
        setNotice(isAutomatic ? 'מריץ סנכרון יומי מהשיטס...' : 'קורא את רשימת הספרים מגוגל שיטס...');
        setProgress({ current: 0, total: 0 });

        try {
            const result = await syncBooksFromSheet({
                onProgress: (current, total) => {
                    setProgress({ current, total });
                    setNotice(total ? `מעדכן ספרים באתר ${current} מתוך ${total}` : 'מכין את הרשימה...');
                }
            });

            setState(result);
            if (!isFirebaseEnabled) {
                setBooks(await getBooks());
            }
            setNotice(
                `הסתיים: ${result.created} חדשים, ${result.updated} עודכנו, ${result.unchanged} ללא שינוי.`
            );
        } catch (syncError) {
            console.error('שגיאה בסנכרון השיטס:', syncError);
            setError(syncError.message || 'הסנכרון נכשל');
            setNotice('');
        } finally {
            setSyncing(false);
            setProgress(null);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const start = async () => {
            const saved = await loadState();
            if (cancelled || ranDaily.current) return;
            if (shouldRunDailySync(saved)) {
                ranDaily.current = true;
                runSync(true);
            }
        };

        start();
        return () => {
            cancelled = true;
        };
    }, []);

    const percent = progress?.total
        ? Math.round((progress.current / progress.total) * 100)
        : 0;

    return (
        <div className="rounded-3xl border border-stone-200 bg-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
                        <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-medium text-stone-900">סנכרון מגוגל שיטס</h3>
                        <p className="mt-1 max-w-xl text-sm text-stone-600">
                            רשימת הספרים מגיעה מהשיטס פעם ביום. השאלות, סטטוס ותמונות באתר לא נדרסים.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => runSync(false)}
                    disabled={syncing}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'מסנכרן...' : state?.lastSyncedAt ? 'סנכרן עכשיו' : 'ייבא את הספרים'}
                </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <div className="text-xs text-stone-500">סנכרון אחרון</div>
                    <div className="mt-1 text-sm font-medium text-stone-900">
                        {formatSyncTime(state?.lastSyncedAt)}
                    </div>
                </div>
                <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <div className="text-xs text-stone-500">ספרים מהשיטס</div>
                    <div className="mt-1 text-sm font-medium text-stone-900">
                        {state?.imported ?? '—'}
                    </div>
                </div>
                <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <div className="text-xs text-stone-500">שינויים אחרונים</div>
                    <div className="mt-1 text-sm font-medium text-stone-900">
                        {state
                            ? `${state.created || 0} חדשים · ${state.updated || 0} עודכנו`
                            : '—'}
                    </div>
                </div>
            </div>

            {syncing && (
                <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-stone-500">
                        <span>{notice}</span>
                        <span>{progress?.total ? `${percent}%` : ''}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                        <div
                            className="h-full rounded-full bg-emerald-600 transition-all"
                            style={{ width: `${progress?.total ? percent : 15}%` }}
                        />
                    </div>
                </div>
            )}

            {!syncing && notice && (
                <div className="mt-4 flex items-start gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{notice}</span>
                </div>
            )}

            {!isFirebaseEnabled && (
                <div className="mt-4 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    האתר רץ במצב מקומי. ייבואו אלפי ספרים עלולים לא להישמר בדפדפן. עדיף לסנכרן כש-Firebase פעיל.
                </div>
            )}

            {error && (
                <div className="mt-4 flex items-start gap-2 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-800">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
