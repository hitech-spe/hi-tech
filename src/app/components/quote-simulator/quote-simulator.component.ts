import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AiService } from '../../services/ai.service';
import emailjs from '@emailjs/browser';

@Component({
    selector: 'app-quote-simulator',
    templateUrl: './quote-simulator.component.html',
    styleUrls: ['./quote-simulator.component.scss'],
    standalone: false
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
  ) {}

  ngOnInit(): void {}

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

    // Formattiamo le funzionalità identificate in una lista testuale leggibile
    const featuresList = this.aiResponse.features
      ? this.aiResponse.features.map((f: string) => `- ${f}`).join('\n')
      : '';

    const templateParams = {
      user_name: this.userName,
      user_email: this.userEmail,
      project_description: this.userInput,
      estimate_details: `
Costo Stimato: ${this.aiResponse.estimatedCost}
Tempo di Sviluppo: ${this.aiResponse.estimatedTime}

Funzionalità identificate:
${featuresList}

Suggerimento AI:
${this.aiResponse.suggestion}
      `,
      estimated_cost: this.aiResponse.estimatedCost,
      estimated_time: this.aiResponse.estimatedTime
    };

    // Usiamo le stesse chiavi già configurate nel ContactComponent
    const serviceID = 'service_dvvpn9b';
    const templateID = 'template_c7lex0n';
    const publicKey = 'BeTmkZ_BQMgszAUkE';

    try {
      await emailjs.send(serviceID, templateID, templateParams, publicKey);
      this.submitStatus = 'success';
      this.userEmail = '';
      this.userName = '';
    } catch (error) {
      console.error('Errore nell\'invio della mail:', error);
      this.submitStatus = 'error';
    } finally {
      this.isSending = false;
    }
  }
}
