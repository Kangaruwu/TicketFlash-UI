import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { EventItem } from '../../core/models/ticket.models';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="tf-container hero" *ngIf="featured() as headliner">
      <div>
        <p class="tf-eyebrow">Week of May 20 - On sale now</p>
        <h1 class="tf-display title">The night <span class="tf-italic accent">belongs to you.</span></h1>
        <p class="lead">Concerts, theater, sports and festivals. Book in seconds.</p>
        <div class="row">
          <a class="tf-btn tf-btn-ink" [routerLink]="['/event', headliner.id]">Get tickets</a>
          <a class="tf-btn tf-btn-ghost" routerLink="/my-bookings">My tickets</a>
        </div>
      </div>
      <a class="poster" [routerLink]="['/event', headliner.id]" [style.background]="headliner.hero">
        <div class="poster-content">
          <p class="tf-eyebrow tf-white">{{ headliner.dateLabel }} - {{ headliner.city }}</p>
          <h2 class="tf-display">{{ headliner.title }}</h2>
          <p class="tf-italic">{{ headliner.subtitle }}</p>
        </div>
      </a>
    </section>

    <section class="tf-container">
      <div class="chips">
        <button
          *ngFor="let c of categories"
          class="tf-btn tf-btn-sm"
          [class.tf-btn-ink]="store.category() === c"
          [class.tf-btn-ghost]="store.category() !== c"
          (click)="setCategory(c)">
          {{ c }}
        </button>
      </div>

      <div class="event-grid">
        <article class="tf-card tf-card-hover" *ngFor="let event of store.filteredEvents()">
          <a [routerLink]="['/event', event.id]" class="event-link">
            <div class="event-thumb" [style.background]="event.hero"></div>
            <div class="event-body">
              <p class="tf-eyebrow">{{ event.category }} - {{ event.dateLabel }}</p>
              <h3 class="tf-display">{{ event.title }}</h3>
              <p class="muted">{{ event.subtitle }}</p>
              <div class="event-meta">
                <span>{{ event.venue }}, {{ event.city }}</span>
                <strong>{{ fromPrice(event) }}</strong>
              </div>
            </div>
          </a>
        </article>
      </div>

      <div class="empty" *ngIf="store.filteredEvents().length === 0">
        <h3 class="tf-display">Nothing matches yet.</h3>
        <p class="muted">Try another search or category.</p>
      </div>
    </section>
  `,
  styles: `
    .hero { padding: 48px 32px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 28px; }
    .title { font-size: clamp(40px, 8vw, 88px); margin: 0; line-height: .95; }
    .accent { color: var(--accent); }
    .lead { color: var(--muted); max-width: 520px; }
    .row { display: flex; gap: 10px; margin-top: 20px; }
    .poster { border-radius: 16px; min-height: 420px; display: flex; align-items: end; color: #fff; text-decoration: none; }
    .poster-content { padding: 20px; text-shadow: 0 3px 18px rgba(0,0,0,.4); }
    .tf-white { color: rgba(255,255,255,.85); }
    .chips { display: flex; gap: 8px; margin: 8px 0 18px; flex-wrap: wrap; }
    .event-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .event-link { text-decoration: none; color: inherit; display: block; }
    .event-thumb { height: 170px; }
    .event-body { padding: 14px; }
    h3 { margin: 4px 0; font-size: 34px; }
    .muted { color: var(--muted); }
    .event-meta { margin-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
    .empty { padding: 40px 0; text-align: center; }
    @media (max-width: 940px) {
      .hero { grid-template-columns: 1fr; padding: 24px 20px; }
    }
  `
})
export class BrowseComponent {
  readonly store = inject(StoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categories: Array<'All' | EventItem['category']> = ['All', 'Concert', 'Theater', 'Sports', 'Festival'];

  readonly featured = computed(() => this.store.events().find((event) => event.featured) ?? this.store.events()[0]);

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const category = (params.get('cat') as EventItem['category'] | null) ?? 'All';
      this.store.setCategory(['Concert', 'Theater', 'Sports', 'Festival'].includes(category) ? category : 'All');
    });
  }

  setCategory(category: 'All' | EventItem['category']): void {
    this.store.setCategory(category);
    const queryParams = category === 'All' ? {} : { cat: category };
    void this.router.navigate(['/browse'], { queryParams });
  }

  fromPrice(event: EventItem): string {
    const min = Math.min(...event.classes.map((item) => item.price));
    return this.store.formatVnd(min);
  }
}
