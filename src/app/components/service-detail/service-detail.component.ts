import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import {UpperCasePipe, isPlatformBrowser, Location, DOCUMENT} from "@angular/common";

export interface ServiceSection {
  title: string;
  content: string;
  points?: string[];
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  fullContent: string;
  sections?: ServiceSection[];
  faqs?: ServiceFaq[];
  technologies?: string[];
  translations?: {
    [locale: string]: {
      title: string;
      description: string;
      features: string[];
      fullContent: string;
      sections?: ServiceSection[];
      faqs?: ServiceFaq[];
      technologies?: string[];
    }
  };
}

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  imports: [
    RouterLink,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  service: Service | undefined;
  private langChangeSub: Subscription | undefined;

  private services: Service[] = [
    {
      id: 'sviluppo-piattaforme-web-b2b',
      title: 'Sviluppo Piattaforme Web B2B',
      description: 'Applicazioni web enterprise moderne, scalabili, resilienti e ottimizzate per processi aziendali complessi.',
      features: ['Framework Moderni (Angular, React)', 'Architetture a Microservizi Java/Spring & Node.js', 'Infrastruttura Cloud Native & API REST/GraphQL', 'Sicurezza Enterprise & Performance Optimization'],
      fullContent: 'Progettiamo e sviluppiamo piattaforme web B2B su misura capaci di digitalizzare e ottimizzare i processi operativi aziendali. Realizziamo portali per clienti e fornitori, dashboard di business intelligence e gestionali web evoluti, integrabili perfettamente con i sistemi informativi esistenti (ERP, CRM) per garantire efficienza, tracciabilità e una user experience fluida.',
      technologies: ['Angular', 'React', 'Java & Spring Boot', 'Node.js & TypeScript', 'PostgreSQL', 'Docker', 'REST & GraphQL APIs', 'Tailwind/SCSS'],
      sections: [
        {
          title: 'Architetture a Microservizi e Integrazione API',
          content: 'Sviluppiamo backend modulari a microservizi basati su Spring Boot e Node.js, collegati tramite API RESTful e GraphQL per scambiare dati in modo rapido, sicuro e standardizzato con i tuoi sistemi aziendali legacy o terze parti.'
        },
        {
          title: 'UI/UX Design per Ambienti Produttivi Complessi',
          content: 'L\'efficienza operativa dipende dalla facilità d\'uso: progettiamo interfacce utente chiare, veloci ed ergonomiche, pensate per accelerare i flussi di lavoro quotidiani degli operatori e ridurre drasticamente il margine di errore.'
        },
        {
          title: 'Sicurezza Enterprise e Compliance Dati',
          content: 'Implementiamo protocolli avanzati di autenticazione e autorizzazione (OAuth 2.0, OpenID Connect, RBAC), crittografia dei dati sensibili e audit trail dettagliati per rispettare le normative GDPR e gli standard di settore.'
        }
      ],
      faqs: [
        {
          question: 'La piattaforma può integrarsi con il nostro gestionale aziendale (ERP o CRM)?',
          answer: 'Certamente. Sviluppiamo connettori e integrazioni API bidirezionali con i principali gestionali di mercato (SAP, Zucchetti, Salesforce, Microsoft Dynamics) o database proprietari, garantendo la sincronizzazione dei dati in tempo reale.'
        },
        {
          question: 'In che modo garantite la scalabilità dell\'applicazione con l\'aumento degli utenti?',
          answer: 'Grazie all\'architettura Cloud Native a microservizi e container Docker, la piattaforma può scalare orizzontalmente in modo automatico su più server cloud, sostenendo carichi di lavoro intensi senza cali di prestazioni.'
        }
      ],
      translations: {
        en: {
          title: 'B2B Web Platform Development',
          description: 'Modern, scalable, resilient web applications optimized for complex enterprise business processes.',
          features: ['Modern Frameworks (Angular, React)', 'Microservices in Java/Spring & Node.js', 'Cloud Native & REST/GraphQL APIs', 'Enterprise Security & Performance Optimization'],
          fullContent: 'We design and develop custom B2B web platforms capable of digitalizing and streamlining core corporate operations. We build client/supplier portals, business intelligence dashboards, and management platforms that seamlessly integrate with your existing ERP/CRM systems, delivering efficiency, traceability, and a first-class user experience.',
          technologies: ['Angular', 'React', 'Java & Spring Boot', 'Node.js & TypeScript', 'PostgreSQL', 'Docker', 'REST & GraphQL APIs', 'Tailwind/SCSS'],
          sections: [
            {
              title: 'Microservices Architectures & API Integration',
              content: 'We build modular microservices backends using Spring Boot and Node.js, interconnected via RESTful and GraphQL APIs to exchange data rapidly and securely with legacy systems or third-party tools.'
            },
            {
              title: 'UI/UX Design for Complex Workflows',
              content: 'Operational efficiency relies on ease of use: we design intuitive, ergonomic web interfaces crafted to streamline daily workflows and significantly reduce human error.'
            },
            {
              title: 'Enterprise Security & Compliance',
              content: 'We enforce robust authentication and authorization protocols (OAuth 2.0, OpenID Connect, RBAC), end-to-end data encryption, and audit logs to comply with GDPR and industry standards.'
            }
          ],
          faqs: [
            {
              question: 'Can the platform integrate with our existing ERP or CRM software?',
              answer: 'Absolutely. We develop custom bidirectional API connectors for leading ERPs (SAP, Salesforce, Microsoft Dynamics) as well as proprietary databases, ensuring seamless real-time data sync.'
            },
            {
              question: 'How do you ensure application scalability as users grow?',
              answer: 'Through Cloud Native microservices and Docker containers, the platform automatically scales horizontally across cloud nodes to support heavy traffic peaks without performance degradation.'
            }
          ]
        }
      }
    },
    {
      id: 'sviluppo-app-mobile-native',
      title: 'Sviluppo App Mobile Native & Cross-Platform',
      description: 'Applicazioni mobile iOS e Android ad alte prestazioni, fluide, sicure e connesse all\'ecosistema aziendale.',
      features: ['Sviluppo Flutter & Dart Cross-Platform', 'Integrazione IoT & Sensori Industriali 4.0', 'Esperienza Utente UX/UI Mobile-First', 'Pubblicazione & Manutenzione Continua sugli Store'],
      fullContent: 'Creiamo applicazioni mobile native e cross-platform ad alte performance che mettono la potenza del vostro business nelle mani di collaboratori e clienti. Specializzati in soluzioni per l\'Industria 4.0, logistica e mobile commerce, integriamo sensori hardware, telemetria in tempo reale, funzionamento offline e notifiche push intelligenti per garantire la massima produttività sul campo.',
      technologies: ['Flutter & Dart', 'iOS (Swift)', 'Android (Kotlin)', 'Firebase', 'Bluetooth Low Energy (BLE)', 'SQLite/Room', 'REST APIs', 'App Store & Google Play'],
      sections: [
        {
          title: 'Single Codebase ad Alte Prestazioni con Flutter',
          content: 'Sviluppiamo con Flutter per coprire sia iOS che Android con una sola base di codice di altissimo livello qualitativo, garantendo rendering grafico a 60/120 fps, dimezzando i tempi di time-to-market e riducendo i costi di manutenzione futura.'
        },
        {
          title: 'Funzionamento Offline e Sincronizzazione Dati',
          content: 'Le app per contesti operativi devono funzionare ovunque. Implementiamo database locali protetti e logiche di sincronizzazione bidirezionale intelligente in background non appena la connettività di rete viene ripristinata.'
        },
        {
          title: 'Integrazione Hardware, Sensori e Barcode Scanner',
          content: 'Sfruttiamo le API hardware del dispositivo per interagire con lettori ottici, barcode/QR scanner industriali, antenne RFID, dispositivi BLE e coordinate GPS ad alta precisione.'
        }
      ],
      faqs: [
        {
          question: 'È meglio scegliere un\'app nativa pura o una soluzione cross-platform in Flutter?',
          answer: 'Flutter rappresenta oggi lo standard ideale per la stragrande maggioranza dei progetti: compila direttamente in codice macchina nativo ARM, offre prestazioni indistinguibili da un\'app nativa pura e garantisce risparmi sostanziali nello sviluppo parallelo per iOS e Android.'
        },
        {
          question: 'Vi occupate anche delle pratiche di approvazione sugli Store (Apple e Google)?',
          answer: 'Sì, gestiamo l\'intero processo di pubblicazione: configurazione degli account sviluppatore, firma digitale dei pacchetti, conformità alle linee guida e ottimizzazione delle schede (App Store Optimization - ASO).'
        }
      ],
      translations: {
        en: {
          title: 'Native & Cross-Platform Mobile App Development',
          description: 'High-performance, fluid, secure iOS and Android mobile apps connected to your business ecosystem.',
          features: ['Flutter & Dart Cross-Platform Development', 'IoT & Industry 4.0 Hardware Integration', 'Mobile-First UX/UI Design', 'Store Publishing & Ongoing Maintenance'],
          fullContent: 'We engineer high-performance native and cross-platform mobile apps that put the power of your business directly into the hands of your workforce and customers. Specializing in Industry 4.0, logistics, and mobile commerce, we integrate hardware sensors, real-time telemetry, offline operation, and intelligent push notifications for maximum productivity.',
          technologies: ['Flutter & Dart', 'iOS (Swift)', 'Android (Kotlin)', 'Firebase', 'Bluetooth Low Energy (BLE)', 'SQLite/Room', 'REST APIs', 'App Store & Google Play'],
          sections: [
            {
              title: 'High-Performance Single Codebase with Flutter',
              content: 'We use Flutter to target both iOS and Android from a single codebase, delivering 60/120 fps animations, halving time-to-market, and significantly lowering long-term maintenance costs.'
            },
            {
              title: 'Offline-First Operation & Smart Sync',
              content: 'Field apps must stay reliable anywhere. We implement secure local storage and background synchronization that kicks in automatically once internet connectivity is restored.'
            },
            {
              title: 'Hardware, Sensor & Barcode Scanner Integration',
              content: 'We leverage native hardware APIs to integrate optical readers, industrial barcode/QR scanners, RFID antennas, BLE beacons, and high-accuracy GPS positioning.'
            }
          ],
          faqs: [
            {
              question: 'Is it better to build purely native or cross-platform with Flutter?',
              answer: 'Flutter is the gold standard for most enterprise apps today: it compiles directly to native ARM machine code, delivers identical native performance, and saves substantial budget by maintaining a single codebase.'
            },
            {
              question: 'Do you manage the approval and publishing on App Store and Google Play?',
              answer: 'Yes, we handle the complete lifecycle: developer accounts, cryptographic code signing, store compliance reviews, and App Store Optimization (ASO).'
            }
          ]
        }
      }
    },
    {
      id: 'consulenza-cloud-aziendale',
      title: 'Consulenza Cloud Aziendale & Cloud Native Solutions',
      description: 'Migrazione strategica, architetture Cloud Native, orchestrazione Kubernetes e ottimizzazione dei costi FinOps su AWS, Azure e Google Cloud.',
      features: [
        'Cloud Migration & Assessment (AWS, Azure, GCP)',
        'Orchestrazione Microservizi con Kubernetes & Docker',
        'Automazione DevOps & Pipeline CI/CD (GitHub Actions, GitLab)',
        'FinOps & Riduzione Costi Infrastruttura Cloud (25%-45%)',
        'Sicurezza Avanzata Zero-Trust & Disaster Recovery Multi-Regione',
        'Monitoraggio Proattivo 24/7 & Telemetria (Prometheus & Grafana)'
      ],
      fullContent: 'Accompagniamo medie e grandi imprese nella transizione strategica verso il Cloud Computing, eliminando i vincoli dell\'hardware obsoleto on-premise e garantendo architetture ad alta affidabilità. Progettiamo ambienti ibridi, multi-cloud e serverless studiati per offrire scalabilità dinamica, massima sicurezza operativa e piena conformità alle normative europee (GDPR e ISO 27001). Grazie a un approccio orientato all\'ingegneria del software moderna, trasformiamo l\'infrastruttura IT da centro di costo a vero acceleratore di business.',
      technologies: [
        'Amazon Web Services (AWS)',
        'Microsoft Azure',
        'Google Cloud Platform (GCP)',
        'Kubernetes & Docker',
        'Terraform & Ansible (IaC)',
        'CI/CD (GitLab, GitHub Actions)',
        'Prometheus & Grafana',
        'ArgoCD & Helm'
      ],
      sections: [
        {
          title: 'Assessment Infrastrutturale & Roadmap di Migrazione',
          content: 'Ogni progetto comincia con un audit approfondito dello stack tecnologico aziendale, dei database e delle dipendenze applicative. Definiamo la strategia di migrazione più idonea (Rehost, Replatform o Refactor Cloud-Native), stabilendo Proof of Concept (PoC) e pianificazioni dettagliate per azzerare i tempi di fermo produttivo (zero downtime).'
        },
        {
          title: 'Architetture a Microservizi e Orchestrazione Kubernetes',
          content: 'Modernizziamo le applicazioni monolitiche trasformandole in architetture a microservizi scalabili e containerizzate. Gestiamo cluster Kubernetes su AWS (EKS), Azure (AKS) e GCP (GKE), configurando bilanciatori di carico intelligenti, service mesh e auto-scaling orizzontale automatico per sostenere picchi imprevisti di traffico.'
        },
        {
          title: 'Infrastructure as Code (IaC) e Automazione DevOps',
          content: 'Trattiamo l\'infrastruttura esattamente come il software: versionata, testata e riproducibile tramite Terraform e Ansible. Integrando pipeline CI/CD automatizzate, riduciamo i tempi di deploy da settimane a minuti, eliminando gli errori di configurazione manuale e consentendo rilasci continui e sicuri in produzione.'
        },
        {
          title: 'FinOps: Controllo Intelligente e Riduzione Costi Cloud',
          content: 'Senza una governance mirata, i costi delle risorse cloud possono crescere in modo incontrollato. Applichiamo metodologie FinOps certificate per monitorare la spesa in tempo reale, eliminare l\'over-provisioning, negoziare Savings Plans/Reserved Instances e implementare spegnimenti pianificati degli ambienti non produttivi, ottenendo risparmi compresi tra il 25% e il 45%.'
        }
      ],
      faqs: [
        {
          question: 'Quali sono le prime fasi per avviare una migrazione al Cloud?',
          answer: 'Il processo ha inizio con il Cloud Readiness Assessment: analizziamo le applicazioni esistenti, i flussi di dati, i requisiti di latenza e le normative di conformità. Segue la creazione di un piano di migrazione a fasi con ambienti pilota di test, garantendo che il passaggio definitivo avvenga in sicurezza e senza interruzioni di servizio.'
        },
        {
          question: 'Come garantite la sicurezza e la conformità GDPR dei dati sul Cloud?',
          answer: 'Configuriamo architetture conformi alle direttive europee con crittografia end-to-end (sia per i dati a riposo che in transito), gestione granulare dei permessi (IAM con principio di minimo privilegio), audit log centralizzati e piani di Disaster Recovery e backup geografico per garantire la sovranità e l\'integrità dei dati.'
        },
        {
          question: 'Quale provider Cloud scegliere tra AWS, Azure e Google Cloud Platform?',
          answer: 'La scelta dipende dalle specificità aziendali: Azure è particolarmente indicata per realtà con forte integrazione nell\'ecosistema Microsoft; AWS offre il catalogo di servizi gestiti più vasto al mondo; GCP eccelle nel data analytics, intelligenza artificiale e Kubernetes. Possiamo anche strutturare una strategia Multi-Cloud per evitare il vendor lock-in.'
        },
        {
          question: 'Come si evitano interruzioni di servizio (downtime) durante il passaggio?',
          answer: 'Adottiamo strategie di rilascio progressive, come il Blue/Green Deployment o il Canary Deployment, affiancate da repliche asincrone e sincronizzazioni in tempo reale dei database. Il traffico reale degli utenti viene spostato sul Cloud solo quando il nuovo ambiente è stato interamente validato e collaudato.'
        },
        {
          question: 'Offrite supporto continuativo e monitoraggio post-migrazione?',
          answer: 'Assolutamente sì. Forniamo servizi di Managed Cloud Operations: monitoraggio proattivo H24/7 con allarmi tempestivi, applicazione costante delle patch di sicurezza, ottimizzazione ciclica dei costi (FinOps) e supporto tecnico sistemistico specializzato per ogni esigenza.'
        }
      ],
      translations: {
        en: {
          title: 'Enterprise Cloud Consulting & Cloud Native Solutions',
          description: 'Secure migration, Cloud Native architectures, Kubernetes orchestration, and FinOps cost optimization across AWS, Azure, and Google Cloud.',
          features: [
            'Cloud Migration & Assessment (AWS, Azure, GCP)',
            'Microservices Orchestration with Kubernetes & Docker',
            'DevOps Automation & CI/CD Pipelines (GitHub Actions, GitLab)',
            'FinOps & Cloud Infrastructure Cost Reduction (25%-45%)',
            'Zero-Trust Security & Multi-Region Disaster Recovery',
            '24/7 Proactive Monitoring & Telemetry (Prometheus & Grafana)'
          ],
          fullContent: 'We guide medium and enterprise businesses through strategic transitions to Cloud Computing, eliminating constraints of legacy on-premise hardware and delivering high-availability architectures. We engineer hybrid, multi-cloud, and serverless environments designed for dynamic scalability, robust security, and full compliance with European regulations (GDPR and ISO 27001). Utilizing modern software engineering practices, we turn IT infrastructure from a cost center into a core business accelerator.',
          technologies: [
            'Amazon Web Services (AWS)',
            'Microsoft Azure',
            'Google Cloud Platform (GCP)',
            'Kubernetes & Docker',
            'Terraform & Ansible (IaC)',
            'CI/CD (GitLab, GitHub Actions)',
            'Prometheus & Grafana',
            'ArgoCD & Helm'
          ],
          sections: [
            {
              title: 'Infrastructure Assessment & Migration Roadmap',
              content: 'Every project begins with a deep audit of your current tech stack, databases, and application dependencies. We define the optimal migration pathway (Rehost, Replatform, or Refactor Cloud-Native), establishing Proof of Concepts (PoC) and rigorous planning to guarantee zero downtime.'
            },
            {
              title: 'Microservices Architectures & Kubernetes Orchestration',
              content: 'We modernize legacy monolithic applications into scalable, containerized microservices. Managing production Kubernetes clusters across AWS (EKS), Azure (AKS), and GCP (GKE), we configure intelligent load balancing, service meshes, and automated horizontal scaling to handle unexpected traffic spikes effortlessly.'
            },
            {
              title: 'Infrastructure as Code (IaC) & DevOps Automation',
              content: 'We treat infrastructure just like software: versioned, tested, and fully reproducible through Terraform and Ansible. By integrating automated CI/CD pipelines, deployment times shrink from weeks to minutes while human error is eliminated, enabling safe and continuous delivery.'
            },
            {
              title: 'FinOps: Intelligent Cost Control & Optimization',
              content: 'Unmonitored cloud resources quickly lead to runaway expenses. We apply certified FinOps methodologies to monitor spending in real time, eliminate over-provisioning, configure Reserved Instances/Savings Plans, and automate shutdown schedules for staging environments, saving 25% to 45% on average.'
            }
          ],
          faqs: [
            {
              question: 'What are the first steps to initiate a Cloud migration?',
              answer: 'We start with a comprehensive Cloud Readiness Assessment: auditing existing applications, data flows, latency requirements, and compliance. We then design a phased migration roadmap with pilot test environments, guaranteeing safe and seamless cutover.'
            },
            {
              question: 'How do you guarantee data security and GDPR compliance in the Cloud?',
              answer: 'We architect environments adhering to European standards with end-to-end encryption (both at rest and in transit), least-privilege IAM policies, centralized audit logs, and geographic disaster recovery backups to guarantee data sovereignty and business continuity.'
            },
            {
              question: 'Which cloud provider should we choose: AWS, Azure, or GCP?',
              answer: 'The choice depends on your business goals: Azure is ideal for enterprises heavily integrated with Microsoft tools; AWS provides the broadest portfolio of managed cloud services globally; GCP excels in AI, data analytics, and native Kubernetes. We can also build a Multi-Cloud strategy to prevent vendor lock-in.'
            },
            {
              question: 'How do you avoid service downtime during migration?',
              answer: 'We employ progressive deployment patterns such as Blue/Green or Canary releases, combined with real-time database replication. Production traffic is only switched over once the cloud environment has been thoroughly load-tested and validated.'
            },
            {
              question: 'Do you offer ongoing post-migration management and support?',
              answer: 'Yes, we provide 24/7 Managed Cloud Operations: proactive telemetry and alerting, continuous security patching, recurring FinOps reviews, and dedicated senior sysadmin support.'
            }
          ]
        }
      }
    },
    {
      id: 'web',
      title: 'Sviluppo Web',
      description: 'Applicazioni web moderne, scalabili e ad alte prestazioni.',
      features: ['Angular/React/Vue.js', 'Microservizi Java/Spring Backend', 'Cloud Native', 'SEO Optimized'],
      fullContent: 'Progettiamo e sviluppiamo architetture web all\'avanguardia, focalizzandoci sulla user experience e sulle performance. Utilizziamo i framework più moderni per garantire prodotti sicuri, veloci e pronti a scalare con il tuo business.',
      translations: {
        en: {
          title: 'Web Development',
          description: 'Modern, scalable, and high-performance web applications.',
          features: ['Angular/React/Vue.js', 'Java/Spring Microservices Backend', 'Cloud Native', 'SEO Optimized'],
          fullContent: 'We design and develop cutting-edge web architectures, focusing on user experience and performance. We use the most modern frameworks to ensure safe, fast products ready to scale with your business.'
        }
      }
    },
    {
      id: 'mobile',
      title: 'Sviluppo App Mobile',
      description: 'Esperienze mobile native e cross-platform d\'eccellenza.',
      features: ['Flutter', 'iOS & Android', 'UX/UI Design', 'App Store Optimization'],
      fullContent: 'Le nostre app mobile sono progettate per offrire prestazioni fluide e interfacce intuitive. Che si tratti di un\'app nativa o cross-platform, garantiamo un codice di alta qualità e una manutenzione semplificata.',
      translations: {
        en: {
          title: 'Mobile App Development',
          description: 'Excellent native and cross-platform mobile experiences.',
          features: ['Flutter', 'iOS & Android', 'UX/UI Design', 'App Store Optimization'],
          fullContent: 'Our mobile apps are designed to offer smooth performance and intuitive interfaces. Whether it is a native or cross-platform app, we guarantee high-quality code and simplified maintenance.'
        }
      }
    },
    {
      id: "cloud",
      title: "Consulenza Cloud",
      description: "Infrastrutture cloud sicure, resilienti e ottimizzate.",
      features: ["AWS & Azure", "Kubernetes", "DevOps Automation", "Security Audits"],
      fullContent: "Accompagniamo le aziende nella migrazione verso il cloud, ottimizzando i costi e migliorando l'affidabilità dei sistemi. Implementiamo pipeline di CI/CD e monitoraggio continuo per una gestione senza stress.",
      translations: {
        en: {
          title: "Cloud Consulting",
          description: "Secure, resilient, and optimized cloud infrastructures.",
          features: ["AWS & Azure", "Kubernetes", "DevOps Automation", "Security Audits"],
          fullContent: "We accompany companies in the migration towards the cloud, optimizing costs and improving the reliability of systems. We implement CI/CD pipelines and continuous monitoring for stress-free management."
        }
      }
    },
    {
      id: "social",
      title: "Social Media Manager",
      description: "Gestione professionale dei canali social per brand awareness e lead generation.",
      features: ["Content Strategy", "Advertising (Meta/LinkedIn)", "Community Management", "Data Analysis"],
      fullContent: "Analizziamo il tuo target e creiamo una strategia di contenuti su misura per aumentare il coinvolgimento della tua community. Gestiamo le campagne pubblicitarie per massimizzare il ritorno sull'investimento e rafforzare la tua presenza digitale.",
      translations: {
        en: {
          title: "Social Media Manager",
          description: "Professional social media management for brand awareness and lead generation.",
          features: ["Content Strategy", "Advertising (Meta/LinkedIn)", "Community Management", "Data Analysis"],
          fullContent: "We analyze your target and create a custom content strategy to increase community engagement. We manage advertising campaigns to maximize return on investment and strengthen your digital presence."
        }
      }
    },
    {
      id: "graphic",
      title: "Grafica & Design",
      description: "Design creativo per comunicare l'identità del tuo brand in modo efficace.",
      features: ["Brand Identity", "Logo Design", "UI/UX Prototyping", "Marketing Materials"],
      fullContent: "Trasformiamo i valori della tua azienda in elementi visivi distintivi. Dalla creazione del logo alla progettazione di interfacce utente intuitive, curiamo ogni dettaglio per garantire una comunicazione visiva coerente e professionale su tutti i canali.",
      translations: {
        en: {
          title: "Graphic & Design",
          description: "Creative design to communicate your brand identity effectively.",
          features: ["Brand Identity", "Logo Design", "UI/UX Prototyping", "Marketing Materials"],
          fullContent: "We transform your company values into distinctive visual elements. From logo creation to intuitive user interface design, we take care of every detail to ensure consistent and professional visual communication across all channels."
        }
      }
    },
    {
      id: "adastra-consulting",
      title: "Consulenza digitale e di innovazione",
      description: "Definizione di strategie digitali orientate alla crescita, all'efficienza e alla competitività.",
      features: ["Analisi modello business", "Ottimizzazione processi", "Innovazione canali", "Customer experience"],
      fullContent: "Supportiamo aziende, professionisti e attività commerciali nella definizione di strategie digitali orientate alla crescita, all’efficienza e alla competitività. Attraverso un’analisi del modello di business, dei processi, dei canali di comunicazione e degli strumenti già in uso, individuiamo nuove opportunità di innovazione e sviluppiamo soluzioni su misura per migliorare presenza online, organizzazione interna, customer experience e performance commerciali.",
      translations: {
        en: {
          title: "Digital Consulting and Innovation",
          description: "Defining digital strategies oriented towards growth, efficiency, and competitiveness.",
          features: ["Business model analysis", "Process optimization", "Channel innovation", "Customer experience"],
          fullContent: "We support companies, professionals, and commercial activities in defining digital strategies oriented towards growth, efficiency, and competitiveness. Through an analysis of the business model, processes, communication channels, and tools already in use, we identify new innovation opportunities and develop tailor-made solutions to improve online presence, internal organization, customer experience, and commercial performance."
        }
      }
    },
    {
      id: "adastra-wordpress",
      title: "Creazione siti web WordPress",
      description: "Realizziamo siti web professionali, responsive e personalizzati per raccontare l'identità del tuo brand.",
      features: ["Design Responsive", "Ottimizzazione SEO", "Esperienza Utente", "Facilmente Aggiornabile"],
      fullContent: "Realizziamo siti web WordPress professionali, responsive e personalizzati, pensati per raccontare l’identità del brand e trasformare la presenza online in uno strumento di comunicazione efficace. Ogni sito viene progettato curando struttura, design, esperienza utente, contenuti e ottimizzazione SEO di base, con l’obiettivo di creare una piattaforma chiara, veloce, facilmente aggiornabile e adatta a rappresentare al meglio l’azienda, il professionista o il progetto.",
      translations: {
        en: {
          title: "WordPress Website Creation",
          description: "We create professional, responsive, and personalized websites to tell your brand's identity.",
          features: ["Responsive Design", "SEO Optimization", "User Experience", "Easily Updatable"],
          fullContent: "We create professional, responsive, and customized WordPress websites, designed to tell the identity of the brand and transform the online presence into an effective communication tool. Each site is designed by taking care of the structure, design, user experience, content, and basic SEO optimization, with the goal of creating a clear, fast, easily updatable platform suitable for best representing the company, professional, or project."
        }
      }
    },
    {
      id: "adastra-elearning",
      title: "Creazione piattaforme e-learning",
      description: "Sviluppo piattaforme personalizzate per vendere o distribuire corsi online.",
      features: ["Aree riservate", "Moduli didattici", "Sistemi pagamento", "Gestione utenti"],
      fullContent: "Sviluppiamo piattaforme e-learning personalizzate per aziende, professionisti, scuole, enti di formazione e realtà che desiderano vendere o distribuire corsi online. La piattaforma può includere aree riservate, moduli didattici, video lezioni, materiali scaricabili, quiz, certificati, sistemi di pagamento e gestione degli utenti.",
      translations: {
        en: {
          title: "E-learning Platform Creation",
          description: "Development of customized platforms to sell or distribute online courses.",
          features: ["Private areas", "Learning modules", "Payment systems", "User management"],
          fullContent: "We develop customized e-learning platforms for companies, professionals, schools, training entities, and entities that wish to sell or distribute online courses. The platform can include reserved areas, educational modules, video lessons, downloadable materials, quizzes, certificates, payment systems, and user management."
        }
      }
    },
    {
      id: "adastra-branding",
      title: "Grafica, branding e immagine coordinata",
      description: "Identità visive riconoscibili, coerenti e memorabili per il tuo brand.",
      features: ["Logo design", "Palette colori", "Immagine coordinata", "Materiali marketing"],
      fullContent: "Costruiamo identità visive riconoscibili, coerenti e memorabili, capaci di comunicare il valore del brand in modo professionale. Ci occupiamo di logo design, palette colori, tipografia, materiali grafici, immagine coordinata, presentazioni, brochure, cataloghi e supporti digitali o stampati.",
      translations: {
        en: {
          title: "Graphics, Branding, and Corporate Image",
          description: "Recognizable, consistent, and memorable visual identities for your brand.",
          features: ["Logo design", "Color palette", "Corporate image", "Marketing materials"],
          fullContent: "We build recognizable, consistent, and memorable visual identities capable of communicating the brand's value professionally. We take care of logo design, color palettes, typography, graphic materials, corporate image, presentations, brochures, catalogs, and digital or printed supports."
        }
      }
    },
    {
      id: "adastra-content",
      title: "Content creation: foto e video",
      description: "Contenuti visivi professionali per valorizzare prodotti, servizi e persone.",
      features: ["Shooting fotografici", "Produzione video", "Social content", "Post-produzione"],
      fullContent: "Realizziamo contenuti fotografici e video professionali pensati per valorizzare prodotti, servizi, ambienti, persone e momenti chiave del brand. Dallo shooting alla produzione video, creiamo materiali visivi adatti a siti web, social media, campagne pubblicitarie, presentazioni aziendali e comunicazione digitale.",
      translations: {
        en: {
          title: "Content Creation: Photo and Video",
          description: "Professional visual content to enhance products, services, and people.",
          features: ["Photo shoots", "Video production", "Social content", "Post-production"],
          fullContent: "We create professional photographic and video content designed to enhance products, services, environments, people, and key moments of the brand. From the shooting to video production, we create visual materials suitable for websites, social media, advertising campaigns, and corporate presentations."
        }
      }
    },
    {
      id: "adastra-social",
      title: "Social media marketing e management",
      description: "Gestione strategica dei canali social per far crescere la tua community.",
      features: ["Strategia editoriale", "Pianificazione post", "Community management", "Performance monitoring"],
      fullContent: "Gestiamo la presenza social di aziende, professionisti e brand attraverso strategie editoriali personalizzate, contenuti mirati e una comunicazione coerente con gli obiettivi di business. Ci occupiamo di pianificazione, creazione contenuti, scrittura testi, pubblicazione, gestione dei canali e monitoraggio delle performance.",
      translations: {
        en: {
          title: "Social Media Marketing and Management",
          description: "Strategic social media management to grow your community.",
          features: ["Editorial strategy", "Post planning", "Community management", "Performance monitoring"],
          fullContent: "We manage the social presence of companies, professionals, and brands through customized editorial strategies, targeted content, and communication consistent with business objectives. We take care of planning, content creation, text writing, publishing, channel management, and performance monitoring."
        }
      }
    },
    {
      id: "adastra-adv",
      title: "Advertising Google, Meta e LinkedIn",
      description: "Campagne pubblicitarie digitali per aumentare visibilità e conversioni.",
      features: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Ottimizzazione continua"],
      fullContent: "Progettiamo e gestiamo campagne pubblicitarie digitali su Google, Meta e LinkedIn, con l’obiettivo di aumentare visibilità, traffico qualificato, contatti, vendite e conversioni. Ogni campagna viene strutturata in base al target, al budget e agli obiettivi del cliente.",
      translations: {
        en: {
          title: "Google, Meta, and LinkedIn Advertising",
          description: "Digital advertising campaigns to increase visibility and conversions.",
          features: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Continuous optimization"],
          fullContent: "We design and manage digital advertising campaigns on Google, Meta, and LinkedIn, with the goal of increasing visibility, qualified traffic, contacts, sales, and conversions. Each campaign is structured based on the target, budget, and customer objectives."
        }
      }
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    private location: Location,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) { }

  goBack(event: Event): void {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId) && window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/'], { fragment: 'services' });
    }
  }

  ngOnInit(): void {
    // Scrolla in alto quando si apre il dettaglio (solo lato browser)
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.route.params.subscribe(params => {
      const id = params['id'] || this.route.snapshot.data['id'];
      this.updateService(id);
    });

    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      const id = this.route.snapshot.params['id'] || this.route.snapshot.data['id'];
      this.updateService(id);
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
    const existingScript = this.document.getElementById('service-jsonld-schema');
    if (existingScript) existingScript.remove();
    const existingBcScript = this.document.getElementById('breadcrumb-jsonld-schema');
    if (existingBcScript) existingBcScript.remove();
    const existingFaqScript = this.document.getElementById('faq-jsonld-schema');
    if (existingFaqScript) existingFaqScript.remove();
  }

  private updateService(id: string): void {
    const rawService = this.services.find(s => s.id === id);
    if (rawService) {
      this.service = this.localizeService(rawService);
      if (this.service) {
        const pageTitle = `${this.service.title} | Hi-Tech`;
        this.titleService.setTitle(pageTitle);
        this.metaService.updateTag({ name: 'description', content: this.service.description });

        // Aggiorna tag Open Graph e Twitter per condivisione social
        this.metaService.updateTag({ property: 'og:title', content: pageTitle });
        this.metaService.updateTag({ property: 'og:description', content: this.service.description });
        this.metaService.updateTag({ property: 'twitter:title', content: pageTitle });
        this.metaService.updateTag({ property: 'twitter:description', content: this.service.description });

        // Aggiorna URL canonico per il dettaglio del servizio includendo parametro lingua e trailing slash
        const baseUrl = 'https://hitechsrls.com';
        const currentLang = this.translate.currentLang || 'it';
        const canonicalUrl = `${baseUrl}/services/${id}/${currentLang === 'en' ? '?lang=en' : ''}`;
        this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
        this.metaService.updateTag({ property: 'twitter:url', content: canonicalUrl });

        // Aggiorna anche l'elemento link canonical nel DOM (sia su browser che server/prerender)
        let canonicalLink = this.document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
          canonicalLink = this.document.createElement('link');
          canonicalLink.setAttribute('rel', 'canonical');
          this.document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonicalUrl);

        // Inietta gli schemi JSON-LD del servizio e del relativo breadcrumb
        this.injectServiceSchema(this.service, id);

        // Segnala a Netlify Prerender che il rendering di questa pagina dinamica è completato
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            (window as any).prerenderReady = true;
          }, 150);
        }
      }
    } else {
      this.service = undefined; // Triggera l'errore 404 nel template
    }
  }

  private injectServiceSchema(service: any, id: string): void {
    // Rimuovi vecchi script se presenti
    const existingScript = this.document.getElementById('service-jsonld-schema');
    if (existingScript) existingScript.remove();

    const existingBcScript = this.document.getElementById('breadcrumb-jsonld-schema');
    if (existingBcScript) existingBcScript.remove();

    const currentLang = this.translate.currentLang || 'it';
    const isEn = currentLang === 'en';
    const baseUrl = 'https://hitechsrls.com';
    const serviceUrl = `${baseUrl}/services/${id}/${isEn ? '?lang=en' : ''}`;

    // 1. Schema Servizio
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.title,
      "description": service.description,
      "provider": {
        "@type": "ProfessionalService",
        "name": "Hi-Tech Solutions",
        "image": `${baseUrl}/assets/images/logo-trasp.webp`,
        "telephone": "+39 3456425468",
        "url": baseUrl
      },
      "url": serviceUrl
    };

    const script = this.document.createElement('script');
    script.id = 'service-jsonld-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(serviceSchema);
    this.document.head.appendChild(script);

    // 2. Schema Breadcrumb per il dettaglio del servizio
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": isEn ? "Home" : "Pagina Iniziale",
          "item": `${baseUrl}/${isEn ? '?lang=en' : ''}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": isEn ? "Services" : "Servizi",
          "item": `${baseUrl}/services/${isEn ? '?lang=en' : ''}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": service.title,
          "item": serviceUrl
        }
      ]
    };

    const bcScript = this.document.createElement('script');
    bcScript.id = 'breadcrumb-jsonld-schema';
    bcScript.type = 'application/ld+json';
    bcScript.text = JSON.stringify(breadcrumbSchema);
    this.document.head.appendChild(bcScript);

    // 3. Schema FAQ se presenti
    const existingFaqScript = this.document.getElementById('faq-jsonld-schema');
    if (existingFaqScript) existingFaqScript.remove();

    if (service.faqs && service.faqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faqs.map((faq: ServiceFaq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };

      const faqScript = this.document.createElement('script');
      faqScript.id = 'faq-jsonld-schema';
      faqScript.type = 'application/ld+json';
      faqScript.text = JSON.stringify(faqSchema);
      this.document.head.appendChild(faqScript);
    }
  }

  private localizeService(service: Service): Service {
    const currentLang = this.translate.currentLang || 'it';
    if (currentLang === 'en' && service.translations?.['en']) {
      return {
        ...service,
        ...service.translations['en']
      };
    }
    return service;
  }
}
