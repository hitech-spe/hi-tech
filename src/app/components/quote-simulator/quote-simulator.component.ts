import {Component, OnInit, inject, ElementRef, ChangeDetectionStrategy} from '@angular/core';
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

  //private loadingService = inject(LoadingService);

  private observer: IntersectionObserver | null = null;

  constructor(
    private aiService: AiService,
    private translate: TranslateService,
    private el: ElementRef
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Il trucco del setTimeout per dare respiro al browser
    setTimeout(() => {
      const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.05
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target); // Stoppa l'osservazione per salvare RAM
          }
        });
      }, options);

      // Cerca tutti i blocchi che devono essere animati
      const elements = this.el.nativeElement.querySelectorAll('.scroll-reveal');
      elements.forEach((el: Element) => {
        this.observer?.observe(el);
      });
    }, 100);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  async generateQuote() {
    if (!this.userInput.trim() || this.isLoading) return;

    this.isLoading = true;
    //this.loadingService.show();
    this.aiResponse = null;
    this.submitStatus = null;

    try {
      this.aiResponse = await this.aiService.getQuoteEstimate(this.userInput);
    } catch (error) {
      console.error('Errore durante la generazione del preventivo:', error);
      this.submitStatus = 'error';
    } finally {
      this.isLoading = false;
      //this.loadingService.hide();
    }
  }

  async sendQuoteToEmail() {
    if (!this.userEmail || this.isSending || !this.aiResponse) return;

    this.isSending = true;
    // this.loadingService.show();

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
      //this.loadingService.hide();
    }
  }
}
