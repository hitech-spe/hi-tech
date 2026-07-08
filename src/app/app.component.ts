import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {RouterOutlet, Router, NavigationEnd} from "@angular/router";
import {Title, Meta} from '@angular/platform-browser';
import {HeaderComponent} from "./shared/header/header.component";
import {SpinnerComponent} from "./shared/spinner/spinner.component";
import {FooterComponent} from "./shared/footer/footer.component";
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent
  ],
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

    // Gestione dello scroll manuale per i frammenti ed SEO su navigazione
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSeoTags();

      if (this.isBrowser) {
        const tree = this.router.parseUrl(this.router.url);
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
    // Dopo 2 secondi (2000ms), facciamo sfumare la splash screen
    setTimeout(() => {
      this.fadeSplash = true;

      // Dopo un altro mezzo secondo (il tempo della transizione CSS), la rimuoviamo del tutto
      setTimeout(() => {
        this.showSplash = false;
      }, 500);

    }, 1800);
  }

  private updateSeoTags(): void {
    const url = this.router.url.split('?')[0].split('#')[0]; // Rimuove query string e frammenti
    
    // Se siamo su una pagina di dettaglio di un servizio (es. /services/sviluppo-...),
    // lasciamo che sia il ServiceDetailComponent a gestire la SEO.
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

    // Aggiorna URL canonico dinamico
    const baseUrl = 'https://hitechsrls.com';
    const canonicalUrl = `${baseUrl}${url === '/' ? '' : url}`;
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
    this.metaService.updateTag({ property: 'twitter:url', content: canonicalUrl });

    // Aggiorna anche l'elemento link canonical nel DOM
    if (this.isBrowser) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
      }
    }
  }

}
