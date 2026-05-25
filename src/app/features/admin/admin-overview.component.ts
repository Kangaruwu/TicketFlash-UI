import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiPageHeaderComponent } from '../../shared/ui/ui-page-header.component';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, UiCardComponent, UiPageHeaderComponent],
  template: `
    <section class="tf-container" style="padding: 36px 32px 56px;">
      <ui-page-header eyebrow="Admin · Overview" title="Today's pulse." />

      <div class="kpis">
        <ui-card *ngFor="let card of kpis" padding="14px">
          <p class="tf-eyebrow" style="margin:0;">{{ card.label }}</p>
          <h3 class="tf-display" style="font-size: 36px; margin:8px 0 0;">{{ card.value }}</h3>
          <p style="margin:2px 0 0; color: var(--muted);">{{ card.sub }}</p>
        </ui-card>
      </div>

      <ui-card padding="14px" style="margin-top: 16px;">
        <div style="display:flex; justify-content: space-between; align-items:center;">
          <p class="tf-eyebrow" style="margin:0;">Recent bookings</p>
          <a routerLink="/admin/bookings" class="tf-btn tf-btn-ghost tf-btn-sm">View all</a>
        </div>
        <div class="row" *ngFor="let booking of recent()">
          <div>
            <strong>{{ booking.id }}</strong>
            <p class="muted">{{ title(booking.event) }} - {{ booking.user }}</p>
          </div>
          <strong>{{ store.formatVnd(booking.total) }}</strong>
        </div>
      </ui-card>
    </section>
  `,
  styles: `
    .kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
    .row { padding: 12px 0; border-top: 1px solid var(--line); display:flex; justify-content: space-between; align-items:center; }
    .muted { color: var(--muted); margin: 2px 0 0; }
    @media (max-width: 960px) {
      .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 640px) {
      .kpis { grid-template-columns: 1fr; }
    }
  `
})
export class AdminOverviewComponent {
  readonly store = inject(StoreService);

  readonly recent = computed(() => this.store.adminBookings().slice(0, 6));

  readonly kpis = [
    { label: 'Revenue (30d)', value: 'VND 2.84B', sub: '+18.4% vs last period' },
    { label: 'Tickets sold', value: '12,847', sub: '4,210 last 7d' },
    { label: 'Active events', value: '24', sub: '8 on sale this week' },
    { label: 'Avg checkout', value: '1.4s', sub: 'p95 latency' }
  ];

  title(eventId: string): string {
    return this.store.getEvent(eventId)?.title ?? eventId;
  }
}
