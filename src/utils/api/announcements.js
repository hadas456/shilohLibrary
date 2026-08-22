import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';
import { defaultAnnouncements, localModeAnnouncement } from '../../constants';

const ANNOUNCEMENTS_STORAGE_KEY = 'libraryAnnouncements';
const ANNOUNCEMENTS_INITIALIZED_KEY = 'libraryAnnouncementsInitialized';
const DELETED_ANNOUNCEMENTS_STORAGE = 'deletedAnnouncements';
const DELETED_ANNOUNCEMENTS_COLLECTION = 'settings';
const DELETED_ANNOUNCEMENTS_DOC = 'deletedAnnouncements';

const defaultFingerprints = [
    ...defaultAnnouncements,
    localModeAnnouncement
].map(announcementFingerprint);

function announcementFingerprint(announcement) {
    return `${String(announcement?.title || '').trim()}::${String(announcement?.message || '').trim()}`;
}

function emptyDeletedState() {
    return { ids: [], fingerprints: [] };
}

function normalizeDeletedState(value) {
    if (!value || typeof value !== 'object') return emptyDeletedState();
    return {
        ids: Array.isArray(value.ids) ? value.ids.map(String).filter(Boolean) : [],
        fingerprints: Array.isArray(value.fingerprints) ? value.fingerprints.filter(Boolean) : []
    };
}

function mergeDeletedState(...states) {
    const merged = emptyDeletedState();
    for (const state of states) {
        const normalized = normalizeDeletedState(state);
        merged.ids.push(...normalized.ids);
        merged.fingerprints.push(...normalized.fingerprints);
    }
    return {
        ids: [...new Set(merged.ids)],
        fingerprints: [...new Set(merged.fingerprints)]
    };
}

function readLocalDeletedAnnouncements() {
    try {
        const saved = localStorage.getItem(DELETED_ANNOUNCEMENTS_STORAGE);
        return saved ? normalizeDeletedState(JSON.parse(saved)) : emptyDeletedState();
    } catch {
        return emptyDeletedState();
    }
}

function writeLocalDeletedAnnouncements(state) {
    localStorage.setItem(DELETED_ANNOUNCEMENTS_STORAGE, JSON.stringify(normalizeDeletedState(state)));
}

export function filterDeletedAnnouncements(announcements = [], deleted = emptyDeletedState()) {
    const ids = new Set((deleted.ids || []).map(String));
    const fingerprints = new Set(deleted.fingerprints || []);

    return announcements.filter((announcement) => {
        if (!announcement) return false;
        if (ids.has(String(announcement.id))) return false;
        return !fingerprints.has(announcementFingerprint(announcement));
    });
}

export async function getDeletedAnnouncements() {
    const localDeleted = readLocalDeletedAnnouncements();
    if (!isFirebaseEnabled || !db) return localDeleted;

    try {
        const snapshot = await getDoc(doc(db, DELETED_ANNOUNCEMENTS_COLLECTION, DELETED_ANNOUNCEMENTS_DOC));
        const remoteDeleted = snapshot.exists() ? normalizeDeletedState(snapshot.data()) : emptyDeletedState();
        const merged = mergeDeletedState(remoteDeleted, localDeleted);
        writeLocalDeletedAnnouncements(merged);
        return merged;
    } catch (error) {
        console.error('שגיאה בטעינת הודעות שנמחקו:', error);
        return localDeleted;
    }
}

async function rememberDeletedAnnouncement(announcement) {
    if (!announcement?.id && !announcement?.title) return;

    const current = await getDeletedAnnouncements();
    const next = mergeDeletedState(current, {
        ids: announcement.id ? [String(announcement.id)] : [],
        fingerprints: defaultFingerprints.includes(announcementFingerprint(announcement))
            ? [announcementFingerprint(announcement)]
            : []
    });

    writeLocalDeletedAnnouncements(next);
    localStorage.setItem(ANNOUNCEMENTS_INITIALIZED_KEY, '1');

    if (!isFirebaseEnabled || !db) return;

    await setDoc(doc(db, DELETED_ANNOUNCEMENTS_COLLECTION, DELETED_ANNOUNCEMENTS_DOC), {
        ...next,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

const readLocalAnnouncements = () => {
    const saved = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    if (saved === null) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        console.error('שגיאה בקריאת הודעות מקומיות:', error);
        return [];
    }
};

const writeLocalAnnouncements = (announcements) => {
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
    localStorage.setItem(ANNOUNCEMENTS_INITIALIZED_KEY, '1');
};

const getOrSeedLocalAnnouncements = (deleted = emptyDeletedState()) => {
    const existing = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    if (existing !== null) {
        return filterDeletedAnnouncements(readLocalAnnouncements(), deleted);
    }

    const alreadyInitialized = localStorage.getItem(ANNOUNCEMENTS_INITIALIZED_KEY) === '1';
    const hasDeletions = deleted.ids.length > 0 || deleted.fingerprints.length > 0;
    if (alreadyInitialized || hasDeletions) {
        writeLocalAnnouncements([]);
        return [];
    }

    writeLocalAnnouncements(defaultAnnouncements);
    return filterDeletedAnnouncements(defaultAnnouncements, deleted);
};

function sortAnnouncements(announcements) {
    return [...announcements].sort((a, b) => {
        const aDate = a?.createdAt?.seconds
            ? a.createdAt.seconds * 1000
            : new Date(a?.createdAt || 0).getTime();
        const bDate = b?.createdAt?.seconds
            ? b.createdAt.seconds * 1000
            : new Date(b?.createdAt || 0).getTime();
        return bDate - aDate;
    });
}

export const getAnnouncements = async () => {
    const deleted = await getDeletedAnnouncements();

    if (!isFirebaseEnabled) {
        return getOrSeedLocalAnnouncements(deleted);
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'announcements'));
        const announcements = [];
        querySnapshot.forEach((docSnap) => {
            announcements.push({ id: docSnap.id, ...docSnap.data() });
        });
        return filterDeletedAnnouncements(sortAnnouncements(announcements), deleted);
    } catch (error) {
        console.error('שגיאה בטעינת הודעות:', error);
        return getOrSeedLocalAnnouncements(deleted);
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
        writeLocalAnnouncements(announcements);
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

export const deleteAnnouncement = async (announcementId, announcement = {}) => {
    if (!announcementId) {
        throw new Error('מזהה הודעה חסר');
    }

    await rememberDeletedAnnouncement({
        ...announcement,
        id: announcementId
    });

    const localAnnouncements = readLocalAnnouncements();
    writeLocalAnnouncements(
        localAnnouncements.filter((item) => String(item.id) !== String(announcementId))
    );

    if (!isFirebaseEnabled || !db) {
        return;
    }

    try {
        await deleteDoc(doc(db, 'announcements', String(announcementId)));
    } catch (error) {
        console.error('שגיאה במחיקת הודעה מ-Firebase:', error);
    }
};
