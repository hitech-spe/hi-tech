import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rotte statiche di servizio pre-renderizzate per massimizzare la SEO e prevenire 404
  {
    path: 'services/sviluppo-piattaforme-web-b2b',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'services/sviluppo-app-mobile-native',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'services/consulenza-cloud-aziendale',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'services/adastra-wordpress',
    renderMode: RenderMode.Prerender
  },
  // Fallback per rotte parametriche di servizio. Queste verranno caricate via CSR.
  {
    path: 'services/:id',
    renderMode: RenderMode.Client
  },
  // La dashboard amministrativa necessita l'Auth di Firebase, quindi usa il Client
  {
    path: 'quotes',
    renderMode: RenderMode.Client
  },
  // Tutte le altre rotte statiche del sito vengono "Prerenderizzate" in HTML statico
  // a tempo di build. Questo risolve l'indicizzazione in Google Search Console!
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
