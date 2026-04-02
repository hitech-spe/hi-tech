import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor() {}

  async getQuoteEstimate(description: string): Promise<any> {
    // Simuliamo una chiamata AI con un delay
    // In un caso reale qui chiameresti OpenAI API
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Logica di "analisi" simulata basata su parole chiave
    const desc = description.toLowerCase();
    let baseCost = 1500;
    let baseTime = '2-3 settimane';
    const features = [];

    if (desc.includes('app') || desc.includes('mobile')) {
      baseCost += 3000;
      baseTime = '2-3 mesi';
      features.push('Sviluppo Mobile (iOS/Android)');
    } else {
      features.push('Sviluppo Web Responsive');
    }

    if (desc.includes('e-commerce') || desc.includes('shop') || desc.includes('vendita')) {
      baseCost += 2000;
      features.push('Sistema di Pagamento (Stripe/PayPal)');
      features.push('Catalogo Prodotti');
    }

    if (desc.includes('login') || desc.includes('utente') || desc.includes('area riservata')) {
      baseCost += 800;
      features.push('Gestione Utenti & Autenticazione');
    }

    if (desc.includes('mappa') || desc.includes('geolocalizzazione')) {
      baseCost += 500;
      features.push('Integrazione Google Maps/GPS');
    }

    if (features.length === 1) {
      features.push('UI/UX Design Personalizzato');
      features.push('SEO Base');
    }

    return {
      estimatedCost: `€${baseCost} - €${Math.round(baseCost * 1.4)}`,
      estimatedTime: baseTime,
      features: features,
      suggestion: "Questa è una stima preliminare generata dalla nostra AI. Per un preventivo dettagliato e vincolante, ti invitiamo a lasciarci la tua mail."
    };
  }
}
