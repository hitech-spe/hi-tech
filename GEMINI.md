# GEMINI.md - Contesto di Istruzione per Hi-Tech Solutions

Benvenuto nella codebase frontend di Hi-Tech Solutions! Questo documento funge da manuale di istruzioni fondamentale e mappa architetturale per lo sviluppo all'interno di questo spazio di lavoro.

---

## 1. Panoramica del Progetto

**Hi-Tech Solutions** è una single-page application (SPA) moderna e ad alte prestazioni che offre servizi di consulenza IT aziendale, sviluppo software e mobile, consulenza cloud e integrazioni CMS/WordPress personalizzate. Presenta un design premium con tema scuro responsive, supporto multi-lingua e un avanzato simulatore di preventivi guidato dall'intelligenza artificiale.

### Tecnologie Principali
- **Framework:** Angular 22 (v22.0.6)
- **Architettura:** Architettura a Componenti Standalone (senza dichiarazioni NgModule)
- **Database e Auth:** Integrazione Firebase & Firestore tramite `@angular/fire` (v21.0.0-rc.0) e Firebase JS SDK (v12.12.0)
- **Internazionalizzazione (i18n):** `@ngx-translate/core` con caricatore di asset HTTP
- **Integrazione IA:** API OpenRouter (utilizzando `google/gemini-2.0-flash-001` tramite formato di risposta JSON)
- **Esportazione PDF:** `jsPDF` e `jspdf-autotable`
- **Notifiche Email:** `@emailjs/browser` per l'invio di email ai clienti

---

## 2. Struttura delle Directory e File Chiave

Le parti principali della struttura delle directory sono organizzate come segue:

```
src/
├── main.ts                       # Punto di ingresso, effettua il bootstrap di AppComponent con appConfig
├── styles.scss                   # Stili globali, variabili CSS personalizzate e classi di utilità UI
├── assets/
│   ├── i18n/                     # File di traduzione (it.json ed en.json)
│   └── images/                   # Loghi statici e risorse grafiche
└── app/
    ├── app.component.*           # Componente radice principale (con splash screen personalizzata a dissolvenza)
    ├── app.config.ts             # Configurazione dell'applicazione (routing funzionale, provider firebase, i18n)
    ├── app.routes.ts             # Percorsi di routing e guardie (guards)
    ├── components/               # Pagine e viste personalizzate (Standalone)
    │   ├── home/                 # Area di atterraggio principale con evidenze dei servizi interattivi
    │   ├── about/                # Presentazione aziendale e storia
    │   ├── services/             # Elenco generale dei servizi offerti
    │   ├── service-detail/       # Vista dettagliata e dinamica di specifici servizi aziendali
    │   ├── contact/              # Modulo di contatto email interattivo
    │   ├── quote-simulator/      # Schermata del simulatore di preventivi IA con input interattivi
    │   ├── quotes/               # Dashboard amministratore per gestire i preventivi dei clienti (Protetta)
    │   └── login/                # Semplice pagina di accesso e registrazione con email/password
    ├── guards/
    │   └── auth.guard.ts         # Guardia CanActivateFn funzionale per proteggere la dashboard
    └── services/
        ├── ai.service.ts         # Gestisce la connessione a OpenRouter e il fallback di simulazione lato client
        ├── auth.service.ts       # Gestisce l'accesso e la registrazione tramite Firebase Auth
        ├── firestore.service.ts  # Esegue query su Firestore (Preventivi, Clienti, Utenti)
        ├── loading.service.ts    # Servizio per mostrare schermate/stati di caricamento personalizzati
        └── news.service.ts       # Fornisce articoli e approfondimenti di settore
```

---

## 3. Compilazione e Avvio

Assicurati di avere installato Node.js e l'interfaccia a riga di comando di Angular (Angular CLI), quindi utilizza i seguenti script NPM per le operazioni comuni:

