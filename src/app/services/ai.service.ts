import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

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
  private readonly firestore = inject(Firestore);

  // NOTA: In produzione, non esporre MAI le chiavi API lato client.
  // Usa un backend (Node.js, Firebase Functions, etc.) come proxy.
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly API_KEY = '';

  private cachedApiKey: string | null = null;
  private isKeyLoaded = false;

  constructor() {}

  private async getActiveApiKey(): Promise<string> {
    // 1. Check local storage first (gives local testing priority)
    const localKey = typeof window !== 'undefined' ? localStorage.getItem('custom_openrouter_key') : null;
    if (localKey && localKey.trim()) {
      return localKey.trim();
    }

    // 2. Check cached Firestore key
    if (this.isKeyLoaded) {
      return this.cachedApiKey || this.API_KEY;
    }

    try {
      const docRef = doc(this.firestore, 'config', 'openrouter');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firestoreKey = docSnap.data()?.[ 'apiKey' ];
        if (firestoreKey && firestoreKey.trim()) {
          this.cachedApiKey = firestoreKey.trim();
        }
      }
    } catch (error) {
      console.warn('Could not fetch OpenRouter key from Firestore:', error);
    }

    this.isKeyLoaded = true;
    return this.cachedApiKey || this.API_KEY;
  }

  async getQuoteEstimate(description: string): Promise<QuoteResponse> {
    try {
      const apiKey = await this.getActiveApiKey();
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://hi-tech-simulator.it', // Opzionale per OpenRouter
          'X-Title': 'Hi-Tech AI Quote Simulator' // Opzionale per OpenRouter
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash", // Modello consigliato (veloce ed economico)
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
          temperature: 0.7,
          max_tokens: 1500
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

  async getChatbotResponse(message: string, history: { role: 'user' | 'assistant', content: string }[], currentLang: string): Promise<string> {
    try {
      const messages = [
        {
          role: "system",
          content: `Sei l'Assistente Virtuale intelligente di Hi-Tech Solutions.
L'utente sta navigando sul sito della nostra software house. Rispondi con professionalità, cortesia, in modo conciso (massimo 3-4 frasi) e orientato a convertire l'utente in lead.
I nostri servizi principali:
- Sviluppo Piattaforme Web B2B Custom (Angular/Java/Spring/Node)
- Sviluppo App Mobile Native e Cross-Platform (Flutter/iOS/Android)
- Consulenza Cloud Aziendale (AWS/Azure, migrazione, disaster recovery)
- Adastra WordPress (siti istituzionali ed e-commerce veloci e gestibili)
- Consulenza IT, Audit di sicurezza, DevOps e manutenzione.

Se l'utente chiede informazioni sui prezzi, invitalo calorosamente a visitare la sezione "Preventivo AI" (/quote-ai) o a scriverci tramite il modulo "Contatti" (/contact) per uno studio di fattibilità gratuito.
Rispondi esclusivamente nella lingua richiesta: ${currentLang === 'en' ? 'Inglese (English)' : 'Italiano (Italian)'}.`
        },
        ...history.map(h => ({ role: h.role === 'assistant' ? 'assistant' as const : 'user' as const, content: h.content })),
        {
          role: "user",
          content: message
        }
      ];

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getActiveApiKey()}`,
          'HTTP-Referer': 'https://hi-tech-simulator.it',
          'X-Title': 'Hi-Tech Chatbot Assistant'
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Chatbot API Fallback:', error);
      return this.simulateChatbotResponse(message, currentLang);
    }
  }

  private simulateChatbotResponse(message: string, lang: string): string {
    const msg = message.toLowerCase();
    if (lang === 'en') {
      if (msg.includes('app') || msg.includes('mobile')) {
        return "We build native and cross-platform mobile apps using Flutter. They are fast, responsive, and deployable to both App Store and Google Play Store. Would you like us to schedule a call to talk about your idea?";
      }
      if (msg.includes('price') || msg.includes('cost') || msg.includes('estimate')) {
        return "You can get an instant, AI-powered cost estimation in seconds using our 'AI Quote Simulator' on the /quote-ai page. Or, feel free to contact us directly via our contact form!";
      }
      if (msg.includes('cloud') || msg.includes('aws')) {
        return "Our Cloud consulting covers migration, server scaling, and continuous support on AWS and Azure, reducing traditional hardware costs up to 40%. Let us know what you are migrating!";
      }
      return "Hi-Tech Solutions is here to help with your custom web, mobile, and cloud software. Let us know what kind of project you have in mind!";
    } else {
      if (msg.includes('app') || msg.includes('mobile')) {
        return "Sviluppiamo applicazioni mobile native e cross-platform avanzate utilizzando Flutter. Ottieni un'app eccellente su iOS e Android con un unico codice. Vuoi fissare una chiamata per parlarne?";
      }
      if (msg.includes('prezz') || msg.includes('cost') || msg.includes('preventiv')) {
        return "Puoi ottenere una stima istantanea dei costi in pochi secondi nella nostra sezione 'Preventivo AI' (/quote-ai). Oppure, scrivici tramite il modulo di contatto per uno studio di fattibilità gratuito!";
      }
      if (msg.includes('cloud') || msg.includes('aws')) {
        return "La nostra consulenza Cloud copre migrazione, scalabilità automatica dei server e disaster recovery su AWS/Azure, abbattendo i costi fino al 40%. Di cosa ha bisogno la tua infrastruttura?";
      }
      return "Hi-Tech Solutions è a tua disposizione per sviluppo software web su misura, mobile ed integrazioni cloud. Parlami del tuo progetto!";
    }
  }
}
