import { Component, ChangeDetectionStrategy, OnInit, DestroyRef, inject } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [
    TranslateModule,
    FormsModule,
    NgClass,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class ContactComponent implements OnInit {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  isSending = false;
  submitStatus: 'success' | 'error' | null = null;
  privacyAccepted = false;
  private destroyRef = inject(DestroyRef);

  private serviceTitleMap: { [key: string]: string } = {
    'sviluppo-piattaforme-web-b2b': 'SERVICES.WEB.TITLE',
    'sviluppo-app-mobile-native': 'SERVICES.MOBILE.TITLE',
    'consulenza-cloud-aziendale': 'SERVICES.CLOUD.TITLE',
    'web': 'SERVICES.WEB.TITLE',
    'mobile': 'SERVICES.MOBILE.TITLE',
    'cloud': 'SERVICES.CLOUD.TITLE',
    'social': 'SERVICES.SOCIAL.TITLE',
    'graphic': 'SERVICES.GRAPHIC.TITLE'
  };

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(params => {
        const serviceId = params['service'];
        if (serviceId && this.serviceTitleMap[serviceId]) {
          const translationKey = this.serviceTitleMap[serviceId];
          return this.translate.get(translationKey).pipe(
            switchMap((serviceTitle: string) => 
              this.translate.get('CONTACT.PREFILL_MESSAGE', { service: serviceTitle })
            )
          );
        }
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(prefillMsg => {
      if (prefillMsg) {
        this.formData.message = prefillMsg;
      }
    });
  }

  onSubmit() {
    if (this.isSending || !this.privacyAccepted) return; // Blocco sicurezza

    this.isSending = true;
    this.submitStatus = null;

    // I tuoi valori di EmailJS
    const serviceID = 'service_dvvpn9b';
    const templateID = 'template_yepteb7';
    const publicKey = 'BeTmkZ_BQMgszAUkE';

    emailjs.send(serviceID, templateID, this.formData, publicKey)
      .then((result: EmailJSResponseStatus) => {
        console.log('Email inviata con successo!', result.text);
        this.submitStatus = 'success';
        this.resetForm();
      }, (error) => {
        console.error('Errore durante l\'invio:', error.text);
        this.submitStatus = 'error';
      })
      .finally(() => {
        this.isSending = false;
        // Nasconde il messaggio di stato dopo 5 secondi
        setTimeout(() => this.submitStatus = null, 5000);
      });
  }

  private resetForm() {
    this.formData = { name: '', email: '', message: '' };
    this.privacyAccepted = false;
  }
}
