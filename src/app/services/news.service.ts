import { Injectable } from '@angular/core';

export interface NewsItem {
  id: number;
  date: string;
  titleKey: string;
  excerptKey: string;
  link: string;
  image?: string;
  categoryKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private news: NewsItem[] = [
    {
      id: 1,
      date: '2026-06-11',
      titleKey: 'INSIGHTS.NEWS1.TITLE',
      excerptKey: 'INSIGHTS.NEWS1.EXCERPT',
      categoryKey: 'INSIGHTS.NEWS1.CATEGORY',
      link: 'https://intempra.com/it/AI-Generativa-nel-B2B-previsioni-e-vantaggi-secondo-McKinsey-e-Gartner_blog531.html',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      date: '2026-05-30',
      titleKey: 'INSIGHTS.NEWS2.TITLE',
      excerptKey: 'INSIGHTS.NEWS2.EXCERPT',
      categoryKey: 'INSIGHTS.NEWS2.CATEGORY',
      link: 'https://www.mimit.gov.it/it/incentivi/piano-transizione-5-0',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      date: '2024-10-17',
      titleKey: 'INSIGHTS.NEWS3.TITLE',
      excerptKey: 'INSIGHTS.NEWS3.EXCERPT',
      categoryKey: 'INSIGHTS.NEWS3.CATEGORY',
      link: 'https://www.agendadigitale.eu/sicurezza/proteggere-i-dati-aziendali-guida-alla-sicurezza-nel-cloud/',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
    }
  ];

  getNews() {
    return this.news;
  }
}
