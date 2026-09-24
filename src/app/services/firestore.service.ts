import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
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

  updateQuote(id: string, quote: any) {
    const ref = doc(this.firestore, 'quotes', id);
    return updateDoc(ref, {
      ...quote,
      updatedAt: new Date().toISOString()
    });
  }

  deleteQuote(id: string) {
    const ref = doc(this.firestore, 'quotes', id);
    return deleteDoc(ref);
  }

  // --- Clienti per preventivi ---

  addClient(client: any) {
    const ref = collection(this.firestore, 'clients');
    return addDoc(ref, {
      ...client,
      createdAt: new Date().toISOString()
    });
  }

  updateClient(id: string, client: any) {
    const ref = doc(this.firestore, 'clients', id);
    return updateDoc(ref, {
      ...client,
      updatedAt: new Date().toISOString()
    });
  }

  deleteClient(id: string) {
    const ref = doc(this.firestore, 'clients', id);
    return deleteDoc(ref);
  }

  // --- Contratti di Manutenzione e Canoni Ricorrenti ---

  getMaintenanceContracts(userId: string): Observable<any[]> {
    const ref = collection(this.firestore, 'maintenance_contracts');
    const q = query(ref, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  saveMaintenanceContract(contract: any) {
    const ref = collection(this.firestore, 'maintenance_contracts');
    return addDoc(ref, {
      ...contract,
      createdAt: new Date().toISOString()
    });
  }

  updateMaintenanceContract(id: string, contract: any) {
    const ref = doc(this.firestore, 'maintenance_contracts', id);
    return updateDoc(ref, {
      ...contract,
      updatedAt: new Date().toISOString()
    });
  }

  deleteMaintenanceContract(id: string) {
    const ref = doc(this.firestore, 'maintenance_contracts', id);
    return deleteDoc(ref);
  }

  // --- Impostazioni Notifiche Admin ---

  getAdminAlertSettings(userId: string): Observable<any> {
    const ref = doc(this.firestore, 'admin_settings', `alerts_${userId}`);
    return docData(ref);
  }

  saveAdminAlertSettings(userId: string, settings: any) {
    const ref = doc(this.firestore, 'admin_settings', `alerts_${userId}`);
    return setDoc(ref, {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

}
