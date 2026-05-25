import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="tf-container detail" *ngIf="event() as e; else missing">
      <button class="tf-btn tf-btn-ghost tf-btn-sm" (click)="back()">Back</button>
      <div class="hero" [style.background]="e.hero">
        <div>
          <p class="tf-eyebrow tf-white">{{ e.category }} - {{ e.dateLabel }}</p>
          <h1 class="tf-display">{{ e.title }}</h1>
          <p class="tf-italic">{{ e.subtitle }}</p>
          <p>{{ e.description }}</p>
        </div>
      </div>

      <div class="tf-card classes">
        <h3 class="tf-display">Choose your tickets</h3>
        <div class="class-row" *ngFor="let cls of e.classes">
          <div>
            <strong>{{ cls.name }}</strong>
            <p class="muted">{{ cls.perks }}</p>
          </div>
          <div class="class-actions">
            <span>{{ store.formatVnd(cls.price) }}</span>
            <div class="stepper">
              <button (click)="change(cls.id, -1)">-</button>
              <span>{{ qty(cls.id) }}</span>
              <button (click)="change(cls.id, 1)">+</button>
            </div>
          </div>
        </div>
        <div class="footer">
          <strong>Total: {{ total() }}</strong>
          <button class="tf-btn tf-btn-ink" (click)="goToCart()" [disabled]="count() === 0">Add to cart</button>
        </div>
      </div>
    </section>

    <ng-template #missing>
      <section class="tf-container" style="padding: 80px 32px; text-align:center;">
        <h2 class="tf-display">Event not found</h2>
      </section>
    </ng-template>
  `,
  styles: `
    .detail { padding: 28px 32px 56px; }
    .hero { border-radius: 14px; color: #fff; padding: 32px; margin: 16px 0; }
    .tf-white { color: rgba(255,255,255,.82); }
    .classes { padding: 18px; }
    .class-row { display: flex; justify-content: space-between; gap: 20px; padding: 14px 0; border-top: 1px solid var(--line); }
    .class-actions { display: flex; align-items: center; gap: 12px; }
    .stepper { display: inline-flex; border: 1px solid var(--line); border-radius: 999px; overflow: hidden; }
    .stepper button { border: 0; background: #fff; width: 32px; }
    .stepper span { min-width: 32px; text-align: center; line-height: 32px; }
    .footer { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
    .muted { color: var(--muted); margin: 2px 0 0; }
  `
})
export class EventDetailComponent {
  readonly store = inject(StoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly selections = signal<Record<string, number>>({});

  readonly event = computed(() => this.store.getEvent(this.route.snapshot.paramMap.get('id')));

  readonly count = computed(() => Object.values(this.selections()).reduce((sum, qty) => sum + qty, 0));

  readonly total = computed(() => {
    const event = this.event();
    if (!event) {
      return this.store.formatVnd(0);
    }
    const value = Object.entries(this.selections()).reduce((sum, [classId, qty]) => {
      const ticketClass = event.classes.find((entry) => entry.id === classId);
      return sum + (ticketClass ? ticketClass.price * qty : 0);
    }, 0);
    return this.store.formatVnd(value);
  });

  qty(classId: string): number {
    return this.selections()[classId] ?? 0;
  }

  change(classId: string, delta: number): void {
    this.selections.update((current) => {
      const next = Math.max(0, (current[classId] ?? 0) + delta);
      return { ...current, [classId]: next };
    });
  }

  goToCart(): void {
    const event = this.event();
    if (!event) {
      return;
    }
    for (const [classId, qty] of Object.entries(this.selections())) {
      if (qty > 0) {
        this.store.updateCart(event.id, classId, qty);
      }
    }
    void this.router.navigate(['/cart']);
  }

  back(): void {
    void this.router.navigate(['/browse']);
  }
}
