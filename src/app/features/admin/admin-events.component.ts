import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../core/services/store.service';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiPageHeaderComponent } from '../../shared/ui/ui-page-header.component';
import { UiTableComponent } from '../../shared/ui/ui-table.component';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageHeaderComponent, UiTableComponent],
  template: `
    <section class="tf-container" style="padding: 36px 32px 56px;">
      <ui-page-header eyebrow="Admin · Events" title="Manage events." titleMargin="0" [hasAction]="true">
        <ui-button header-action>New event</ui-button>
      </ui-page-header>

      <ui-card padding="0" style="margin-top: 14px;">
        <ui-table [headers]="['Event', 'Venue', 'Date', 'Category', 'Lowest price']">
            <tr *ngFor="let event of store.events()">
              <td>
                <strong>{{ event.title }}</strong>
                <p class="muted">{{ event.subtitle }}</p>
              </td>
              <td>{{ event.venue }}, {{ event.city }}</td>
              <td>{{ event.dateLabel }}</td>
              <td>{{ event.category }}</td>
              <td>{{ low(event.classes) }}</td>
            </tr>
        </ui-table>
      </ui-card>
    </section>
  `,
  styles: `
    .muted { color: var(--muted); margin: 2px 0 0; font-size: 12px; }
  `
})
export class AdminEventsComponent {
  readonly store = inject(StoreService);

  low(classes: Array<{ price: number }>): string {
    return this.store.formatVnd(Math.min(...classes.map((entry) => entry.price)));
  }
}
