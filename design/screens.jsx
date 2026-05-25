// User-facing screens for TicketFlash

const { useState: useStateS, useEffect: useEffectS, useMemo: useMemoS, useRef: useRefS } = React;

// ─────────────────────────────────────────────────────────────
// BROWSE
// ─────────────────────────────────────────────────────────────
function BrowseScreen({ events, navigate, query, setQuery, categoryFilter, setCategoryFilter }) {
  const featured = events.find(e => e.featured) || events[0];
  const otherFeatured = events.filter(e => e.featured && e.id !== featured.id);
  const allFiltered = useMemoS(() => {
    let list = events;
    if (categoryFilter !== 'All') list = list.filter(e => e.category === categoryFilter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(e => (e.title + e.subtitle + e.venue + e.city + e.genre).toLowerCase().includes(q));
    }
    return list;
  }, [events, query, categoryFilter]);

  const categories = ['All', 'Concert', 'Theater', 'Sports', 'Festival'];

  return (
    <div>
      {/* Hero */}
      <section className="tf-container" style={{ padding: '56px 32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'end' }}>
          <div>
            <div className="tf-eyebrow" style={{ marginBottom: 16 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', marginRight: 8, verticalAlign: 'middle' }}></span>
              Week of May 20 — On sale now
            </div>
            <h1 className="tf-display" style={{ fontSize: 96, margin: 0 }}>
              The night<br />
              <span className="tf-italic" style={{ color: 'var(--accent)' }}>belongs to you.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 440, marginTop: 24, lineHeight: 1.5 }}>
              Concerts, theater, sport and festivals — the moments worth showing up for. Booked in seconds, held for two minutes, yours forever.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button className="tf-btn tf-btn-ink tf-btn-lg" onClick={() => document.getElementById('tf-discover')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Discover events <Icon.arrow />
              </button>
              <button className="tf-btn tf-btn-ghost tf-btn-lg" onClick={() => navigate('mybookings')}>
                My tickets
              </button>
            </div>
          </div>
          <div onClick={() => navigate(`event:${featured.id}`)} style={{ cursor: 'pointer', position: 'relative' }}>
            <EventPoster event={featured} height={520} showLabel={false} scale={1.5} />
            <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: '#fff' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.9 }}>
                <span>{featured.dateLabel}</span>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>{featured.venue}, {featured.city}</span>
              </div>
              <div className="tf-display" style={{ fontSize: 56, lineHeight: 0.95, marginTop: 8, textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}>
                {featured.title}
                <div className="tf-italic" style={{ fontSize: 28, opacity: 0.92, marginTop: 4 }}>{featured.subtitle}</div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ background: '#fff', color: 'var(--ink)', padding: '10px 20px', borderRadius: 999, fontSize: 14, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Get tickets <Icon.arrow />
                </span>
                <span className="tf-pulse tf-mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%' }}></span>
                  {featured.viewing} viewing now
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="tf-container" style={{ padding: '32px 32px', borderTop: '1px solid var(--line)', marginTop: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48 }}>
          {[
            { kpi: '480k', label: 'Tickets booked this year' },
            { kpi: '<2 sec', label: 'Median checkout latency' },
            { kpi: '120ms', label: 'Pessimistic lock window' },
            { kpi: '99.99%', label: 'Payment success rate' },
          ].map((s, i) => (
            <div key={i}>
              <div className="tf-display" style={{ fontSize: 48 }}>{s.kpi}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Discover */}
      <section id="tf-discover" className="tf-container" style={{ padding: '64px 32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 32 }}>
          <div>
            <div className="tf-eyebrow" style={{ marginBottom: 8 }}>02 — On sale this season</div>
            <h2 className="tf-display" style={{ fontSize: 52, margin: 0 }}>Discover what's <span className="tf-italic">next</span>.</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)}
                className="tf-btn tf-btn-sm"
                style={{
                  background: categoryFilter === c ? 'var(--ink)' : '#fff',
                  color: categoryFilter === c ? '#fff' : 'var(--ink-2)',
                  border: '1px solid ' + (categoryFilter === c ? 'var(--ink)' : 'var(--line)'),
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Featured row of 2 */}
        {otherFeatured.length > 0 && categoryFilter === 'All' && !query && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 40 }}>
            {otherFeatured.slice(0, 2).map(e => (
              <EventCardLarge key={e.id} event={e} onClick={() => navigate(`event:${e.id}`)} />
            ))}
          </div>
        )}

        {/* Editorial list */}
        <div style={{ borderTop: '1px solid var(--line)' }}>
          {allFiltered.map((e, i) => (
            <EventRow key={e.id} event={e} index={i} onClick={() => navigate(`event:${e.id}`)} />
          ))}
        </div>
        {allFiltered.length === 0 && (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>
            <div className="tf-display" style={{ fontSize: 32 }}>Nothing matches yet.</div>
            <p>Try a different search or category.</p>
          </div>
        )}
      </section>

      {/* Editorial CTA */}
      <section className="tf-container" style={{ padding: '96px 32px 0' }}>
        <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: 20, padding: '64px 56px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: '100%', background: 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)', opacity: 0.5 }}></div>
          <div style={{ position: 'relative', maxWidth: 640 }}>
            <div className="tf-eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>03 — TicketFlash Pass</div>
            <h2 className="tf-display" style={{ fontSize: 64, lineHeight: 1, margin: '12px 0 16px' }}>
              Early access<br/>
              <span className="tf-italic" style={{ color: 'var(--accent)' }}>before the public sale.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 460 }}>
              Members get the first 48 hours on every show. No queues, no resale markup, no robots.
            </p>
            <button className="tf-btn" style={{ background: '#fff', color: 'var(--ink)', marginTop: 28 }}>Learn more <Icon.arrow /></button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function EventCardLarge({ event, onClick }) {
  return (
    <div className="tf-card tf-card-hover" onClick={onClick}>
      <EventPoster event={event} height={340} showLabel={false} />
      <div style={{ padding: '20px 22px 22px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>{event.dateLabel}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{event.city}</span>
          {event.viewing > 100 && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: 'var(--accent)' }} className="tf-pulse">{event.viewing} viewing</span>
            </>
          )}
        </div>
        <h3 className="tf-display" style={{ fontSize: 36, margin: '8px 0 4px', lineHeight: 1 }}>{event.title}</h3>
        <div className="tf-italic" style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--muted)' }}>{event.subtitle}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: 24 }}>
          <div>
            <div className="tf-eyebrow">From</div>
            <div className="tf-display" style={{ fontSize: 28 }}>{TF_FMT.shortCurrency(Math.min(...event.classes.map(c => c.price)))}</div>
          </div>
          <span className="tf-btn tf-btn-ghost tf-btn-sm">Get tickets <Icon.arrow /></span>
        </div>
      </div>
    </div>
  );
}

