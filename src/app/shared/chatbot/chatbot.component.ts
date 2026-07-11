import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AiService } from '../../services/ai.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  private aiService = inject(AiService);
  private translate = inject(TranslateService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal(false);
  userInput = signal('');
  isLoading = signal(false);

  // Conversation history starts with the welcome message
  messages = signal<ChatMessage[]>([]);

  constructor() {
    // Generate initial welcome message based on language
    this.translate.get('CHATBOT.WELCOME').subscribe((msg: string) => {
      this.messages.set([{ role: 'assistant', content: msg }]);
    });

    // Update welcome message on language change
    this.translate.onLangChange.subscribe(() => {
      this.translate.get('CHATBOT.WELCOME').subscribe((msg: string) => {
        // Only replace if it's the only message in the array to avoid deleting history
        if (this.messages().length === 1 && this.messages()[0].role === 'assistant') {
          this.messages.set([{ role: 'assistant', content: msg }]);
        }
      });
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen.update(val => !val);
  }

  async sendMessage() {
    const text = this.userInput().trim();
    if (!text || this.isLoading()) return;

    // Clear input
    this.userInput.set('');

    // Append user message
    this.messages.update(history => [...history, { role: 'user', content: text }]);
    this.isLoading.set(true);

    try {
      const currentLang = this.translate.currentLang || 'it';
      // Call AI Service with history (excluding system details)
      const aiReply = await this.aiService.getChatbotResponse(text, this.messages().slice(0, -1), currentLang);
      this.messages.update(history => [...history, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      console.error('Error in chatbot communication:', error);
      this.translate.get('CHATBOT.ERROR').subscribe((errMsg: string) => {
        this.messages.update(history => [...history, { role: 'assistant', content: errMsg }]);
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {
        // Ignore scroll errors
      }
    }
  }
}
