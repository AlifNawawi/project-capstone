import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { auth } from './firebase';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export const db = getFirestore();

// Simpan testimoni
export const saveTestimonial = async ({ rating, status, message, isDisplayed, displayName }) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    const testimonial = {
        userId: user.uid,
        displayName: displayName || 'Anonymous',
        rating,
        status,
        message,
        isDisplayed: isDisplayed === 'ya',
        timestamp: fromZonedTime(new Date(), 'Asia/Jakarta').toISOString(),
    };

    await addDoc(collection(db, 'testimonials'), testimonial);
};

// Ambil testimoni untuk ditampilkan
export const fetchTestimonials = async () => {
    const q = query(collection(db, 'testimonials'), where('isDisplayed', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: toZonedTime(new Date(doc.data().timestamp), 'Asia/Jakarta'),
    }));
};

// Fungsi yang sudah ada (tidak diubah)
export const saveMoodEntry = async (mood, journal) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    const moodEntry = {
        userId: user.uid,
        mood,
        journal,
        date: fromZonedTime(new Date(), 'Asia/Jakarta').toISOString(),
    };

    await addDoc(collection(db, 'users', user.uid, 'mood_entries'), moodEntry);
};

export const fetchMoodHistory = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    const q = query(collection(db, 'users', user.uid, 'mood_entries'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: toZonedTime(new Date(doc.data().date), 'Asia/Jakarta'),
    }));
};

export const saveJournalEntry = async (text, mood, confidence) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    const journalEntry = {
        userId: user.uid,
        text,
        mood,
        confidence,
        date: fromZonedTime(new Date(), 'Asia/Jakarta').toISOString(),
    };

    const docRef = await addDoc(collection(db, 'users', user.uid, 'journals'), journalEntry);
    return { journalId: docRef.id, ...journalEntry };
};

export const fetchJournalHistory = (callback) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Pengguna belum login');

    const initialFetch = async () => {
        const q = query(collection(db, 'users', user.uid, 'journals'));
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: toZonedTime(new Date(doc.data().date), 'Asia/Jakarta'),
        }));
        if (callback) callback(history);
        return history;
    };

    const unsubscribe = onSnapshot(
        collection(db, `users/${user.uid}/journals`),
        (snapshot) => {
            const history = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                date: toZonedTime(new Date(doc.data().date), 'Asia/Jakarta'),
            }));
            if (callback) callback(history);
        },
        (error) => {
            console.error('Error mengambil riwayat jurnal:', error);
            if (callback) callback([]);
        }
    );

    return { unsubscribe, initialData: initialFetch() };
};

export const updateJournalEntry = async (journalId, text, mood, confidence) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    const journalRef = doc(db, 'users', user.uid, 'journals', journalId);
    await updateDoc(journalRef, {
        text,
        mood,
        confidence,
        date: fromZonedTime(new Date(), 'Asia/Jakarta').toISOString(),
    });
};

export const deleteJournalEntry = async (journalId) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    const journalRef = doc(db, 'users', user.uid, 'journals', journalId);
    await deleteDoc(journalRef);
};