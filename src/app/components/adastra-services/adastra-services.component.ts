import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-adastra-services',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './adastra-services.component.html',
  styleUrls: ['./adastra-services.component.scss']
})
export class AdastraServicesComponent implements AfterViewInit {
  @ViewChildren('animatedElement') animatedElements!: QueryList<ElementRef>;

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

  getSafeIcon(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  services = [
    {
      id: 'adastra-consulting',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&fm=webp&q=60&w=800',
      titleKey: 'SERVICES.ADASTRA.CONSULTING.TITLE',
      descKey: 'SERVICES.ADASTRA.CONSULTING.DESC'
    },
    /*{
      id: 'adastra-wordpress',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&fm=webp&q=60&w=800',
      titleKey: 'SERVICES.ADASTRA.WORDPRESS.TITLE',
      descKey: 'SERVICES.ADASTRA.WORDPRESS.DESC'
    },*/
    {
      id: 'adastra-elearning',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&fm=webp&q=60&w=800',
      titleKey: 'SERVICES.ADASTRA.ELEARNING.TITLE',
      descKey: 'SERVICES.ADASTRA.ELEARNING.DESC'
    },
    {
      id: 'adastra-branding',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`,
      image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&fm=webp&q=60&w=800',
      titleKey: 'SERVICES.ADASTRA.BRANDING.TITLE',
      descKey: 'SERVICES.ADASTRA.BRANDING.DESC'
    },
    {
      id: 'adastra-content',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&fm=webp&q=60&w=800',
      titleKey: 'SERVICES.ADASTRA.CONTENT.TITLE',
      descKey: 'SERVICES.ADASTRA.CONTENT.DESC'
    },
    {
      id: 'adastra-social',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>`,
      image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&fm=webp&q=60&w=800',
      titleKey: 'SERVICES.ADASTRA.SOCIAL.TITLE',
      descKey: 'SERVICES.ADASTRA.SOCIAL.DESC'
    },
    {
      id: 'adastra-adv',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
      image: 'https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&fm=webp&q=60&w=800',
      titleKey: 'SERVICES.ADASTRA.ADV.TITLE',
      descKey: 'SERVICES.ADASTRA.ADV.DESC'
    }
  ];
}
