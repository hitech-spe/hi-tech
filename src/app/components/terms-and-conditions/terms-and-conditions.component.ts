import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './terms-and-conditions.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent {
  currentDate = new Date().toLocaleDateString();
}
