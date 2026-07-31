import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface Partner {
  name: string;
  description: string;
  logo: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-partnership',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgOptimizedImage],
  templateUrl: './partnership.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./partnership.component.scss']
})
export class PartnershipComponent {

  partners: Partner[] = [
    {
      name: 'PARTNERSHIP.ADASTRA.NAME',
      description: 'PARTNERSHIP.ADASTRA.DESC',
      logo: '/assets/images/adastraLogo.webp',
      width: 370,
      height: 131
    },
    {
      name: 'PARTNERSHIP.MERQORN.NAME',
      description: 'PARTNERSHIP.MERQORN.DESC',
      logo: '/assets/images/Merqorn.webp',
      width: 370,
      height: 131
    },
    {
      name: 'PARTNERSHIP.TAMBORRINO.NAME',
      description: 'PARTNERSHIP.TAMBORRINO.DESC',
      logo: '/assets/images/tamborrinoLogo.webp',
      width: 370,
      height: 131
    }
  ];

  constructor() {}
}
