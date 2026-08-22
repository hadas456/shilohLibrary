import {
    collection,
    query,
    onSnapshot
} from 'firebase/firestore';

import { db, isFirebaseEnabled } from '../firebase';

export const subscribeToCollection = (collectionName, callback) => {
    if (!isFirebaseEnabled) {
        return () => { };
    }

    try {
        const q = query(collection(db, collectionName));
        return onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((docSnap) => {
                data.push({ id: docSnap.id, ...docSnap.data() });
            });
            callback(data);
        });
    } catch (error) {
        console.error(`שגיאה במעקב אחר ${collectionName}:`, error);
        return () => { };
    }
};
