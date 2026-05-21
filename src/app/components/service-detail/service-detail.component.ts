import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {UpperCasePipe} from "@angular/common";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  fullContent: string;
  translations?: {
    [locale: string]: {
      title: string;
      description: string;
      features: string[];
      fullContent: string;
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
  standalone: true
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  service: Service | undefined;
  private langChangeSub: Subscription | undefined;

  private services: Service[] = [
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
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // Scrolla in alto quando si apre il dettaglio
    window.scrollTo(0, 0);

    this.route.params.subscribe(params => {
      const id = params['id'];
      this.updateService(id);
    });

    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      const id = this.route.snapshot.params['id'];
      this.updateService(id);
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  private updateService(id: string): void {
    const rawService = this.services.find(s => s.id === id);
    if (rawService) {
      this.service = this.localizeService(rawService);
    } else {
      this.service = undefined; // Triggera l'errore 404 nel template
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
