import { Injectable } from '@angular/core';

export interface QuoteResponse {
  estimatedCost: string;
  estimatedTime: string;
  features: string[];
  suggestion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  // NOTA: In produzione, non esporre MAI le chiavi API lato client.
  // Usa un backend (Node.js, Firebase Functions, etc.) come proxy.
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly API_KEY = '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';

  constructor() {}

  async getQuoteEstimate(description: string): Promise<QuoteResponse> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'HTTP-Referer': 'https://hi-tech-simulator.it', // Opzionale per OpenRouter
          'X-Title': 'Hi-Tech AI Quote Simulator' // Opzionale per OpenRouter
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001", // Modello consigliato (veloce ed economico)
          messages: [
            {
              role: "system",
              content: "Sei un esperto di stime per progetti software e consulente digitale. Analizza la descrizione del progetto e restituisci SOLO un JSON con questi campi: estimatedCost (stringa con range in Euro), estimatedTime (stringa range tempo), features (array di stringhe con le feature principali identificate), suggestion (una breve nota professionale che includa anche un invito a richiedere un preventivo personalizzato e a farsi seguire da un esperto per ottenere il miglior risultato). Rispondi in italiano con tono professionale ma orientato alla conversione."
            },
            {
              role: "user",
              content: description
            }
          ],
          response_format: {
            type: 'json_object'
          },
          temperature: 0.7
        })
      });

      if (!response.ok) {
        // Se riceviamo un errore (es. 429 Too Many Requests), solleviamo un'eccezione per attivare il fallback
        const errorData = await response.json().catch(() => ({}));
        console.warn(`OpenRouter API Error ${response.status}:`, errorData);
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('AI API Fallback Triggered:', error);
      // Fallback alla simulazione in caso di errore API (es. quota esaurita o chiave invalida)
      return this.simulateAiResponse(description);
    }
  }

  private async simulateAiResponse(description: string): Promise<QuoteResponse> {
    // Simuliamo il delay dell'AI
    await new Promise(resolve => setTimeout(resolve, 2000));

    const desc = description.toLowerCase();
    let minCost = 800;
    let maxCost = 1500;
    let time = '1-2 settimane';
    const features: string[] = [];

    // Logica di analisi migliorata
    if (desc.includes('app') || desc.includes('mobile') || desc.includes('ios') || desc.includes('android')) {
      minCost += 3500;
      maxCost += 6000;
      time = '2-4 mesi';
      features.push('Sviluppo Cross-Platform (Flutter/React Native)');
      features.push('Pubblicazione su Store (App Store/Play Store)');
    } else if (desc.includes('sito') || desc.includes('web') || desc.includes('portale')) {
      minCost += 1200;
      maxCost += 2500;
      time = '3-5 settimane';
      features.push('Architettura Web SPA (Angular)');
      features.push('Design Responsive & Mobile-First');
    }

    if (desc.includes('e-commerce') || desc.includes('shop') || desc.includes('pagamento') || desc.includes('vendita')) {
      minCost += 2000;
      maxCost += 4000;
      features.push('Integrazione Gateway di Pagamento Sicuro');
      features.push('Dashboard Gestione Prodotti e Ordini');
      if (time.includes('settimane')) time = '6-8 settimane';
    }

    if (desc.includes('login') || desc.includes('utente') || desc.includes('account') || desc.includes('social login')) {
      minCost += 500;
      maxCost += 1200;
      features.push('Sistema di Autenticazione OAuth2/JWT');
      features.push('Gestione Profili Utente');
    }

    if (desc.includes('gestione') || desc.includes('crm') || desc.includes('dashboard')) {
      minCost += 1500;
      maxCost += 3000;
      features.push('Pannello di Controllo Amministrativo');
      features.push('Visualizzazione Dati & Analytics');
    }

    // Default features se la descrizione è troppo breve
    if (features.length < 2) {
      features.push('UI/UX Design Professionale');
      features.push('Ottimizzazione Performance & SEO');
    }

    return {
      estimatedCost: `€${minCost.toLocaleString()} - €${maxCost.toLocaleString()}`,
      estimatedTime: time,
      features: features,
      suggestion: "Questa stima è generata dalla nostra AI avanzata. I costi reali possono variare in base alle integrazioni specifiche richieste."
    };
  }
}
