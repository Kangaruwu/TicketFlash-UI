import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type ApiSession = {
  username: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
};

type TicketClassResponse = {
  id: number;
  name: string;
  price: number;
  quantityAvailable: number;
  quantitySold: number;
  eventId: number;
};

type EventResponse = {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  ticketClasses: TicketClassResponse[];
};

type PagedResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

type BookingResponse = {
  id: string;
  qrToken: string;
  eventName: string;
  eventId: number;
  email: string;
  status: string;
  totalTicket: number;
  bookingDate: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/v1';

  readonly userSession = signal<ApiSession | null>(null);
  readonly adminSession = signal<ApiSession | null>(null);

  readonly events = signal<EventResponse[]>([]);
  readonly bookings = signal<BookingResponse[]>([]);
  readonly selectedEventId = signal<number | null>(null);
  readonly selectedTicketId = signal<number | null>(null);
  readonly bookingQuantity = signal(1);

  readonly selectedBookingId = signal('');
  readonly checkInBookingId = signal('');
  readonly checkInQrToken = signal('');
  readonly qrPreviewUrl = signal<string | null>(null);

  readonly status = signal('Ready.');
  readonly isLoading = signal(false);

  userRegister = {
    username: '',
    email: '',
    password: '',
    fullName: ''
  };

  adminRegister = {
    username: '',
    email: '',
    password: '',
    fullName: ''
  };

  userLogin = {
    usernameOrEmail: '',
    password: ''
  };

  adminLogin = {
    usernameOrEmail: '',
    password: ''
  };

  readonly selectedEvent = computed(() => {
    const id = this.selectedEventId();
    if (!id) return null;
    return this.events().find((event) => event.id === id) ?? null;
  });

  readonly selectedTicket = computed(() => {
    const event = this.selectedEvent();
    const ticketId = this.selectedTicketId();
    if (!event || !ticketId) return null;
    return event.ticketClasses.find((ticket) => ticket.id === ticketId) ?? null;
  });

  async loadEvents(): Promise<void> {
    await this.runAction(async () => {
      const response = await firstValueFrom(
        this.http.get<PagedResponse<EventResponse>>(
          `${this.apiBase}/events?page=0&size=20&sortBy=id&sortDir=asc`
        )
      );
      this.events.set(response.content ?? []);
      this.status.set(`Loaded ${this.events().length} events.`);
      if (!this.selectedEventId() && this.events().length > 0) {
        this.selectedEventId.set(this.events()[0].id);
      }
      this.syncTicketSelection();
    }, 'Cannot load events');
  }

  async registerUser(): Promise<void> {
    await this.register('/auth/register', this.userRegister, 'User registered.');
  }

  async registerAdmin(): Promise<void> {
    await this.register('/auth/register-admin', this.adminRegister, 'Admin registered.');
  }

  async loginUser(): Promise<void> {
    await this.login('/auth/login', this.userLogin, (session) => {
      this.userSession.set(session);
      this.status.set(`User login OK: ${session.email}`);
    });
  }

  async loginAdmin(): Promise<void> {
    await this.login('/auth/login', this.adminLogin, (session) => {
      this.adminSession.set(session);
      this.status.set(`Admin login OK: ${session.email}`);
    });
  }

  logoutUser(): void {
    this.userSession.set(null);
    this.bookings.set([]);
    this.status.set('User session cleared.');
  }

  logoutAdmin(): void {
    this.adminSession.set(null);
    this.status.set('Admin session cleared.');
  }

  onEventChange(eventIdRaw: string): void {
    const eventId = Number(eventIdRaw);
    this.selectedEventId.set(Number.isNaN(eventId) ? null : eventId);
    this.syncTicketSelection();
  }

  onTicketChange(ticketIdRaw: string): void {
    const ticketId = Number(ticketIdRaw);
    this.selectedTicketId.set(Number.isNaN(ticketId) ? null : ticketId);
  }

  async createBooking(): Promise<void> {
    const session = this.userSession();
    if (!session) {
      this.status.set('User must login first.');
      return;
    }
    const eventId = this.selectedEventId();
    const ticketId = this.selectedTicketId();
    if (!eventId || !ticketId) {
      this.status.set('Select event and ticket class first.');
      return;
    }

    await this.runAction(async () => {
      const quantity = Math.max(1, this.bookingQuantity());
      const booking = await firstValueFrom(
        this.http.post<BookingResponse>(
          `${this.apiBase}/bookings`,
          {
            eventId,
            ticketDetails: [
              {
                ticketId,
                quantity
              }
            ]
          },
          {
            headers: this.authHeaders(session.accessToken)
          }
        )
      );

      this.status.set(`Booking created: ${booking.id}`);
      this.selectedBookingId.set(booking.id);
      await this.loadMyBookings();
    }, 'Booking failed');
  }

  async loadMyBookings(): Promise<void> {
    const session = this.userSession();
    if (!session) {
      this.status.set('User must login first.');
      return;
    }

    await this.runAction(async () => {
      const bookings = await firstValueFrom(
        this.http.get<BookingResponse[]>(`${this.apiBase}/bookings/my-bookings`, {
          headers: this.authHeaders(session.accessToken)
        })
      );
      this.bookings.set(bookings ?? []);
      this.status.set(`Loaded ${this.bookings().length} bookings.`);
      if (!this.selectedBookingId() && this.bookings().length > 0) {
        this.selectedBookingId.set(this.bookings()[0].id);
      }
    }, 'Cannot load user bookings');
  }

  async payBooking(): Promise<void> {
    const session = this.userSession();
    const bookingId = this.selectedBookingId().trim();
    if (!session || !bookingId) {
      this.status.set('Need user login and booking ID.');
      return;
    }

    await this.runAction(async () => {
      const response = await firstValueFrom(
        this.http.post<{ message: string }>(
          `${this.apiBase}/payments/${bookingId}/pay`,
          {},
          {
            headers: this.authHeaders(session.accessToken)
          }
        )
      );
      this.status.set(response.message || 'Payment success.');
      await this.loadMyBookings();
    }, 'Payment failed');
  }

  async fetchQr(): Promise<void> {
    const session = this.userSession();
    const bookingId = this.selectedBookingId().trim();
    if (!session || !bookingId) {
      this.status.set('Need user login and booking ID.');
      return;
    }

    await this.runAction(async () => {
      const blob = await firstValueFrom(
        this.http.get(`${this.apiBase}/bookings/my-bookings/${bookingId}/qr`, {
          headers: this.authHeaders(session.accessToken),
          responseType: 'blob'
        })
      );
      if (this.qrPreviewUrl()) {
        URL.revokeObjectURL(this.qrPreviewUrl()!);
      }
      const url = URL.createObjectURL(blob);
      this.qrPreviewUrl.set(url);

      const booking = this.bookings().find((item) => item.id === bookingId);
      if (booking) {
        this.checkInBookingId.set(booking.id);
        this.checkInQrToken.set(booking.qrToken);
      }

      this.status.set(`QR ready for booking ${bookingId}.`);
    }, 'Cannot fetch QR');
  }

  async checkIn(): Promise<void> {
    const session = this.adminSession();
    const bookingId = this.checkInBookingId().trim();
    const qrToken = this.checkInQrToken().trim();
    if (!session || !bookingId || !qrToken) {
      this.status.set('Need admin login, booking ID and qr token.');
      return;
    }

    await this.runAction(async () => {
      const response = await firstValueFrom(
        this.http.post<{
          bookingId: string;
          checkedIn: boolean;
          checkedInAt: string;
        }>(
          `${this.apiBase}/check-in`,
          {
            bookingId,
            qrToken
          },
          {
            headers: this.authHeaders(session.accessToken)
          }
        )
      );
      this.status.set(
        `Check-in success: ${response.bookingId} at ${response.checkedInAt}`
      );
    }, 'Check-in failed');
  }

  pickBooking(bookingId: string): void {
    this.selectedBookingId.set(bookingId);
    const booking = this.bookings().find((item) => item.id === bookingId);
    if (booking) {
      this.checkInBookingId.set(booking.id);
      this.checkInQrToken.set(booking.qrToken);
    }
  }

  private syncTicketSelection(): void {
    const event = this.selectedEvent();
    if (!event || event.ticketClasses.length === 0) {
      this.selectedTicketId.set(null);
      return;
    }
    const hasCurrent = event.ticketClasses.some(
      (ticket) => ticket.id === this.selectedTicketId()
    );
    if (!hasCurrent) {
      this.selectedTicketId.set(event.ticketClasses[0].id);
    }
  }

  private authHeaders(accessToken: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
  }

  private async register(
    path: string,
    payload: {
      username: string;
      email: string;
      password: string;
      fullName: string;
    },
    successMessage: string
  ): Promise<void> {
    await this.runAction(async () => {
      await firstValueFrom(this.http.post(`${this.apiBase}${path}`, payload));
      this.status.set(successMessage);
    }, 'Register failed');
  }

  private async login(
    path: string,
    payload: {
      usernameOrEmail: string;
      password: string;
    },
    onSuccess: (session: ApiSession) => void
  ): Promise<void> {
    await this.runAction(async () => {
      const response = await firstValueFrom(
        this.http.post<{
          tokens: { accessToken: string; refreshToken: string };
          user: { username: string; email: string; role: string };
        }>(`${this.apiBase}${path}`, payload)
      );

      onSuccess({
        username: response.user.username,
        email: response.user.email,
        role: response.user.role,
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken
      });
    }, 'Login failed');
  }

  private async runAction(
    action: () => Promise<void>,
    defaultErrorMessage: string
  ): Promise<void> {
    this.isLoading.set(true);
    try {
      await action();
    } catch (error: unknown) {
      this.status.set(`${defaultErrorMessage}: ${this.extractError(error)}`);
    } finally {
      this.isLoading.set(false);
    }
  }

  private extractError(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object') {
      const anyError = error as {
        error?: { message?: string; error?: string } | string;
        message?: string;
        status?: number;
      };

      if (typeof anyError.error === 'string') return anyError.error;
      if (anyError.error?.message) return anyError.error.message;
      if (anyError.error?.error) return anyError.error.error;
      if (anyError.message) return anyError.message;
      if (anyError.status) return `HTTP ${anyError.status}`;
    }
    return 'Unknown error';
  }
}
