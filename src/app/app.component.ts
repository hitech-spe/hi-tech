import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { HeaderComponent } from "./shared/header/header.component";
import { SpinnerComponent } from "./shared/spinner/spinner.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent
  ],
  standalone: true
})
export class AppComponent {
  title = 'hi-tech';
  private isBrowser: boolean;

  constructor(
    private translate: TranslateService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    translate.setDefaultLang('it');
    translate.use('it');
    this.isBrowser = isPlatformBrowser(platformId);

    // Gestione dello scroll manuale per i frammenti
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isBrowser) {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          // Aggiungi un piccolo ritardo per assicurarti che il DOM sia stato renderizzato
          setTimeout(() => {
            const element = document.querySelector('#' + tree.fragment);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    });
  }
}
