import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subscription } from 'rxjs';

interface QuoteItem {
  description: string;
  quantity: number;
  price: number;
}

interface ClientData {
  id?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

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

  client: ClientData = { name: '', company: '', email: '', phone: '', address: '' };
  items: QuoteItem[] = [{ description: '', quantity: 1, price: 0 }];
  quotes: any[] = [];
  clients: ClientData[] = [];
  currentUser: any = null;
  private authSub?: Subscription;

  ngOnInit() {
    this.authSub = this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadQuotes();
        this.loadClients();
      } else {
        this.quotes = [];
        this.clients = [];
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
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
      const selectedClient = this.clients.find(c => c.id === clientId);
      if (selectedClient) {
        this.client = { ...selectedClient };
      }
    } else {
      this.resetClientForm();
    }
  }

  resetClientForm() {
    this.client = { name: '', company: '', email: '', phone: '', address: '' };
  }

  addItem() {
    this.items.push({ description: '', quantity: 1, price: 0 });
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  }

  async saveQuote() {
    if (!this.client.name || this.items.some(i => !i.description)) {
      alert('Per favore compila tutti i campi obbligatori');
      return;
    }

    this.loadingService.show();
    try {
      // Se il cliente è nuovo (non ha ID), lo salviamo nella collezione clients
      if (!this.client.id) {
        const newClient = { ...this.client, userId: this.currentUser.uid };
        const clientRef = await this.firestoreService.addClient(newClient);
        this.client.id = clientRef.id;
      }

      const quote = {
        userId: this.currentUser.uid,
        client: { ...this.client },
        items: [...this.items],
        total: this.getTotal(),
        date: new Date().toISOString()
      };
      await this.firestoreService.saveQuote(quote);
      this.loadQuotes();
      this.resetForm();
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  loadQuoteIntoForm(quote: any) {
    this.client = { ...quote.client };
    this.items = quote.items.map((item: any) => ({ ...item }));
    // Scorri verso l'alto per mostrare il form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadQuotes() {
    this.firestoreService.getQuotesByUser(this.currentUser.uid).subscribe(data => {
      // Nota: in FirestoreService ho già aggiunto il filtraggio utente nel piano futuro,
      // ma al momento filtriamo lato client per sicurezza dato che il servizio è generico.
      this.quotes = data.filter(q => q.userId === this.currentUser.uid)
                       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }

  resetForm() {
    this.resetClientForm();
    this.items = [{ description: '', quantity: 1, price: 0 }];
  }

  downloadPDF(quote?: any) {
    const data = quote || { client: this.client, items: this.items, total: this.getTotal() };
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 210, 255);
    doc.text('Hi-Tech Solutions', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Preventivo', 20, 30);

    // Dati Cliente
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Cliente:', 20, 50);
    doc.setFontSize(11);
    doc.text(`Nome: ${data.client.name}`, 20, 60);
    if (data.client.company) doc.text(`Azienda: ${data.client.company}`, 20, 67);
    doc.text(`Email: ${data.client.email}`, 20, 74);
    if (data.client.address) doc.text(`Indirizzo: ${data.client.address}`, 20, 81);

    // Tabella Articoli
    const tableRows = data.items.map((item: any) => [
      item.description,
      item.quantity,
      `€ ${item.price.toFixed(2)}`,
      `€ ${(item.quantity * item.price).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 90,
      head: [['Descrizione', 'Quantità', 'Prezzo Unitario', 'Totale']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [0, 210, 255] }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.setFontSize(14);
    doc.text(`TOTALE: € ${data.total.toFixed(2)}`, 140, finalY + 20);

    doc.save(`preventivo_${data.client.name.replace(/\s+/g, '_')}.pdf`);
  }
}
