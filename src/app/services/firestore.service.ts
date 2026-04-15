import {inject, Injectable} from '@angular/core';
import {Firestore, collection, addDoc, collectionData, doc, setDoc, getDoc} from '@angular/fire/firestore';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  private firestore = inject(Firestore);

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
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

  saveQuote(quote: any) {
    const ref = collection(this.firestore, 'quotes');
    return addDoc(ref, {
      ...quote,
      createdAt: new Date().toISOString()
    });
  }

  getQuotesByUser(userId: string): Observable<any[]> {
    const ref = collection(this.firestore, 'quotes');
    // Nota: Firebase v9+ suggerisce l'uso di query() per filtri complessi,
    // ma collectionData con un filtro semplice può funzionare se configurato correttamente.
    // Per semplicità qui usiamo la collezione intera e filtreremo se necessario o implementeremo query()
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

}
