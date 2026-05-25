// Extra screens: active holds feed, ticket detail (user), booking detail (admin)

const { useState: useStateE, useEffect: useEffectE, useMemo: useMemoE, useRef: useRefE } = React;

// ─────────────────────────────────────────────────────────────
// Seed active holds (live people reserving but not yet paid)
// ─────────────────────────────────────────────────────────────
const NAMES_POOL = [
  { name: 'Thanh N.', email: 't***@gmail.com' },
  { name: 'Minh T.', email: 'm***@outlook.com' },
  { name: 'Linh P.', email: 'l***@gmail.com' },
  { name: 'An L.', email: 'a***@yahoo.com' },
  { name: 'Duy H.', email: 'd***@gmail.com' },
  { name: 'Mai B.', email: 'm***@gmail.com' },
  { name: 'Phuc D.', email: 'p***@gmail.com' },
  { name: 'Huy V.', email: 'h***@gmail.com' },
  { name: 'Trang L.', email: 't***@gmail.com' },
  { name: 'Quang N.', email: 'q***@outlook.com' },
  { name: 'Hieu V.', email: 'h***@yahoo.com' },
  { name: 'Khanh P.', email: 'k***@gmail.com' },
];

const HOLD_STATES = ['CART', 'CHECKOUT', 'PAYING'];

function randomHold(event, now, suggestedClass) {
  const name = NAMES_POOL[Math.floor(Math.random() * NAMES_POOL.length)];
  const cls = suggestedClass || event.classes[Math.floor(Math.random() * event.classes.length)];
  const qty = 1 + Math.floor(Math.random() * 3);
  const ageSec = Math.floor(Math.random() * 90); // hold started 0–90 sec ago
  const totalHoldSec = 120;
  const remaining = Math.max(5, totalHoldSec - ageSec);
  const state = HOLD_STATES[Math.floor(Math.random() * HOLD_STATES.length)];
  return {
    id: 'h-' + Math.random().toString(36).slice(2, 9),
    user: name,
    cls,
    qty,
    expiresAt: now + remaining * 1000,
    state,
    startedAt: now - ageSec * 1000,
  };
}

