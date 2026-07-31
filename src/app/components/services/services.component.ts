import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  imports: [
    TranslateModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class ServicesComponent {
  constructor() {}
}
