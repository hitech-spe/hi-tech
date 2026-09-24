import { CommercialQuote } from './quote.model';

export const WORK_TYPE_OPTIONS = [
  { value: 'PIATTAFORMA_GESTIONALE', label: 'Piattaforma Web B2B / Gestionale Custom' },
  { value: 'APP_MOBILE', label: 'Sviluppo App Mobile Nativa (iOS / Android)' },
  { value: 'WORDPRESS_ADASTRA', label: 'Sito Web Professionale WordPress (Adastra)' },
  { value: 'CLOUD_DEVOPS', label: 'Consulenza Cloud, Sicurezza & DevOps' },
  { value: 'CUSTOM', label: 'Soluzione Personalizzata / Su Misura' }
] as const;

export function getTemplateForWorkType(workType: CommercialQuote['workType'], clientName: string = '', companyName: string = ''): Partial<CommercialQuote> {
  const targetName = companyName || clientName || 'Azienda';

  switch (workType) {
    case 'PIATTAFORMA_GESTIONALE':
      return {
        workType: 'PIATTAFORMA_GESTIONALE',
        subject: `Preventivo Piattaforma Gestione & Controllo Digitale`,
        validityDays: 30,
        premiseIntro: `La presente proposta ha l'obiettivo di avviare il processo di digitalizzazione e automazione della gestione operativa, finanziaria e statistica di ${targetName}.\nAttualmente, il monitoraggio delle attività e delle performance aziendali si basa su processi manuali o fogli di calcolo disgiunti, che presentano limiti strutturali per l'efficienza quotidiana.`,
        currentProblems: [
          'Rischio di errori: L\'inserimento manuale e la dispersione dei dati aumentano sensibilmente il rischio di disallineamenti di cassa o inesattezze di calcolo.',
          'Visione frammentata: Risulta complesso e dispendioso confrontare l\'andamento economico su base annuale, stagionale o per centro di costo in tempo reale.',
          'Mancanza di tempestività: L\'assenza di indicatori visivi e alert impedisce al management di intervenire tempestivamente qualora i costi superino la soglia ottimale rispetto ai ricavi.'
        ],
        solutionTitle: 'LA SOLUZIONE PROPOSTA (GESTIONE & CONTROLLO STANDARD)',
        solutionDescription: `Sviluppo di un'applicazione web protetta ed esclusiva (Single Page Application) basata su architettura Angular 22 e database Google Firebase Cloud Firestore. L'applicazione sarà caratterizzata da una User Experience (UX) estremamente intuitiva, pensata per l'operatività quotidiana (anche tramite tablet o smartphone in mobilità), e con un design premium coordinato con l'identità del brand.`,
        modules: [
          {
            title: 'Modulo 1: Dashboard di Controllo e Alerting Visivo',
            features: [
              {
                title: 'Pannello di Sintesi KPIs',
                description: 'Visualizzazione in tempo reale di Fatturato Lordo, Margine Operativo Netto e Liquidità Totale (suddivisa tra banca e cassa contanti).'
              },
              {
                title: 'Semafori di Controllo (Alerting)',
                description: 'Indicatori grafici immediati (Verde / Arancio / Rosso) associati alle percentuali reali di costo rispetto al fatturato per le principali macro-voci di spesa.'
              },
              {
                title: 'Grafici Dinamici Custom',
                description: 'Rappresentazione visiva pulita delle tendenze mensili del fatturato a confronto con l\'esercizio precedente.'
              }
            ]
          },
          {
            title: 'Modulo 2: Registro Attività e Calcolo Margine Netto',
            features: [
              {
                title: 'Immissione Rapida Attività',
                description: 'Maschera di inserimento ultra-veloce (ottimizzata per tablet e smartphone) dei dati operativi chiave con calcolo istantaneo delle tariffe.'
              },
              {
                title: 'Modulo Risorse & Personale',
                description: 'Associazione rapida dei costi del personale operativo impiegato nelle singole commesse o giornate lavorative.'
              },
              {
                title: 'Margine Operativo Istantaneo',
                description: 'Calcolo automatico del profitto netto generato (Ricavi - Costi Diretti) aggiornato in tempo reale.'
              }
            ]
          },
          {
            title: 'Modulo 3: Uscite e Registro Fornitori',
            features: [
              {
                title: 'Tracciamento Uscite in Valori Assoluti',
                description: 'Registrazione di ogni singola spesa con indicazione del beneficiario, importo, data e metodo di pagamento (Bonifico/POS, Contanti).'
              },
              {
                title: 'Catalogazione per Macro-Famiglie',
                description: 'Suddivisione automatica delle uscite tra Fornitori Primari, Spese Fisse di Struttura e Costi di Gestione.'
              }
            ]
          },
          {
            title: 'Modulo 4: Inventario e Giacenze Magazzino',
            features: [
              {
                title: 'Digitalizzazione dell\'Inventario',
                description: 'Tabella interattiva con elenco delle referenze, codici articolo e rispettivi costi unitari d\'acquisto.'
              },
              {
                title: 'Calcolo Consumo Effettivo',
                description: 'Conteggio periodico delle giacenze con applicazione automatica della formula: Consumi = Giacenza Iniziale + Acquisti - Giacenza Finale.'
              }
            ]
          },
          {
            title: 'Modulo 5: Liquidità, Flussi di Cassa e Previsione Fiscale',
            features: [
              {
                title: 'Saldo Cassa Reale',
                description: 'Schermata di quadratura periodica dei fondi cassa fisici e dei saldi bancari disponibili.'
              },
              {
                title: 'Previsione Fiscale (IVA)',
                description: 'Calcolatore automatico dell\'IVA a debito a confronto con l\'IVA a credito, per conoscere in anticipo l\'importo F24 stimato.'
              }
            ]
          }
        ],
        techStack: {
          frontend: 'Angular 22 con architettura a componenti Standalone reattiva basata su Signals. Caricamento modulare per prestazioni istantanee su qualsiasi rete (3G/4G/5G).',
          backendAndDb: 'Google Firebase Cloud Firestore. Database NoSQL distribuito, cifrato a riposo e in transito, con sincronizzazione dati in tempo reale multi-dispositivo.',
          hosting: 'Netlify Edge CDN con protocollo HTTPS/SSL integrato a velocità globale e zero tempi di downtime.',
          maintenanceCosts: 'L\'infrastruttura proposta sfrutta i piani professionali gratuiti (Spark Tier Google Firebase e Free Tier Netlify). Costi di esercizio per il cliente: € 0,00/mese per volumi standard.'
        },
        phases: [
          {
            phase: 'Fase 1 (Settimana 1)',
            timing: 'Settimana 1',
            description: 'Setup database Firebase Cloud Firestore, configurazione ambiente Angular e sviluppo del layout della dashboard con palette cromatica personalizzata.'
          },
          {
            phase: 'Fase 2 (Settimana 2)',
            timing: 'Settimana 2',
            description: 'Rilascio e collaudo dei moduli di inserimento e consultazione "Attività Operative" e "Uscite Fornitori".'
          },
          {
            phase: 'Fase 3 (Settimana 3)',
            timing: 'Settimana 3',
            description: 'Rilascio del modulo "Inventario & Magazzino" con algoritmi di calcolo automatico dei consumi effettivi.'
          },
          {
            phase: 'Fase 4 (Settimana 4)',
            timing: 'Settimana 4',
            description: 'Rilascio della Dashboard direzionale completa di grafici KPIs, semafori di Alerting e modulo Liquidità / Previsione IVA.'
          },
          {
            phase: 'Fase 5 (Settimana 5)',
            timing: 'Settimana 5',
            description: 'Sessione di collaudo con dati reali forniti dal cliente, ottimizzazione finale, correzione anomalie e pubblicazione in produzione (Go-Live).'
          }
        ],
        priceNet: 4900,
        taxRate: 22,
        milestones: [
          {
            title: '1. Acconto all\'avvio (30%)',
            percentage: 30,
            description: 'All\'accettazione del preventivo e setup iniziale dell\'architettura cloud'
          },
          {
            title: '2. Rilascio intermedio (40%)',
            percentage: 40,
            description: 'Al rilascio e test dei moduli funzionali core (fine Settimana 3)'
          },
          {
            title: '3. Saldo al collaudo (30%)',
            percentage: 30,
            description: 'Alla consegna delle credenziali in produzione previa approvazione del cliente (fine Settimana 5)'
          }
        ],
        inclusions: [
          'Sviluppo completo e configurazione personalizzata dello stack tecnologico (Angular 22 + Firebase + Netlify).',
          'Ottimizzazione responsive fluida per smartphone, tablet e desktop (Apple iOS e Android).',
          'Importazione iniziale dei dati storici da file Excel/fogli forniti dal cliente per partire subito operativi.',
          '3 ore di sessione formativa online per il personale amministrativo e operativo.',
          'Garanzia di 6 mesi con risoluzione tempestiva gratuita di qualsiasi eventuale difetto software (bug) rilevato.'
        ],
        exclusions: [
          'Costi vivi di acquisto o rinnovo dominio web personalizzato (qualora non in possesso del cliente, circa € 10-15/anno).',
          'Funzionalità avanzate di intelligenza artificiale o integrazioni ERP terze non specificate, quotabili separatamente come moduli futuri.'
        ]
      };

    case 'APP_MOBILE':
      return {
        workType: 'APP_MOBILE',
        subject: `Preventivo Sviluppo Applicazione Mobile Nativa iOS & Android`,
        validityDays: 30,
        premiseIntro: `La presente proposta ha l'obiettivo di progettare e sviluppare un'applicazione mobile innovativa per ${targetName}, pubblicata sugli store ufficiali Apple App Store e Google Play Store.\nL'obiettivo è fidelizzare i clienti, incrementare le interazioni dirette e ottimizzare i processi aziendali in mobilità.`,
        currentProblems: [
          'Mancanza di canale diretto: Difficoltà nel raggiungere i clienti con notifiche push personalizzate e comunicazioni tempestive.',
          'Esperienza mobile frammentata: Il solo sito web mobile non garantisce la rapidità, l\'accesso offline e la fluidità di una vera app nativa.',
          'Perdita di opportunità commerciali: Impossibilità per gli utenti di effettuare prenotazioni, ordini o consultazioni con memorizzazione dei dati personali in un click.'
        ],
        solutionTitle: 'LA SOLUZIONE MOBILE D\'AVANGUARDIA (FLUTTER MULTI-PLATFORM)',
        solutionDescription: `Sviluppo di un'applicazione nativa ad alte prestazioni realizzata con framework Google Flutter. Un unico codice sorgente robusto compilato nativamente sia per iOS che per Android, con design moderno coerente con le linee guida Apple Human Interface e Google Material 3.`,
        modules: [
          {
            title: 'Modulo 1: Onboarding e Autenticazione Sicura',
            features: [
              {
                title: 'Accesso Rapido & Social Login',
                description: 'Registrazione e login tramite Email, Google e Apple ID con supporto al riconoscimento biometrico (Face ID / Touch ID / Impronta).'
              },
              {
                title: 'Profilo Utente Personalizzato',
                description: 'Area riservata per la gestione delle preferenze, storico ordini/interazioni e dati di fatturazione.'
              }
            ]
          },
          {
            title: 'Modulo 2: Catalogo Servizi e Interfaccia Interattiva',
            features: [
              {
                title: 'Navigazione Fluida a 60/120fps',
                description: 'Visualizzazione interattiva dei prodotti e servizi con ricerca in tempo reale, filtri avanzati e schede di dettaglio ricche di contenuti.'
              },
              {
                title: 'Carrello o Sistema di Prenotazione',
                description: 'Flusso di prenotazione o acquisto snello con validazione istantanea della disponibilità.'
              }
            ]
          },
          {
            title: 'Modulo 3: Notifiche Push e Engagement',
            features: [
              {
                title: 'Notifiche Push Segmentate',
                description: 'Integrazione con Firebase Cloud Messaging (FCM) per inviare notifiche transazionali, promozionali o promemoria mirati.'
              },
              {
                title: 'Messaggistica In-App',
                description: 'Banner e comunicazioni dinamiche visibili all\'apertura dell\'app senza richiedere un nuovo aggiornamento dallo store.'
              }
            ]
          },
          {
            title: 'Modulo 4: Modalità Offline e Sincronizzazione Dati',
            features: [
              {
                title: 'Caching Dati Locale',
                description: 'L\'app rimane consultabile e veloce anche in assenza temporanea di connessione internet, sincronizzando i dati appena torna la rete.'
              }
            ]
          }
        ],
        techStack: {
          frontend: 'Google Flutter (Dart), compilato nativamente in codice macchina ARM/x64 per iOS e Android. Massima fluidità grafica e tempi di risposta istantanei.',
          backendAndDb: 'Firebase Cloud Firestore & Authentication con Cloud Functions scalabili per la logica di business e gestione notifiche.',
          hosting: 'Infrastruttura Serverless Google Cloud con disponibilità del 99.99% e backup automatici crittografati.',
          maintenanceCosts: 'Piani gratuiti di partenza per Firebase e Cloud Functions. Costi di backend nulli o nell\'ordine di pochi centesimi per traffico standard.'
        },
        phases: [
          {
            phase: 'Fase 1 (Settimana 1-2)',
            timing: 'Settimane 1-2',
            description: 'Progettazione UI/UX con prototipo interattivo ad alta fedeltà, approvazione grafica e configurazione architettura cloud.'
          },
          {
            phase: 'Fase 2 (Settimana 3-4)',
            timing: 'Settimane 3-4',
            description: 'Sviluppo frontend Flutter dei moduli onboarding, catalogo, navigazione e integrazione database.'
          },
          {
            phase: 'Fase 3 (Settimana 5)',
            timing: 'Settimana 5',
            description: 'Integrazione sistema notifiche push, pagamenti o prenotazioni, e sincronizzazione dati offline.'
          },
          {
            phase: 'Fase 4 (Settimana 6)',
            timing: 'Settimana 6',
            description: 'Fase di collaudo e Beta Testing su TestFlight (iOS) e Google Play Internal Testing con il cliente.'
          },
          {
            phase: 'Fase 5 (Settimana 7)',
            timing: 'Settimana 7',
            description: 'Preparazione asset grafici store, gestione iter di approvazione Apple/Google e pubblicazione ufficiale Go-Live.'
          }
        ],
        priceNet: 5800,
        taxRate: 22,
        milestones: [
          {
            title: '1. Acconto all\'avvio (30%)',
            percentage: 30,
            description: 'All\'approvazione del preventivo e avvio progettazione UI/UX'
          },
          {
            title: '2. Rilascio Beta Funzionante (40%)',
            percentage: 40,
            description: 'Al rilascio dell\'app in ambiente di test privato TestFlight / Google Play (fine Settimana 5)'
          },
          {
            title: '3. Saldo alla pubblicazione (30%)',
            percentage: 30,
            description: 'All\'avvenuta approvazione e disponibilità dell\'app sugli Store ufficiali'
          }
        ],
        inclusions: [
          'Sviluppo completo dell\'app compatibile sia per iOS (iPhone/iPad) che per Android (smartphone/tablet).',
          'Gestione completa delle pratiche di sottomissione e conformità agli standard Apple App Store e Google Play.',
          'Integrazione notifiche push illimitate tramite Google Firebase.',
          'Pannello web semplificato per inviare notifiche push o gestire i contenuti dell\'app.',
          '6 mesi di garanzia e manutenzione correttiva gratuita per bug e adeguamenti a nuovi update minori del sistema operativo.'
        ],
        exclusions: [
          'Canoni annuali degli account sviluppatore dovuti direttamente a Apple ($99/anno) e Google ($25 una tantum).',
          'Spese di gateway di pagamento terzi (es. percentuali transazione Stripe/PayPal a carico del cliente).'
        ]
      };

    case 'WORDPRESS_ADASTRA':
      return {
        workType: 'WORDPRESS_ADASTRA',
        subject: `Preventivo Sito Web Professionale & CMS Adastra WordPress`,
        validityDays: 30,
        premiseIntro: `La presente proposta ha l'obiettivo di realizzare un nuovo sito web istituzionale moderno, performante e ottimizzato SEO per ${targetName}.\nLa piattaforma permetterà di valorizzare l'identità del brand, generare nuovi contatti qualificati e gestire i contenuti in totale autonomia tramite interfaccia visuale intuitiva.`,
        currentProblems: [
          'Grafica e tecnologia datata: Il sito attuale non riflette l\'effettiva autorevolezza e qualità dei servizi offerti dall\'azienda.',
          'Scarsa visibilità su Google: Assenza di un\'architettura semantica SEO-friendly e mancata ottimizzazione per le ricerche locali e di settore.',
          'Dipendenza tecnica: Difficoltà e lentezza nell\'aggiornare testi, immagini e offerte promozionali in autonomia.'
        ],
        solutionTitle: 'LA SOLUZIONE ADASTRA WORDPRESS (PERFORMANCE & AUTONOMIA)',
        solutionDescription: `Realizzazione di un sito web su misura basato su CMS WordPress potenziato con la nostra suite Adastra. Template leggero, codice pulito senza plugin ridondanti, punteggi PageSpeed elevati e pannello di controllo semplificato per gestire pagine e articoli con facilità.`,
        modules: [
          {
            title: 'Modulo 1: Struttura Grafica e Identità Digitale',
            features: [
              {
                title: 'Design Sartoriale Responsive',
                description: 'Layout grafico personalizzato curato nel dettaglio, perfettamente fluido da desktop a smartphone a 320px.'
              },
              {
                title: 'Pagine Chiave Istituzionali',
                description: 'Home page ad alto impatto, Chi Siamo / Storia, Pagine Servizi dettagliate, Gallery e Pagina Contatti con mappa e form.'
              }
            ]
          },
          {
            title: 'Modulo 2: Lead Generation e Contatto Immediato',
            features: [
              {
                title: 'Form di Contatto Anti-Spam',
                description: 'Moduli di richiesta preventivo e contatto con notifiche email istantanee e protezione Google reCAPTCHA v3.'
              },
              {
                title: 'Pulsanti di Conversione Rapida',
                description: 'Integrazione di pulsante di chat WhatsApp fluttuante e Click-to-Call per favorire i contatti immediati da mobile.'
              }
            ]
          },
          {
            title: 'Modulo 3: SEO Tecnico e Velocità di Caricamento',
            features: [
              {
                title: 'Ottimizzazione Core Web Vitals',
                description: 'Compressione immagini in formato WebP, caching avanzato e minificazione risorse per caricamento sotto i 2 secondi.'
              },
              {
                title: 'Struttura SEO On-Page',
                description: 'Metatag unici per ogni pagina, generazione automatica di Sitemap XML per Google e markup Dati Strutturati Schema.org.'
              }
            ]
          },
          {
            title: 'Modulo 4: Conformità Legale e Privacy (GDPR)',
            features: [
              {
                title: 'Banner Cookie e Privacy Policy',
                description: 'Configurazione di registro consensi conforme GDPR e collegamento alle pagine legali dedicate.'
              }
            ]
          }
        ],
        techStack: {
          frontend: 'Design su misura responsive con fogli di stile leggeri e ottimizzati per la massima resa visiva.',
          backendAndDb: 'CMS WordPress all\'ultima versione con database MySQL su server ad alte prestazioni.',
          hosting: 'Hosting Cloud SSD NVMe ultra-veloce con certificato SSL Let\'s Encrypt gratuito e firewall attivo.',
          maintenanceCosts: 'Costi di hosting e dominio gestiti annualmente con canoni contenuti e massima trasparenza.'
        },
        phases: [
          {
            phase: 'Fase 1 (Settimana 1)',
            timing: 'Settimana 1',
            description: 'Analisi dei contenuti aziendali, definizione dell\'alberatura di navigazione e stesura della bozza grafica dell\'Home Page.'
          },
          {
            phase: 'Fase 2 (Settimana 2)',
            timing: 'Settimana 2',
            description: 'Sviluppo completo delle pagine interne, inserimento testi, immagini fornite dal cliente e configurazione form interattivi.'
          },
          {
            phase: 'Fase 3 (Settimana 3)',
            timing: 'Settimana 3',
            description: 'Test prestazionali, configurazione SEO e GDPR, sessione formativa per l\'aggiornamento autonomo e messa online ufficiale.'
          }
        ],
        priceNet: 2400,
        taxRate: 22,
        milestones: [
          {
            title: '1. Acconto all\'avvio (50%)',
            percentage: 50,
            description: 'All\'accettazione del preventivo e avvio lavori grafici'
          },
          {
            title: '2. Saldo alla messa online (50%)',
            percentage: 50,
            description: 'A sito completato e testato, contestualmente alla pubblicazione sul dominio finale'
          }
        ],
        inclusions: [
          'Realizzazione completa del sito web fino a 7 pagine principali personalizzate.',
          'Piena autonomia di modifica testi e immagini attraverso WordPress.',
          'Configurazione Google Search Console e invio sitemap per indicizzazione rapida.',
          '2 ore di formazione pratica da remoto per il cliente o i suoi collaboratori.',
          '3 mesi di supporto tecnico e assistenza inclusi post-lancio.'
        ],
        exclusions: [
          'Redazione professionale di testi (copywriting da zero) qualora non forniti dal cliente.',
          'Servizi fotografici o videoriprese professionali in sede (quotabili su richiesta).'
        ]
      };

    case 'CLOUD_DEVOPS':
      return {
        workType: 'CLOUD_DEVOPS',
        subject: `Preventivo Consulenza Cloud & Architettura DevOps`,
        validityDays: 30,
        premiseIntro: `La presente proposta ha l'obiettivo di supportare ${targetName} nella transizione o ottimizzazione della propria infrastruttura IT verso un'architettura Cloud Native, garantendo sicurezza, scalabilità e contenimento dei costi fissi.`,
        currentProblems: [
          'Server sovradimensionati o instabili: Spese mensili fisse elevate a fronte di cali di prestazione durante i picchi di carico.',
          'Processi di deploy manuali e rischiosi: Rilasci software lenti esposti a errori umani e interruzioni di servizio (downtime).',
          'Vulnerabilità di sicurezza e backup non verificati: Mancanza di disaster recovery collaudato e monitoraggio continuo degli accessi.'
        ],
        solutionTitle: 'ARCHITETTURA CLOUD SCALABILE & AUTOMAZIONE CI/CD',
        solutionDescription: `Progettazione di un'infrastruttura Cloud moderna (AWS o Google Cloud) basata su container e pipeline di Continuous Integration & Continuous Deployment (CI/CD) completamente automatizzate.`,
        modules: [
          {
            title: 'Modulo 1: Audit Architetturale e Assessment',
            features: [
              {
                title: 'Analisi dei Carichi e dei Costi',
                description: 'Verifica dettagliata delle risorse utilizzate e individuazione degli sprechi per ridurre la fattura cloud fino al 40%.'
              },
              {
                title: 'Report di Vulnerabilità e Sicurezza',
                description: 'Ispezione delle policy IAM, crittografia dei dischi e configurazione delle reti virtuali (VPC/Firewall).'
              }
            ]
          },
          {
            title: 'Modulo 2: Containerizzazione e Pipeline CI/CD',
            features: [
              {
                title: 'Dockerizzazione dei Servizi',
                description: 'Creazione di immagini Docker ottimizzate e multi-stage per rendere le applicazioni portabili e isolate.'
              },
              {
                title: 'Automazione Deploy (GitHub Actions / GitLab CI)',
                description: 'Pipeline automatica che testa il codice e lo distribuisce in produzione senza interruzioni per l\'utente finale (Zero-Downtime).'
              }
            ]
          },
          {
            title: 'Modulo 3: Monitoraggio, Logging e Alerting',
            features: [
              {
                title: 'Dashboard di Controllo Infrastruttura',
                description: 'Monitoraggio centralizzato di CPU, Memoria, Latenza di rete e tassi di errore applicativi.'
              },
              {
                title: 'Allarmi Automatici Telegram/Email/Slack',
                description: 'Notifica immediata al team tecnico qualora un parametro superi i livelli di guardia.'
              }
            ]
          }
        ],
        techStack: {
          frontend: 'N/A (Infrastruttura di Backend e Servizi Cloud).',
          backendAndDb: 'Amazon Web Services (AWS) o Google Cloud Platform (GCP) con database gestiti e replica automatica.',
          hosting: 'Container orchestration (Docker Compose / ECS) e bilanciatori di carico con SSL gestito.',
          maintenanceCosts: 'Costi di infrastruttura a consumo reale pay-as-you-go, drasticamente ridotti grazie al dimensionamento corretto.'
        },
        phases: [
          {
            phase: 'Fase 1 (Settimana 1)',
            timing: 'Settimana 1',
            description: 'Audit infrastruttura esistente, mappatura dipendenze e stesura del piano di migrazione dettagliato.'
          },
          {
            phase: 'Fase 2 (Settimana 2)',
            timing: 'Settimana 2',
            description: 'Allestimento ambiente Cloud di staging, containerizzazione servizi e test pipeline CI/CD.'
          },
          {
            phase: 'Fase 3 (Settimana 3)',
            timing: 'Settimana 3',
            description: 'Migrazione dei dati, sincronizzazione in tempo reale e switch dei record DNS in produzione.'
          },
          {
            phase: 'Fase 4 (Settimana 4)',
            timing: 'Settimana 4',
            description: 'Attivazione monitoraggio continuo, collaudo disaster recovery e consegna documentazione operativa al team.'
          }
        ],
        priceNet: 3600,
        taxRate: 22,
        milestones: [
          {
            title: '1. Acconto all\'avvio (40%)',
            percentage: 40,
            description: 'All\'approvazione del piano di migrazione e avvio ambiente cloud'
          },
          {
            title: '2. Saldo a collaudo migrazione (60%)',
            percentage: 60,
            description: 'A migrazione avvenuta con successo e verifica dei servizi in produzione'
          }
        ],
        inclusions: [
          'Configurazione completa dell\'architettura cloud e delle pipeline di deploy automatico.',
          'Migrazione dei database e dei file con zero perdita di dati e minimo fermo programmato.',
          'Manuale operativo e schemi architetturali consegnati al cliente.',
          '30 giorni di reperibilità e affiancamento prioritario post-migrazione.'
        ],
        exclusions: [
          'Canoni di consumo mensile del provider cloud (AWS/GCP), fatturati direttamente dal fornitore a ${targetName}.'
        ]
      };

    case 'CUSTOM':
    default:
      return {
        workType: 'CUSTOM',
        subject: `Proposta Commerciale e Preventivo di Sviluppo`,
        validityDays: 30,
        premiseIntro: `La presente proposta ha l'obiettivo di definire i requisiti, le funzionalità e le modalità operative per la realizzazione del progetto commissionato da ${targetName}.`,
        currentProblems: [
          'Esigenza di modernizzazione e standardizzazione dei processi digitali.',
          'Necessità di ridurre i tempi operativi e minimizzare gli sprechi di risorse.',
          'Miglioramento dell\'esperienza utente e della sicurezza dei dati aziendali.'
        ],
        solutionTitle: 'SOLUZIONE DIGITALE SU MISURA HI-TECH',
        solutionDescription: `Progettazione e sviluppo di una soluzione tecnologica personalizzata, creata per integrarsi perfettamente nei flussi di lavoro dell'azienda con un'interfaccia moderna e scalabile.`,
        modules: [
          {
            title: 'Modulo 1: Sviluppo Funzionalità Core',
            features: [
              {
                title: 'Funzionalità Principali',
                description: 'Implementazione dei requisiti funzionali specificati nel documento di analisi preliminare.'
              }
            ]
          }
        ],
        techStack: {
          frontend: 'Tecnologie web moderne e reattive con interfaccia responsive per tutti i dispositivi.',
          backendAndDb: 'Infrastruttura cloud sicura e scalabile con database relazionale o NoSQL.',
          hosting: 'Hosting professionale ad alta velocità e sicurezza garantita.',
          maintenanceCosts: 'Dimensionamento ottimale per massimizzare il ritorno sull\'investimento.'
        },
        phases: [
          {
            phase: 'Fase 1 (Settimana 1)',
            timing: 'Settimana 1',
            description: 'Analisi dei requisiti, progettazione architetturale e mockup grafico.'
          },
          {
            phase: 'Fase 2 (Settimana 2)',
            timing: 'Settimana 2',
            description: 'Sviluppo dei moduli funzionali e integrazione dei servizi.'
          },
          {
            phase: 'Fase 3 (Settimana 3)',
            timing: 'Settimana 3',
            description: 'Collaudo con il cliente, correzione dettagli e messa in produzione.'
          }
        ],
        priceNet: 3000,
        taxRate: 22,
        milestones: [
          {
            title: '1. Acconto all\'avvio (50%)',
            percentage: 50,
            description: 'All\'accettazione del preventivo'
          },
          {
            title: '2. Saldo al collaudo (50%)',
            percentage: 50,
            description: 'A conclusione del progetto previa verifica del cliente'
          }
        ],
        inclusions: [
          'Sviluppo completo secondo le specifiche concordate.',
          'Collaudo e garanzia di corretto funzionamento.',
          'Formazione iniziale all\'utilizzo del sistema.'
        ],
        exclusions: [
          'Eventuali licenze di software terzi o servizi a consumo esterno.'
        ]
      };
  }
}
