import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './config';

function docId(uid: string, date: string) {
  return `${uid}_${date}`;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function getCachedMessage(date?: string): Promise<string | null> {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  const dateKey = date ?? todayStr();
  const snap = await getDoc(doc(db, 'userDailyFortunes', docId(uid, dateKey)));
  return snap.exists() ? (snap.data().message as string) : null;
}

export async function cacheMessage(message: string, date?: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const dateKey = date ?? todayStr();
  await setDoc(doc(db, 'userDailyFortunes', docId(uid, dateKey)), {
    message,
    date: dateKey,
    cachedAt: serverTimestamp(),
  });
}
