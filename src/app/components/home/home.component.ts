import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
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
export class HomeComponent implements AfterViewInit {
  // Selezioniamo tutti gli elementi che hanno la classe 'scroll-animate'
  @ViewChildren('animatedSection') animatedSections!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    // Configurazione dell'osservatore
    const options = {
      root: null, // Usa il viewport del browser
      rootMargin: '0px',
      threshold: 0.15 // L'animazione scatta quando il 15% della sezione è visibile
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Se la sezione entra nello schermo
        if (entry.isIntersecting) {
          // Aggiunge la classe che fa partire l'animazione CSS
          entry.target.classList.add('is-visible');

          // Opzionale: smette di osservare se vuoi che l'animazione avvenga solo la prima volta
          // observer.unobserve(entry.target);
        } else {
          // Opzionale: rimuovi la classe se vuoi che l'animazione si ripeta quando l'utente fa scroll su e giù
          entry.target.classList.remove('is-visible');
        }
      });
    }, options);

    // Collega l'osservatore a ogni sezione
    this.animatedSections.forEach(section => {
      observer.observe(section.nativeElement);
    });
  }
}
