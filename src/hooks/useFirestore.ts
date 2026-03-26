import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export function useFirestore<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, collectionName),
      where('uid', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as T);
      });
      setData(items);
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  const add = async (item: Omit<T, 'id'>) => {
    if (!auth.currentUser) return;
    return addDoc(collection(db, collectionName), {
      ...item,
      uid: auth.currentUser.uid,
      createdAt: Timestamp.now().toDate().toISOString(),
    });
  };

  const update = async (id: string, item: Partial<T>) => {
    const docRef = doc(db, collectionName, id);
    return updateDoc(docRef, {
      ...item,
      updatedAt: Timestamp.now().toDate().toISOString(),
    });
  };

  const remove = async (id: string) => {
    const docRef = doc(db, collectionName, id);
    return deleteDoc(docRef);
  };

  return { data, loading, error, add, update, remove };
}
