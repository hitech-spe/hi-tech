import { Component, AfterViewInit, ChangeDetectionStrategy, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { ServicesComponent } from "../services/services.component";
import { AboutComponent } from "../about/about.component";
import { ContactComponent } from "../contact/contact.component";
import { PartnershipComponent } from "../partnership/partnership.component";
import { InsightsComponent } from "../insights/insights.component";
import { RoiCalculatorComponent } from "../roi-calculator/roi-calculator.component";
import { FaqComponent } from "../faq/faq.component";
import { TechMatcherComponent } from "../tech-matcher/tech-matcher.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    TranslateModule,
    RouterLink,
    ServicesComponent,
    AboutComponent,
    ContactComponent,
    PartnershipComponent,
    InsightsComponent,
    RoiCalculatorComponent,
    FaqComponent,
    TechMatcherComponent
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  currentLang: string;
  private langSub: Subscription | undefined;
  private routeFragmentSub: Subscription | undefined;

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute
  ) {
    this.currentLang = this.translate.currentLang || 'it';
    this.injectProfessionalServiceSchema();

    this.langSub = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.injectProfessionalServiceSchema();
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.routeFragmentSub = this.route.fragment.subscribe(fragment => {
        if (fragment) {
          this.scrollToFragment(fragment);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
    if (this.routeFragmentSub) {
      this.routeFragmentSub.unsubscribe();
    }
    if (isPlatformBrowser(this.platformId)) {
      const existingScript = document.getElementById('home-professional-service-schema');
      if (existingScript) {
        existingScript.remove();
      }
    }
  }

  private scrollToFragment(fragment: string) {
    // Dai tempo alle animazioni e al caricamento asincrono di posizionare gli elementi
    setTimeout(() => {
      const el = document.getElementById(fragment);
      if (el) {
        const headerOffset = 90; // Altezza dell'header fixed
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 350);
  }

  private injectProfessionalServiceSchema() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Rimuove script precedente se esiste
    const existingScript = document.getElementById('home-professional-service-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const baseUrl = 'https://hitechsrls.com';
    const currentLang = this.translate.currentLang || 'it';
    const isEn = currentLang === 'en';

    const schema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Hi-Tech Solutions",
      "image": `${baseUrl}/assets/images/logo-trasp.webp`,
      "@id": `${baseUrl}/#organization`,
      "url": baseUrl,
      "telephone": "+39 3456425468",
      "email": "infoammhitech@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Contrada Marinara 3 str. dx, 12",
        "addressLocality": "Mottola",
        "addressRegion": "TA",
        "postalCode": "74017",
        "addressCountry": "IT"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 40.6382,
        "longitude": 17.0392
      },
      "description": isEn 
        ? "Enterprise IT consulting, custom software and mobile development, cloud solutions, and professional Adastra WordPress integrations."
        : "Consulenza IT aziendale, sviluppo software e mobile su misura, soluzioni cloud ed integrazioni professionali WordPress Adastra.",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://www.instagram.com/hitech_high_technology/"
      ],
      "priceRange": "$$"
    };

    const script = document.createElement('script');
    script.id = 'home-professional-service-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
