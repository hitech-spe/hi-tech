export interface ClientData {
  id?: string;
  userId?: string;
  name: string;
  company?: string;
  vat?: string; // Partita IVA / Codice Fiscale
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  createdAt?: string;
}

export interface QuoteFeature {
  title: string;
  description: string;
}

export interface QuoteModule {
  title: string;
  features: QuoteFeature[];
}

export interface QuotePhase {
  phase: string;
  timing: string;
  description: string;
}

export interface QuoteMilestone {
  title: string;
  percentage: number;
  description: string;
}

export interface CommercialQuote {
  id?: string;
  userId: string;
  quoteNumber?: string;
  date: string;
  validityDays: number;
  subject: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  
  // Tipologia e Cliente
  workType: 'PIATTAFORMA_GESTIONALE' | 'APP_MOBILE' | 'WORDPRESS_ADASTRA' | 'CLOUD_DEVOPS' | 'CUSTOM';
  client: ClientData;

  // Sezione 1: Premessa e Obiettivi
  premiseIntro: string;
  currentProblems: string[];
  solutionTitle: string;
  solutionDescription: string;

  // Sezione 2: Scope of Work (Moduli)
  modules: QuoteModule[];

  // Sezione 3: Tecnologia e Infrastruttura
  techStack: {
    frontend: string;
    backendAndDb: string;
    hosting: string;
    maintenanceCosts: string;
  };

  // Sezione 4: Pianificazione Tempi (Fasi)
  phases: QuotePhase[];

  // Sezione 5: Valore Economico e Pagamento
  priceNet: number; // Prezzo imponibile esclusa IVA
  taxRate: number; // % IVA (default 22%)
  milestones: QuoteMilestone[];

  // Sezione 6: Inclusioni ed Esclusioni
  inclusions: string[];
  exclusions: string[];

  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
