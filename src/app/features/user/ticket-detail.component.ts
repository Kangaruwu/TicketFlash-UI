import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="tf-container" style="padding: 36px 32px 56px;" *ngIf="booking(); else missing">
      <a class="tf-btn tf-btn-ghost tf-btn-sm" routerLink="/my-bookings">Back to my tickets</a>

      <div class="tf-card" style="padding: 20px; margin-top: 14px;" *ngIf="ticket() as t">
        <p class="tf-eyebrow">Booking {{ t.id }}</p>
        <h1 class="tf-display" style="font-size: 52px; margin: 8px 0;">{{ t.event?.title }}</h1>
        <p class="muted">{{ t.event?.subtitle }}</p>

        <div class="grid">
          <div>
            <span class="tf-eyebrow">Venue</span>
            <p>{{ t.event?.venue }}, {{ t.event?.city }}</p>
          </div>
          <div>
            <span class="tf-eyebrow">Date</span>
            <p>{{ t.event?.dateLabel }} · {{ t.event?.timeLabel }}</p>
          </div>
          <div>
            <span class="tf-eyebrow">Quantity</span>
            <p>{{ t.qty }} tickets</p>
          </div>
          <div>
            <span class="tf-eyebrow">Total</span>
            <p>{{ t.totalLabel }}</p>
          </div>
        </div>
      </div>
    </section>

    <ng-template #missing>
      <section class="tf-container" style="padding: 80px 32px; text-align:center;">
        <h2 class="tf-display">Booking not found</h2>
      </section>
    </ng-template>
  `,
  styles: `
    .grid { margin-top: 18px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .muted { color: var(--muted); }
    @media (max-width: 760px) {
      .grid { grid-template-columns: 1fr; }
    }
  `
})
export class TicketDetailComponent implements OnInit {
  readonly store = inject(StoreService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.store.loadMyBookings();
  }

  readonly booking = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.store.myBookings().find((item) => item.id === id) ?? this.store.lastBooking();
  });

  readonly ticket = computed(() => {
    const booking = this.booking();
    if (!booking) {
      return null;
    }
    return {
      ...booking,
      event: this.store.getEvent(booking.eventId),
      totalLabel: this.store.formatVnd(booking.total)
    };
  });
}
