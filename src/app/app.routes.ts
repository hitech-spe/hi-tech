import { Routes } from '@angular/router';
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'about', 
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) 
  },
  { 
    path: 'services', 
    loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent) 
  },
  { 
    path: 'services/sviluppo-piattaforme-web-b2b', 
    loadComponent: () => import('./components/service-detail/service-detail.component').then(m => m.ServiceDetailComponent), 
    data: { id: 'sviluppo-piattaforme-web-b2b' } 
  },
  { 
    path: 'services/sviluppo-app-mobile-native', 
    loadComponent: () => import('./components/service-detail/service-detail.component').then(m => m.ServiceDetailComponent), 
    data: { id: 'sviluppo-app-mobile-native' } 
  },
  { 
    path: 'services/consulenza-cloud-aziendale', 
    loadComponent: () => import('./components/service-detail/service-detail.component').then(m => m.ServiceDetailComponent), 
    data: { id: 'consulenza-cloud-aziendale' } 
  },
  { 
    path: 'services/adastra-wordpress', 
    loadComponent: () => import('./components/service-detail/service-detail.component').then(m => m.ServiceDetailComponent), 
    data: { id: 'adastra-wordpress' } 
  },
  { 
    path: 'services/:id', 
    loadComponent: () => import('./components/service-detail/service-detail.component').then(m => m.ServiceDetailComponent) 
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent) 
  },
  { 
    path: 'privacy-policy', 
    loadComponent: () => import('./components/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent) 
  },
  { 
    path: 'terms-and-conditions', 
    loadComponent: () => import('./components/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent) 
  },
  { path: 'quote-simulator', redirectTo: '/quote-ai', pathMatch: 'full' },
  { 
    path: 'quote-ai', 
    loadComponent: () => import('./components/quote-simulator/quote-simulator.component').then(m => m.QuoteSimulatorComponent) 
  },
  { 
    path: 'quotes', 
    loadComponent: () => import('./components/quotes/quotes.component').then(m => m.QuotesComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  { path: '**', redirectTo: '/home' }
];
