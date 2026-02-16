import { GoogleAuthProvider, User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '../firebase/config';

const provider = new GoogleAuthProvider();

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  if (!auth || !isFirebaseEnabled) {
    throw new Error('Firebase is not configured. Add REACT_APP_FIREBASE_* env values.');
  }

  return signInWithPopup(auth, provider);
}

export async function signOutUser() {
  if (!auth) {
    return;
  }

  await signOut(auth);
}
