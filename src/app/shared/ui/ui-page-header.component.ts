import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="ui-page-header">
      <div>
        <p class="tf-eyebrow" *ngIf="eyebrow">{{ eyebrow }}</p>
        <h1 class="tf-display" [style.fontSize]="titleSize" [style.margin]="titleMargin">{{ title }}</h1>
        <p class="ui-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="ui-header-action" *ngIf="hasAction">
        <ng-content select="[header-action]" />
      </div>
    </header>
  `,
  styles: `
    .ui-page-header { display: flex; justify-content: space-between; align-items: end; gap: 12px; }
    .ui-subtitle { margin: 6px 0 0; color: var(--muted); }
    .ui-header-action { display: flex; align-items: center; gap: 8px; }
  `
})
export class UiPageHeaderComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() titleSize = '56px';
  @Input() titleMargin = '0 0 14px';
  @Input() hasAction = false;
}
