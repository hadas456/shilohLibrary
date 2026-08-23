import React, { useState } from 'react';
import { FolderPlus, Plus, Trash2, Edit2, Save, X, AlertCircle, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import {
    addCategory,
    updateCategory,
    deleteCategory
} from '../utils/dbHelpers';
import { useLibrary } from '../context/LibraryContext';

const colorFamilies = [
    { name: 'אדום', family: 'red', shades: ['red-300', 'red-400', 'red-500', 'red-600', 'red-700', 'red-800'] },
    { name: 'כתום', family: 'orange', shades: ['orange-300', 'orange-400', 'orange-500', 'orange-600', 'orange-700', 'orange-800'] },
    { name: 'ענבר', family: 'amber', shades: ['amber-300', 'amber-400', 'amber-500', 'amber-600', 'amber-700', 'amber-800'] },
    { name: 'צהוב', family: 'yellow', shades: ['yellow-300', 'yellow-400', 'yellow-500', 'yellow-600', 'yellow-700', 'yellow-800'] },
    { name: 'ליים', family: 'lime', shades: ['lime-300', 'lime-400', 'lime-500', 'lime-600', 'lime-700', 'lime-800'] },
    { name: 'ירוק', family: 'green', shades: ['green-300', 'green-400', 'green-500', 'green-600', 'green-700', 'green-800'] },
    { name: 'זמרגד', family: 'emerald', shades: ['emerald-300', 'emerald-400', 'emerald-500', 'emerald-600', 'emerald-700', 'emerald-800'] },
    { name: 'טורקיז', family: 'teal', shades: ['teal-300', 'teal-400', 'teal-500', 'teal-600', 'teal-700', 'teal-800'] },
    { name: 'ציאן', family: 'cyan', shades: ['cyan-300', 'cyan-400', 'cyan-500', 'cyan-600', 'cyan-700', 'cyan-800'] },
    { name: 'תכלת', family: 'sky', shades: ['sky-300', 'sky-400', 'sky-500', 'sky-600', 'sky-700', 'sky-800'] },
    { name: 'כחול', family: 'blue', shades: ['blue-300', 'blue-400', 'blue-500', 'blue-600', 'blue-700', 'blue-800'] },
    { name: 'אינדיגו', family: 'indigo', shades: ['indigo-300', 'indigo-400', 'indigo-500', 'indigo-600', 'indigo-700', 'indigo-800'] },
    { name: 'סגול', family: 'violet', shades: ['violet-300', 'violet-400', 'violet-500', 'violet-600', 'violet-700', 'violet-800'] },
    { name: 'סגול כהה', family: 'purple', shades: ['purple-300', 'purple-400', 'purple-500', 'purple-600', 'purple-700', 'purple-800'] },
    { name: 'פוקסיה', family: 'fuchsia', shades: ['fuchsia-300', 'fuchsia-400', 'fuchsia-500', 'fuchsia-600', 'fuchsia-700', 'fuchsia-800'] },
    { name: 'ורוד', family: 'pink', shades: ['pink-300', 'pink-400', 'pink-500', 'pink-600', 'pink-700', 'pink-800'] },
    { name: 'ורדרד', family: 'rose', shades: ['rose-300', 'rose-400', 'rose-500', 'rose-600', 'rose-700', 'rose-800'] },
    { name: 'אפור', family: 'gray', shades: ['gray-300', 'gray-400', 'gray-500', 'gray-600', 'gray-700', 'gray-800'] },
    { name: 'אבן', family: 'stone', shades: ['stone-300', 'stone-400', 'stone-500', 'stone-600', 'stone-700', 'stone-800'] },
    { name: 'צפחה', family: 'slate', shades: ['slate-300', 'slate-400', 'slate-500', 'slate-600', 'slate-700', 'slate-800'] },
];

const colorClasses = {
    'red-300': 'bg-red-300', 'red-400': 'bg-red-400', 'red-500': 'bg-red-500', 'red-600': 'bg-red-600', 'red-700': 'bg-red-700', 'red-800': 'bg-red-800',
    'orange-300': 'bg-orange-300', 'orange-400': 'bg-orange-400', 'orange-500': 'bg-orange-500', 'orange-600': 'bg-orange-600', 'orange-700': 'bg-orange-700', 'orange-800': 'bg-orange-800',
    'amber-300': 'bg-amber-300', 'amber-400': 'bg-amber-400', 'amber-500': 'bg-amber-500', 'amber-600': 'bg-amber-600', 'amber-700': 'bg-amber-700', 'amber-800': 'bg-amber-800',
    'yellow-300': 'bg-yellow-300', 'yellow-400': 'bg-yellow-400', 'yellow-500': 'bg-yellow-500', 'yellow-600': 'bg-yellow-600', 'yellow-700': 'bg-yellow-700', 'yellow-800': 'bg-yellow-800',
    'lime-300': 'bg-lime-300', 'lime-400': 'bg-lime-400', 'lime-500': 'bg-lime-500', 'lime-600': 'bg-lime-600', 'lime-700': 'bg-lime-700', 'lime-800': 'bg-lime-800',
    'green-300': 'bg-green-300', 'green-400': 'bg-green-400', 'green-500': 'bg-green-500', 'green-600': 'bg-green-600', 'green-700': 'bg-green-700', 'green-800': 'bg-green-800',
    'emerald-300': 'bg-emerald-300', 'emerald-400': 'bg-emerald-400', 'emerald-500': 'bg-emerald-500', 'emerald-600': 'bg-emerald-600', 'emerald-700': 'bg-emerald-700', 'emerald-800': 'bg-emerald-800',
    'teal-300': 'bg-teal-300', 'teal-400': 'bg-teal-400', 'teal-500': 'bg-teal-500', 'teal-600': 'bg-teal-600', 'teal-700': 'bg-teal-700', 'teal-800': 'bg-teal-800',
    'cyan-300': 'bg-cyan-300', 'cyan-400': 'bg-cyan-400', 'cyan-500': 'bg-cyan-500', 'cyan-600': 'bg-cyan-600', 'cyan-700': 'bg-cyan-700', 'cyan-800': 'bg-cyan-800',
    'sky-300': 'bg-sky-300', 'sky-400': 'bg-sky-400', 'sky-500': 'bg-sky-500', 'sky-600': 'bg-sky-600', 'sky-700': 'bg-sky-700', 'sky-800': 'bg-sky-800',
    'blue-300': 'bg-blue-300', 'blue-400': 'bg-blue-400', 'blue-500': 'bg-blue-500', 'blue-600': 'bg-blue-600', 'blue-700': 'bg-blue-700', 'blue-800': 'bg-blue-800',
    'indigo-300': 'bg-indigo-300', 'indigo-400': 'bg-indigo-400', 'indigo-500': 'bg-indigo-500', 'indigo-600': 'bg-indigo-600', 'indigo-700': 'bg-indigo-700', 'indigo-800': 'bg-indigo-800',
    'violet-300': 'bg-violet-300', 'violet-400': 'bg-violet-400', 'violet-500': 'bg-violet-500', 'violet-600': 'bg-violet-600', 'violet-700': 'bg-violet-700', 'violet-800': 'bg-violet-800',
    'purple-300': 'bg-purple-300', 'purple-400': 'bg-purple-400', 'purple-500': 'bg-purple-500', 'purple-600': 'bg-purple-600', 'purple-700': 'bg-purple-700', 'purple-800': 'bg-purple-800',
    'fuchsia-300': 'bg-fuchsia-300', 'fuchsia-400': 'bg-fuchsia-400', 'fuchsia-500': 'bg-fuchsia-500', 'fuchsia-600': 'bg-fuchsia-600', 'fuchsia-700': 'bg-fuchsia-700', 'fuchsia-800': 'bg-fuchsia-800',
    'pink-300': 'bg-pink-300', 'pink-400': 'bg-pink-400', 'pink-500': 'bg-pink-500', 'pink-600': 'bg-pink-600', 'pink-700': 'bg-pink-700', 'pink-800': 'bg-pink-800',
    'rose-300': 'bg-rose-300', 'rose-400': 'bg-rose-400', 'rose-500': 'bg-rose-500', 'rose-600': 'bg-rose-600', 'rose-700': 'bg-rose-700', 'rose-800': 'bg-rose-800',
    'gray-300': 'bg-gray-300', 'gray-400': 'bg-gray-400', 'gray-500': 'bg-gray-500', 'gray-600': 'bg-gray-600', 'gray-700': 'bg-gray-700', 'gray-800': 'bg-gray-800',
    'stone-300': 'bg-stone-300', 'stone-400': 'bg-stone-400', 'stone-500': 'bg-stone-500', 'stone-600': 'bg-stone-600', 'stone-700': 'bg-stone-700', 'stone-800': 'bg-stone-800',
    'slate-300': 'bg-slate-300', 'slate-400': 'bg-slate-400', 'slate-500': 'bg-slate-500', 'slate-600': 'bg-slate-600', 'slate-700': 'bg-slate-700', 'slate-800': 'bg-slate-800',
    'blue': 'bg-blue-500', 'green': 'bg-green-500', 'purple': 'bg-purple-500', 'red': 'bg-red-500',
    'yellow': 'bg-yellow-500', 'indigo': 'bg-indigo-500', 'pink': 'bg-pink-500', 'gray': 'bg-gray-500',
    'orange': 'bg-orange-500', 'teal': 'bg-teal-500', 'cyan': 'bg-cyan-500', 'emerald': 'bg-emerald-500'
};

function ColorPickerGrid({ selectedColor, onSelectColor, disabled }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm font-medium text-stone-700">בחר צבע:</span>
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors"
                    disabled={disabled}
                >
                    {isExpanded ? 'הסתר טבלה מלאה' : 'הצג את כל הצבעים (120)'}
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {isExpanded ? (
                <div className="border border-purple-200 rounded-xl p-3 bg-purple-50/50 max-h-96 overflow-y-auto">
                    <div className="text-xs text-stone-500 mb-3 text-center">לחץ על צבע לבחירה • בהיר ← כהה</div>
                    <div className="space-y-2">
                        {colorFamilies.map(family => (
                            <div key={family.family} className="flex items-center gap-2">
                                <span className="text-xs text-stone-600 w-14 sm:w-16 text-left flex-shrink-0">{family.name}</span>
                                <div className="flex gap-1 flex-1">
                                    {family.shades.map(shade => (
                                        <button
                                            key={shade}
                                            type="button"
                                            onClick={() => onSelectColor(shade)}
                                            disabled={disabled}
                                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${colorClasses[shade]} transition-all hover:scale-110 ${
                                                selectedColor === shade
                                                    ? 'ring-2 ring-stone-800 ring-offset-1 sm:ring-offset-2 scale-110'
                                                    : 'hover:ring-1 hover:ring-stone-400'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            title={shade}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {['red-500', 'orange-500', 'amber-500', 'yellow-500', 'lime-500', 'green-500', 'emerald-500', 'teal-500', 'cyan-500', 'sky-500', 'blue-500', 'indigo-500', 'violet-500', 'purple-500', 'fuchsia-500', 'pink-500', 'rose-500', 'gray-500'].map(color => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => onSelectColor(color)}
                            disabled={disabled}
                            className={`w-8 h-8 rounded-lg ${colorClasses[color]} transition-all hover:scale-110 ${
                                selectedColor === color || selectedColor === color.replace('-500', '')
                                    ? 'ring-2 ring-stone-800 ring-offset-2'
                                    : ''
                            } disabled:opacity-50`}
                            title={color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CategoryManagement() {
    const {
        user: currentUser,
        categories,
        setCategories,
        books
    } = useLibrary();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newCategory, setNewCategory] = useState({
        id: '',
        name: '',
        color: 'blue-500'
    });

    const availableColors = [
        { id: 'blue', name: 'כחול', class: 'bg-blue-500' },
        { id: 'green', name: 'ירוק', class: 'bg-green-500' },
        { id: 'purple', name: 'סגול', class: 'bg-purple-500' },
        { id: 'red', name: 'אדום', class: 'bg-red-500' },
        { id: 'yellow', name: 'צהוב', class: 'bg-yellow-500' },
        { id: 'indigo', name: 'כחול כהה', class: 'bg-indigo-500' },
        { id: 'pink', name: 'ורוד', class: 'bg-pink-500' },
        { id: 'gray', name: 'אפור', class: 'bg-gray-500' },
        { id: 'orange', name: 'כתום', class: 'bg-orange-500' },
        { id: 'teal', name: 'טורקיז', class: 'bg-teal-500' },
        { id: 'cyan', name: 'ציאן', class: 'bg-cyan-500' },
        { id: 'emerald', name: 'ירוק זמרגד', class: 'bg-emerald-500' }
    ];

    const generateId = (name) => {
        return name.toLowerCase()
            .replace(/[^a-zA-Z0-9\u0590-\u05FF\s]/g, '') // רק אותיות ומספרים (כולל עברית)
            .replace(/\s+/g, '_') // החלפת רווחים ב-_
            .substring(0, 20); // מגבלת אורך
    };

    // בדיקה כמה ספרים משתמשים בקטגוריה
    const getBooksInCategory = (categoryId) => {
        return books.filter(book => book.category === categoryId).length;
    };

    // הוספת קטגוריה חדשה
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) {
            alert('יש למלא את שם הקטגוריה');
            return;
        }

        setLoading(true);
        try {
            const id = generateId(newCategory.name);

            // בדיקה שלא קיימת קטגוריה עם אותו ID
            if (categories.some(cat => cat.id === id)) {
                alert('קטגוריה עם שם דומה כבר קיימת במערכת');
                setLoading(false);
                return;
            }

            const categoryToAdd = {
                id,
                name: newCategory.name.trim(),
                color: newCategory.color,
                createdAt: new Date().toISOString(),
                createdBy: currentUser.name
            };

            const savedCategory = await addCategory(categoryToAdd);
            setCategories(prev => [...prev, savedCategory]);

            setNewCategory({ id: '', name: '', color: 'blue' });
            setShowAddForm(false);

            console.log('קטגוריה נוספה בהצלחה:', savedCategory.name);

        } catch (error) {
            console.error('שגיאה בהוספת קטגוריה:', error);
            alert('שגיאה בהוספת הקטגוריה: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // עריכת קטגוריה
    const handleEditCategory = (category) => {
        setEditingCategory({ ...category });
    };

    // שמירת עריכה
    const handleSaveEdit = async () => {
        if (!editingCategory.name.trim()) {
            alert('יש למלא את שם הקטגוריה');
            return;
        }

        setLoading(true);
        try {
            const updatedCategoryData = {
                name: editingCategory.name.trim(),
                color: editingCategory.color,
                updatedAt: new Date().toISOString(),
                updatedBy: currentUser.name
            };

            await updateCategory(editingCategory.id, updatedCategoryData);

            setCategories(prev => prev.map(cat =>
                cat.id === editingCategory.id
                    ? { ...cat, ...updatedCategoryData }
                    : cat
            ));

            setEditingCategory(null);
            console.log('קטגוריה עודכנה בהצלחה:', updatedCategoryData.name);

        } catch (error) {
            console.error('שגיאה בעדכון קטגוריה:', error);
            alert('שגיאה בעדכון הקטגוריה: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // מחיקת קטגוריה
    const handleDeleteCategory = async (categoryId) => {
        const booksCount = getBooksInCategory(categoryId);

        if (booksCount > 0) {
            alert(`לא ניתן למחוק קטגוריה זו כיוון שיש ${booksCount} ספרים השייכים אליה. יש להעביר את הספרים לקטגוריה אחרת תחילה.`);
            return;
        }

        const category = categories.find(cat => cat.id === categoryId);
        if (!confirm(`האם אתה בטוח שברצונך למחוק את הקטגוריה "${category.name}"?\nפעולה זו אינה הפיכה!`)) {
            return;
        }

        setLoading(true);
        try {
            await deleteCategory(categoryId);
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            console.log('קטגוריה נמחקה בהצלחה:', category.name);

        } catch (error) {
            console.error('שגיאה במחיקת קטגוריה:', error);
            alert('שגיאה במחיקת הקטגוריה: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getColorClass = (colorId) => {
        if (colorClasses[colorId]) {
            return colorClasses[colorId];
        }
        const color = availableColors.find(c => c.id === colorId);
        return color ? color.class : 'bg-gray-500';
    };

    const getColorName = (colorId) => {
        if (colorId && colorId.includes('-')) {
            const [family, shade] = colorId.split('-');
            const familyData = colorFamilies.find(f => f.family === family);
            return familyData ? `${familyData.name} ${shade}` : colorId;
        }
        const color = availableColors.find(c => c.id === colorId);
        return color ? color.name : 'אפור';
    };

    return (
        <div className="space-y-6">
            {/* כותרת וסטטיסטיקות */}
            <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        <h2 className="text-lg sm:text-2xl font-semibold">ניהול קטגוריות ספרים</h2>
                        {loading && <div className="text-xs sm:text-sm text-purple-600">טוען...</div>}
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        הוסף קטגוריה חדשה
                    </button>
                </div>

                {/* סטטיסטיקות מהירות */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 sm:p-4 border border-purple-200">
                        <div className="text-xl sm:text-2xl font-bold text-purple-900">{categories.length}</div>
                        <div className="text-xs sm:text-sm text-purple-700">קטגוריות</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 border border-blue-200">
                        <div className="text-xl sm:text-2xl font-bold text-blue-900">{books.length}</div>
                        <div className="text-xs sm:text-sm text-blue-700">ספרים</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 sm:p-4 border border-green-200">
                        <div className="text-xl sm:text-2xl font-bold text-green-900">
                            {categories.filter(cat => getBooksInCategory(cat.id) > 0).length}
                        </div>
                        <div className="text-xs sm:text-sm text-green-700">פעילות</div>
                    </div>
                </div>
            </div>

            {/* טופס הוספת קטגוריה */}
            {showAddForm && (
                <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">הוספת קטגוריה חדשה</h3>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                שם הקטגוריה *
                            </label>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="למשל: ספרי מוסר"
                                required
                                disabled={loading}
                            />
                        </div>

                        <ColorPickerGrid
                            selectedColor={newCategory.color}
                            onSelectColor={(color) => setNewCategory(prev => ({ ...prev, color }))}
                            disabled={loading}
                        />

                        {/* תצוגה מקדימה */}
                        {newCategory.name && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-600 mb-2">תצוגה מקדימה:</div>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm text-white ${getColorClass(newCategory.color)}`}>
                                    {newCategory.name}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                    ID: {generateId(newCategory.name)} • צבע: {getColorName(newCategory.color)}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading || !newCategory.name.trim()}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {loading ? 'מוסיף...' : 'הוסף קטגוריה'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                disabled={loading}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 border border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
                            >
                                ביטול
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* רשימת קטגוריות */}
            <div className="rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">רשימת קטגוריות קיימות</h3>
                <div className="space-y-3">
                    {categories.map(category => {
                        const booksCount = getBooksInCategory(category.id);
                        return (
                            <div key={category.id} className="border rounded-xl p-4 transition-all border-stone-200">
                                {editingCategory && editingCategory.id === category.id ? (
                                    // מצב עריכה
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">שם הקטגוריה</label>
                                            <input
                                                type="text"
                                                value={editingCategory.name}
                                                onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="שם הקטגוריה"
                                                disabled={loading}
                                            />
                                        </div>
                                        
                                        <ColorPickerGrid
                                            selectedColor={editingCategory.color}
                                            onSelectColor={(color) => setEditingCategory(prev => ({ ...prev, color }))}
                                            disabled={loading}
                                        />

                                        {/* תצוגה מקדימה */}
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-sm text-gray-600 mb-2">תצוגה מקדימה:</div>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm text-white ${getColorClass(editingCategory.color)}`}>
                                                {editingCategory.name}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                disabled={loading}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
                                            >
                                                <Save className="w-4 h-4 inline mr-1" />
                                                {loading ? 'שומר...' : 'שמור'}
                                            </button>
                                            <button
                                                onClick={() => setEditingCategory(null)}
                                                disabled={loading}
                                                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 text-sm disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4 inline mr-1" />
                                                ביטול
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // מצב תצוגה
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg ${getColorClass(category.color)} flex items-center justify-center`}>
                                                <FolderPlus className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    {category.name}
                                                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getColorClass(category.color)}`}>
                                                        {getColorName(category.color)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-stone-600">
                                                    ID: {category.id} • {booksCount} ספרים
                                                </div>
                                                {category.createdAt && (
                                                    <div className="text-xs text-stone-500">
                                                        נוצר: {new Date(category.createdAt).toLocaleDateString('he-IL')}
                                                        {category.createdBy && ` על ידי ${category.createdBy}`}
                                                    </div>
                                                )}
                                                {category.updatedAt && (
                                                    <div className="text-xs text-stone-400">
                                                        עודכן: {new Date(category.updatedAt).toLocaleDateString('he-IL')}
                                                        {category.updatedBy && ` על ידי ${category.updatedBy}`}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditCategory(category)}
                                                disabled={loading}
                                                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                                                title="ערוך קטגוריה"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                disabled={loading || booksCount > 0}
                                                className={`p-2 rounded-lg transition-colors ${booksCount > 0
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    } disabled:opacity-50`}
                                                title={booksCount > 0 ? `לא ניתן למחוק - יש ${booksCount} ספרים` : 'מחק קטגוריה'}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {categories.length === 0 && !loading && (
                        <div className="text-center py-8 text-stone-500">
                            <Tag className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                            <div className="text-lg font-medium mb-2">אין קטגוריות במערכת</div>
                            <div className="text-sm">הוסף קטגוריה ראשונה כדי להתחיל</div>
                        </div>
                    )}
                    {loading && categories.length === 0 && (
                        <div className="text-center py-8 text-purple-500">
                            טוען קטגוריות מ-Firebase...
                        </div>
                    )}
                </div>

                {/* אזהרות ועצות */}
                {categories.length > 0 && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-blue-800">
                                <div className="font-medium mb-1">טיפים לניהול קטגוריות:</div>
                                <ul className="text-sm space-y-1">
                                    <li>• קטגוריות עם ספרים לא ניתנות למחיקה</li>
                                    <li>• השתמש בצבעים שונים להבחנה קלה</li>
                                    <li>• שמות קטגוריות חייבים להיות ייחודיים</li>
                                    <li>• שינוי שם קטגוריה ישפיע על כל הספרים השייכים אליה</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}