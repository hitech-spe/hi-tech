import { Component, OnInit, OnDestroy, inject, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface FaqItem {
  qKey: string;
  aKey: string;
  open: any; // signal<boolean>
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  private langSub!: Subscription;

  searchTerm = signal('');

  faqs: FaqItem[] = [
    { qKey: 'FAQ.Q1', aKey: 'FAQ.A1', open: signal(false) },
    { qKey: 'FAQ.Q2', aKey: 'FAQ.A2', open: signal(false) },
    { qKey: 'FAQ.Q3', aKey: 'FAQ.A3', open: signal(false) },
    { qKey: 'FAQ.Q4', aKey: 'FAQ.A4', open: signal(false) },
    { qKey: 'FAQ.Q5', aKey: 'FAQ.A5', open: signal(false) }
  ];

  // Dynamically translate and filter FAQs in real-time
  filteredFaqs = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    
    const items = this.faqs.map(item => {
      const question = this.translate.instant(item.qKey);
      const answer = this.translate.instant(item.aKey);
      return { question, answer, open: item.open };
    });

    if (!term) return items;

    return items.filter(item => 
      item.question.toLowerCase().includes(term) || 
      item.answer.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    // Generate and inject JSON-LD FAQ Schema for Google SEO Rich Snippets
    this.injectFaqSchema();

    // Re-inject schema on language changes to ensure Google index works for both languages
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.injectFaqSchema();
    });
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
    // Clean up injected script from DOM
    if (isPlatformBrowser(this.platformId)) {
      const script = document.getElementById('faq-jsonld-schema');
      if (script) {
        script.remove();
      }
    }
  }

  toggleFaq(item: any) {
    item.open.set(!item.open());
  }

  private injectFaqSchema() {
    if (isPlatformBrowser(this.platformId)) {
      // Remove previous script if any
      const existingScript = document.getElementById('faq-jsonld-schema');
      if (existingScript) {
        existingScript.remove();
      }

      // Format Schema.org mainEntity questions & answers
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": this.faqs.map(item => ({
          "@type": "Question",
          "name": this.translate.instant(item.qKey),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": this.translate.instant(item.aKey)
          }
        }))
      };

      const script = document.createElement('script');
      script.id = 'faq-jsonld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }
}
