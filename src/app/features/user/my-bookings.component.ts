import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiPageHeaderComponent } from '../../shared/ui/ui-page-header.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, UiCardComponent, UiPageHeaderComponent],
  template: `
    <section class="tf-container" style="padding: 36px 32px 56px;">
      <ui-page-header title="My tickets" eyebrow="User" />

      <ui-card padding="14px" *ngIf="bookings().length > 0; else empty">
        <a class="booking" *ngFor="let booking of bookings()" [routerLink]="['/ticket', booking.id]">
          <div>
            <strong>{{ booking.event?.title }}</strong>
            <p class="muted">{{ booking.event?.venue }} - {{ booking.date }}</p>
          </div>
          <div style="text-align:right;">
            <p class="tf-eyebrow" style="margin:0;">{{ booking.status }}</p>
            <strong>{{ booking.totalLabel }}</strong>
          </div>
        </a>
      </ui-card>

      <ng-template #empty>
        <ui-card padding="36px" style="text-align:center;">
          <h3 class="tf-display">No bookings yet</h3>
          <a class="tf-btn tf-btn-ink" routerLink="/browse">Book now</a>
        </ui-card>
      </ng-template>
    </section>
  `,
  styles: `
    .booking { display: flex; justify-content: space-between; align-items: center; padding: 14px 4px; border-top: 1px solid var(--line); text-decoration:none; color:inherit; }
    .booking:first-child { border-top: 0; }
    .booking:hover { background: var(--bg-soft); }
    .muted { color: var(--muted); margin: 2px 0 0; }
  `
})
export class MyBookingsComponent implements OnInit {
  readonly store = inject(StoreService);

  ngOnInit(): void {
    this.store.loadMyBookings();
  }

  readonly bookings = computed(() => this.store.myBookings().map((booking) => ({
    ...booking,
    event: this.store.getEvent(booking.eventId),
    totalLabel: this.store.formatVnd(booking.total)
  })));
}
