import {Component, Inject, PLATFORM_ID, ChangeDetectionStrategy} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {RouterOutlet, Router, NavigationEnd} from "@angular/router";
import {Title, Meta} from '@angular/platform-browser';
import {HeaderComponent} from "./shared/header/header.component";
import {SpinnerComponent} from "./shared/spinner/spinner.component";
import {FooterComponent} from "./shared/footer/footer.component";
import {ChatbotComponent} from "./shared/chatbot/chatbot.component";
import {WhatsappComponent} from "./shared/whatsapp/whatsapp.component";
import {filter} from 'rxjs/operators';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent,
    ChatbotComponent,
    WhatsappComponent,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class AppComponent {
  title = 'hi-tech';
  private isBrowser: boolean;

  showSplash = true;  
  fadeSplash = false;

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

    if (this.isBrowser && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/assets/sw.js')
          .catch(err => console.error('Errore nella registrazione del Service Worker:', err));
      });
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isBrowser) {
        (window as any).prerenderReady = false;
        
        setTimeout(() => {
          AOS.refresh();
        }, 150);
      }

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
          setTimeout(() => {
            const element = document.querySelector('#' + tree.fragment);
            if (element) {
              element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
          }, 100);
        }
      }
    });

    this.translate.onLangChange.subscribe(() => {
      this.updateSeoTags();
    });
  }

  ngOnInit() {
    // Lo splash screen corporate dura 2800ms per completare il disegno 3D del cubo e il shimmer metallico
    setTimeout(() => {
      this.fadeSplash = true; // Applica la classe .fade-out con dissolvenza e blur cinematografico

      // Dopo mezzo secondo (500ms), distrugge lo splash e innesca le animazioni AOS
      setTimeout(() => {
        this.showSplash = false;

        if (this.isBrowser) {
          AOS.init({
            duration: 800,
            once: true,
            mirror: false,
            offset: 100,
            easing: 'ease-out-cubic',
            delay: 50
          });
        }
      }, 500); 

    }, 2800);
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

      // Segnala a Netlify Prerender che il rendering di questa pagina standard è completato
      // (Facciamo scadere un piccolissimo timeout per assicurarci che il DOM sia pienamente pronto)
      setTimeout(() => {
        (window as any).prerenderReady = true;
      }, 150);
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