function useActiveHolds(event, startCount = 5) {
  const [holds, setHolds] = useStateE([]);
  const eventIdRef = useRefE(event.id);

  // Initialize / re-init when event changes
  useEffectE(() => {
    const now = Date.now();
    const initial = Array.from({ length: startCount }, () => randomHold(event, now));
    setHolds(initial);
    eventIdRef.current = event.id;
  }, [event.id]);

  // Tick: every second, prune expired and occasionally spawn / advance
  useEffectE(() => {
    const id = setInterval(() => {
      setHolds((cur) => {
        const now = Date.now();
        let next = cur.filter(h => h.expiresAt > now);
        // 30% chance to advance state
        next = next.map(h => {
          if (Math.random() < 0.05 && h.state !== 'PAYING') {
            const nextIdx = Math.min(HOLD_STATES.length - 1, HOLD_STATES.indexOf(h.state) + 1);
            return { ...h, state: HOLD_STATES[nextIdx] };
          }
          return h;
        });
        // Spawn new
        if (Math.random() < 0.35 && next.length < 8) {
          next = [randomHold(event, now), ...next];
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [event.id]);

  return holds;
}

function ActiveHoldsPanel({ event }) {
  const holds = useActiveHolds(event, 5);
  const [now, setNow] = useStateE(Date.now());
  useEffectE(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (holds.length === 0) return null;

  const stateMeta = {
    CART: { label: 'In cart', color: 'var(--muted)', bg: 'var(--bg-warm)' },
    CHECKOUT: { label: 'Checkout', color: '#8A5A0B', bg: '#FFF6E6' },
    PAYING: { label: 'Paying', color: 'var(--accent)', bg: 'var(--accent-soft)' },
  };

  return (
    <div className="tf-card" style={{ padding: 22, marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="tf-pulse" style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: 999 }}></span>
          <div className="tf-eyebrow">Live · holding tickets now</div>
        </div>
        <span className="tf-mono tf-num" style={{ fontSize: 11, color: 'var(--muted)' }}>{holds.length} active</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {holds.slice(0, 5).map(h => {
          const secLeft = Math.max(0, Math.ceil((h.expiresAt - now) / 1000));
          const mm = String(Math.floor(secLeft / 60)).padStart(2, '0');
          const ss = String(secLeft % 60).padStart(2, '0');
          const pct = secLeft / 120;
          const meta = stateMeta[h.state];
          return (
            <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 10, alignItems: 'center', fontSize: 12, padding: '6px 0' }}>
              <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--bg-warm)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 500, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>
                {h.user.name.split(' ').map(s => s[0]).join('').slice(0, 2)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                  <span style={{ color: 'var(--ink-2)' }}>{h.user.name}</span>
                  <span style={{ background: meta.bg, color: meta.color, fontSize: 9.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 999 }}>{meta.label}</span>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 1 }}>{h.qty}× {h.cls.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, position: 'relative' }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="16" cy="16" r="13" fill="none" stroke="var(--line)" strokeWidth="2" />
                    <circle cx="16" cy="16" r="13" fill="none"
                      stroke={secLeft < 30 ? 'var(--bad)' : secLeft < 60 ? 'var(--warn)' : 'var(--accent)'}
                      strokeWidth="2"
                      strokeDasharray={81.7}
                      strokeDashoffset={81.7 - pct * 81.7}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear' }} />
                  </svg>
                  <div className="tf-mono tf-num" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 9, color: secLeft < 30 ? 'var(--bad)' : 'var(--ink)', fontWeight: 500 }}>{mm}:{ss}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg-soft)', borderRadius: 8, fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 8, alignItems: 'start' }}>
        <Icon.shield width="12" height="12" style={{ marginTop: 2, flexShrink: 0 }} />
        <span>Pessimistic lock — these seats are reserved while users check out. Released back to the pool if the 2-min hold expires.</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TICKET DETAIL (user) — view full e-tickets for any booking
// ─────────────────────────────────────────────────────────────
function TicketDetailScreen({ booking, events, navigate }) {
  // Booking can be either a "lastBooking" (with items + ev) or a seeded shorter one
  if (!booking) {
    return (
      <div className="tf-container" style={{ padding: '120px 32px', textAlign: 'center' }}>
        <h1 className="tf-display" style={{ fontSize: 48 }}>Booking not found</h1>
        <button onClick={() => navigate('mybookings')} className="tf-btn tf-btn-ink">Back to my tickets</button>
      </div>
    );
  }

  // Normalize the booking into the rich shape
  const rich = booking.items
    ? booking
    : (() => {
        const ev = events.find(e => e.id === booking.eventId);
        const cls = ev?.classes[1] || ev?.classes[0];
        return {
          id: booking.id,
          status: booking.status,
          created: booking.date,
          email: 'thanh.nguyen@gmail.com',
          subtotal: Math.round(booking.total / 1.05),
          fee: booking.total - Math.round(booking.total / 1.05),
          total: booking.total,
          items: [{ event: ev, cls, qty: booking.qty, eventId: ev.id, classId: cls.id }],
        };
      })();

  const ev0 = rich.items[0].event;
  const upcoming = new Date(ev0.date) > new Date();

  return (
    <div className="tf-container" style={{ padding: '40px 32px 80px' }}>
      <div style={{ marginBottom: 16 }}><BackLink onClick={() => navigate('mybookings')}>All my tickets</BackLink></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 32 }}>
        <div>
          <div className="tf-eyebrow">Booking · <span className="tf-mono">{rich.id}</span></div>
          <h1 className="tf-display" style={{ fontSize: 56, margin: '10px 0 0' }}>{ev0.title} <span className="tf-italic" style={{ color: 'var(--muted)' }}>{ev0.subtitle}</span></h1>
        </div>
        <StatusTag status={rich.status} size="md" />
      </div>

      {/* Quick facts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 32, padding: '24px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <Fact label="Date" main={ev0.dateLabel} sub={ev0.timeLabel} />
        <Fact label="Venue" main={ev0.venue} sub={ev0.city} />
        <Fact label="Tickets" main={`${rich.items.reduce((a, b) => a + b.qty, 0)} ticket${rich.items.reduce((a, b) => a + b.qty, 0) > 1 ? 's' : ''}`} sub={rich.items.map(i => i.cls.name).join(' · ')} />
        <Fact label="Total paid" main={TF_FMT.shortCurrency(rich.total)} sub={`Inc. ${TF_FMT.shortCurrency(rich.fee)} fee`} />
      </div>

      {/* Banner */}
      {rich.status === 'CONFIRMED' && upcoming && (
        <div style={{ marginTop: 24 }}>
          <Banner tone="info" icon={<Icon.bell width="18" height="18" />}
            action={<div style={{ display: 'flex', gap: 6 }}>
              <button className="tf-btn tf-btn-ghost tf-btn-sm"><Icon.download /> Download all</button>
              <button className="tf-btn tf-btn-ink tf-btn-sm"><Icon.share /> Add to wallet</button>
            </div>}>
            Save tickets to your phone — bring the QR to the venue. Each ticket scans once.
          </Banner>
        </div>
      )}
      {rich.status === 'CANCELLED' && (
        <div style={{ marginTop: 24 }}>
          <Banner tone="danger" icon={<Icon.close />} title="Cancelled.">
            Auto-refund processed to original payment method. Allow 3–5 business days.
          </Banner>
        </div>
      )}

      <h2 style={{ marginTop: 40, fontSize: 14, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        Your tickets — {rich.items.reduce((a, b) => a + b.qty, 0)} total
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16, opacity: rich.status === 'CANCELLED' ? 0.4 : 1 }}>
        {rich.items.flatMap((item, i) => Array.from({ length: item.qty }, (_, j) => (
          <TicketCard key={`${i}-${j}`} event={item.event} cls={item.cls} ticketIdx={j + 1} ticketTotal={item.qty} bookingId={rich.id} seatNum={`${item.cls.id.toUpperCase()}-${String(j+1).padStart(3, '0')}-${17 + j * 3}`} />
        )))}
      </div>

      {/* Timeline */}
      <div style={{ marginTop: 56 }}>
        <h2 style={{ fontSize: 14, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>Booking timeline</h2>
        <BookingTimeline status={rich.status} created={rich.created} />
      </div>

      {/* Payment summary */}
      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="tf-card" style={{ padding: 24 }}>
          <div className="tf-eyebrow">Payment</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14, fontSize: 13 }}>
            <KV k="Method" v="Visa ending 4242" />
            <KV k="Transaction ID" v="pi_3PqZxR2eZvKYlo2C1nAB23cD" mono />
            <KV k="Subtotal" v={TF_FMT.shortCurrency(rich.subtotal)} />
            <KV k="Service fee (5%)" v={TF_FMT.shortCurrency(rich.fee)} />
            <div className="tf-divider" style={{ margin: '4px 0' }}></div>
            <KV k="Total charged" v={TF_FMT.shortCurrency(rich.total)} bold />
          </div>
        </div>
        <div className="tf-card" style={{ padding: 24 }}>
          <div className="tf-eyebrow">Need help?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            <ActionRow icon={<Icon.share />} title="Transfer to a friend" desc="Send a ticket to someone else's TicketFlash account." />
            <ActionRow icon={<Icon.download />} title="Download invoice (PDF)" desc="VAT-compliant invoice for your records." />
            <ActionRow icon={<Icon.bell />} title="Get event reminders" desc="Set a reminder 24h and 1h before doors." />
            {rich.status === 'CONFIRMED' && upcoming && (
              <ActionRow icon={<Icon.close />} title="Request a refund" desc="Available up to 48h before doors." danger />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionRow({ icon, title, desc, danger }) {
  return (
    <button style={{ display: 'flex', gap: 12, alignItems: 'start', padding: '10px 0', background: 'transparent', border: 0, borderTop: '1px solid var(--line-2)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', width: '100%', color: danger ? 'var(--bad)' : 'var(--ink)' }}>
      <IconBadge size={28} icon={icon} tone={danger ? 'danger' : 'warm'} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{desc}</div>
      </div>
      <Icon.arrow style={{ marginTop: 6, color: 'var(--muted-2)' }} />
    </button>
  );
}

function BookingTimeline({ status, created }) {
  const steps = [
    { t: 'Booking created', s: created || 'Just now', sub: '4 tickets held · Pessimistic lock acquired', state: 'done' },
    { t: 'Payment received', s: '~2 min later', sub: 'Visa ending 4242 · ₫ via TF Payments', state: status === 'PENDING' ? 'pending' : 'done' },
    { t: 'Booking confirmed', s: '~2 min later', sub: 'PENDING → CONFIRMED · QR generated', state: status === 'CONFIRMED' ? 'done' : status === 'CANCELLED' ? 'cancelled' : 'pending' },
    { t: 'Confirmation email', s: '+5s', sub: 'Spring Events @Async · Sent to your inbox', state: status === 'CONFIRMED' ? 'done' : status === 'CANCELLED' ? 'skipped' : 'pending' },
  ];
  if (status === 'CANCELLED') {
    steps.push({ t: 'Auto-cancelled', s: '2 min hold expired', sub: 'RabbitMQ DLX · Refund initiated', state: 'cancelled' });
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {steps.map((step, i) => {
        const dotColor = step.state === 'done' ? 'var(--ok)' : step.state === 'cancelled' ? 'var(--bad)' : step.state === 'skipped' ? 'var(--muted-2)' : 'var(--line)';
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 160px', gap: 12, padding: '12px 0', alignItems: 'start', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: dotColor, border: '2px solid #fff', boxShadow: '0 0 0 1px ' + dotColor, marginTop: 4, position: 'relative', zIndex: 2 }}></div>
              {i < steps.length - 1 && <div style={{ position: 'absolute', top: 12, bottom: -16, left: '50%', width: 1, background: 'var(--line)' }}></div>}
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14, color: step.state === 'skipped' ? 'var(--muted)' : 'var(--ink)' }}>{step.t}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{step.sub}</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'right', paddingTop: 2, fontFamily: 'var(--font-mono)' }}>{step.s}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN BOOKING DETAIL
// ─────────────────────────────────────────────────────────────
function AdminBookingDetail({ booking, events, navigate }) {
  if (!booking) {
    return (
      <div className="tf-container" style={{ padding: '80px 32px' }}>
        <button onClick={() => navigate('admin-bookings')} className="tf-btn tf-btn-ghost">← Back</button>
        <h1 className="tf-display" style={{ fontSize: 48, marginTop: 24 }}>Booking not found</h1>
      </div>
    );
  }
  const ev = events.find(e => e.id === booking.event);
  const cls = ev?.classes[1] || ev?.classes[0];
  const subtotal = Math.round(booking.total / 1.05);
  const fee = booking.total - subtotal;

  return (
    <div className="tf-container" style={{ padding: '40px 32px 80px' }}>
      <div style={{ marginBottom: 16 }}><BackLink onClick={() => navigate('admin-bookings')}>All bookings</BackLink></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 32 }}>
        <div>
          <div className="tf-eyebrow">Booking · <span className="tf-mono">{booking.id}</span></div>
          <h1 className="tf-display" style={{ fontSize: 52, margin: '8px 0 0' }}>{ev?.title}</h1>
          <div style={{ color: 'var(--muted)', marginTop: 4 }}>{booking.user} · Booked {booking.created}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <StatusTag status={booking.status} size="md" />
          <button className="tf-btn tf-btn-ghost"><Icon.download /> Invoice</button>
          {booking.status === 'CONFIRMED' && <button className="tf-btn tf-btn-ink"><Icon.bolt /> Refund</button>}
          {booking.status === 'PENDING' && <button className="tf-btn tf-btn-primary">Force confirm</button>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32, marginTop: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Items */}
          <div className="tf-card" style={{ padding: 24 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Items</div>
            <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderTop: '1px solid var(--line-2)' }}>
              <EventThumb event={ev} size="sm" width={80} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{ev.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{cls.name} · {ev.dateLabel} · {ev.venue}, {ev.city}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  {Array.from({ length: booking.tickets }, (_, i) => (
                    <span key={i} className="tf-tag tf-mono" style={{ background: '#fff', borderColor: 'var(--line)', fontSize: 10 }}>
                      {cls.id.toUpperCase()}-{String(i + 1).padStart(3, '0')}-{17 + i * 3}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="tf-num" style={{ fontWeight: 500 }}>{TF_FMT.shortCurrency(cls.price * booking.tickets)}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{TF_FMT.shortCurrency(cls.price)} × {booking.tickets}</div>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="tf-card" style={{ padding: 24 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Customer</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 999, background: 'linear-gradient(135deg, #29261b, #6E2BA6)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 500 }}>
                {booking.user.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{booking.user.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{booking.user}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="tf-btn tf-btn-ghost tf-btn-sm">Email</button>
                <button className="tf-btn tf-btn-ghost tf-btn-sm">View profile</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line-2)' }}>
              <Fact label="Customer since" main="Apr 2024" sub="2 years" />
              <Fact label="Lifetime bookings" main="14" sub="₫ 38.4M total" />
              <Fact label="No-show rate" main="0%" sub="Excellent" />
            </div>
          </div>

          {/* Timeline */}
          <div className="tf-card" style={{ padding: 24 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 16 }}>Event log</div>
            <BookingTimeline status={booking.status} created={booking.created} />
          </div>

          {/* Internal notes */}
          <div className="tf-card" style={{ padding: 24 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Internal notes</div>
            <textarea className="tf-textarea" rows="3" placeholder="Add a note visible to admins only…"></textarea>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
              <span>Notes are timestamped and attributed to your admin account.</span>
              <button className="tf-btn tf-btn-sm tf-btn-ink">Save note</button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="tf-card" style={{ padding: 24 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Financial summary</div>
            <KV k="Subtotal" v={TF_FMT.shortCurrency(subtotal)} />
            <KV k="Service fee" v={TF_FMT.shortCurrency(fee)} />
            <div className="tf-divider" style={{ margin: '12px 0' }}></div>
            <KV k="Total charged" v={TF_FMT.shortCurrency(booking.total)} bold />
            <div className="tf-divider" style={{ margin: '12px 0' }}></div>
            <KV k="Net to TicketFlash" v={TF_FMT.shortCurrency(fee + Math.round(subtotal * 0.08))} />
            <KV k="Net to organizer" v={TF_FMT.shortCurrency(subtotal - Math.round(subtotal * 0.08))} />
          </div>

          <div className="tf-card" style={{ padding: 24 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Payment</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <KV k="Method" v="Visa ····  4242" />
              <KV k="Provider" v="TF Payments" />
              <KV k="Status" v={booking.status === 'CONFIRMED' ? 'Captured' : booking.status === 'PENDING' ? 'Authorized' : 'Refunded'} />
              <KV k="Transaction" v="pi_3PqZxR…23cD" mono />
              <KV k="Captured at" v={booking.created} mono />
            </div>
          </div>

          <div className="tf-card" style={{ padding: 24 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Check-in</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div className="tf-display" style={{ fontSize: 36 }}>0<span style={{ fontSize: 18, color: 'var(--muted)' }}>/{booking.tickets}</span></div>
              <span className="tf-tag" style={{ background: 'var(--bg-warm)' }}>Not started</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>QR codes scan at door, results land here in real-time.</div>
            <button className="tf-btn tf-btn-ghost tf-btn-block" style={{ marginTop: 12 }}>Open scanner</button>
          </div>

          <div className="tf-card" style={{ padding: 24 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
              <ActivityRow when="Today 14:22" what="Confirmation email sent" who="System · @Async" />
              <ActivityRow when="Today 14:22" what="Status → CONFIRMED" who="System · Payment hook" />
              <ActivityRow when="Today 14:22" what="Payment authorized & captured" who="TF Payments" />
              <ActivityRow when="Today 14:20" what="Booking created · seats locked" who={booking.user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ when, what, who }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10, fontSize: 12 }}>
      <div style={{ color: 'var(--muted-2)', fontFamily: 'var(--font-mono)' }}>{when}</div>
      <div>
        <div style={{ color: 'var(--ink)' }}>{what}</div>
        <div style={{ color: 'var(--muted)', fontSize: 11 }}>{who}</div>
      </div>
    </div>
  );
}

window.ActiveHoldsPanel = ActiveHoldsPanel;
window.TicketDetailScreen = TicketDetailScreen;
window.AdminBookingDetail = AdminBookingDetail;
