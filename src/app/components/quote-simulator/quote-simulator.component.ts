import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {AiService} from '../../services/ai.service';
import {LoadingService} from '../../services/loading.service';
import emailjs from '@emailjs/browser';
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-quote-simulator',
  templateUrl: './quote-simulator.component.html',
  styleUrls: ['./quote-simulator.component.scss'],
  imports: [
    FormsModule,
    TranslateModule,
    NgClass
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class QuoteSimulatorComponent implements OnInit {
  userInput: string = '';
  aiResponse: any = null;
  isLoading: boolean = false;
  isSending: boolean = false;
  submitStatus: 'success' | 'error' | null = null;
  userEmail: string = '';
  userName: string = '';

  constructor(
    private aiService: AiService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  async generateQuote() {
    if (!this.userInput.trim() || this.isLoading) return;

    this.isLoading = true;
    this.aiResponse = null;
    this.submitStatus = null;

    try {
      this.aiResponse = await this.aiService.getQuoteEstimate(this.userInput);
    } catch (error) {
      console.error('Errore durante la generazione del preventivo:', error);
      this.submitStatus = 'error';
    } finally {
      this.isLoading = false;
    }
  }

  async sendQuoteToEmail() {
    if (!this.userEmail || this.isSending || !this.aiResponse) return;

    this.isSending = true;

    try {
      const templateParams = {
        to_email: this.userEmail,
        to_name: this.userName || 'Cliente',
        project_type: this.aiResponse.projectType || 'Progetto personalizzato',
        total_estimate: this.aiResponse.totalEstimate || 'Non disponibile',
        timeline: this.aiResponse.timeline || 'Da definire',
        features: this.formatFeaturesForEmail(this.aiResponse.features)
      };

      const serviceID = 'service_dvvpn9b'; // Sostituisci con il tuo Service ID EmailJS
      const templateID = 'template_1guzxla'; // Sostituisci con il tuo Template ID per i preventivi
      const publicKey = 'BeTmkZ_BQMgszAUkE'; // Sostituisci con la tua Public Key

      await emailjs.send(serviceID, templateID, templateParams, publicKey);
      
      this.submitStatus = 'success';
      this.userEmail = '';
      this.userName = '';
      setTimeout(() => this.submitStatus = null, 5000);
      
    } catch (error) {
      console.error('Errore invio email preventivo:', error);
      this.submitStatus = 'error';
    } finally {
      this.isSending = false;
    }
  }

  private formatFeaturesForEmail(features: any[]): string {
    if (!features || !Array.isArray(features)) return 'Nessuna feature specificata.';
    
    return features.map(f => 
      `- ${f.name}: ${f.description} (Costo stimato: ${f.estimatedCost})`
    ).join('\n');
  }
}