function EventRow({ event, index, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'grid', gridTemplateColumns: '64px 200px 1fr 200px 140px 40px', alignItems: 'center', gap: 24, padding: '24px 0', borderBottom: '1px solid var(--line)', cursor: 'pointer', transition: 'background 0.15s' }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-soft)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <div className="tf-mono" style={{ fontSize: 12, color: 'var(--muted-2)' }}>{String(index + 1).padStart(2, '0')}</div>
      <EventThumb event={event} size="md" />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
          <CategoryIcon category={event.category} width="12" height="12" />
          <span>{event.genre}</span>
          {!event.onSale && <span style={{ color: 'var(--warn)' }}>· On sale soon</span>}
        </div>
        <div className="tf-display" style={{ fontSize: 28, lineHeight: 1 }}>{event.title} <span className="tf-italic" style={{ color: 'var(--muted)', fontSize: 22 }}>{event.subtitle}</span></div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon.pin width="12" height="12" /> {event.venue}</div>
        <div style={{ color: 'var(--muted)', marginTop: 2 }}>{event.city}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="tf-eyebrow">From</div>
        <div className="tf-display" style={{ fontSize: 22 }}>{TF_FMT.shortCurrency(Math.min(...event.classes.map(c => c.price)))}</div>
      </div>
      <Icon.arrow width="18" height="18" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EVENT DETAIL
