import {
    collection,
    doc,
    getDocs,
    addDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';

export const getAnnouncements = async () => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryAnnouncements');
        return saved ? JSON.parse(saved) : [];
    }

    try {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const announcements = [];
        querySnapshot.forEach((docSnap) => {
            announcements.push({ id: docSnap.id, ...docSnap.data() });
        });
        return announcements;
    } catch (error) {
        console.error('שגיאה בטעינת הודעות:', error);
        const saved = localStorage.getItem('libraryAnnouncements');
        return saved ? JSON.parse(saved) : [];
    }
};

export const addAnnouncement = async (announcementData) => {
    if (!isFirebaseEnabled) {
        const announcements = await getAnnouncements();
        const newAnnouncement = {
            id: Date.now().toString(),
            ...announcementData,
            createdAt: new Date().toISOString()
        };
        announcements.unshift(newAnnouncement);
        localStorage.setItem('libraryAnnouncements', JSON.stringify(announcements));
        return newAnnouncement;
    }

    try {
        const docRef = await addDoc(collection(db, 'announcements'), {
            ...announcementData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...announcementData };
    } catch (error) {
        console.error('שגיאה בהוספת הודעה:', error);
        throw error;
    }
};

export const deleteAnnouncement = async (announcementId) => {
    if (!isFirebaseEnabled) {
        const saved = localStorage.getItem('libraryAnnouncements');
        const announcements = saved ? JSON.parse(saved) : [];
        const filteredAnnouncements = announcements.filter(announcement => announcement.id !== announcementId);
        localStorage.setItem('libraryAnnouncements', JSON.stringify(filteredAnnouncements));
        console.log('הודעה נמחקה מ-localStorage:', announcementId);
        return;
    }

    try {
        await deleteDoc(doc(db, 'announcements', announcementId));
        console.log('הודעה נמחקה מ-Firebase:', announcementId);
    } catch (error) {
        console.error('שגיאה במחיקת הודעה מ-Firebase:', error);
        throw new Error(`שגיאה במחיקת הודעה: ${error.message}`);
    }
};
