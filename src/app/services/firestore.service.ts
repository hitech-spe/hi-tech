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

  private cleanData(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    const cleaned: any = Array.isArray(obj) ? [] : {};
    for (const key of Object.keys(obj)) {
      if (key === 'id') continue; // L'id del documento non va salvato all'interno del payload
      const val = obj[key];
      if (val !== undefined) {
        cleaned[key] = typeof val === 'object' && val !== null && !(val instanceof Date) 
          ? this.cleanData(val) 
          : val;
      }
    }
    return cleaned;
  }

  getUserDocData(uid: string): Observable<any> {
    const ref = doc(this.firestore, 'users', uid);
    return docData(ref);
  }

  getClients(): Observable<any[]> {
    const ref = collection(this.firestore, 'clients');
    return collectionData(query(ref), { idField: 'id' }) as Observable<any[]>;
  }

  getClientsByUser(userId: string): Observable<any[]> {
    // Restituisce tutti i clienti ma mantiene la firma per retrocompatibilità
    const ref = collection(this.firestore, 'clients');
    return collectionData(query(ref), { idField: 'id' }) as Observable<any[]>;
  }

  getQuotes(): Observable<any[]> {
    const ref = collection(this.firestore, 'quotes');
    return collectionData(query(ref), { idField: 'id' }) as Observable<any[]>;
  }

  getQuotesByUser(userId: string): Observable<any[]> {
    // Restituisce tutti i preventivi aziendali per gli admin
    const ref = collection(this.firestore, 'quotes');
    return collectionData(query(ref), { idField: 'id' }) as Observable<any[]>;
  }

  addUser(data: any) {
    const ref = collection(this.firestore, 'users');
    return addDoc(ref, this.cleanData(data));
  }

  saveUser(uid: string, data: any) {
    const ref = doc(this.firestore, 'users', uid);
    return setDoc(ref, this.cleanData(data));
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
      ...this.cleanData(quote),
      createdAt: quote.createdAt || new Date().toISOString()
    });
  }

  updateQuote(id: string, quote: any) {
    const ref = doc(this.firestore, 'quotes', id);
    return updateDoc(ref, {
      ...this.cleanData(quote),
      updatedAt: new Date().toISOString()
    });
  }

  deleteQuote(id: string) {
    const ref = doc(this.firestore, 'quotes', id);
    return deleteDoc(ref);
  }

  // --- Clienti per preventivi e contratti ---

  addClient(client: any) {
    const ref = collection(this.firestore, 'clients');
    return addDoc(ref, {
      ...this.cleanData(client),
      createdAt: new Date().toISOString()
    });
  }

  updateClient(id: string, client: any) {
    const ref = doc(this.firestore, 'clients', id);
    return updateDoc(ref, {
      ...this.cleanData(client),
      updatedAt: new Date().toISOString()
    });
  }

  deleteClient(id: string) {
    const ref = doc(this.firestore, 'clients', id);
    return deleteDoc(ref);
  }

  // --- Contratti di Manutenzione e Canoni Ricorrenti ---

  getMaintenanceContracts(userId?: string): Observable<any[]> {
    // Restituisce tutti i contratti memorizzati su Firestore per garantire visibilità globale all'amministrazione
    const ref = collection(this.firestore, 'maintenance_contracts');
    return collectionData(query(ref), { idField: 'id' }) as Observable<any[]>;
  }

  saveMaintenanceContract(contract: any) {
    const ref = collection(this.firestore, 'maintenance_contracts');
    return addDoc(ref, {
      ...this.cleanData(contract),
      createdAt: contract.createdAt || new Date().toISOString()
    });
  }

  updateMaintenanceContract(id: string, contract: any) {
    const ref = doc(this.firestore, 'maintenance_contracts', id);
    return updateDoc(ref, {
      ...this.cleanData(contract),
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
