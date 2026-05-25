import { AdminBooking, Booking, EventItem } from '../models/ticket.models';

export const VND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
});

export const EVENTS: EventItem[] = [
  {
    id: 'ev-weeknd-2026',
    title: 'The Weeknd',
    subtitle: 'After Hours Til Dawn',
    category: 'Concert',
    genre: 'R&B / Pop',
    venue: 'Phu Tho Stadium',
    city: 'Ho Chi Minh City',
    date: '2026-07-24T20:00:00+07:00',
    dateLabel: 'Fri, Jul 24 2026',
    timeLabel: '20:00 GMT+7',
    onSale: true,
    featured: true,
    viewing: 428,
    description: 'A full-scale stadium production with cinematic visuals, extended setlist, and synchronized crowd lighting experience.',
    hero: 'linear-gradient(135deg, #0f0f13 0%, #4c1d95 40%, #e5392f 100%)',
    classes: [
      { id: 'vip', name: 'VIP', price: 3600000, available: 48, perks: 'Prime view, priority entry' },
      { id: 'gold', name: 'Gold', price: 2600000, available: 180, perks: 'Great sightline, fast lane' },
      { id: 'standard', name: 'Standard', price: 1500000, available: 540, perks: 'Assigned seat' },
      { id: 'ga', name: 'General Admission', price: 900000, available: 820, perks: 'Standing floor access' }
    ]
  },
  {
    id: 'ev-bruno-2026',
    title: 'Bruno Mars',
    subtitle: '24K Live Nights',
    category: 'Concert',
    genre: 'Funk / Soul',
    venue: 'My Dinh National Stadium',
    city: 'Ha Noi',
    date: '2026-08-08T19:30:00+07:00',
    dateLabel: 'Sat, Aug 08 2026',
    timeLabel: '19:30 GMT+7',
    onSale: true,
    featured: true,
    viewing: 311,
    description: 'Chart-topping hits, premium live band, and an arena-ready dance production staged for one-night spectacle.',
    hero: 'linear-gradient(135deg, #1f2937 0%, #0f766e 45%, #f59e0b 100%)',
    classes: [
      { id: 'vvip', name: 'VVIP', price: 4200000, available: 24, perks: 'Front block + lounge' },
      { id: 'vip', name: 'VIP', price: 3200000, available: 96, perks: 'Priority lane + merch lane' },
      { id: 'standard', name: 'Standard', price: 1800000, available: 430, perks: 'Assigned seat' }
    ]
  },
  {
    id: 'ev-hamlet-2026',
    title: 'Hamlet',
    subtitle: 'Modern Cut',
    category: 'Theater',
    genre: 'Drama',
    venue: 'Saigon Opera House',
    city: 'Ho Chi Minh City',
    date: '2026-06-18T20:00:00+07:00',
    dateLabel: 'Thu, Jun 18 2026',
    timeLabel: '20:00 GMT+7',
    onSale: true,
    featured: false,
    viewing: 96,
    description: 'A contemporary adaptation with minimalist staging, immersive sound design, and bilingual subtitles.',
    hero: 'linear-gradient(135deg, #1f2937 0%, #7c2d12 40%, #b91c1c 100%)',
    classes: [
      { id: 'box', name: 'Box', price: 2400000, available: 16, perks: 'Private box + host service' },
      { id: 'orchestra', name: 'Orchestra', price: 1400000, available: 110, perks: 'Best acoustic position' },
      { id: 'balcony', name: 'Balcony', price: 700000, available: 190, perks: 'Elevated full-stage view' }
    ]
  },
  {
    id: 'ev-ucl-2026',
    title: 'Champions Tour',
    subtitle: 'Legends Matchday',
    category: 'Sports',
    genre: 'Football',
    venue: 'Hang Day Arena',
    city: 'Ha Noi',
    date: '2026-09-02T18:30:00+07:00',
    dateLabel: 'Wed, Sep 02 2026',
    timeLabel: '18:30 GMT+7',
    onSale: true,
    featured: false,
    viewing: 224,
    description: 'International legend squads reunite for a high-intensity exhibition game with live pre-show performance.',
    hero: 'linear-gradient(135deg, #0a1023 0%, #1e3a8a 45%, #2563eb 100%)',
    classes: [
      { id: 'pitchside', name: 'Pitchside', price: 2800000, available: 34, perks: 'Closest field view' },
      { id: 'premium', name: 'Premium', price: 1700000, available: 260, perks: 'Covered stand section' },
      { id: 'regular', name: 'Regular', price: 950000, available: 900, perks: 'General stand access' }
    ]
  },
  {
    id: 'ev-river-fest',
    title: 'River Sound Fest',
    subtitle: 'Sunset Edition',
    category: 'Festival',
    genre: 'Multi-genre',
    venue: 'Thu Duc Riverside Park',
    city: 'Ho Chi Minh City',
    date: '2026-10-11T15:00:00+07:00',
    dateLabel: 'Sun, Oct 11 2026',
    timeLabel: '15:00 GMT+7',
    onSale: false,
    featured: false,
    viewing: 142,
    description: 'Open-air multi-stage festival featuring indie, electronic, and hip-hop acts with sunset riverfront backdrop.',
    hero: 'linear-gradient(135deg, #0b1321 0%, #14532d 45%, #f97316 100%)',
    classes: [
      { id: 'vip', name: 'VIP', price: 2200000, available: 120, perks: 'Exclusive deck + private bar' },
      { id: 'daypass', name: 'Day Pass', price: 1200000, available: 1200, perks: 'All stages access' }
    ]
  }
];

export const MY_BOOKINGS_SEED: Booking[] = [
  {
    id: 'TFB-8392-KQRM',
    eventId: 'ev-weeknd-2026',
    date: 'May 22, 2026 14:22',
    qty: 2,
    total: 7200000,
    status: 'CONFIRMED'
  },
  {
    id: 'TFB-1508-HLWN',
    eventId: 'ev-hamlet-2026',
    date: 'May 20, 2026 19:06',
    qty: 2,
    total: 2940000,
    status: 'PENDING'
  },
  {
    id: 'TFB-6649-TRPX',
    eventId: 'ev-ucl-2026',
    date: 'May 19, 2026 11:52',
    qty: 4,
    total: 7140000,
    status: 'CANCELLED'
  }
];

export const ADMIN_BOOKINGS_SEED: AdminBooking[] = [
  {
    id: 'TFB-8392-KQRM',
    event: 'ev-weeknd-2026',
    user: 'thanh.nguyen@gmail.com',
    created: 'May 22, 2026 14:22',
    tickets: 2,
    total: 7200000,
    status: 'CONFIRMED'
  },
  {
    id: 'TFB-7421-PZXA',
    event: 'ev-bruno-2026',
    user: 'linh.pham@gmail.com',
    created: 'May 21, 2026 09:41',
    tickets: 3,
    total: 9600000,
    status: 'CONFIRMED'
  },
  {
    id: 'TFB-1508-HLWN',
    event: 'ev-hamlet-2026',
    user: 'duy.hoang@yahoo.com',
    created: 'May 20, 2026 19:06',
    tickets: 2,
    total: 2940000,
    status: 'PENDING'
  }
];
