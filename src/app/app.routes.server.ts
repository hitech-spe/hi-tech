import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
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
