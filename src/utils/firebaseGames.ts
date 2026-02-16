import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  type DocumentData,
} from 'firebase/firestore';
import type { SavedGameRecord } from '../types';
import { db, isFirebaseEnabled } from '../firebase/config';

interface SaveGameInput {
  userId: string;
  pgn: string;
  white?: string;
  black?: string;
  result?: string;
  accuracy?: number;
}

function mapDoc(id: string, data: DocumentData): SavedGameRecord {
  return {
    id,
    userId: data.userId,
    pgn: data.pgn,
    white: data.white,
    black: data.black,
    result: data.result,
    accuracy: data.accuracy,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

export async function saveGameRecord(input: SaveGameInput) {
  if (!db || !isFirebaseEnabled) {
    throw new Error('Firebase is not configured. Add REACT_APP_FIREBASE_* env values.');
  }

  await addDoc(collection(db, 'games'), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

export async function fetchSavedGames(userId: string): Promise<SavedGameRecord[]> {
  if (!db || !isFirebaseEnabled) {
    return [];
  }

  const q = query(collection(db, 'games'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => mapDoc(doc.id, doc.data()));
}
