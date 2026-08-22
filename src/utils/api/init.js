import { isFirebaseEnabled } from '../firebase';
import { getUsers, addUser } from './users';
import { getCategories, addCategory } from './categories';

export const initializeDefaultData = async () => {
    try {
        console.log('מאתחל נתונים בסיסיים...');

        // Seed demo users only in local mode — never write plaintext passwords into Firebase
        const existingUsers = await getUsers();
        if (!isFirebaseEnabled && existingUsers.length === 0) {
            console.log('יוצר משתמשים ברירת מחדל (מצב מקומי)...');

            const defaultUsers = [
                {
                    username: 'admin',
                    password: 'admin123',
                    name: 'מנהל ראשי',
                    role: 'admin',
                    email: 'admin@library.com',
                    phone: '050-1234567',
                    isActive: true
                },
                {
                    username: 'user1',
                    password: 'user123',
                    name: 'משתמש להדגמה',
                    role: 'user',
                    email: 'user@library.com',
                    phone: '050-7654321',
                    isActive: true
                }
            ];

            for (const user of defaultUsers) {
                await addUser(user);
            }
            console.log('משתמשים ברירת מחדל נוצרו בהצלחה');
        }

        const existingCategories = await getCategories();
        if (existingCategories.length === 0) {
            console.log('יוצר קטגוריות ברירת מחדל...');

            const defaultCategories = [
                { id: 'torah', name: 'תנ"ך ותורה', color: 'blue' },
                { id: 'nevi', name: 'נביאים וכתובים', color: 'green' },
                { id: 'midrash', name: 'מדרשים', color: 'purple' },
                { id: 'talmud', name: 'משניות וגמרא', color: 'red' },
                { id: 'halacha', name: 'הלכה', color: 'yellow' },
                { id: 'responsa', name: 'שו"ת', color: 'indigo' },
                { id: 'prayer', name: 'תפילה וחסידות', color: 'pink' },
                { id: 'thought', name: 'מחשבה ומוסר', color: 'gray' },
                { id: 'history', name: 'היסטוריה', color: 'orange' }
            ];

            for (const category of defaultCategories) {
                await addCategory(category);
            }
            console.log('קטגוריות ברירת מחדל נוצרו בהצלחה');
        }

        console.log('אתחול נתונים הושלם בהצלחה');

    } catch (error) {
        console.error('שגיאה באתחול נתונים:', error);
    }
};
