// Main app for TicketFlash

const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#E5392F", "#B82A22", "#FCE9E6"]
}/*EDITMODE-END*/;

const PALETTE_OPTIONS = [
  ['#E5392F', '#B82A22', '#FCE9E6'], // electric red (default)
  ['#1E40AF', '#172E7A', '#E0E7F4'], // cobalt
  ['#1B5E3F', '#0F4329', '#DCE9E0'], // forest
  ['#6E2BA6', '#4A1B75', '#EDE0F4'], // royal purple
  ['#C97B16', '#8A5A0B', '#F9EAD0'], // ember
  ['#0C0C0A', '#000000', '#E8E3D8'], // monochrome
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [role, setRole] = useStateApp('user'); // 'user' | 'admin'
  const [route, setRoute] = useStateApp('browse');
  const [cart, setCart] = useStateApp([]);
  const [query, setQuery] = useStateApp('');
  const [categoryFilter, setCategoryFilter] = useStateApp('All');
  const [lastBooking, setLastBooking] = useStateApp(null);
  const [toast, setToast] = useStateApp(null);

  // Apply palette
  useEffectApp(() => {
    const p = t.palette || PALETTE_OPTIONS[0];
    document.documentElement.style.setProperty('--accent', p[0]);
    document.documentElement.style.setProperty('--accent-ink', p[1]);
    document.documentElement.style.setProperty('--accent-soft', p[2]);
  }, [t.palette]);

  const events = window.TF_EVENTS;
  const cartCount = useMemoApp(() => cart.reduce((a, b) => a + b.qty, 0), [cart]);

  // Toast helper
  useEffectApp(() => { if (toast) { const id = setTimeout(() => setToast(null), 2400); return () => clearTimeout(id); } }, [toast]);

  const navigate = (to) => {
    if (to.startsWith('event:')) {
      setRoute(to);
    } else if (to === 'cart') {
      setRoute('cart');
    } else {
      setRoute(to);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Selected event for detail route
  const eventId = route.startsWith('event:') ? route.slice(6) : null;
  const event = eventId ? events.find(e => e.id === eventId) : null;

  // Selected booking
  const userBookingId = route.startsWith('booking:') ? route.slice(8) : null;
  const myBookings = window.TF_MY_BOOKINGS_SEED;
  const userBooking = userBookingId
    ? (lastBooking && lastBooking.id === userBookingId ? lastBooking : myBookings.find(b => b.id === userBookingId))
    : null;

  const adminBookingId = route.startsWith('admin-booking:') ? route.slice(14) : null;
  const adminBooking = adminBookingId ? window.TF_BOOKINGS_SEED.find(b => b.id === adminBookingId) : null;

  // Sync category filter into nav clicks
  useEffectApp(() => {
    if (route === 'concerts') { setCategoryFilter('Concert'); setRoute('browse'); }
    else if (route === 'sports') { setCategoryFilter('Sports'); setRoute('browse'); }
    else if (route === 'theater') { setCategoryFilter('Theater'); setRoute('browse'); }
  }, [route]);

  // ----- Render -----
  let screen = null;
  if (role === 'user') {
    if (route === 'browse') screen = <BrowseScreen events={events} navigate={navigate} query={query} setQuery={setQuery} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />;
    else if (event) screen = <EventDetailScreen event={event} navigate={navigate} cart={cart} setCart={setCart} />;
    else if (userBookingId) screen = <TicketDetailScreen booking={userBooking} events={events} navigate={navigate} />;
    else if (route === 'cart') screen = <CartScreen events={events} cart={cart} setCart={setCart} navigate={navigate} />;
    else if (route === 'payment') screen = <PaymentScreen events={events} cart={cart} setCart={setCart} navigate={navigate} setLastBooking={setLastBooking} />;
    else if (route === 'ticket') screen = <TicketScreen booking={lastBooking} navigate={navigate} />;
    else if (route === 'mybookings') screen = <MyBookingsScreen events={events} lastBooking={lastBooking} navigate={navigate} />;
    else screen = <BrowseScreen events={events} navigate={navigate} query={query} setQuery={setQuery} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />;
  } else {
    if (route === 'admin-events') screen = <AdminEvents events={events} navigate={navigate} />;
    else if (route === 'admin-event-new') screen = <AdminEventNew navigate={navigate} />;
    else if (adminBookingId) screen = <AdminBookingDetail booking={adminBooking} events={events} navigate={navigate} />;
    else if (route === 'admin-bookings') screen = <AdminBookings events={events} navigate={navigate} />;
    else if (route === 'admin-venues') screen = <AdminVenues />;
    else screen = <AdminOverview events={events} navigate={navigate} />;
  }

  return (
    <div className="tf-shell">
      <TopNav role={role} setRole={setRole} route={route.includes(':') ? '' : route} navigate={navigate} cartCount={cartCount} query={query} setQuery={setQuery} />
      <div style={{ flex: 1 }}>{screen}</div>

      {toast && <div className="tf-toast">{toast}</div>}

      <TweaksPanel>
        <TweakSection label="Brand accent" />
        <TweakColor label="Palette" value={t.palette}
          options={PALETTE_OPTIONS}
          onChange={(v) => setTweak('palette', v)} />
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>
          Changes the accent color used across CTAs, highlights, and hover states. Editorial type, neutrals, and layout stay constant.
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
