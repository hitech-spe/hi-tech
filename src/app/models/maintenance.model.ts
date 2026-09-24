import { ClientData } from './quote.model';

export interface MaintenancePayment {
  id?: string;
  date: string;
  amount: number;
  periodLabel: string; // es. "1° Semestre 2026"
  notes?: string;
  registeredAt: string;
}

export interface MaintenanceContract {
  id?: string;
  userId: string;
  clientId?: string;
  client: ClientData;
  serviceName: string; // es. "Manutenzione Piattaforma & Cloud"
  annualPrice: number; // Costo annuo (es. 500)
  billingFrequency: 'SEMESTRAL' | 'ANNUAL' | 'QUARTERLY'; // default SEMESTRAL (ogni 6 mesi)
  periodPrice: number; // Quota per periodo (es. 250)
  taxRate: number; // % IVA (default 22)
  startDate: string; // Data inizio contratto (es. "2026-04-15")
  nextDueDate: string; // Prossima scadenza (es. "2026-10-15")
  noticeDaysBefore: number; // Giorni di preavviso per l'alert (default: 5)
  status: 'active' | 'expiring' | 'overdue' | 'paid' | 'suspended';
  paymentHistory: MaintenancePayment[];
  lastAlertSentDate?: string; // Data dell'ultimo alert inviato per evitare doppioni
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminAlertSettings {
  phone1: string; // Telefono Socio 1 (es. "+393456425468")
  apiKey1?: string; // Chiave CallMeBot Socio 1
  phone2: string; // Telefono Socio 2 (es. "+393512135403")
  apiKey2?: string; // Chiave CallMeBot Socio 2
  defaultNoticeDays: number; // Default 5 giorni
  autoCheckOnLogin: boolean; // Verifica automatica scadenze ad ogni accesso
}
