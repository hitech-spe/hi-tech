import { Component, inject, HostListener, ChangeDetectionStrategy, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {RouterLink, RouterLinkActive, Router, NavigationEnd} from "@angular/router";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {FirestoreService} from "../../services/firestore.service";
import {map, Observable, of, Subscription, switchMap} from "rxjs";
import {doc, docData, Firestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  currentLang: string;

  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  user$ = this.authService.user$;
  userData$: Observable<any> = this.user$.pipe(
    switchMap(user => {
      if (user) {
        return this.firestoreService.getUserDocData(user.uid).pipe(
          map(data => data ? { ...data, uid: user.uid } : { 
            firstName: user.displayName?.split(' ')[0] || '', 
            lastName: user.displayName?.split(' ')[1] || '',
            email: user.email,
            uid: user.uid 
          })
        );
      }
      return of(null);
    })
  );

  isUserMenuOpen = false;
  activeSection = 'home';
  private observer: IntersectionObserver | null = null;
  private routerSub: Subscription | undefined;

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'it';
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.routerSub = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setupScrollObserver();
        }
      });
      // Avvia inizialmente dopo un piccolo timeout per attendere il rendering del DOM
      setTimeout(() => this.setupScrollObserver(), 500);
    }
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupScrollObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    const isHome = this.router.url === '/' || this.router.url.startsWith('/home');
    if (!isHome) {
      this.activeSection = '';
      return;
    }

    const options = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // Concentra l'area di intercettazione nella metà superiore
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    const sectionIds = ['home', 'about', 'services', 'partnership', 'news', 'contact'];
    let elementsFound = 0;
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        this.observer?.observe(el);
        elementsFound++;
      }
    });

    // Se non tutti gli elementi sono pronti (es. caricamento asincrono), riprova tra poco
    if (elementsFound < sectionIds.length) {
      setTimeout(() => {
        sectionIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            this.observer?.observe(el);
          }
        });
      }, 1000);
    }
  }

  getInitials(user: any): string {
    if (!user) return '';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click')
  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.isUserMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isUserMenuOpen = false;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    this.closeMenu();
    this.router.navigate([], {
      queryParams: { lang: lang },
      queryParamsHandling: 'merge'
    });
  }
}