| Azione | Comando | Scopo |
|---|---|---|
| **Avvia Server di Sviluppo** | `npm start` | Avvia un server di sviluppo con ricaricamento in tempo reale (live-reload) all'indirizzo `http://localhost:4200/`. |
| **Compilazione di Produzione**| `npm run build` | Compila un bundle ottimizzato pronto per la produzione nella directory `dist/`. |
| **Monitoraggio Sviluppo**    | `npm run watch` | Compila e monitora continuamente le modifiche di sviluppo. |
| **Esegui Test Unitari**      | `npm test` | Avvia i test unitari in modalità ultra-rapida tramite il test runner Vitest. |

---

## 4. Regole Architetturali e Convenzioni

Per mantenere la coerenza e standard tecnici elevati, tutte le nuove modifiche devono aderire rigorosamente a questi principi di progettazione:

### A. Componenti Standalone
* Tutti i componenti devono utilizzare `standalone: true`.
* **NON** utilizzare moduli per dichiarare i componenti. Dichiara invece le dipendenze direttamente nell'array `imports` del decoratore `@Component` (come `TranslateModule`, `FormsModule`, `NgClass`, `RouterLink`, ecc.).

### B. Pattern Funzionali Moderni
* Utilizza **guardie di rotta funzionali** (`CanActivateFn`) anziché guardie basate su classi. Mantieni le dipendenze iniettate dinamicamente utilizzando il metodo funzionale di Angular `inject()`.
* Mantieni una configurazione pulita in `app.config.ts` utilizzando provider funzionali (`provideRouter`, `provideHttpClient`, `provideFirebaseApp`, `provideAuth`, `provideFirestore`).

### C. Stile e Interfaccia Utente (CSS / SCSS)
* **Variabili CSS:** Utilizza rigorosamente le proprietà CSS globali dichiarate su `:root` in `styles.scss` (es. `var(--primary)`, `var(--secondary)`, `var(--dark)`). Non introdurre mai codici esadecimali (HEX) hardcoded all'interno dei file SCSS dei componenti, tranne che per mock temporanei isolati.
* **Estetica Premium del Tema:** Aderisci al tema scuro, futuristico e responsive. Riutilizza lo stile glassmorphic (classe `glass-card`) e le animazioni interattive personalizzate (classi `scroll-reveal` e `.is-visible` con `IntersectionObserver`).
* **Responsività:** Mantieni la piena compatibilità fino a una larghezza del viewport di 320px (approccio responsive Mobile-First).

### D. Integrazione Resiliente dell'IA
* **Protezione delle API:** Le funzionalità IA dovrebbero essere orchestrate tramite un proxy sicuro (es. backend o edge functions) in produzione.
* **Strategia di Fallback:** Quando modifichi `AiService`, mantieni sempre un robusto **fallback di simulazione lato client** all'interno di `simulateAiResponse()`. In caso di guasti alla rete, chiavi API non valide o limiti di frequenza superati da OpenRouter, l'app deve degradare gradualmente e restituire un preventivo simulato senza interrompere l'esperienza utente.

### E. Internazionalizzazione (i18n)
* L'applicazione supports l'inglese (`en`) e l'italiano (`it`), con l'italiano come lingua predefinita.
* **Non inserire mai testi visibili all'utente in modo hardcoded** all'interno dei template dei componenti o dei file TS. Definiscili invece in `assets/i18n/it.json` e `assets/i18n/en.json` e renderizzali utilizzando la pipe `translate` o il servizio `TranslateService`.

