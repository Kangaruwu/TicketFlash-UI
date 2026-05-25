import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-admin-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="tf-container" style="padding: 36px 32px 56px;" *ngIf="booking(); else missing">
      <a class="tf-btn tf-btn-ghost tf-btn-sm" routerLink="/admin/bookings">Back to bookings</a>

      <div class="tf-card" style="padding: 18px; margin-top: 14px;" *ngIf="booking() as b">
        <p class="tf-eyebrow">Admin booking</p>
        <h1 class="tf-display" style="font-size: 48px; margin: 8px 0;">{{ b.id }}</h1>

        <div class="grid">
          <div>
            <span class="tf-eyebrow">Event</span>
            <p>{{ eventTitle() }}</p>
          </div>
          <div>
            <span class="tf-eyebrow">Customer</span>
            <p>{{ b.user }}</p>
          </div>
          <div>
            <span class="tf-eyebrow">Tickets</span>
            <p>{{ b.tickets }}</p>
          </div>
          <div>
            <span class="tf-eyebrow">Total</span>
            <p>{{ store.formatVnd(b.total) }}</p>
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
  styles: `.grid { margin-top: 14px; display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }`
})
export class AdminBookingDetailComponent {
  readonly store = inject(StoreService);
  private readonly route = inject(ActivatedRoute);

  readonly booking = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.store.adminBookings().find((item) => item.id === id);
  });

  readonly eventTitle = computed(() => {
    const current = this.booking();
    return this.store.getEvent(current?.event ?? null)?.title ?? current?.event ?? '-';
  });
}
