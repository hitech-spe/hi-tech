import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class WhatsappComponent {
  // Numero WhatsApp ufficiale formattato con prefisso internazionale per l'Italia (+39)
  readonly whatsappNumber = '393456425468';
  readonly prefilledText = 'Ciao Hi-Tech Solutions, vorrei richiedere maggiori informazioni.';

  get whatsappUrl(): string {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.prefilledText)}`;
  }
}
