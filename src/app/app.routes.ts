import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactComponent } from './components/contact/contact.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { QuoteSimulatorComponent } from './components/quote-simulator/quote-simulator.component';
import { LoginComponent } from "./components/login/login.component";
import { QuotesComponent } from "./components/quotes/quotes.component";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'services/sviluppo-piattaforme-web-b2b', component: ServiceDetailComponent, data: { id: 'sviluppo-piattaforme-web-b2b' } },
  { path: 'services/sviluppo-app-mobile-native', component: ServiceDetailComponent, data: { id: 'sviluppo-app-mobile-native' } },
  { path: 'services/consulenza-cloud-aziendale', component: ServiceDetailComponent, data: { id: 'consulenza-cloud-aziendale' } },
  { path: 'services/adastra-wordpress', component: ServiceDetailComponent, data: { id: 'adastra-wordpress' } },
  { path: 'services/:id', component: ServiceDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: 'quote-simulator', redirectTo: '/quote-ai', pathMatch: 'full' },
  { path: 'quote-ai', component: QuoteSimulatorComponent },
  { path: 'quotes', component: QuotesComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home' }
];
