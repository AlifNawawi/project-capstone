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
    signOut
} from 'firebase/auth';

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

// Auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();
const linkedinProvider = (() => {
    // Placeholder untuk LinkedIn (tidak didukung langsung oleh Firebase)
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ 'login_hint': 'linkedin' });
    return provider;
})();

// API base URL untuk backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export {
    auth,
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