// ─────────────────────────────────────────────────────────────
function EventDetailScreen({ event, navigate, cart, setCart }) {
  const [selection, setSelection] = useStateS(() => {
    const s = {};
    cart.filter(c => c.eventId === event.id).forEach(c => { s[c.classId] = c.qty; });
    return s;
  });

  const total = Object.entries(selection).reduce((sum, [cid, qty]) => {
    const cls = event.classes.find(c => c.id === cid);
    return sum + (cls ? cls.price * qty : 0);
  }, 0);
  const totalQty = Object.values(selection).reduce((a, b) => a + b, 0);

  const updateQty = (classId, delta) => {
    setSelection(s => {
      const next = Math.max(0, Math.min(8, (s[classId] || 0) + delta));
      return { ...s, [classId]: next };
    });
  };

  const proceed = () => {
    const newCart = cart.filter(c => c.eventId !== event.id);
    Object.entries(selection).forEach(([cid, qty]) => {
      if (qty > 0) newCart.push({ eventId: event.id, classId: cid, qty });
    });
    setCart(newCart);
    navigate('cart');
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', background: event.hero, color: '#fff', padding: '64px 0 80px' }}>
        <div className="tf-container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: 24 }}><BackLink onClick={() => navigate('browse')} dark>All events</BackLink></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 12 }}>
              <CategoryIcon category={event.category} width="14" height="14" />
              <span>{event.category}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{event.genre}</span>
            </div>
            <h1 className="tf-display" style={{ fontSize: 120, margin: 0, lineHeight: 0.88 }}>
              {event.title}
            </h1>
            <div className="tf-display tf-italic" style={{ fontSize: 48, opacity: 0.92, marginTop: 8, lineHeight: 1 }}>{event.subtitle}</div>
            <div style={{ display: 'flex', gap: 40, marginTop: 40 }}>
              <div>
                <div className="tf-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Date</div>
                <div style={{ fontSize: 20, marginTop: 4 }}>{event.dateLabel}</div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>{event.timeLabel}</div>
              </div>
              <div>
                <div className="tf-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Venue</div>
                <div style={{ fontSize: 20, marginTop: 4 }}>{event.venue}</div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>{event.city}</div>
              </div>
              <div>
                <div className="tf-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Doors</div>
                <div style={{ fontSize: 20, marginTop: 4 }}>1 hr early</div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>All ages</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 16 }}>
            <div style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)', padding: '14px 20px', borderRadius: 999, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span className="tf-pulse" style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }}></span>
              <span><b className="tf-num">{event.viewing}</b> people viewing this event now</span>
            </div>
            <div style={{ width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: 20, display: 'grid', placeItems: 'center', backdropFilter: 'blur(12px)' }}>
              <svg width="120" height="120" viewBox="0 0 100 100" opacity="0.7">
                <g fill="none" stroke="#fff" strokeWidth="1.2">
                  <circle cx="50" cy="50" r="40" />
                  <circle cx="50" cy="50" r="28" />
                  <circle cx="50" cy="50" r="16" />
                  <circle cx="50" cy="50" r="4" fill="#fff" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="tf-container" style={{ padding: '64px 32px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 64 }}>
        <div>
          <div className="tf-eyebrow" style={{ marginBottom: 16 }}>About this show</div>
          <p style={{ fontSize: 22, lineHeight: 1.5, color: 'var(--ink-2)', margin: 0, fontFamily: 'var(--font-display)' }}>
            {event.description}
          </p>

          <div style={{ marginTop: 56 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 16 }}>Good to know</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              {[
                { icon: <Icon.shield />, t: 'Verified e-tickets', d: 'Single QR per ticket, scanned at the door.' },
                { icon: <Icon.clock />, t: '2-minute hold', d: 'Tickets held while you check out. No queue jumping.' },
                { icon: <Icon.bolt />, t: 'No resale markup', d: 'Face value only — TicketFlash is the official seller.' },
                { icon: <Icon.bell />, t: 'Real-time waitlist', d: 'If a class sells out, get notified the second it opens.' },
              ].map((f, i) => (
                <div key={i} style={{ padding: '20px 22px', border: '1px solid var(--line)', borderRadius: 12 }}>
                  <div style={{ marginBottom: 10 }}><IconBadge icon={f.icon} /></div>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{f.t}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{f.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 16 }}>Venue map</div>
            <div style={{ aspectRatio: '2 / 1', background: 'var(--bg-warm)', borderRadius: 14, border: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                {/* stage */}
                <rect x="160" y="20" width="80" height="14" fill="var(--ink)" rx="2" />
                <text x="200" y="30" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="var(--font-mono)">STAGE</text>
                {/* tiers */}
                <path d="M 60 50 Q 200 30 340 50 L 340 60 Q 200 40 60 60 Z" fill="#E5392F" opacity="0.85" />
                <path d="M 50 75 Q 200 50 350 75 L 350 90 Q 200 65 50 90 Z" fill="#E5392F" opacity="0.55" />
                <path d="M 40 105 Q 200 80 360 105 L 360 125 Q 200 100 40 125 Z" fill="#E5392F" opacity="0.3" />
                <path d="M 30 140 Q 200 115 370 140 L 370 165 Q 200 140 30 165 Z" fill="var(--ink)" opacity="0.15" />
                {/* labels */}
                <text x="200" y="58" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="var(--font-mono)">VVIP</text>
                <text x="200" y="83" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="var(--font-mono)">GOLD</text>
                <text x="200" y="115" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="var(--font-mono)">STANDARD</text>
                <text x="200" y="155" textAnchor="middle" fill="var(--ink)" fontSize="7" fontFamily="var(--font-mono)">GENERAL ADMISSION</text>
              </svg>
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: '#fff', padding: '6px 10px', fontSize: 11, color: 'var(--muted)', borderRadius: 6, fontFamily: 'var(--font-mono)' }}>Indicative layout</div>
            </div>
          </div>
        </div>

        {/* Ticket class selector */}
        <div>
          <div style={{ position: 'sticky', top: 88 }}>
            <div className="tf-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="tf-eyebrow">Choose your ticket</div>
                <StatusTag status="ONSALE" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
                {event.classes.map(cls => {
                  const sold = cls.available === 0;
                  const lowStock = cls.available > 0 && cls.available < 20;
                  const qty = selection[cls.id] || 0;
                  return (
                    <div key={cls.id} style={{
                      border: '1px solid ' + (qty > 0 ? 'var(--ink)' : 'var(--line)'),
                      borderRadius: 12, padding: 16, opacity: sold ? 0.5 : 1,
                      background: qty > 0 ? 'var(--bg-soft)' : '#fff',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ fontWeight: 500, fontSize: 15 }}>{cls.name}</div>
                            {lowStock && <span className="tf-tag" style={{ background: '#FFF6E6', color: '#8A5A0B', borderColor: '#F4D8A1' }}>Only {cls.available} left</span>}
                            {sold && <span className="tf-tag" style={{ background: 'var(--bg-warm)' }}>Sold out</span>}
                          </div>
                          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{cls.perks}</div>
                        </div>
                        <div className="tf-display" style={{ fontSize: 22, whiteSpace: 'nowrap' }}>{TF_FMT.shortCurrency(cls.price)}</div>
                      </div>
                      {!sold && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                          <div className="tf-step">
                            <button onClick={() => updateQty(cls.id, -1)} disabled={qty === 0}><Icon.minus /></button>
                            <div className="tf-step-val">{qty}</div>
                            <button onClick={() => updateQty(cls.id, 1)} disabled={qty >= 8 || qty >= cls.available}><Icon.plus /></button>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Max 8 per order</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="tf-divider" style={{ margin: '20px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{totalQty} ticket{totalQty !== 1 ? 's' : ''} · subtotal</div>
                <div className="tf-display" style={{ fontSize: 32 }}>{TF_FMT.shortCurrency(total)}</div>
              </div>
              <button onClick={proceed} className="tf-btn tf-btn-primary tf-btn-lg tf-btn-block" style={{ marginTop: 16 }} disabled={totalQty === 0}>
                Continue to checkout <Icon.arrow />
              </button>
              <div style={{ marginTop: 12 }}><SecureNote>Held for 2 minutes at checkout</SecureNote></div>
            </div>
            <ActiveHoldsPanel event={event} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CART / BOOKING SUMMARY
// ─────────────────────────────────────────────────────────────
function CartScreen({ events, cart, setCart, navigate }) {
  const items = useMemoS(() => cart.map(c => {
    const ev = events.find(e => e.id === c.eventId);
    const cls = ev?.classes.find(cc => cc.id === c.classId);
    return { ...c, event: ev, cls };
  }).filter(i => i.event && i.cls), [cart, events]);

  const subtotal = items.reduce((s, i) => s + i.cls.price * i.qty, 0);
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  const removeItem = (eventId, classId) => {
    setCart(cart.filter(c => !(c.eventId === eventId && c.classId === classId)));
  };
  const updateQty = (eventId, classId, qty) => {
    setCart(cart.map(c => (c.eventId === eventId && c.classId === classId) ? { ...c, qty } : c));
  };

  if (items.length === 0) {
    return (
      <EmptyState eyebrow="Your cart" title="It's" italicTail="empty."
        sub="Find a show worth showing up for."
        action={<button onClick={() => navigate('browse')} className="tf-btn tf-btn-ink tf-btn-lg">Browse events <Icon.arrow /></button>} />
    );
  }

  return (
    <div className="tf-container" style={{ padding: '48px 32px 80px' }}>
      <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Step 1 of 3 — Review</div>
      <h1 className="tf-display" style={{ fontSize: 64, margin: 0 }}>Your <span className="tf-italic">cart</span>.</h1>

      {/* Progress dots */}
      <ProgressBar step={1} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48, marginTop: 40 }}>
        <div>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, padding: '24px 0', borderTop: i === 0 ? '1px solid var(--line)' : 'none', borderBottom: '1px solid var(--line)' }}>
              <EventThumb event={it.event} size="lg" width={140} />
              <div style={{ flex: 1 }}>
                <div className="tf-eyebrow">{it.event.dateLabel} · {it.event.venue}, {it.event.city}</div>
                <div className="tf-display" style={{ fontSize: 30, lineHeight: 1, marginTop: 4 }}>{it.event.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span className="tf-tag"><span className="tf-tag-dot"></span>{it.cls.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>· {it.cls.perks}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: 16 }}>
                  <div className="tf-step">
                    <button onClick={() => updateQty(it.eventId, it.classId, Math.max(1, it.qty - 1))} disabled={it.qty <= 1}><Icon.minus /></button>
                    <div className="tf-step-val">{it.qty}</div>
                    <button onClick={() => updateQty(it.eventId, it.classId, it.qty + 1)} disabled={it.qty >= 8}><Icon.plus /></button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button onClick={() => removeItem(it.eventId, it.classId)} style={{ background: 'none', border: 0, color: 'var(--muted)', fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 3 }}>Remove</button>
                    <div className="tf-display" style={{ fontSize: 26 }}>{TF_FMT.shortCurrency(it.cls.price * it.qty)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 32 }}>
            <a onClick={() => navigate('browse')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 14, cursor: 'pointer' }}>
              <Icon.arrow style={{ transform: 'rotate(180deg)' }} /> Keep browsing
            </a>
          </div>
        </div>

        <div>
          <div className="tf-card" style={{ padding: 28, position: 'sticky', top: 88 }}>
            <div className="tf-eyebrow">Order summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              <KV k={`Subtotal (${items.reduce((a, b) => a + b.qty, 0)} tickets)`} v={TF_FMT.shortCurrency(subtotal)} />
              <KV k="Service fee (5%)" v={TF_FMT.shortCurrency(fee)} />
              <KV k="Insurance" v="Not added" muted />
            </div>
            <div className="tf-divider" style={{ margin: '16px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 500 }}>Total</span>
              <div className="tf-display" style={{ fontSize: 36 }}>{TF_FMT.shortCurrency(total)}</div>
            </div>
            <button onClick={() => navigate('payment')} className="tf-btn tf-btn-ink tf-btn-lg tf-btn-block" style={{ marginTop: 20 }}>Continue to payment <Icon.arrow /></button>
            <SecureNote style={{ marginTop: 12 }}>Secure checkout · 256-bit SSL</SecureNote>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ step }) {
  const labels = ['Review', 'Pay', 'Confirm'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32, fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      {labels.map((l, i) => (
        <React.Fragment key={i}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: i + 1 === step ? 'var(--ink)' : i + 1 < step ? 'var(--ok)' : 'var(--muted-2)' }}>
            <div style={{ width: 22, height: 22, borderRadius: 999, border: '1px solid currentColor', display: 'grid', placeItems: 'center', fontSize: 11, background: i + 1 < step ? 'var(--ok)' : 'transparent', color: i + 1 < step ? '#fff' : 'currentColor', borderColor: i + 1 < step ? 'var(--ok)' : 'currentColor' }}>
              {i + 1 < step ? <Icon.check width="10" height="10" /> : i + 1}
            </div>
            <span>{l}</span>
          </div>
          {i < labels.length - 1 && <div style={{ width: 48, height: 1, background: i + 1 < step ? 'var(--ok)' : 'var(--line)' }}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAYMENT
// ─────────────────────────────────────────────────────────────
function PaymentScreen({ events, cart, setCart, navigate, setLastBooking }) {
  const items = useMemoS(() => cart.map(c => {
    const ev = events.find(e => e.id === c.eventId);
    const cls = ev?.classes.find(cc => cc.id === c.classId);
    return { ...c, event: ev, cls };
  }).filter(i => i.event && i.cls), [cart, events]);

  const subtotal = items.reduce((s, i) => s + i.cls.price * i.qty, 0);
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  // 2-minute hold countdown
  const [secondsLeft, setSecondsLeft] = useStateS(120);
  useEffectS(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const [method, setMethod] = useStateS('card');
  const [status, setStatus] = useStateS('PENDING'); // PENDING -> PROCESSING -> CONFIRMED
  const [card, setCard] = useStateS({ number: '4242 4242 4242 4242', name: 'Thanh Nguyen', exp: '12/28', cvc: '123' });

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const pct = Math.max(0, (secondsLeft / 120) * 100);

  const pay = () => {
    if (status !== 'PENDING') return;
    setStatus('PROCESSING');
    setTimeout(() => {
      setStatus('CONFIRMED');
      // Generate booking
      const id = 'TFB-' + Math.floor(Math.random() * 9000 + 1000) + '-' + ['A','B','C','D','E','F'].map(() => String.fromCharCode(65 + Math.floor(Math.random()*26))).join('').slice(0,4);
      const booking = {
        id, items, subtotal, fee, total,
        status: 'CONFIRMED',
        created: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        email: 'thanh.nguyen@gmail.com',
      };
      setLastBooking(booking);
      // Clear cart
      setCart([]);
      setTimeout(() => navigate('ticket'), 800);
    }, 1800);
  };

  if (items.length === 0 && status !== 'CONFIRMED') {
    return (
      <EmptyState title="Nothing to pay for."
        action={<button onClick={() => navigate('browse')} className="tf-btn tf-btn-ink">Browse events</button>} />
    );
  }

  return (
    <div className="tf-container" style={{ padding: '48px 32px 80px' }}>
      <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Step 2 of 3 — Pay</div>
      <h1 className="tf-display" style={{ fontSize: 64, margin: 0 }}>Confirm <span className="tf-italic">payment</span>.</h1>
      <ProgressBar step={2} />

      {/* Countdown bar */}
      <div style={{
        marginTop: 32, padding: '16px 20px',
        background: secondsLeft < 30 ? '#FBEAE7' : 'var(--bg-soft)',
        border: '1px solid ' + (secondsLeft < 30 ? '#F1C3BE' : 'var(--line)'),
        borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: '#fff', display: 'grid', placeItems: 'center', position: 'relative' }}>
          <svg width="44" height="44" viewBox="0 0 44 44" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--line)" strokeWidth="2.5" />
            <circle cx="22" cy="22" r="18" fill="none" stroke={secondsLeft < 30 ? 'var(--bad)' : 'var(--accent)'} strokeWidth="2.5"
              strokeDasharray={113}
              strokeDashoffset={113 - (pct / 100) * 113}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <Icon.clock width="16" height="16" style={{ color: secondsLeft < 30 ? 'var(--bad)' : 'var(--ink)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: 14 }}>Your tickets are held for <span className="tf-mono tf-num" style={{ fontWeight: 600 }}>{mm}:{ss}</span></div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            After this, they return to general pool. Booking ID assigned on completion.
          </div>
        </div>
        <span className="tf-tag tf-tag-pending"><span className="tf-tag-dot" style={{ background: '#C97B16' }}></span>Pending</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48, marginTop: 32 }}>
        <div>
          {/* Payment method */}
          <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Payment method</div>
          <PaymentMethodGrid value={method} onChange={setMethod} methods={[
            { id: 'card', label: 'Card', sub: 'Visa, Master' },
            { id: 'momo', label: 'MoMo', sub: 'E-wallet' },
            { id: 'zalo', label: 'ZaloPay', sub: 'E-wallet' },
            { id: 'bank', label: 'Bank QR', sub: 'VietQR' },
          ]} />

          {/* Card form */}
          {method === 'card' && (
            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormField label="Card number" span={2}>
                <input className="tf-input tf-mono" value={card.number} onChange={(e) => setCard({...card, number: e.target.value})} />
              </FormField>
              <FormField label="Cardholder name" span={2}>
                <input className="tf-input" value={card.name} onChange={(e) => setCard({...card, name: e.target.value})} />
              </FormField>
              <FormField label="Expiry">
                <input className="tf-input tf-mono" value={card.exp} onChange={(e) => setCard({...card, exp: e.target.value})} />
              </FormField>
              <FormField label="CVC">
                <input className="tf-input tf-mono" value={card.cvc} onChange={(e) => setCard({...card, cvc: e.target.value})} />
              </FormField>
            </div>
          )}
          {method !== 'card' && (
            <div style={{ marginTop: 28, padding: 32, border: '1px dashed var(--line)', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ width: 140, height: 140, margin: '0 auto', background: 'var(--bg-warm)', borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
                <QRPattern size={140} />
              </div>
              <div style={{ marginTop: 16, fontSize: 14 }}>Scan with {method === 'momo' ? 'MoMo' : method === 'zalo' ? 'ZaloPay' : 'your banking app'}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>Confirm in the app to complete payment</div>
            </div>
          )}

          {/* Billing email */}
          <div style={{ marginTop: 28 }}>
            <FormField label="Email for e-tickets">
              <input className="tf-input" defaultValue="thanh.nguyen@gmail.com" />
            </FormField>
          </div>
        </div>

        <div>
          <div className="tf-card" style={{ padding: 28, position: 'sticky', top: 88 }}>
            <div className="tf-eyebrow">Order</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
              {items.map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{it.event.title}</div>
                    <div style={{ color: 'var(--muted)' }}>{it.cls.name} × {it.qty}</div>
                  </div>
                  <div className="tf-num">{TF_FMT.shortCurrency(it.cls.price * it.qty)}</div>
                </div>
              ))}
            </div>
            <div className="tf-divider" style={{ margin: '16px 0' }}></div>
            <KV k="Subtotal" v={TF_FMT.shortCurrency(subtotal)} />
            <KV k="Service fee" v={TF_FMT.shortCurrency(fee)} />
            <div className="tf-divider" style={{ margin: '16px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 500 }}>Total due</span>
              <div className="tf-display" style={{ fontSize: 36 }}>{TF_FMT.shortCurrency(total)}</div>
            </div>
            <button onClick={pay} disabled={status !== 'PENDING' || secondsLeft <= 0}
              className="tf-btn tf-btn-primary tf-btn-lg tf-btn-block" style={{ marginTop: 20 }}>
              {status === 'PROCESSING' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="42 56" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite" /></circle></svg>
                  Processing…
                </>
              ) : status === 'CONFIRMED' ? (
                <><Icon.check /> Confirmed</>
              ) : (
                <>Pay {TF_FMT.shortCurrency(total)} <Icon.arrow /></>
              )}
            </button>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textAlign: 'center', marginTop: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              By paying you accept the <a style={{ textDecoration: 'underline' }}>Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// E-TICKET
// ─────────────────────────────────────────────────────────────
function TicketScreen({ booking, navigate }) {
  if (!booking) {
    return (
      <EmptyState title="No tickets yet"
        action={<button onClick={() => navigate('browse')} className="tf-btn tf-btn-ink">Browse events</button>} />
    );
  }
  return (
    <div className="tf-container" style={{ padding: '48px 32px 80px' }}>
      <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Step 3 of 3 — Confirmed</div>
      <h1 className="tf-display" style={{ fontSize: 64, margin: 0 }}>You're <span className="tf-italic">going</span>.</h1>
      <ProgressBar step={3} />

      <div style={{ marginTop: 32 }}>
        <Banner tone="success" icon={<Icon.check />}
          title={`Booking ${booking.id} confirmed`}
          action={<StatusTag status="CONFIRMED" />}>
          Confirmation sent to <b>{booking.email}</b> · Booked {booking.created}
        </Banner>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40 }}>
        {booking.items.flatMap((item, i) => Array.from({ length: item.qty }, (_, j) => (
          <TicketCard key={`${i}-${j}`} event={item.event} cls={item.cls} ticketIdx={j + 1} ticketTotal={item.qty} bookingId={booking.id} seatNum={`${item.cls.id.toUpperCase()}-${String(j+1).padStart(3, '0')}-${Math.floor(Math.random() * 99 + 10)}`} />
        )))}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }}>
        <button className="tf-btn tf-btn-ghost"><Icon.download /> Download PDF</button>
        <button className="tf-btn tf-btn-ghost"><Icon.share /> Send to wallet</button>
        <button onClick={() => navigate('browse')} className="tf-btn tf-btn-ink">Continue browsing <Icon.arrow /></button>
      </div>
    </div>
  );
}

function TicketCard({ event, cls, ticketIdx, ticketTotal, bookingId, seatNum }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 280px', background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.04)' }}>
      <div style={{ background: event.hero, color: '#fff', padding: '28px 32px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <Logo />
            <div className="tf-mono" style={{ fontSize: 11, opacity: 0.8, textAlign: 'right' }}>
              {bookingId}<br/>
              <span style={{ fontSize: 10 }}>{ticketIdx} / {ticketTotal}</span>
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            <div className="tf-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>{event.category} · {event.genre}</div>
            <div className="tf-display" style={{ fontSize: 44, lineHeight: 0.95, marginTop: 6, textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>{event.title}</div>
            <div className="tf-display tf-italic" style={{ fontSize: 22, opacity: 0.92, marginTop: 2 }}>{event.subtitle}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
          <div>
            <div className="tf-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Date</div>
            <div style={{ fontSize: 14, marginTop: 2 }}>{event.dateLabel}</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>{event.timeLabel}</div>
          </div>
          <div>
            <div className="tf-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Venue</div>
            <div style={{ fontSize: 14, marginTop: 2 }}>{event.venue}</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>{event.city}</div>
          </div>
          <div>
            <div className="tf-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Class</div>
            <div style={{ fontSize: 14, marginTop: 2 }}>{cls.name}</div>
            <div style={{ fontSize: 12, opacity: 0.75, fontFamily: 'var(--font-mono)' }}>{seatNum}</div>
          </div>
        </div>
      </div>
      {/* Stub */}
      <div style={{ borderLeft: '2px dashed var(--line)', position: 'relative', padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
        <div style={{ position: 'absolute', top: -10, left: -10, width: 20, height: 20, borderRadius: 999, background: 'var(--bg-soft)', border: '1px solid var(--line)' }}></div>
        <div style={{ position: 'absolute', bottom: -10, left: -10, width: 20, height: 20, borderRadius: 999, background: 'var(--bg-soft)', border: '1px solid var(--line)' }}></div>
        <div className="tf-eyebrow">Scan at entry</div>
        <div style={{ width: 200, height: 200, position: 'relative' }}>
          <QRPattern size={200} />
        </div>
        <div className="tf-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{bookingId}-{String(ticketIdx).padStart(2, '0')}</div>
      </div>
    </div>
  );
}

function QRPattern({ size = 160 }) {
  // Deterministic pseudo-random pattern using a simple PRNG
  const cells = 25;
  const cellSize = size / cells;
  const seed = 7;
  const rand = (x, y) => {
    const v = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    return v - Math.floor(v);
  };
  const fill = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const isCorner = (x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17);
      if (isCorner) continue;
      if (rand(x, y) > 0.55) fill.push(<rect key={`${x}-${y}`} x={x * cellSize} y={y * cellSize} width={cellSize} height={cellSize} fill="var(--ink)" />);
    }
  }
  const finder = (cx, cy) => (
    <>
      <rect x={cx * cellSize} y={cy * cellSize} width={cellSize * 7} height={cellSize * 7} fill="var(--ink)" />
      <rect x={(cx + 1) * cellSize} y={(cy + 1) * cellSize} width={cellSize * 5} height={cellSize * 5} fill="#fff" />
      <rect x={(cx + 2) * cellSize} y={(cy + 2) * cellSize} width={cellSize * 3} height={cellSize * 3} fill="var(--ink)" />
    </>
  );
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <rect x="0" y="0" width={size} height={size} fill="#fff" />
      {fill}
      {finder(0, 0)}
      {finder(18, 0)}
      {finder(0, 18)}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// MY BOOKINGS
// ─────────────────────────────────────────────────────────────
function MyBookingsScreen({ events, lastBooking, navigate }) {
  const seeded = window.TF_MY_BOOKINGS_SEED;
  const all = lastBooking ? [{ id: lastBooking.id, eventId: lastBooking.items[0].event.id, date: lastBooking.created, qty: lastBooking.items.reduce((a,b) => a + b.qty, 0), total: lastBooking.total, status: lastBooking.status }, ...seeded] : seeded;
  return (
    <div className="tf-container" style={{ padding: '48px 32px 80px' }}>
      <div className="tf-eyebrow">Account · Thanh Nguyen</div>
      <h1 className="tf-display" style={{ fontSize: 72, margin: '12px 0 0' }}>My <span className="tf-italic">tickets</span>.</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 480, fontSize: 16, marginTop: 12 }}>Upcoming and past bookings. Tap any to view e-tickets and QR codes.</p>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {all.map((b, i) => {
          const ev = events.find(e => e.id === b.eventId);
          if (!ev) return null;
          return (
            <div key={b.id} className="tf-card" style={{ display: 'grid', gridTemplateColumns: '120px 1fr 200px 160px 100px', gap: 24, alignItems: 'center', padding: 16 }}>
              <EventThumb event={ev} size="sm" />
              <div>
                <div className="tf-eyebrow">{ev.dateLabel} · {ev.timeLabel}</div>
                <div className="tf-display" style={{ fontSize: 24, lineHeight: 1, marginTop: 2 }}>{ev.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{ev.venue} · {ev.city}</div>
              </div>
              <div>
                <div className="tf-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{b.id}</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>{b.qty} ticket{b.qty > 1 ? 's' : ''} · {TF_FMT.shortCurrency(b.total)}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Booked {b.date}</div>
              </div>
              <StatusTag status={b.status} />
              <button className="tf-btn tf-btn-ghost tf-btn-sm" onClick={() => navigate(`booking:${b.id}`)}>View <Icon.arrow /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="tf-footer">
      <div className="tf-container tf-footer-grid">
        <div>
          <Logo size="lg" />
          <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 320, marginTop: 16, lineHeight: 1.5 }}>
            Vietnam's official ticketing platform for concerts, theater, sport and festival events. Face-value pricing, verified entry.
          </p>
        </div>
        <div>
          <h4>Discover</h4>
          <ul>
            <li>Concerts</li><li>Theater</li><li>Sports</li><li>Festivals</li><li>Workshops</li>
          </ul>
        </div>
        <div>
          <h4>Account</h4>
          <ul>
            <li>My tickets</li><li>Refunds</li><li>Wallet</li><li>Settings</li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li>About</li><li>For organizers</li><li>Help center</li><li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="tf-container tf-footer-bottom">
        <div>© 2026 TicketFlash Pte Ltd.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span>Terms</span><span>Privacy</span><span>Cookies</span>
        </div>
      </div>
    </footer>
  );
}

window.BrowseScreen = BrowseScreen;
window.EventDetailScreen = EventDetailScreen;
window.CartScreen = CartScreen;
window.PaymentScreen = PaymentScreen;
window.TicketScreen = TicketScreen;
window.MyBookingsScreen = MyBookingsScreen;
window.Footer = Footer;
window.QRPattern = QRPattern;
window.ProgressBar = ProgressBar;
