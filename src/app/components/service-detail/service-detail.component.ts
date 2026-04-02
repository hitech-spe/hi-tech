import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface Service {
  id: string;
  title: string;
  icon: string;
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
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  service: Service | undefined;
  private langChangeSub: Subscription | undefined;

  private services: Service[] = [
    {
      id: 'web',
      title: 'Sviluppo Web',
      icon: '🚀',
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
      icon: '📱',
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
      id: 'cloud',
      title: 'Consulenza Cloud',
      icon: '☁️',
      description: 'Infrastrutture cloud sicure, resilienti e ottimizzate.',
      features: ['AWS & Azure', 'Kubernetes', 'DevOps Automation', 'Security Audits'],
      fullContent: 'Accompagniamo le aziende nella migrazione verso il cloud, ottimizzando i costi e migliorando l\'affidabilità dei sistemi. Implementiamo pipeline di CI/CD e monitoraggio continuo per una gestione senza stress.',
      translations: {
        en: {
          title: 'Cloud Consulting',
          description: 'Secure, resilient, and optimized cloud infrastructures.',
          features: ['AWS & Azure', 'Kubernetes', 'DevOps Automation', 'Security Audits'],
          fullContent: 'We accompany companies in the migration towards the cloud, optimizing costs and improving the reliability of systems. We implement CI/CD pipelines and continuous monitoring for stress-free management.'
        }
      }
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
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
