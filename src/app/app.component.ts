import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'hi-tech';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('it');
    translate.use('it');
  }
}
