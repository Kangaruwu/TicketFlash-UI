import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiPageHeaderComponent } from '../../shared/ui/ui-page-header.component';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, UiCardComponent, UiPageHeaderComponent],
  template: `
    <section class="tf-container" style="padding: 36px 32px 56px;">
      <ui-page-header eyebrow="Admin · Bookings" title="All bookings." />

      <ui-card padding="12px">
        <a class="row" *ngFor="let booking of store.adminBookings()" [routerLink]="['/admin/bookings', booking.id]">
          <div>
            <strong>{{ booking.id }}</strong>
            <p class="muted">{{ title(booking.event) }} - {{ booking.user }}</p>
          </div>
          <div style="text-align:right;">
            <p class="tf-eyebrow" style="margin:0;">{{ booking.status }}</p>
            <strong>{{ store.formatVnd(booking.total) }}</strong>
          </div>
        </a>
      </ui-card>
    </section>
  `,
  styles: `
    .row { text-decoration:none; color:inherit; display:flex; justify-content: space-between; align-items:center; border-top: 1px solid var(--line); padding: 12px 4px; }
    .row:first-child { border-top: 0; }
    .row:hover { background: var(--bg-soft); }
    .muted { color: var(--muted); margin: 2px 0 0; }
  `
})
export class AdminBookingsComponent {
  readonly store = inject(StoreService);

  title(eventId: string): string {
    return this.store.getEvent(eventId)?.title ?? eventId;
  }
}
