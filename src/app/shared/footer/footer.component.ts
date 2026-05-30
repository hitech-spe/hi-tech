import { Component } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [
    TranslateModule,
    RouterLink
  ],
  standalone: true
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
