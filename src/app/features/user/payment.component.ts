import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="tf-container" style="padding: 36px 32px 56px; max-width: 760px;">
      <h1 class="tf-display" style="font-size: 56px; margin: 0;">Payment</h1>
      <p style="color: var(--muted);">Secure checkout for your selected tickets.</p>

      <div class="tf-card" style="padding: 18px; margin-top: 16px;">
        <label class="tf-label">Email</label>
        <input class="tf-input" [(ngModel)]="email" placeholder="you@email.com" />

        <label class="tf-label" style="margin-top: 12px;">Card</label>
        <input class="tf-input" [(ngModel)]="card" placeholder="4242 4242 4242 4242" />

        <div style="margin-top: 18px; display:flex; justify-content:space-between; align-items:center;">
          <strong>Total: {{ store.formatVnd(store.cartTotal()) }}</strong>
          <button class="tf-btn tf-btn-ink" (click)="confirm()" [disabled]="!email || store.cart().length === 0 || store.isLoading()">Confirm payment</button>
        </div>
      </div>
    </section>
  `
})
export class PaymentComponent {
  readonly store = inject(StoreService);
  private readonly router = inject(Router);

  readonly card = signal('');
  email = 'thanh.nguyen@gmail.com';

  async confirm(): Promise<void> {
    const booking = await this.store.checkout(this.email);
    if (!booking) {
      return;
    }
    void this.router.navigate(['/ticket', booking.id]);
  }
}
