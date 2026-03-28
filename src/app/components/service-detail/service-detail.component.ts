import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  fullContent: string;
}

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  service: Service | undefined;

  private services: Service[] = [
    {
      id: 'web',
      title: 'Sviluppo Web',
      icon: '🚀',
      description: 'Applicazioni web moderne, scalabili e ad alte prestazioni.',
      features: ['Angular & React', 'Node.js Backend', 'Cloud Native', 'SEO Optimized'],
      fullContent: 'Progettiamo e sviluppiamo architetture web all\'avanguardia, focalizzandoci sulla user experience e sulle performance. Utilizziamo i framework più moderni per garantire prodotti sicuri, veloci e pronti a scalare con il tuo business.'
    },
    {
      id: 'mobile',
      title: 'Sviluppo App Mobile',
      icon: '📱',
      description: 'Esperienze mobile native e cross-platform d\'eccellenza.',
      features: ['Flutter & React Native', 'iOS & Android', 'UX/UI Design', 'App Store Optimization'],
      fullContent: 'Le nostre app mobile sono progettate per offrire prestazioni fluide e interfacce intuitive. Che si tratti di un\'app nativa o cross-platform, garantiamo un codice di alta qualità e una manutenzione semplificata.'
    },
    {
      id: 'cloud',
      title: 'Consulenza Cloud',
      icon: '☁️',
      description: 'Infrastrutture cloud sicure, resilienti e ottimizzate.',
      features: ['AWS & Azure', 'Kubernetes', 'DevOps Automation', 'Security Audits'],
      fullContent: 'Accompagniamo le aziende nella migrazione verso il cloud, ottimizzando i costi e migliorando l\'affidabilità dei sistemi. Implementiamo pipeline di CI/CD e monitoraggio continuo per una gestione senza stress.'
    }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.service = this.services.find(s => s.id === id);
    });
  }
}
