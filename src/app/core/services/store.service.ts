import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ADMIN_BOOKINGS_SEED, VND } from '../data/seed-data';
import { AdminBooking, Booking, CartItem, EventItem, UserRole } from '../models/ticket.models';

type BackendPaged<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

type BackendEvent = {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  venue?: {
    id: number;
    name: string;
    address: string;
    capacity: number;
  };
  ticketClasses: Array<{
    id: number;
    name: string;
    price: number;
    quantityAvailable: number;
    quantitySold: number;
    eventId: number;
  }>;
};

type BackendLoginResponse = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
};

type BackendRegisterResponse = {
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
};

type BackendBooking = {
  id: string;
  qrToken: string;
  eventName: string;
  eventId: number;
  email: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  totalTicket: number;
  bookingDate: string;
};

type Session = {
  accessToken: string;
  refreshToken: string;
  username: string;
  email: string;
  role: string;
};

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/v1';

  readonly role = signal<UserRole>('user');
  readonly query = signal('');
  readonly category = signal<'All' | EventItem['category']>('All');
  readonly status = signal('Ready');
  readonly isLoading = signal(false);
  readonly session = signal<Session | null>(this.loadSession());

  readonly events = signal<EventItem[]>([]);
  readonly cart = signal<CartItem[]>([]);
  readonly myBookings = signal<Booking[]>([]);
  readonly adminBookings = signal<AdminBooking[]>(ADMIN_BOOKINGS_SEED);
  readonly lastBooking = signal<Booking | null>(null);

  readonly cartCount = computed(() => this.cart().reduce((sum, item) => sum + item.qty, 0));

  readonly filteredEvents = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.events().filter((event) => {
      const categoryMatches = this.category() === 'All' || event.category === this.category();
      const searchSource = `${event.title} ${event.subtitle} ${event.venue} ${event.city} ${event.genre}`.toLowerCase();
      const queryMatches = !q || searchSource.includes(q);
      return categoryMatches && queryMatches;
    });
  });

  constructor() {
    this.loadEvents();
    if (this.session()) {
      const userRole = this.session()!.role.toUpperCase().includes('ADMIN') ? 'admin' : 'user';
      this.role.set(userRole);
      this.loadMyBookings();
    }
  }

  setRole(role: UserRole): void {
    this.role.set(role);
  }

  async login(usernameOrEmail: string, password: string): Promise<boolean> {
    if (!usernameOrEmail || !password) {
      this.status.set('Enter username/email and password');
      return false;
    }

    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<BackendLoginResponse>(`${this.apiBase}/auth/login`, {
          usernameOrEmail,
          password
        })
      );

      const session: Session = {
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        username: response.user.username,
        email: response.user.email,
        role: response.user.role
      };
      this.session.set(session);
      localStorage.setItem('ticketflash.session', JSON.stringify(session));

      const userRole = session.role.toUpperCase().includes('ADMIN') ? 'admin' : 'user';
      this.role.set(userRole);
      this.status.set(`Logged in as ${session.email}`);
      await this.loadMyBookings();
      return true;
    } catch {
      this.status.set('Login failed');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async register(payload: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }, asAdmin: boolean): Promise<boolean> {
    if (!payload.username || !payload.email || !payload.password) {
      this.status.set('Username, email and password are required');
      return false;
    }

    this.isLoading.set(true);
    try {
      const endpoint = asAdmin ? '/auth/register-admin' : '/auth/register';
      await firstValueFrom(
        this.http.post<BackendRegisterResponse>(`${this.apiBase}${endpoint}`, {
          username: payload.username,
          email: payload.email,
          password: payload.password,
          fullName: payload.fullName || payload.username
        })
      );
      this.status.set(`Registered ${asAdmin ? 'admin' : 'user'} ${payload.email}`);
      return true;
    } catch {
      this.status.set(`Register ${asAdmin ? 'admin' : 'user'} failed`);
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  logout(): void {
    this.session.set(null);
    this.myBookings.set([]);
    this.lastBooking.set(null);
    localStorage.removeItem('ticketflash.session');
    this.status.set('Logged out');
  }

  async loadEvents(): Promise<void> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<BackendPaged<BackendEvent>>(`${this.apiBase}/events?page=0&size=50&sortBy=id&sortDir=asc`)
      );
      this.events.set((response.content ?? []).map((event) => this.mapEvent(event)));
      this.status.set(`Loaded ${this.events().length} events`);
    } catch {
      this.status.set('Cannot load events from backend');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMyBookings(): Promise<void> {
    if (!this.session()) {
      return;
    }

    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<BackendBooking[]>(`${this.apiBase}/bookings/my-bookings`, {
          headers: this.authHeaders()
        })
      );
      this.myBookings.set((response ?? []).map((booking) => this.mapBooking(booking)));
    } catch {
      this.status.set('Cannot load my bookings');
    } finally {
      this.isLoading.set(false);
    }
  }

  setQuery(query: string): void {
    this.query.set(query);
  }

  setCategory(category: 'All' | EventItem['category']): void {
    this.category.set(category);
  }

  getEvent(id: string | null): EventItem | undefined {
    if (!id) {
      return undefined;
    }
    return this.events().find((event) => event.id === id);
  }

  updateCart(eventId: string, classId: string, delta: number): void {
    const copy = [...this.cart()];
    const index = copy.findIndex((item) => item.eventId === eventId && item.classId === classId);
    if (index >= 0) {
      const nextQty = copy[index].qty + delta;
      if (nextQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index] = { ...copy[index], qty: nextQty };
      }
    } else if (delta > 0) {
      copy.push({ eventId, classId, qty: delta });
    }
    this.cart.set(copy);
  }

  cartTotal(): number {
    return this.cart().reduce((sum, item) => {
      const event = this.getEvent(item.eventId);
      const ticketClass = event?.classes.find((entry) => entry.id === item.classId);
      return sum + (ticketClass ? ticketClass.price * item.qty : 0);
    }, 0);
  }

  async checkout(email: string): Promise<Booking | null> {
    void email;
    if (this.cart().length === 0) {
      return null;
    }

    if (!this.session()) {
      this.status.set('Please login first');
      return null;
    }

    const firstEventId = this.cart()[0].eventId;
    const mixedEvents = this.cart().some((item) => item.eventId !== firstEventId);
    if (mixedEvents) {
      this.status.set('Checkout currently supports one event per order');
      return null;
    }

    this.isLoading.set(true);
    try {
      const created = await firstValueFrom(
        this.http.post<BackendBooking>(
          `${this.apiBase}/bookings`,
          {
            eventId: Number(firstEventId),
            ticketDetails: this.cart().map((item) => ({
              ticketId: Number(item.classId),
              quantity: item.qty
            }))
          },
          {
            headers: this.authHeaders()
          }
        )
      );

      await firstValueFrom(
        this.http.post<{ message: string }>(
          `${this.apiBase}/payments/${created.id}/pay`,
          {},
          { headers: this.authHeaders() }
        )
      );

      const booking = this.mapBooking(created);
      booking.status = 'CONFIRMED';
      this.lastBooking.set(booking);
      this.myBookings.set([booking, ...this.myBookings()]);
      this.cart.set([]);
      this.status.set('Payment success');
      return booking;
    } catch {
      this.status.set('Checkout or payment failed');
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  formatVnd(amount: number): string {
    return VND.format(amount || 0);
  }

  private mapEvent(event: BackendEvent): EventItem {
    const category = this.inferCategory(event.name, event.description);
    const city = this.extractCity(event.venue?.address ?? 'Unknown');
    const date = new Date(event.startTime);

    return {
      id: String(event.id),
      title: event.name,
      subtitle: event.status === 'PUBLISHED' ? 'Live now' : 'Upcoming event',
      category,
      genre: category,
      venue: event.venue?.name ?? 'TBA Venue',
      city,
      date: event.startTime,
      dateLabel: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }),
      timeLabel: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      onSale: event.status === 'PUBLISHED',
      featured: event.status === 'PUBLISHED',
      viewing: 0,
      description: event.description,
      hero: this.heroForCategory(category),
      classes: (event.ticketClasses ?? []).map((ticket) => ({
        id: String(ticket.id),
        name: ticket.name,
        price: Number(ticket.price ?? 0),
        available: ticket.quantityAvailable,
        perks: `${ticket.quantityAvailable} available`
      }))
    };
  }

  private mapBooking(booking: BackendBooking): Booking {
    return {
      id: booking.id,
      eventId: String(booking.eventId),
      date: new Date(booking.bookingDate).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      qty: booking.totalTicket,
      total: this.estimateBookingTotal(booking),
      status: booking.status
    };
  }

  private estimateBookingTotal(booking: BackendBooking): number {
    const event = this.getEvent(String(booking.eventId));
    const minPrice = event ? Math.min(...event.classes.map((entry) => entry.price)) : 0;
    return minPrice * booking.totalTicket;
  }

  private inferCategory(name: string, description: string): EventItem['category'] {
    const text = `${name} ${description}`.toLowerCase();
    if (text.includes('concert') || text.includes('music')) return 'Concert';
    if (text.includes('theater') || text.includes('drama')) return 'Theater';
    if (text.includes('sport') || text.includes('football')) return 'Sports';
    if (text.includes('festival')) return 'Festival';
    return 'Concert';
  }

  private extractCity(address: string): string {
    if (!address) {
      return 'Unknown';
    }
    const parts = address.split(',').map((entry) => entry.trim()).filter(Boolean);
    return parts[parts.length - 1] ?? address;
  }

  private heroForCategory(category: EventItem['category']): string {
    const heroes: Record<EventItem['category'], string> = {
      Concert: 'linear-gradient(135deg, #0f0f13 0%, #4c1d95 45%, #e5392f 100%)',
      Theater: 'linear-gradient(135deg, #1f2937 0%, #7c2d12 45%, #b91c1c 100%)',
      Sports: 'linear-gradient(135deg, #0a1023 0%, #1e3a8a 45%, #2563eb 100%)',
      Festival: 'linear-gradient(135deg, #0b1321 0%, #14532d 45%, #f97316 100%)'
    };
    return heroes[category];
  }

  private authHeaders(): HttpHeaders {
    const accessToken = this.session()?.accessToken;
    return new HttpHeaders({
      Authorization: `Bearer ${accessToken ?? ''}`
    });
  }

  private loadSession(): Session | null {
    try {
      const raw = localStorage.getItem('ticketflash.session');
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }
}