### F. Linee Guida per i Test
* I test unitari devono rimanere coerenti con i Componenti Standalone. Quando compili i componenti in `TestBed.configureTestingModule`, inserisci il componente Standalone all'interno dell'array `imports` (anziché nell'array `declarations`) per evitare errori di configurazione.

---

## 5. Ottimizzazione SEO (Search Engine Optimization)

L'applicazione segue le migliori pratiche SEO moderne per garantire un'eccellente visibilità sui motori di ricerca e una condivisione ottimale sui canali social:

### A. Meta Tag Statici e Social Graph (`src/index.html`)
* **Meta Description e Keywords:** Forniscono una descrizione chiara e parole chiave mirate relative alla Software House (sviluppo App, piattaforme B2B, consulenza Cloud) per massimizzare la rilevanza e ottimizzare lo snippet nei risultati di ricerca.
* **Open Graph (Facebook, LinkedIn) e Twitter Cards:** Configurazione dettagliata per controllare la visualizzazione dei link condivisi sui social network, specificando titolo, descrizione, URL canonico e immagine di anteprima ottimizzata (`logo-trasp.png`).
* **Link Canonical:** Previene problemi legati ai contenuti duplicati impostando come URL canonico principale e assoluto `https://hitechsrls.com/`.

### B. Gestione Sitemap e Robots (`sitemap.xml`, `robots.txt`)
* Il file `sitemap.xml` mappa accuratamente tutte le rotte prioritarie del sito, inclusi i link diretti per ciascun servizio aziendale specifico, definendone la priorità relativa di scansione.
* Il file `robots.txt` concede libero accesso a tutti i motori di ricerca e include il riferimento assoluto e diretto al file `sitemap.xml` per facilitare il lavoro dei web crawler.

### C. Routing SPA e Redirects per il Deploy (`_redirects`)
* Poiché si tratta di un'applicazione Angular Single Page App (SPA), per garantire che i motori di ricerca non riscontrino errori 404 durante l'indicizzazione dei percorsi profondi (deep routing come `/services` o `/about`), è configurato un file `_redirects` (`/* /index.html 200`). Questo istruisce la CDN (es. Netlify) a servire sempre `index.html` con codice di stato 200 per qualsiasi rotta, lasciando la gestione del routing interno interamente ad Angular.

### D. Prestazioni, Core Web Vitals e Funzionalità Mobile/PWA
Le performance di caricamento e la stabilità visiva costituiscono fattori cruciali per l'esperienza utente mobile/web e per il posizionamento SEO algoritmico moderno. Abbiamo implementato:
* **Route Lazy Loading con Precaricamento in Background:** Tutte le rotte in `app.routes.ts` sono caricate pigramente (`loadComponent`), il che riduce drasticamente la dimensione del bundle JS iniziale caricato all'avvio. Per garantire transizioni di pagina istantanee e impercettibili, abbiamo integrato la strategia `PreloadAllModules` in `app.config.ts`, che scarica i chunk delle altre rotte in background non appena l'app diventa inattiva (idle).
* **Integrazione PWA (Progressive Web App):** Configurato un Web App Manifest completo (`src/assets/manifest.json`) e registrato un Service Worker personalizzato (`src/assets/sw.js`) per supportare il caching della "shell" dell'applicazione, offrendo caricamento ultra-rapido su visite ripetute e un'esperienza offline resiliente.
* **Ottimizzazione CLS (Cumulative Layout Shift):** Tutte le immagini illustrative principali delle righe dei servizi nel componente `ServicesComponent` dispongono di attributi espliciti di `width` e `height` (rapporto 3:2), eliminando i fastidiosi scatti di layout (layout shifts) durante il caricamento della pagina e massimizzando il punteggio Core Web Vitals.
* **Pre-caricamento Critico (preload) e Preconnessione DNS:**
  * Applicato il pre-caricamento all'immagine del logo principale, ai file delle traduzioni essenziali (`it.json`) e ai fogli di stile tipografici.
  * Connessione preventiva (`preconnect`) configurata sia per i server dei font Google che per `https://images.unsplash.com` per ridurre la latenza del handshake di rete durante il caricamento di risorse ed immagini dinamiche.
* **Velocità Splash Screen Ottimizzata:** Ridotto l'artificio del tempo di attesa della splash screen da 1.8s a 800ms in `AppComponent` per rendere l'interazione iniziale quasi istantanea pur mantenendo l'elegante dissolvenza del brand.
* **SEO Dinamico per Pagine Legali:** Mappate le pagine `/privacy-policy` e `/terms-and-conditions` all'interno di `updateSeoTags()` per garantire metadati, descrizioni e titoli localizzati e unici per ciascuna pagina legale (risolvendo i problemi di contenuti duplicati).

---

*Esamina sempre le implementazioni dei servizi esistenti (come `firestore.service.ts` e `auth.service.ts`) prima di estendere le funzionalità del database, per mantenere lo stesso stile pulito basato su RxJS/Promise.*
