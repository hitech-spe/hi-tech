import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  docData
} from '@angular/fire/firestore';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  private firestore = inject(Firestore);

  getUserDocData(uid: string): Observable<any> {
    const ref = doc(this.firestore, 'users', uid);
    return docData(ref);
  }

  getClientsByUser(userId: string): Observable<any[]> {
    const ref = collection(this.firestore, 'clients');
    const q = query(ref, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  getQuotesByUser(userId: string): Observable<any[]> {
    const ref = collection(this.firestore, 'quotes');
    const q = query(ref, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  addUser(data: any) {
    const ref = collection(this.firestore, 'users');
    return addDoc(ref, data);
  }

  saveUser(uid: string, data: any) {
    const ref = doc(this.firestore, 'users', uid);
    return setDoc(ref, data);
  }

  getUser(uid: string) {
    const ref = doc(this.firestore, 'users', uid);
    return getDoc(ref);
  }

  getUsers(): Observable<any[]> {
    const ref = collection(this.firestore, 'users');
    return collectionData(query(ref), { idField: 'id' }) as Observable<any[]>;
  }

  saveQuote(quote: any) {
    const ref = collection(this.firestore, 'quotes');
    return addDoc(ref, {
      ...quote,
      createdAt: new Date().toISOString()
    });
  }

  // --- Clienti per preventivi ---

  addClient(client: any) {
    const ref = collection(this.firestore, 'clients');
    return addDoc(ref, {
      ...client,
      createdAt: new Date().toISOString()
    });
  }

}
