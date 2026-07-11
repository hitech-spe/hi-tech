import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tech-matcher',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './tech-matcher.component.html',
  styleUrls: ['./tech-matcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechMatcherComponent {
  currentStep = signal(1);
  answers = signal<string[]>([]);

  // Step information
  steps = [
    {
      titleKey: 'TECH_MATCHER.STEP_1_TITLE',
      options: [
        { code: 'A', textKey: 'TECH_MATCHER.STEP_1_OPT_A' },
        { code: 'B', textKey: 'TECH_MATCHER.STEP_1_OPT_B' },
        { code: 'C', textKey: 'TECH_MATCHER.STEP_1_OPT_C' }
      ]
    },
    {
      titleKey: 'TECH_MATCHER.STEP_2_TITLE',
      options: [
        { code: 'A', textKey: 'TECH_MATCHER.STEP_2_OPT_A' },
        { code: 'B', textKey: 'TECH_MATCHER.STEP_2_OPT_B' },
        { code: 'C', textKey: 'TECH_MATCHER.STEP_2_OPT_C' }
      ]
    },
    {
      titleKey: 'TECH_MATCHER.STEP_3_TITLE',
      options: [
        { code: 'A', textKey: 'TECH_MATCHER.STEP_3_OPT_A' },
        { code: 'B', textKey: 'TECH_MATCHER.STEP_3_OPT_B' },
        { code: 'C', textKey: 'TECH_MATCHER.STEP_3_OPT_C' }
      ]
    }
  ];

  // Dynamic matching algorithm based on user answers
  recommendation = computed(() => {
    const ans = this.answers();
    if (ans.length < 3) return null;

    const [scope, budget, speed] = ans;

    // 1. If scope is Mobile -> Native Mobile App (Flutter)
    if (scope === 'C') {
      return 'MOBILE';
    }

    // 2. If budget is complex systems -> Cloud & DevOps Consulting
    if (budget === 'C') {
      return 'CLOUD';
    }

    // 3. If scope is brand/marketing website AND speed is Fast or budget is Lean -> WordPress Website
    if (scope === 'A' && (speed === 'A' || budget === 'A')) {
      return 'WP';
    }

    // 4. Default: Custom B2B Web Platform (Angular)
    return 'B2B';
  });

  selectOption(optionCode: string) {
    const stepIdx = this.currentStep() - 1;
    this.answers.update(current => {
      const copy = [...current];
      copy[stepIdx] = optionCode;
      return copy;
    });

    // Advance to next step or result
    if (this.currentStep() < 3) {
      this.currentStep.update(s => s + 1);
    } else {
      this.currentStep.set(4); // Step 4 means Show Results
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  resetQuiz() {
    this.currentStep.set(1);
    this.answers.set([]);
  }
}
