import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    getRedirectResult,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    onAuthStateChanged,
    signOut,
    updateProfile as updateAuthProfile,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
export const db = getFirestore(app); // Inisialisasi Firestore

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();
const linkedinProvider = (() => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ 'login_hint': 'linkedin' });
    return provider;
})();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, error: error.message };
    }
};

export const updateProfile = async (uid, { displayName, photoURL }) => {
    try {
        const user = auth.currentUser;
        if (user && user.uid === uid) {
            await updateAuthProfile(user, { displayName, photoURL });
            return true;
        } else {
            throw new Error('User not authenticated or UID mismatch');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error(error.message);
    }
};

export const uploadProfilePhoto = async (file, uid) => {
    try {
        const storageRef = ref(storage, `profile-photos/${uid}/${Date.now()}_${file.name}`); // Tambah timestamp untuk unik
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        await savePhotoToFirestore(uid, photoURL, false); // Simpan ke Firestore
        return photoURL;
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        throw new Error(error.message);
    }
};

export const deleteProfilePhoto = async (uid) => {
    try {
        const defaultPhotos = ['profile.png'];
        const userPhotosRef = ref(storage, `profile-photos/${uid}`);
        const userPhotos = await listAll(userPhotosRef);
        const deletePromises = userPhotos.items
            .filter((item) => !defaultPhotos.includes(item.name))
            .map((item) => deleteObject(item));
        await Promise.all(deletePromises);
        await savePhotoToFirestore(uid, '/profile.png', true); // Kembali ke default
    } catch (error) {
        console.error('Error deleting profile photo:', error);
        throw new Error(error.message);
    }
};

// Fungsi baru untuk menyimpan data ke Firestore
const savePhotoToFirestore = async (uid, photoURL, isDefault) => {
    try {
        const userDocRef = doc(db, 'profilePhotos', uid);
        await setDoc(userDocRef, {
            uid,
            photoURL,
            timestamp: new Date().toISOString(),
            default: isDefault,
        }, { merge: true });
    } catch (error) {
        console.error('Error saving photo to Firestore:', error);
        throw new Error(error.message);
    }
};

export const getProfilePhoto = async (uid) => {
    try {
        const userDocRef = doc(db, 'profilePhotos', uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return { photoURL: '/profile.png', default: true }; // Default jika belum ada
        }
    } catch (error) {
        console.error('Error getting profile photo:', error);
        throw new Error(error.message);
    }
};

export {
    auth,
    storage,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    getRedirectResult,
    googleProvider,
    facebookProvider,
    githubProvider,
    linkedinProvider,
    onAuthStateChanged,
    signOut,
    API_BASE_URL
};