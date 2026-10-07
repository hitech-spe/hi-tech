import { vi } from 'vitest';

// Mock di lottie-web per prevenire errori legati alla mancanza di Canvas in ambiente JSDOM
vi.mock('lottie-web', () => {
  return {
    default: {
      loadAnimation: vi.fn().mockReturnValue({
        destroy: vi.fn()
      })
    }
  };
});

import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { FirestoreService } from './services/firestore.service';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

describe('AppComponent', () => {
  const mockAuthService = {
    user$: of(null)
  };

  const mockFirestoreService = {
    getUserDocData: () => of(null)
  };

  const mockFirestore = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        AppComponent
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: FirestoreService, useValue: mockFirestoreService },
        { provide: Firestore, useValue: mockFirestore }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'hi-tech'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('hi-tech');
  });

  it('should initialize successfully on ngOnInit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(() => app.ngOnInit()).not.toThrow();
  });

  it('should set canonical and hreflang tags with trailing slash for internal routes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const document = TestBed.inject(DOCUMENT);
    const router = (app as any).router;

    // Simulate route /about
    Object.defineProperty(router, 'url', { value: '/about', configurable: true });
    (app as any).updateSeoTags();

    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    expect(canonical).toBe('https://hitechsrls.com/about/');

    const hreflangIt = document.querySelector('link[rel="alternate"][hreflang="it"]')?.getAttribute('href');
    const hreflangEn = document.querySelector('link[rel="alternate"][hreflang="en"]')?.getAttribute('href');
    const hreflangDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]')?.getAttribute('href');

    expect(hreflangIt).toBe('https://hitechsrls.com/about/?lang=it');
    expect(hreflangEn).toBe('https://hitechsrls.com/about/?lang=en');
    expect(hreflangDefault).toBe('https://hitechsrls.com/about/');
  });

  it('should set canonical tag with trailing slash and query param when lang is en', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const document = TestBed.inject(DOCUMENT);
    const router = (app as any).router;
    const translate = (app as any).translate;

    translate.currentLang = 'en';
    Object.defineProperty(router, 'url', { value: '/privacy-policy', configurable: true });
    (app as any).updateSeoTags();

    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    expect(canonical).toBe('https://hitechsrls.com/privacy-policy/?lang=en');
  });

  it('should set canonical tag for root URL as https://hitechsrls.com/', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const document = TestBed.inject(DOCUMENT);
    const router = (app as any).router;
    const translate = (app as any).translate;

    translate.currentLang = 'it';
    Object.defineProperty(router, 'url', { value: '/', configurable: true });
    (app as any).updateSeoTags();

    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    expect(canonical).toBe('https://hitechsrls.com/');
  });
});
