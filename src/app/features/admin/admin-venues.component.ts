import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-venues',
  standalone: true,
  template: `
    <section class="tf-container" style="padding: 36px 32px 56px;">
      <p class="tf-eyebrow">Admin · Venues</p>
      <h1 class="tf-display" style="font-size: 56px; margin: 0 0 14px;">Venues.</h1>
      <div class="tf-card" style="padding: 22px; color: var(--muted);">
        Venue management module placeholder. You can wire API CRUD here next.
      </div>
    </section>
  `
})
export class AdminVenuesComponent {}
