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
    const options = {
      root: null,
      /* rootMargin anticipa il caricamento di 50px prima che entri nello schermo,
         aiutando la fluidità su mobile */
      rootMargin: '50px',
      threshold: 0.05 /* Abbassato al 5%: scatta subito senza far faticare il telefono */
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // FONDAMENTALE PER IL MOBILE: Smetti di osservare l'elemento!
          // Evita che scatti a ripetizione andando su e giù, salvando tantissima batteria e RAM.
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.animatedSections.forEach(section => {
      observer.observe(section.nativeElement);
    });
  }
}
