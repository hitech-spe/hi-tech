import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-roi-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './roi-calculator.component.html',
  styleUrls: ['./roi-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoiCalculatorComponent {
  // Inputs as Writable Signals
  manualHours = signal(10);
  hourlyRate = signal(25);
  currentServerCost = signal(300);

  // Computeds for instant reactive calculations
  annualManualWastedCost = computed(() => this.manualHours() * 52 * this.hourlyRate());
  
  hoursSaved = computed(() => Math.round(this.manualHours() * 52 * 0.8));
  cloudSaved = computed(() => Math.round(this.currentServerCost() * 12 * 0.4));
  
  annualSavings = computed(() => {
    // 80% manual labor cost reduction via custom automation, plus 40% traditional server hosting cost reduction via Cloud consulting
    const laborSavings = this.annualManualWastedCost() * 0.8;
    const serverSavings = this.currentServerCost() * 12 * 0.4;
    return Math.round(laborSavings + serverSavings);
  });
}
