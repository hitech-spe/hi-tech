import {Component, Inject, PLATFORM_ID, ChangeDetectionStrategy} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {RouterOutlet, Router, NavigationEnd} from "@angular/router";
import {Title, Meta} from '@angular/platform-browser';
import {HeaderComponent} from "./shared/header/header.component";
import {SpinnerComponent} from "./shared/spinner/spinner.component";
import {FooterComponent} from "./shared/footer/footer.component";
import {ChatbotComponent} from "./shared/chatbot/chatbot.component";
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent,
    ChatbotComponent
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class AppComponent {
  title = 'hi-tech';
  private isBrowser: boolean;

  showSplash = true;  // Controlla se il blocco esiste nell'HTML
  fadeSplash = false; // Controlla l'animazione di dissolvenza

  constructor(
    private translate: TranslateService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    translate.setDefaultLang('it');
    translate.use('it');
    this.isBrowser = isPlatformBrowser(platformId);

    // Registra il Service Worker per le performance offline e PWA su mobile/web
    if (this.isBrowser && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/assets/sw.js')
          .then(reg => console.log('Service Worker registrato con successo (Scope):', reg.scope))
          .catch(err => console.error('Errore nella registrazione del Service Worker:', err));
      });
    }

    // Gestione dello scroll manuale per i frammenti ed SEO su navigazione
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const tree = this.router.parseUrl(this.router.url);
      const urlLang = tree.queryParams['lang'];
      if (urlLang && (urlLang === 'it' || urlLang === 'en')) {
        if (this.translate.currentLang !== urlLang) {
          this.translate.use(urlLang);
        }
      }

      this.updateSeoTags();

      if (this.isBrowser) {
        if (tree.fragment) {
          // Aggiungi un piccolo ritardo per assicurarti che il DOM sia stato renderizzato
          setTimeout(() => {
            const element = document.querySelector('#' + tree.fragment);
            if (element) {
              element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
          }, 100);
        }
      }
    });

    // Aggiorna SEO alla variazione della lingua
    this.translate.onLangChange.subscribe(() => {
      this.updateSeoTags();
    });
  }

  ngOnInit() {
    // Ridotto il tempo a 800ms per migliorare drasticamente le prestazioni di caricamento percepite (Core Web Vitals)
    setTimeout(() => {
      this.fadeSplash = true;

      // Dopo un altro mezzo secondo (il tempo della transizione CSS), la rimuoviamo del tutto
      setTimeout(() => {
        this.showSplash = false;
      }, 500);

    }, 800);
  }

  private updateSeoTags(): void {
    const url = this.router.url.split('?')[0].split('#')[0]; // Rimuove query string e frammenti
    
    // Aggiorna hreflang per l'URL corrente
    this.updateHreflangTags(this.router.url);

    // Se siamo su una pagina di dettaglio di un servizio (es. /services/sviluppo-...),
    // lasciamo che sia il ServiceDetailComponent a gestire la SEO e i suoi schema JSON-LD.
    if (url.startsWith('/services/') && url !== '/services') {
      return;
    }

    let pageKey = 'HOME';
    if (url === '/about') {
      pageKey = 'ABOUT';
    } else if (url === '/services') {
      pageKey = 'SERVICES';
    } else if (url === '/contact') {
      pageKey = 'CONTACT';
    } else if (url === '/quote-ai' || url === '/quote-simulator') {
      pageKey = 'QUOTE_AI';
    } else if (url === '/login') {
      pageKey = 'LOGIN';
    } else if (url === '/quotes') {
      pageKey = 'QUOTES';
    } else if (url === '/privacy-policy') {
      pageKey = 'PRIVACY_POLICY';
    } else if (url === '/terms-and-conditions') {
      pageKey = 'TERMS_AND_CONDITIONS';
    }

    // Carica le traduzioni per la SEO e aggiorna i tag
    this.translate.get(`SEO.${pageKey}.TITLE`).subscribe((translatedTitle: string) => {
      this.titleService.setTitle(translatedTitle);
      
      // Aggiorna tag Open Graph e Twitter per il titolo
      this.metaService.updateTag({ property: 'og:title', content: translatedTitle });
      this.metaService.updateTag({ property: 'twitter:title', content: translatedTitle });
    });

    this.translate.get(`SEO.${pageKey}.DESCRIPTION`).subscribe((translatedDesc: string) => {
      this.metaService.updateTag({ name: 'description', content: translatedDesc });
      
      // Aggiorna tag Open Graph e Twitter per la descrizione
      this.metaService.updateTag({ property: 'og:description', content: translatedDesc });
      this.metaService.updateTag({ property: 'twitter:description', content: translatedDesc });
    });

    // Aggiorna URL canonico dinamico includendo parametro lingua se inglese
    const baseUrl = 'https://hitechsrls.com';
    const currentLang = this.translate.currentLang || 'it';
    const canonicalUrl = `${baseUrl}${url === '/' ? '' : url}${currentLang === 'en' ? '?lang=en' : ''}`;
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
    this.metaService.updateTag({ property: 'twitter:url', content: canonicalUrl });

    // Aggiorna anche l'elemento link canonical nel DOM
    if (this.isBrowser) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
      }

      // Inietta schema Breadcrumbs
      this.injectBreadcrumbSchema(url);
    }
  }

  private updateHreflangTags(url: string): void {
    if (!this.isBrowser) return;

    // Rimuove la query string esistente per calcolare il path pulito
    const cleanPath = url.split('?')[0].split('#')[0];
    const baseUrl = 'https://hitechsrls.com';
    const cleanUrl = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;

    const hreflangs = [
      { lang: 'it', url: `${cleanUrl}?lang=it` },
      { lang: 'en', url: `${cleanUrl}?lang=en` },
      { lang: 'x-default', url: cleanUrl } // L'italiano senza parametri è x-default
    ];

    hreflangs.forEach(hl => {
      let link: HTMLLinkElement | null = document.querySelector(`link[rel="alternate"][hreflang="${hl.lang}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', hl.lang);
        document.head.appendChild(link);
      }
      link.setAttribute('href', hl.url);
    });
  }

  private injectBreadcrumbSchema(url: string): void {
    if (!this.isBrowser) return;

    // Rimuovi vecchi script se esistenti
    const existingScript = document.getElementById('breadcrumb-jsonld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (url === '/') return; // Sulla home page non serve il breadcrumb (abbiamo ProfessionalService)

    const currentLang = this.translate.currentLang || 'it';
    const isEn = currentLang === 'en';

    // Definisci i nomi dei segmenti in base alla lingua
    let pageName = '';
    if (url === '/about') {
      pageName = isEn ? 'About Us' : 'Chi Siamo';
    } else if (url === '/services') {
      pageName = isEn ? 'Services' : 'Servizi';
    } else if (url === '/contact') {
      pageName = isEn ? 'Contact' : 'Contatti';
    } else if (url === '/quote-simulator' || url === '/quote-ai') {
      pageName = isEn ? 'Quote Simulator' : 'Simulatore Preventivi';
    } else if (url === '/login') {
      pageName = isEn ? 'Login' : 'Accesso';
    } else if (url === '/privacy-policy') {
      pageName = isEn ? 'Privacy Policy' : 'Informativa sulla Privacy';
    } else if (url === '/terms-and-conditions') {
      pageName = isEn ? 'Terms & Conditions' : 'Termini e Condizioni';
    } else {
      return;
    }

    const baseUrl = 'https://hitechsrls.com';
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": isEn ? "Home" : "Pagina Iniziale",
          "item": `${baseUrl}${isEn ? '?lang=en' : ''}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": pageName,
          "item": `${baseUrl}${url}${isEn ? '?lang=en' : ''}`
        }
      ]
    };

    const script = document.createElement('script');
    script.id = 'breadcrumb-jsonld-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumb);
    document.head.appendChild(script);
  }

}
