// Shared UI components for TicketFlash

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Icons (inline SVG) ----------
const Icon = {
  search: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  cart: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 4h2l2.4 12.5a2 2 0 0 0 2 1.5h8.6a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="21" r="1.2"/><circle cx="18" cy="21" r="1.2"/></svg>,
  ticket: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z"/><path d="M13 5v14" strokeDasharray="2 2"/></svg>,
  pin: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  cal: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  clock: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  eye: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>,
  arrow: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  check: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m5 12 5 5 9-11"/></svg>,
  close: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  bolt: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>,
  download: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"/></svg>,
  share: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>,
  heart: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>,
  bell: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>,
  plus: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  minus: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M5 12h14"/></svg>,
  user: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>,
  shield: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>,
  music: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  trophy: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 4h8v6a4 4 0 0 1-8 0V4Z"/><path d="M4 5h4v3a2 2 0 0 1-2 2 2 2 0 0 1-2-2V5ZM16 5h4v3a2 2 0 0 1-2 2 2 2 0 0 1-2-2V5ZM8 19h8M10 14v5M14 14v5"/></svg>,
  mask: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 5h16v8a8 8 0 0 1-16 0V5Z"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M9 14c1 1 4 1 6 0"/></svg>,
  star: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2 9 9l-7 .8 5.2 4.6L5.5 22 12 18l6.5 4-1.7-7.6L22 9.8 15 9Z"/></svg>,
};

window.Icon = Icon;

// ---------- Logo ----------
function Logo({ size = 'md' }) {
  const s = size === 'lg' ? { mark: 32, font: 20, gap: 12 } : { mark: 26, font: 17, gap: 10 };
  return (
    <div className="tf-logo" style={{ gap: s.gap, fontSize: s.font }}>
      <div className="tf-logo-mark" style={{ width: s.mark, height: s.mark, fontSize: s.mark * 0.7 }}>T</div>
      <span>TicketFlash</span>
    </div>
  );
}

// ---------- Category icon ----------
function CategoryIcon({ category, ...props }) {
  if (category === 'Concert') return <Icon.music {...props} />;
  if (category === 'Theater') return <Icon.mask {...props} />;
  if (category === 'Sports') return <Icon.trophy {...props} />;
  if (category === 'Festival') return <Icon.star {...props} />;
  return <Icon.ticket {...props} />;
}

// ---------- Event poster (placeholder visual) ----------
function EventPoster({ event, height, showLabel = true, scale = 1 }) {
  return (
    <div className="tf-hero-img tf-shimmer" style={{ background: event.hero, aspectRatio: 'auto', height: height || undefined, width: '100%' }}>
      <svg width={Math.round(120 * scale)} height={Math.round(120 * scale)} viewBox="0 0 100 100" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.18 }}>
        {event.category === 'Concert' && (
          <g fill="#fff" stroke="#fff" strokeWidth="1.2">
            <circle cx="50" cy="50" r="34" fill="none" />
            <circle cx="50" cy="50" r="20" fill="none" opacity="0.6" />
            <circle cx="50" cy="50" r="6" />
          </g>
        )}
        {event.category === 'Theater' && (
          <g fill="#fff" opacity="0.9">
            <path d="M20 25 h60 v30 a30 30 0 0 1 -60 0 z" fill="none" stroke="#fff" strokeWidth="1.2" />
            <circle cx="38" cy="42" r="3" /><circle cx="62" cy="42" r="3" />
            <path d="M38 56 q12 6 24 0" fill="none" stroke="#fff" strokeWidth="1.5" />
          </g>
        )}
        {event.category === 'Sports' && (
          <g fill="none" stroke="#fff" strokeWidth="1.2">
            <circle cx="50" cy="50" r="32" />
            <path d="M50 18 v64 M18 50 h64 M28 28 l44 44 M72 28 l-44 44" />
          </g>
        )}
        {event.category === 'Festival' && (
          <g fill="#fff" opacity="0.85">
            <path d="M50 18 l8 22 22 2 -18 14 6 22 -18 -12 -18 12 6 -22 -18 -14 22 -2 z" />
          </g>
        )}
      </svg>
      <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 2, display: 'flex', gap: 6 }}>
        <span style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 8px', borderRadius: 999, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{event.category}</span>
        {event.featured && <span style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 8px', borderRadius: 999, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Hot</span>}
      </div>
      {showLabel && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 2, color: '#fff' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.8 }}>{event.dateLabel} · {event.city}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: Math.round(28 * scale), lineHeight: 0.95, marginTop: 4, textShadow: '0 2px 14px rgba(0,0,0,0.45)' }}>{event.title}</div>
        </div>
      )}
    </div>
  );
}

// ---------- Top Nav ----------
function TopNav({ role, setRole, route, navigate, cartCount, query, setQuery }) {
  const userNavItems = [
    { id: 'browse', label: 'Browse' },
    { id: 'concerts', label: 'Concerts' },
    { id: 'sports', label: 'Sports' },
    { id: 'theater', label: 'Theater' },
    { id: 'mybookings', label: 'My Tickets' },
  ];
  const adminNavItems = [
    { id: 'admin', label: 'Overview' },
    { id: 'admin-events', label: 'Events' },
    { id: 'admin-bookings', label: 'Bookings' },
    { id: 'admin-venues', label: 'Venues' },
  ];
  const items = role === 'admin' ? adminNavItems : userNavItems;
  return (
    <nav className="tf-nav">
      <div className="tf-container tf-nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a onClick={() => navigate(role === 'admin' ? 'admin' : 'browse')} style={{ cursor: 'pointer' }}>
            <Logo />
          </a>
          <div className="tf-nav-links">
            {items.map(it => (
              <a key={it.id} onClick={() => navigate(it.id)} className={route === it.id ? 'is-active' : ''} style={{ cursor: 'pointer' }}>{it.label}</a>
            ))}
          </div>
        </div>
        {role === 'user' && (
          <div className="tf-nav-search">
            <Icon.search />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, artists, venues…" />
            <span className="tf-mono" style={{ fontSize: 11, color: 'var(--muted-2)', border: '1px solid var(--line)', padding: '2px 6px', borderRadius: 4 }}>⌘ K</span>
          </div>
        )}
        <div className="tf-nav-right">
          <div className="tf-role-switch">
            <button className={role === 'user' ? 'is-active' : ''} onClick={() => { setRole('user'); navigate('browse'); }}>User</button>
            <button className={role === 'admin' ? 'is-active' : ''} onClick={() => { setRole('admin'); navigate('admin'); }}>Admin</button>
          </div>
          {role === 'user' && (
            <>
              <button className="tf-icon-btn" onClick={() => navigate('mybookings')} title="My tickets">
                <Icon.ticket />
              </button>
              <button className="tf-icon-btn" onClick={() => navigate('cart')} title="Cart" style={{ position: 'relative' }}>
                <Icon.cart />
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 600, width: 18, height: 18, borderRadius: 999, display: 'grid', placeItems: 'center' }}>{cartCount}</span>
                )}
              </button>
            </>
          )}
          <div className="tf-avatar">{role === 'admin' ? 'AD' : 'TN'}</div>
        </div>
      </div>
    </nav>
  );
}

window.TopNav = TopNav;
window.Logo = Logo;
window.EventPoster = EventPoster;
window.CategoryIcon = CategoryIcon;
