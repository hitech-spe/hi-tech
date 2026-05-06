import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
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
  standalone: true
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Configuriamo l'osservatore per far scattare l'animazione quando la riga è visibile al 20%
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Aggiunge la classe che fa partire le animazioni interne
          entry.target.classList.add('is-visible');

          // Se vuoi che l'animazione si ripeta scendendo e salendo, commenta la riga sotto.
          // Se vuoi che avvenga solo la prima volta, lasciala decommentata:
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    // Diciamo all'Observer di guardare tutti gli elementi con la classe 'scroll-reveal'
    const elements = this.el.nativeElement.querySelectorAll('.scroll-reveal');
    elements.forEach((el: Element) => {
      this.observer?.observe(el);
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
