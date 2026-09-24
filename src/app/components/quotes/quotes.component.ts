import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { PdfQuoteGeneratorService } from '../../services/pdf-quote-generator.service';
import { MaintenanceAlertService } from '../../services/maintenance-alert.service';
import { CommercialQuote, ClientData } from '../../models/quote.model';
import { WORK_TYPE_OPTIONS, getTemplateForWorkType } from '../../models/quote-templates.data';
import { MaintenanceContract, AdminAlertSettings } from '../../models/maintenance.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './quotes.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit, OnDestroy {
  private firestoreService = inject(FirestoreService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private pdfService = inject(PdfQuoteGeneratorService);
  private alertService = inject(MaintenanceAlertService);

  readonly workTypeOptions = WORK_TYPE_OPTIONS;

  // Switcher di Sezione Admin: 'quotes' (Preventivi) vs 'maintenance' (Canoni & Manutenzioni)
  adminSection: 'quotes' | 'maintenance' = 'quotes';

  // --- SEZIONE 1: PREVENTIVI & PROPOSTE COMMERCIALI ---
  activeSection: 'client' | 'premise' | 'modules' | 'tech' | 'economic' | 'inclusions' = 'client';
  
  client: ClientData = {
    name: '',
    company: '',
    vat: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  };
  saveClientToAddressBook = true;

  quote: CommercialQuote = this.createNewQuoteInstance('PIATTAFORMA_GESTIONALE');
  editingQuoteId: string | null = null;
  quotes: CommercialQuote[] = [];
  clients: ClientData[] = [];
  searchTerm = '';
  statusFilter: 'ALL' | 'draft' | 'sent' | 'accepted' | 'rejected' = 'ALL';

  // --- SEZIONE 2: CANONI & MANUTENZIONI SEMESTRALI ---
  contracts: MaintenanceContract[] = [];
  contractForm: MaintenanceContract = this.createNewContractInstance();
  editingContractId: string | null = null;
  contractSearchTerm = '';
  contractFilter: 'ALL' | 'EXPIRING' | 'ACTIVE' = 'ALL';
  showSettingsModal = false;

  // Impostazioni Notifiche Soci (Default con i numeri Hi-Tech del sito)
  adminSettings: AdminAlertSettings = {
    phone1: '+393456425468',
    apiKey1: '',
    phone2: '+393512135403',
    apiKey2: '',
    defaultNoticeDays: 5,
    autoCheckOnLogin: true
  };

  currentUser: any = null;
  private authSub?: Subscription;

  ngOnInit() {
    this.authSub = this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.quote.userId = user.uid;
        this.contractForm.userId = user.uid;
        this.loadQuotes();
        this.loadClients();
        this.loadMaintenanceContracts();
        this.loadAdminSettings();
      } else {
        this.quotes = [];
        this.clients = [];
        this.contracts = [];
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  // ==========================================
  // METODI: PREVENTIVI
  // ==========================================

  createNewQuoteInstance(type: CommercialQuote['workType']): CommercialQuote {
    const template = getTemplateForWorkType(type, this.client.name, this.client.company);
    return {
      userId: this.currentUser?.uid || '',
      date: new Date().toISOString(),
      validityDays: template.validityDays || 30,
      subject: template.subject || 'Preventivo Sviluppo Software',
      status: 'draft',
      workType: type,
      client: { ...this.client },
      premiseIntro: template.premiseIntro || '',
      currentProblems: [...(template.currentProblems || [])],
      solutionTitle: template.solutionTitle || '',
      solutionDescription: template.solutionDescription || '',
      modules: (template.modules || []).map(m => ({
        title: m.title,
        features: m.features.map(f => ({ ...f }))
      })),
      techStack: {
        frontend: template.techStack?.frontend || '',
        backendAndDb: template.techStack?.backendAndDb || '',
        hosting: template.techStack?.hosting || '',
        maintenanceCosts: template.techStack?.maintenanceCosts || ''
      },
      phases: (template.phases || []).map(p => ({ ...p })),
      priceNet: template.priceNet || 4900,
      taxRate: template.taxRate !== undefined ? template.taxRate : 22,
      milestones: (template.milestones || []).map(m => ({ ...m })),
      inclusions: [...(template.inclusions || [])],
      exclusions: [...(template.exclusions || [])],
      notes: ''
    };
  }

  onWorkTypeChange(event: any) {
    const newType = event.target.value as CommercialQuote['workType'];
    if (!newType) return;

    if (confirm('Vuoi caricare i testi e la struttura predefinita per questa tipologia di lavoro? Le modifiche non salvate a testi e moduli verranno sostituite.')) {
      const template = getTemplateForWorkType(newType, this.client.name, this.client.company);
      this.quote.workType = newType;
      this.quote.subject = template.subject || this.quote.subject;
      this.quote.validityDays = template.validityDays || 30;
      this.quote.premiseIntro = template.premiseIntro || '';
      this.quote.currentProblems = [...(template.currentProblems || [])];
      this.quote.solutionTitle = template.solutionTitle || '';
      this.quote.solutionDescription = template.solutionDescription || '';
      this.quote.modules = (template.modules || []).map(m => ({
        title: m.title,
        features: m.features.map(f => ({ ...f }))
      }));
      this.quote.techStack = {
        frontend: template.techStack?.frontend || '',
        backendAndDb: template.techStack?.backendAndDb || '',
        hosting: template.techStack?.hosting || '',
        maintenanceCosts: template.techStack?.maintenanceCosts || ''
      };
      this.quote.phases = (template.phases || []).map(p => ({ ...p }));
      this.quote.priceNet = template.priceNet || 4900;
      this.quote.taxRate = template.taxRate !== undefined ? template.taxRate : 22;
      this.quote.milestones = (template.milestones || []).map(m => ({ ...m }));
      this.quote.inclusions = [...(template.inclusions || [])];
      this.quote.exclusions = [...(template.exclusions || [])];
    } else {
      this.quote.workType = newType;
    }
  }

  loadClients() {
    this.firestoreService.getClientsByUser(this.currentUser.uid).subscribe(data => {
      this.clients = data.filter(c => c.userId === this.currentUser.uid);
    });
  }

  onClientSelect(event: any) {
    const clientId = event.target.value;
    if (clientId) {
      const selected = this.clients.find(c => c.id === clientId);
      if (selected) {
        this.client = { ...selected };
        this.quote.client = { ...this.client };
      }
    } else {
      this.resetClientForm();
    }
  }

  resetClientForm() {
    this.client = {
      name: '',
      company: '',
      vat: '',
      email: '',
      phone: '',
      address: '',
      city: ''
    };
    this.quote.client = { ...this.client };
  }

  async saveClientPermanently() {
    if (!this.client.name) {
      alert('Inserisci almeno il nome del cliente prima di salvarlo.');
      return;
    }

    this.loadingService.show();
    try {
      if (this.client.id) {
        await this.firestoreService.updateClient(this.client.id, {
          ...this.client,
          userId: this.currentUser.uid
        });
        alert('Cliente aggiornato con successo in rubrica!');
      } else {
        const docRef = await this.firestoreService.addClient({
          ...this.client,
          userId: this.currentUser.uid
        });
        this.client.id = docRef.id;
        this.quote.client = { ...this.client };
        alert('Cliente salvato con successo in rubrica!');
      }
      this.loadClients();
    } catch (err) {
      console.error('Errore nel salvataggio cliente:', err);
      alert('Si è verificato un errore nel salvataggio del cliente.');
    } finally {
      this.loadingService.hide();
    }
  }

  async deleteClient(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Sei sicuro di voler eliminare questo cliente dalla rubrica?')) {
      try {
        await this.firestoreService.deleteClient(id);
        this.loadClients();
        if (this.client.id === id) {
          this.resetClientForm();
        }
      } catch (err) {
        console.error('Errore nella cancellazione del cliente:', err);
      }
    }
  }

  addProblem() { this.quote.currentProblems.push('Nuova criticità da risolvere...'); }
  removeProblem(index: number) { if (this.quote.currentProblems.length > 1) this.quote.currentProblems.splice(index, 1); }

  addModule() {
    const num = this.quote.modules.length + 1;
    this.quote.modules.push({
      title: `Modulo ${num}: Nome Modulo`,
      features: [{ title: 'Nuova Funzionalità', description: 'Descrizione della feature...' }]
    });
  }
  removeModule(index: number) { if (this.quote.modules.length > 1) this.quote.modules.splice(index, 1); }

  addFeature(moduleIndex: number) {
    this.quote.modules[moduleIndex].features.push({ title: 'Nuova Funzionalità', description: 'Descrizione...' });
  }
  removeFeature(moduleIndex: number, featureIndex: number) {
    const mod = this.quote.modules[moduleIndex];
    if (mod.features.length > 1) mod.features.splice(featureIndex, 1);
  }

  addPhase() {
    const nextNum = this.quote.phases.length + 1;
    this.quote.phases.push({
      phase: `Fase ${nextNum} (Settimana ${nextNum})`,
      timing: `Settimana ${nextNum}`,
      description: 'Descrizione attività e rilasci...'
    });
  }
  removePhase(index: number) { if (this.quote.phases.length > 1) this.quote.phases.splice(index, 1); }

  addMilestone() {
    this.quote.milestones.push({ title: 'Tranche di pagamento', percentage: 20, description: 'Condizione di rilascio' });
  }
  removeMilestone(index: number) { if (this.quote.milestones.length > 1) this.quote.milestones.splice(index, 1); }

  addInclusion() { this.quote.inclusions.push('Nuovo servizio incluso nel prezzo...'); }
  removeInclusion(index: number) { if (this.quote.inclusions.length > 1) this.quote.inclusions.splice(index, 1); }

  addExclusion() { this.quote.exclusions.push('Nuova voce esclusa dal preventivo...'); }
  removeExclusion(index: number) { if (this.quote.exclusions.length > 1) this.quote.exclusions.splice(index, 1); }

  getTaxAmount(): number { return ((this.quote.priceNet || 0) * (this.quote.taxRate || 0)) / 100; }
  getTotalGross(): number { return (this.quote.priceNet || 0) + this.getTaxAmount(); }
  getMilestoneAmount(percentage: number): number { return (this.quote.priceNet || 0) * (percentage / 100); }

  async saveQuote() {
    if (!this.client.name || !this.quote.subject) {
      alert('Per favore inserisci il nome del cliente e l\'oggetto del preventivo.');
      return;
    }

    this.loadingService.show();
    try {
      if (this.saveClientToAddressBook) {
        if (!this.client.id) {
          const clientRef = await this.firestoreService.addClient({
            ...this.client,
            userId: this.currentUser.uid
          });
          this.client.id = clientRef.id;
        } else {
          await this.firestoreService.updateClient(this.client.id, {
            ...this.client,
            userId: this.currentUser.uid
          });
        }
      }

      this.quote.client = { ...this.client };
      this.quote.userId = this.currentUser.uid;

      if (this.editingQuoteId) {
        await this.firestoreService.updateQuote(this.editingQuoteId, { ...this.quote });
        alert('Preventivo aggiornato con successo!');
      } else {
        await this.firestoreService.saveQuote({ ...this.quote });
        alert('Preventivo salvato con successo!');
      }

      this.loadQuotes();
      this.loadClients();
    } catch (error) {
      console.error('Errore nel salvataggio del preventivo:', error);
      alert('Si è verificato un errore durante il salvataggio.');
    } finally {
      this.loadingService.hide();
    }
  }

  loadQuoteIntoForm(q: CommercialQuote) {
    this.editingQuoteId = q.id || null;
    this.client = { ...q.client };
    this.quote = JSON.parse(JSON.stringify(q));
    this.activeSection = 'client';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  duplicateQuote(q: CommercialQuote) {
    this.editingQuoteId = null;
    this.client = { ...q.client };
    this.quote = JSON.parse(JSON.stringify(q));
    delete this.quote.id;
    this.quote.subject = `${q.subject} (Copia)`;
    this.quote.date = new Date().toISOString();
    this.quote.status = 'draft';
    this.activeSection = 'client';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteQuote(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Sei sicuro di voler eliminare definitivamente questo preventivo?')) {
      try {
        await this.firestoreService.deleteQuote(id);
        this.loadQuotes();
        if (this.editingQuoteId === id) this.newQuote();
      } catch (err) {
        console.error('Errore durante l\'eliminazione del preventivo:', err);
      }
    }
  }

  loadQuotes() {
    this.firestoreService.getQuotesByUser(this.currentUser.uid).subscribe(data => {
      this.quotes = data
        .filter(q => q.userId === this.currentUser.uid)
        .sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
    });
  }

  newQuote() {
    this.editingQuoteId = null;
    this.resetClientForm();
    this.quote = this.createNewQuoteInstance('PIATTAFORMA_GESTIONALE');
    this.activeSection = 'client';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  downloadPDF(q?: CommercialQuote) {
    const targetQuote = q || this.getNormalizedCurrentQuote();
    const doc = this.pdfService.generateQuotePdf(targetQuote);
    const safeName = (targetQuote.client.company || targetQuote.client.name || 'Preventivo')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`Preventivo_HiTech_${safeName}.pdf`);
  }

  previewPDF(q?: CommercialQuote) {
    const targetQuote = q || this.getNormalizedCurrentQuote();
    const doc = this.pdfService.generateQuotePdf(targetQuote);
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  }

  private getNormalizedCurrentQuote(): CommercialQuote {
    return { ...this.quote, client: { ...this.client } };
  }

  get filteredQuotes(): CommercialQuote[] {
    return this.quotes.filter(q => {
      const matchSearch = !this.searchTerm ||
        (q.client.name && q.client.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (q.client.company && q.client.company.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (q.subject && q.subject.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchStatus = this.statusFilter === 'ALL' || q.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'sent': return 'status-sent';
      case 'rejected': return 'status-rejected';
      default: return 'status-draft';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'accepted': return 'Accettato';
      case 'sent': return 'Inviato';
      case 'rejected': return 'Rifiutato';
      default: return 'Bozza';
    }
  }

  // ==========================================
  // METODI: CANONI & MANUTENZIONI SEMESTRALI
  // ==========================================

  createNewContractInstance(): MaintenanceContract {
    const todayStr = new Date().toISOString().split('T')[0];
    const nextSixMonths = this.alertService.calculateNextDueDate(todayStr, 'SEMESTRAL');

    return {
      userId: this.currentUser?.uid || '',
      client: { ...this.client },
      serviceName: 'Manutenzione Piattaforma & Assistenza Cloud',
      annualPrice: 500,
      billingFrequency: 'SEMESTRAL',
      periodPrice: 250, // 500 / 2
      taxRate: 22,
      startDate: todayStr,
      nextDueDate: nextSixMonths,
      noticeDaysBefore: 5,
      status: 'active',
      paymentHistory: [],
      notes: ''
    };
  }

  onContractAnnualPriceChange() {
    const annual = this.contractForm.annualPrice || 0;
    const freq = this.contractForm.billingFrequency;
    this.contractForm.periodPrice = freq === 'ANNUAL' ? annual : freq === 'QUARTERLY' ? Math.round(annual / 4) : Math.round(annual / 2);
  }

  onContractFrequencyChange() {
    this.onContractAnnualPriceChange();
    if (this.contractForm.startDate) {
      this.contractForm.nextDueDate = this.alertService.calculateNextDueDate(this.contractForm.startDate, this.contractForm.billingFrequency);
    }
  }

  onContractStartDateChange() {
    if (this.contractForm.startDate) {
      this.contractForm.nextDueDate = this.alertService.calculateNextDueDate(this.contractForm.startDate, this.contractForm.billingFrequency);
    }
  }

  onContractClientSelect(event: any) {
    const clientId = event.target.value;
    if (clientId) {
      const selected = this.clients.find(c => c.id === clientId);
      if (selected) {
        this.contractForm.clientId = selected.id;
        this.contractForm.client = { ...selected };
      }
    }
  }

  loadMaintenanceContracts() {
    this.firestoreService.getMaintenanceContracts(this.currentUser.uid).subscribe(data => {
      this.contracts = data
        .filter(c => c.userId === this.currentUser.uid)
        .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());

      // Se abilitato, controlla ed esegue l'auto-check delle scadenze
      if (this.adminSettings.autoCheckOnLogin) {
        this.autoCheckExpiringContracts();
      }
    });
  }

  loadAdminSettings() {
    this.firestoreService.getAdminAlertSettings(this.currentUser.uid).subscribe(settings => {
      if (settings) {
        this.adminSettings = {
          ...this.adminSettings,
          ...settings
        };
      }
    });
  }

  async saveAdminSettings() {
    this.loadingService.show();
    try {
      await this.firestoreService.saveAdminAlertSettings(this.currentUser.uid, this.adminSettings);
      this.showSettingsModal = false;
      alert('Impostazioni alert WhatsApp salvate con successo!');
    } catch (err) {
      console.error('Errore nel salvataggio impostazioni admin:', err);
    } finally {
      this.loadingService.hide();
    }
  }

  async saveContract() {
    if (!this.contractForm.client.name || !this.contractForm.serviceName) {
      alert('Inserisci il nome del cliente e il nome del servizio di manutenzione.');
      return;
    }

    this.loadingService.show();
    try {
      this.contractForm.userId = this.currentUser.uid;

      if (this.editingContractId) {
        await this.firestoreService.updateMaintenanceContract(this.editingContractId, { ...this.contractForm });
        alert('Contratto di manutenzione aggiornato!');
      } else {
        await this.firestoreService.saveMaintenanceContract({ ...this.contractForm });
        alert('Contratto di manutenzione registrato!');
      }

      this.resetContractForm();
      this.loadMaintenanceContracts();
    } catch (err) {
      console.error('Errore nel salvataggio del contratto:', err);
      alert('Si è verificato un errore durante il salvataggio.');
    } finally {
      this.loadingService.hide();
    }
  }

  editContract(c: MaintenanceContract) {
    this.editingContractId = c.id || null;
    this.contractForm = JSON.parse(JSON.stringify(c));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  resetContractForm() {
    this.editingContractId = null;
    this.contractForm = this.createNewContractInstance();
  }

  async deleteContract(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Sei sicuro di voler eliminare questo contratto di manutenzione?')) {
      try {
        await this.firestoreService.deleteMaintenanceContract(id);
        this.loadMaintenanceContracts();
        if (this.editingContractId === id) this.resetContractForm();
      } catch (err) {
        console.error('Errore eliminazione contratto:', err);
      }
    }
  }

  /**
   * Registra il pagamento della rata semestrale e rinnova la scadenza di altri 6 mesi
   */
  async markContractAsPaidAndRenew(c: MaintenanceContract, event: Event) {
    event.stopPropagation();
    if (!c.id) return;

    const formattedQuota = c.periodPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 });
    const clientName = c.client.company || c.client.name;

    if (!confirm(`Confermi di aver incassato la quota di € ${formattedQuota} + IVA per ${clientName}?\nLa scadenza verrà automaticamente prorogata di altri 6 mesi.`)) {
      return;
    }

    this.loadingService.show();
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const newDueDate = this.alertService.calculateNextDueDate(c.nextDueDate, c.billingFrequency);

      const paymentRecord = {
        date: todayStr,
        amount: c.periodPrice,
        periodLabel: `Quota ${new Date(c.nextDueDate).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })}`,
        registeredAt: new Date().toISOString()
      };

      const history = [...(c.paymentHistory || []), paymentRecord];

      await this.firestoreService.updateMaintenanceContract(c.id, {
        nextDueDate: newDueDate,
        status: 'active',
        paymentHistory: history,
        lastAlertSentDate: '' // Reset alert per il nuovo ciclo semestrale
      });

      alert(`Pagamento registrato! Prossima scadenza semestrale impostata al: ${new Date(newDueDate).toLocaleDateString('it-IT')}`);
      this.loadMaintenanceContracts();
    } catch (err) {
      console.error('Errore rinnovo contratto:', err);
    } finally {
      this.loadingService.hide();
    }
  }

  /**
   * Invia l'alert WhatsApp immediato per un singolo contratto
   */
  async sendAlertForContractNow(c: MaintenanceContract, event: Event) {
    event.stopPropagation();
    this.loadingService.show();

    try {
      // Se le chiavi CallMeBot sono impostate, invia in background
      if (this.adminSettings.apiKey1 || this.adminSettings.apiKey2) {
        await this.alertService.dispatchAlertToPartners(c, this.adminSettings);
        alert('Notifica WhatsApp automatica inviata ai telefoni dei soci!');
      } else {
        // Altrimenti apre la chat WhatsApp con messaggio pre-compilato
        const days = this.alertService.getDaysRemaining(c.nextDueDate);
        const msg = this.alertService.formatAlertMessage(c, days);
        const link = this.alertService.getDirectWhatsAppLink(this.adminSettings.phone1, msg);
        window.open(link, '_blank');
      }
      this.loadMaintenanceContracts();
    } catch (err) {
      console.error('Errore invio alert WhatsApp:', err);
    } finally {
      this.loadingService.hide();
    }
  }

  /**
   * Scansione automatica contratti in scadenza e invio alert ai soci
   */
  async autoCheckExpiringContracts() {
    const dueContracts = this.alertService.evaluateContractsForAlerts(this.contracts);
    if (dueContracts.length > 0 && (this.adminSettings.apiKey1 || this.adminSettings.apiKey2)) {
      console.log(`Trovati ${dueContracts.length} canoni in scadenza: invio notifiche ai soci...`);
      for (const contract of dueContracts) {
        await this.alertService.dispatchAlertToPartners(contract, this.adminSettings);
      }
    }
  }

  /**
   * Invia un WhatsApp di prova sui numeri dei soci per verificare il corretto funzionamento
   */
  async sendTestWhatsAppToPartners() {
    if (!this.adminSettings.apiKey1 && !this.adminSettings.apiKey2) {
      alert('Inserisci almeno una chiave API di CallMeBot nelle impostazioni per inviare i messaggi automatici.');
      return;
    }

    this.loadingService.show();
    try {
      const testMsg = `🔔 *HI-TECH NOTIFICHE WHATSAPP ATTIVE!*\n\nQuesto è un messaggio di test automatico inviato dal gestionale Hi-Tech sui numeri dei soci (+39 3456425468 e +39 3512135403).\nIl sistema di alert scadenze semestrali è operativo!`;
      
      let sentCount = 0;
      if (this.adminSettings.phone1 && this.adminSettings.apiKey1) {
        await this.alertService.sendWhatsAppViaCallMeBot(this.adminSettings.phone1, this.adminSettings.apiKey1, testMsg);
        sentCount++;
      }
      if (this.adminSettings.phone2 && this.adminSettings.apiKey2) {
        await this.alertService.sendWhatsAppViaCallMeBot(this.adminSettings.phone2, this.adminSettings.apiKey2, testMsg);
        sentCount++;
      }

      alert(`Messaggio di test inviato con successo a ${sentCount} numero/i!`);
    } catch (err) {
      console.error('Errore invio test:', err);
      alert('Si è verificato un errore durante l\'invio del messaggio di test.');
    } finally {
      this.loadingService.hide();
    }
  }

  getDaysRemaining(dueDateStr: string): number {
    return this.alertService.getDaysRemaining(dueDateStr);
  }

  getContractStatusInfo(c: MaintenanceContract): { label: string, cssClass: string } {
    const days = this.getDaysRemaining(c.nextDueDate);
    if (days < 0) {
      return { label: `Scaduto da ${Math.abs(days)} gg`, cssClass: 'status-overdue' };
    } else if (days <= 5) {
      return { label: `Scade tra ${days} gg!`, cssClass: 'status-urgent' };
    } else if (days <= 15) {
      return { label: `Scade tra ${days} gg`, cssClass: 'status-warning' };
    }
    return { label: `Tra ${days} gg`, cssClass: 'status-ok' };
  }

  get expiringContractsCount(): number {
    return this.contracts.filter(c => this.getDaysRemaining(c.nextDueDate) <= 15).length;
  }

  get totalAnnualRecurringRevenue(): number {
    return this.contracts.reduce((sum, c) => sum + (c.annualPrice || 0), 0);
  }

  get filteredContracts(): MaintenanceContract[] {
    return this.contracts.filter(c => {
      const matchSearch = !this.contractSearchTerm ||
        (c.client.name && c.client.name.toLowerCase().includes(this.contractSearchTerm.toLowerCase())) ||
        (c.client.company && c.client.company.toLowerCase().includes(this.contractSearchTerm.toLowerCase())) ||
        (c.serviceName && c.serviceName.toLowerCase().includes(this.contractSearchTerm.toLowerCase()));

      if (this.contractFilter === 'EXPIRING') {
        return matchSearch && this.getDaysRemaining(c.nextDueDate) <= 15;
      } else if (this.contractFilter === 'ACTIVE') {
        return matchSearch && this.getDaysRemaining(c.nextDueDate) > 15;
      }
      return matchSearch;
    });
  }
}
