import React from 'react';

// ------------------------------------------------------
// 🏠 קומפוננטת סרגל ניווט עליון
// ------------------------------------------------------
export default function Navigation() {
    return (
        <nav className="bg-white border-b border-stone-200 shadow-sm">
            <div className="mx-auto max-w-6xl px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center justify-between">
                    {/* לוגו */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-700 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                            סל
                        </div>
                        <h1 className="text-base sm:text-xl font-semibold text-stone-800">ספריית שִׁלֹה</h1>
                    </div>

                </div>
            </div>
        </nav>

    );
}