import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-table-wrap" [style.minWidth]="minWidth">
      <table class="ui-table">
        <thead>
          <tr>
            <th *ngFor="let header of headers">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <ng-content />
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .ui-table-wrap { overflow: auto; }
    .ui-table { width: 100%; border-collapse: collapse; }
    .ui-table th, .ui-table td { text-align: left; padding: 12px; border-bottom: 1px solid var(--line); }
    .ui-table th { font-size: 11px; font-family: var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
  `
})
export class UiTableComponent {
  @Input() headers: string[] = [];
  @Input() minWidth = '840px';
}
