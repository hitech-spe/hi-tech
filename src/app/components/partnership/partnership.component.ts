import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, ChangeDetectionStrategy } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

interface Partner {
  name: string;
  description: string;
  logo: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-partnership',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgOptimizedImage],
  templateUrl: './partnership.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./partnership.component.scss']
})
export class PartnershipComponent implements AfterViewInit {
  @ViewChildren('animatedElement') animatedElements!: QueryList<ElementRef>;

  partners: Partner[] = [
    {
      name: 'PARTNERSHIP.ADASTRA.NAME',
      description: 'PARTNERSHIP.ADASTRA.DESC',
      logo: '/assets/images/adastraLogo.webp',
      width: 370,
      height: 131
    },
    {
      name: 'PARTNERSHIP.MERQORN.NAME',
      description: 'PARTNERSHIP.MERQORN.DESC',
      logo: '/assets/images/Merqorn.webp',
      width: 370,
      height: 131
    },
    {
      name: 'PARTNERSHIP.TAMBORRINO.NAME',
      description: 'PARTNERSHIP.TAMBORRINO.DESC',
      logo: '/assets/images/tamborrinoLogo.webp',
      width: 370,
      height: 131
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.animatedElements.forEach(el => {
      observer.observe(el.nativeElement);
    });
  }
}
