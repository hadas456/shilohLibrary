import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';

export const loginUser = async (username, password) => {
    console.log('מנסה התחברות עם:', username);

    if (!isFirebaseEnabled) {
        console.log('Firebase לא זמין - מחפש ב-localStorage');
        const saved = localStorage.getItem('libraryUsers');
        const users = saved ? JSON.parse(saved) : [];

        const user = users.find(u =>
            u.username === username && u.password === password && u.isActive !== false
        );

        if (!user) {
            throw new Error('שם משתמש או סיסמה שגויים');
        }

        return user;
    }

    try {
        const usersQuery = query(
            collection(db, 'users'),
            where('username', '==', username)
        );
        const usersSnapshot = await getDocs(usersQuery);

        if (usersSnapshot.empty) {
            throw new Error('משתמש לא נמצא');
        }

        const userData = usersSnapshot.docs[0].data();

        if (userData.password !== password) {
            throw new Error('סיסמה שגויה');
        }

        if (userData.isActive === false) {
            throw new Error('המשתמש אינו פעיל');
        }

        return {
            id: usersSnapshot.docs[0].id,
            ...userData
        };
    } catch (error) {
        console.error('שגיאה בהתחברות Firebase:', error);
        throw error;
    }
};

export const getUsers = async () => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryUsers');
        return saved ? JSON.parse(saved) : [];
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        querySnapshot.forEach((docSnap) => {
            users.push({ id: docSnap.id, ...docSnap.data() });
        });
        return users;
    } catch (error) {
        console.error('שגיאה בטעינת משתמשים:', error);
        const saved = localStorage.getItem('libraryUsers');
        return saved ? JSON.parse(saved) : [];
    }
};

export const addUser = async (userData) => {
    if (!isFirebaseEnabled) {
        const users = await getUsers();
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('libraryUsers', JSON.stringify(users));
        return newUser;
    }

    try {
        const docRef = await addDoc(collection(db, 'users'), {
            ...userData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...userData };
    } catch (error) {
        console.error('שגיאה בהוספת משתמש:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    if (!isFirebaseEnabled) {
        const users = await getUsers();
        const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, ...userData, updatedAt: new Date().toISOString() } : user
        );
        localStorage.setItem('libraryUsers', JSON.stringify(updatedUsers));
        return;
    }

    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...userData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('שגיאה בעדכון משתמש:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    if (!isFirebaseEnabled) {
        const users = await getUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        localStorage.setItem('libraryUsers', JSON.stringify(filteredUsers));
        return;
    }

    try {
        await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
        console.error('שגיאה במחיקת משתמש:', error);
        throw error;
    }
};

export const checkUserExists = async (username) => {
    if (!isFirebaseEnabled) {
        const users = await getUsers();
        return users.some(u => u.username === username);
    }

    try {
        const usersQuery = query(
            collection(db, 'users'),
            where('username', '==', username)
        );
        const usersSnapshot = await getDocs(usersQuery);
        return !usersSnapshot.empty;
    } catch (error) {
        console.error('שגיאה בבדיקת קיום משתמש:', error);
        return false;
    }
};
