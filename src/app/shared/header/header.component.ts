import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent {
  isMenuOpen = false;
  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'it';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    this.closeMenu();
  }
}
