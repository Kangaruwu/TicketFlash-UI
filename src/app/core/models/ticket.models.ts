export type UserRole = 'user' | 'admin';

export interface TicketClass {
  id: string;
  name: string;
  price: number;
  available: number;
  perks: string;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Concert' | 'Theater' | 'Sports' | 'Festival';
  genre: string;
  venue: string;
  city: string;
  date: string;
  dateLabel: string;
  timeLabel: string;
  onSale: boolean;
  featured: boolean;
  viewing: number;
  description: string;
  hero: string;
  classes: TicketClass[];
}

export interface CartItem {
  eventId: string;
  classId: string;
  qty: number;
}

export interface Booking {
  id: string;
  eventId: string;
  date: string;
  qty: number;
  total: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

export interface AdminBooking {
  id: string;
  event: string;
  user: string;
  created: string;
  tickets: number;
  total: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}
