import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiPageHeaderComponent } from '../../shared/ui/ui-page-header.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, UiButtonComponent, UiCardComponent, UiPageHeaderComponent],
  template: `
    <section class="tf-container" style="padding: 36px 32px 56px;">
      <ui-page-header title="Your cart" eyebrow="Checkout" />

      <ui-card *ngIf="items().length > 0; else empty" padding="16px">
        <div *ngFor="let item of items()" class="row">
          <div>
            <strong>{{ item.event?.title }}</strong>
            <p class="muted">{{ item.className }} - {{ item.event?.dateLabel }}</p>
          </div>
          <div class="controls">
            <button (click)="store.updateCart(item.eventId, item.classId, -1)">-</button>
            <span>{{ item.qty }}</span>
            <button (click)="store.updateCart(item.eventId, item.classId, 1)">+</button>
            <strong>{{ item.total }}</strong>
          </div>
        </div>

        <div class="checkout">
          <strong>Total: {{ total() }}</strong>
          <ui-button (pressed)="pay()">Checkout</ui-button>
        </div>
      </ui-card>

      <ng-template #empty>
        <ui-card padding="36px" style="text-align:center;">
          <h3 class="tf-display">Cart is empty</h3>
          <a class="tf-btn tf-btn-ink" routerLink="/browse">Browse events</a>
        </ui-card>
      </ng-template>
    </section>
  `,
  styles: `
    .row { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 0; border-top: 1px solid var(--line); }
    .row:first-child { border-top: 0; }
    .controls { display: flex; align-items: center; gap: 10px; }
    .controls button { border: 1px solid var(--line); background: #fff; width: 30px; height: 30px; border-radius: 999px; }
    .checkout { border-top: 1px solid var(--line); margin-top: 10px; padding-top: 16px; display: flex; justify-content: space-between; }
    .muted { color: var(--muted); margin: 3px 0 0; }
  `
})
export class CartComponent {
  readonly store = inject(StoreService);
  private readonly router = inject(Router);

  readonly items = computed(() => this.store.cart().map((item) => {
    const event = this.store.getEvent(item.eventId);
    const ticketClass = event?.classes.find((entry) => entry.id === item.classId);
    return {
      ...item,
      event,
      className: ticketClass?.name ?? item.classId,
      total: this.store.formatVnd((ticketClass?.price ?? 0) * item.qty)
    };
  }));

  readonly total = computed(() => this.store.formatVnd(this.store.cartTotal()));

  pay(): void {
    void this.router.navigate(['/payment']);
  }
}
