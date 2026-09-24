import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaintenanceContract, AdminAlertSettings } from '../models/maintenance.model';
import { FirestoreService } from './firestore.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceAlertService {
  private http = inject(HttpClient);
  private firestoreService = inject(FirestoreService);

  // Numeri Soci Hi-Tech predefiniti
  readonly defaultSettings: AdminAlertSettings = {
    phone1: '+393456425468',
    phone2: '+393512135403',
    defaultNoticeDays: 5,
    autoCheckOnLogin: true
  };

  /**
   * Calcola la prossima data di scadenza sommando l'intervallo (default 6 mesi)
   */
  calculateNextDueDate(fromDateStr: string, frequency: MaintenanceContract['billingFrequency'] = 'SEMESTRAL'): string {
    const fromDate = new Date(fromDateStr);
    const monthsToAdd = frequency === 'ANNUAL' ? 12 : frequency === 'QUARTERLY' ? 3 : 6;
    
    const targetDate = new Date(fromDate);
    targetDate.setMonth(targetDate.getMonth() + monthsToAdd);

    // Formato ISO YYYY-MM-DD
    return targetDate.toISOString().split('T')[0];
  }

  /**
   * Calcola i giorni rimanenti alla scadenza rispetto alla data odierna
   */
  getDaysRemaining(dueDateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Formatta il testo del messaggio WhatsApp per i soci
   */
  formatAlertMessage(contract: MaintenanceContract, daysRemaining: number): string {
    const clientName = contract.client.company 
      ? `${contract.client.company} (${contract.client.name})` 
      : contract.client.name;

    const formattedDueDate = new Date(contract.nextDueDate).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const timingStr = daysRemaining === 0 
      ? '🚨 *OGGI!*' 
      : daysRemaining > 0 
        ? `tra *${daysRemaining} giorni*` 
        : `⚠️ *SCADUTO DA ${Math.abs(daysRemaining)} GIORNI!*`;

    const quotaStr = contract.periodPrice.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const annualStr = contract.annualPrice.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const phoneStr = contract.client.phone || 'Non specificato';
    const emailStr = contract.client.email || 'Non specificata';

    return `🔔 *ALERT SCADENZA MANUTENZIONE HI-TECH*\n` +
      `---------------------------------\n` +
      `🏢 *Cliente:* ${clientName}\n` +
      `⚙️ *Servizio:* ${contract.serviceName}\n` +
      `💰 *Quota da Incassare:* *€ ${quotaStr} + IVA* (Canone annuo: € ${annualStr})\n` +
      `📅 *Scadenza Semestrale:* ${formattedDueDate} (${timingStr})\n` +
      `📞 *Contatto Cliente:* Tel: ${phoneStr} | Email: ${emailStr}\n` +
      `---------------------------------\n` +
      `👉 *Promemoria per i Soci:* Ricordarsi di emettere fattura e contattare il cliente!`;
  }

  /**
   * Invia la notifica WhatsApp a un singolo numero tramite Proxy Serverless o CallMeBot Gateway
   */
  async sendWhatsAppViaCallMeBot(phone: string, apiKey: string, message: string): Promise<boolean> {
    if (!phone || !apiKey) return false;

    // Normalizza il numero (rimuove spazi e +)
    const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
    const encodedText = encodeURIComponent(message);

    // 1. Prova prima tramite l'endpoint proxy /api/callmebot (valido in locale con proxy.conf.json e in produzione su Netlify Edge)
    const proxyUrl = `/api/callmebot/whatsapp.php?phone=${cleanPhone}&text=${encodedText}&apikey=${apiKey}`;
    try {
      const responseText = await firstValueFrom(this.http.get(proxyUrl, { responseType: 'text' }));
      console.log(`[CallMeBot Proxy Success]:`, responseText);
      return true;
    } catch (proxyErr) {
      console.warn('Proxy /api/callmebot non disponibile, provo fallback serverless function:', proxyErr);
    }

    // 2. Prova tramite la Serverless Function Netlify
    try {
      const serverlessUrl = `/api/send-whatsapp?phone=${cleanPhone}&text=${encodedText}&apikey=${apiKey}`;
      const res: any = await firstValueFrom(this.http.get(serverlessUrl));
      if (res && (res.success || res.status === 200)) {
        return true;
      }
    } catch (serverlessErr) {
      console.warn('Serverless function non disponibile, provo fallback no-cors:', serverlessErr);
    }

    // 3. Fallback diretto con fetch in modalità no-cors
    const directUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedText}&apikey=${apiKey}`;
    try {
      await fetch(directUrl, { mode: 'no-cors' });
      return true;
    } catch {
      if (typeof Image !== 'undefined') {
        const beacon = new Image();
        beacon.src = directUrl;
      }
      return true;
    }
  }

  /**
   * Genera un link WhatsApp diretto wa.me con messaggio pre-compilato
   */
  getDirectWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Esegue l'invio dell'alert WhatsApp a entrambi i numeri dei soci
   */
  async dispatchAlertToPartners(contract: MaintenanceContract, settings: AdminAlertSettings): Promise<{ partner1: boolean, partner2: boolean }> {
    const daysRemaining = this.getDaysRemaining(contract.nextDueDate);
    const message = this.formatAlertMessage(contract, daysRemaining);

    let sent1 = false;
    let sent2 = false;

    // Invio Socio 1
    if (settings.phone1 && settings.apiKey1) {
      sent1 = await this.sendWhatsAppViaCallMeBot(settings.phone1, settings.apiKey1, message);
    }

    // Invio Socio 2
    if (settings.phone2 && settings.apiKey2) {
      sent2 = await this.sendWhatsAppViaCallMeBot(settings.phone2, settings.apiKey2, message);
    }

    // Aggiorna lo stato di invio sul contratto per evitare duplicati odierni
    const todayStr = new Date().toISOString().split('T')[0];
    if (contract.id) {
      await this.firestoreService.updateMaintenanceContract(contract.id, {
        lastAlertSentDate: todayStr
      });
    }

    return { partner1: sent1, partner2: sent2 };
  }

  /**
   * Controlla tutti i contratti attivi e identifica quelli che necessitano di notifica
   */
  evaluateContractsForAlerts(contracts: MaintenanceContract[]): MaintenanceContract[] {
    const todayStr = new Date().toISOString().split('T')[0];

    return contracts.filter(c => {
      if (c.status === 'suspended' || c.status === 'paid') return false;

      const daysRemaining = this.getDaysRemaining(c.nextDueDate);
      const noticeDays = c.noticeDaysBefore || 5;

      // Invia alert se siamo entro i giorni di preavviso (o se è già scaduto)
      const isDue = daysRemaining <= noticeDays;

      // Non inviare più di un avviso automatico nello stesso giorno per lo stesso contratto
      const notSentToday = c.lastAlertSentDate !== todayStr;

      return isDue && notSentToday;
    });
  }
}
