import { Routes } from '@angular/router';
import { AdminBookingDetailComponent } from './features/admin/admin-booking-detail.component';
import { AdminBookingsComponent } from './features/admin/admin-bookings.component';
import { AdminEventsComponent } from './features/admin/admin-events.component';
import { AdminOverviewComponent } from './features/admin/admin-overview.component';
import { AdminVenuesComponent } from './features/admin/admin-venues.component';
import { BrowseComponent } from './features/user/browse.component';
import { CartComponent } from './features/user/cart.component';
import { EventDetailComponent } from './features/user/event-detail.component';
import { MyBookingsComponent } from './features/user/my-bookings.component';
import { PaymentComponent } from './features/user/payment.component';
import { TicketDetailComponent } from './features/user/ticket-detail.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'browse' },
	{ path: 'browse', component: BrowseComponent },
	{ path: 'event/:id', component: EventDetailComponent },
	{ path: 'cart', component: CartComponent },
	{ path: 'payment', component: PaymentComponent },
	{ path: 'my-bookings', component: MyBookingsComponent },
	{ path: 'ticket/:id', component: TicketDetailComponent },

	{ path: 'admin', component: AdminOverviewComponent },
	{ path: 'admin/events', component: AdminEventsComponent },
	{ path: 'admin/bookings', component: AdminBookingsComponent },
	{ path: 'admin/bookings/:id', component: AdminBookingDetailComponent },
	{ path: 'admin/venues', component: AdminVenuesComponent },

	{ path: '**', redirectTo: 'browse' }
];
