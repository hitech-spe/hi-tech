import { Component, AfterViewInit, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  imports: [
    TranslateModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // IL TRUCCO PER iOS: Diamo al browser 100 millisecondi per renderizzare
    // fisicamente il layout prima di attaccare l'Observer.
    setTimeout(() => {
      const options = {
        root: null,
        /* rootMargin a 100px fa scattare l'Observer PRIMA che l'utente arrivi
           fisicamente sull'elemento. Previene i "buchi neri" da caricamento in ritardo. */
        rootMargin: '100px 0px',
        /* Abbassiamo la soglia al 5% per renderlo ultra-sensibile */
        threshold: 0.15
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      }, options);

      const elements = this.el.nativeElement.querySelectorAll('.scroll-reveal');
      elements.forEach((el: Element) => {
        this.observer?.observe(el);
      });
    }, 100); // 100ms di delay salvavita
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
