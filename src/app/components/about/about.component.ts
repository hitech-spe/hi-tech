import { Component, ChangeDetectionStrategy } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class AboutComponent {

}
