import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";
import { ServicesComponent } from "../services/services.component";
import { AboutComponent } from "../about/about.component";
import { ContactComponent } from "../contact/contact.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    TranslateModule,
    RouterLink,
    ServicesComponent,
    AboutComponent,
    ContactComponent
  ],
  standalone: true
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  // Iniettiamo ElementRef per poter scansionare il DOM del componente
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Un piccolo ritardo per assicurarci che Angular abbia renderizzato tutto
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 100);
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.05
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Smettiamo di osservare per salvare batteria su mobile
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // CERCHIAMO ENTRAMBE LE CLASSI (scroll-reveal per la hero, scroll-animate per le altre)
    const elements = this.el.nativeElement.querySelectorAll('.scroll-reveal, .scroll-animate');

    elements.forEach((section: Element) => {
      this.observer?.observe(section);
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
