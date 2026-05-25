// Shared, reusable components for TicketFlash.
// Consumed by screens.jsx, admin.jsx, extras.jsx — single source of truth for
// recurring UI atoms (status tags, callouts, KPI tiles, empty states, tabs, etc).

const { useState: useStateC } = React;

// ─────────────────────────────────────────────────────────────
// PageHeader — eyebrow + display title (with optional italic
// tail and small description) + right-aligned action slot.
// Used by all top-level screens for consistent page chrome.
// ─────────────────────────────────────────────────────────────
function PageHeader({ eyebrow, title, italicTail, sub, action, size = 'lg' }) {
  const titleSize = size === 'xl' ? 72 : size === 'lg' ? 64 : size === 'md' ? 56 : 48;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 32, flexWrap: 'wrap' }}>
      <div>
        {eyebrow && <div className="tf-eyebrow">{eyebrow}</div>}
        <h1 className="tf-display" style={{ fontSize: titleSize, margin: eyebrow ? '10px 0 0' : 0, lineHeight: 0.95 }}>
          {title}{italicTail && <> <span className="tf-italic" style={{ color: 'var(--muted)' }}>{italicTail}</span></>}
        </h1>
        {sub && <p style={{ color: 'var(--muted)', maxWidth: 480, fontSize: 16, marginTop: 12 }}>{sub}</p>}
      </div>
      {action && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{action}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SectionTitle — mono eyebrow used as section headers (in card
// bodies, columns) plus optional right slot.
// ─────────────────────────────────────────────────────────────
function SectionTitle({ children, right, style }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...style }}>
      <div className="tf-eyebrow">{children}</div>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BackLink — “← All bookings” style nav-back affordance.
// ─────────────────────────────────────────────────────────────
function BackLink({ onClick, children, dark }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: dark ? 'rgba(255,255,255,0.12)' : 'transparent',
      color: dark ? '#fff' : 'var(--muted)',
      border: 0, padding: dark ? '6px 14px 6px 10px' : 0,
      borderRadius: dark ? 999 : 0, fontSize: dark ? 12 : 13,
      backdropFilter: dark ? 'blur(8px)' : 'none', cursor: 'pointer', fontFamily: 'inherit',
    }}>
      <Icon.arrow style={{ transform: 'rotate(180deg)' }} /> {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// StatusTag — single source of truth for booking / availability
// statuses. Maps a status string onto the right pill style.
// ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
  CONFIRMED: { cls: 'tf-tag-confirmed', icon: true },
  PENDING:   { cls: 'tf-tag-pending',   icon: false },
  CANCELLED: { cls: 'tf-tag-cancelled', icon: false },
  ONSALE:    { cls: 'tf-tag-onsale',    icon: false, label: 'On sale' },
};
function StatusTag({ status, label, size = 'sm', children }) {
  const meta = STATUS_MAP[status] || { cls: '', icon: false };
  const padding = size === 'md' ? '6px 12px' : '4px 10px';
  return (
    <span className={`tf-tag ${meta.cls}`} style={{ fontSize: size === 'md' ? 12 : 11, padding }}>
      {meta.icon && <Icon.check width="10" height="10" />}
      {label || children || meta.label || status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Banner — coloured callout used for confirmations, warnings,
// cancellations, info messages. Replaces several ad-hoc banners.
// ─────────────────────────────────────────────────────────────
const BANNER_TONES = {
  success:  { bg: '#E7F3EC', border: '#B5DAC3', fg: '#0F4F2D',     iconBg: 'var(--ok)',   iconFg: '#fff' },
  warning:  { bg: '#FFF6E6', border: '#F4D8A1', fg: '#8A5A0B',     iconBg: '#C97B16',     iconFg: '#fff' },
  danger:   { bg: '#FBEAE7', border: '#F1C3BE', fg: '#8A2A20',     iconBg: 'var(--bad)',  iconFg: '#fff' },
  info:     { bg: 'var(--bg-soft)', border: 'var(--line)', fg: 'var(--ink-2)', iconBg: 'var(--bg-warm)', iconFg: 'var(--ink-2)' },
};
function Banner({ tone = 'info', icon, title, children, action, style }) {
  const t = BANNER_TONES[tone];
  return (
    <div style={{
      padding: '16px 20px', background: t.bg, border: `1px solid ${t.border}`,
      borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16, color: t.fg, ...style,
    }}>
      {icon && (
        <div style={{ width: 36, height: 36, borderRadius: 999, background: t.iconBg, color: t.iconFg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, fontSize: 13 }}>
        {title && <div style={{ fontWeight: 500, color: t.fg }}>{title}</div>}
        {children && <div style={{ marginTop: title ? 2 : 0 }}>{children}</div>}
      </div>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EmptyState — full-page “nothing here” block. Used for empty
// cart, missing booking, no tickets, etc.
// ─────────────────────────────────────────────────────────────
function EmptyState({ eyebrow, title, italicTail, sub, action }) {
  return (
    <div className="tf-container" style={{ padding: '120px 32px', textAlign: 'center' }}>
      {eyebrow && <div className="tf-eyebrow">{eyebrow}</div>}
      <h1 className="tf-display" style={{ fontSize: 64, margin: eyebrow ? '16px 0 12px' : '0 0 12px' }}>
        {title}{italicTail && <> <span className="tf-italic">{italicTail}</span></>}
      </h1>
      {sub && <p style={{ color: 'var(--muted)', fontSize: 17 }}>{sub}</p>}
      {action && <div style={{ marginTop: 24 }}>{action}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EventThumb — sized event poster thumbnail. Wraps EventPoster
// in a clipped rounded container, with size presets.
//   xs 48 · sm 80 · md 120 · lg 200
// ─────────────────────────────────────────────────────────────
const THUMB_SIZES = {
  xs: { h: 48,  scale: 0.4, radius: 6 },
  sm: { h: 80,  scale: 0.5, radius: 8 },
  md: { h: 88,  scale: 0.6, radius: 8 },
  lg: { h: 140, scale: 0.5, radius: 10 },
};
function EventThumb({ event, size = 'sm', width }) {
  const s = THUMB_SIZES[size] || THUMB_SIZES.sm;
  return (
    <div style={{ width: width || '100%', borderRadius: s.radius, overflow: 'hidden', flexShrink: 0 }}>
      <EventPoster event={event} height={s.h} showLabel={false} scale={s.scale} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tabs — admin-style underlined tab bar with optional counts.
//   tabs: [{ id, label, count? }], active, onChange
// ─────────────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange, style }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', ...style }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: '10px 14px', background: 'transparent', border: 0, fontFamily: 'inherit', fontSize: 13,
          color: active === t.id ? 'var(--ink)' : 'var(--muted)',
          fontWeight: active === t.id ? 500 : 400,
          borderBottom: '2px solid ' + (active === t.id ? 'var(--ink)' : 'transparent'),
          marginBottom: -1, cursor: 'pointer',
        }}>
          {t.label}
          {t.count !== undefined && (
            <span style={{ color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', fontSize: 11, marginLeft: 4 }}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PillTabs — segmented pill filter (browse category style).
// ─────────────────────────────────────────────────────────────
function PillTabs({ options, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map(o => {
        const id = typeof o === 'string' ? o : o.id;
        const label = typeof o === 'string' ? o : o.label;
        const on = active === id;
        return (
          <button key={id} onClick={() => onChange(id)} className="tf-btn tf-btn-sm" style={{
            background: on ? 'var(--ink)' : '#fff',
            color: on ? '#fff' : 'var(--ink-2)',
            border: '1px solid ' + (on ? 'var(--ink)' : 'var(--line)'),
          }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KpiCard — admin overview metric tile (label, big number,
// delta, sub-line).
// ─────────────────────────────────────────────────────────────
function KpiCard({ label, value, delta, up = true, sub }) {
  return (
    <div className="tf-card" style={{ padding: 22 }}>
      <div className="tf-eyebrow">{label}</div>
      <div className="tf-display" style={{ fontSize: 40, margin: '10px 0 4px' }}>{value}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 12 }}>
        {delta && <span style={{ color: up ? 'var(--ok)' : 'var(--bad)', fontFamily: 'var(--font-mono)' }}>{delta}</span>}
        {sub && <span style={{ color: 'var(--muted)' }}>{sub}</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CapacityBar — “sold / total” thin progress bar used in admin
// overview top events + admin events table.
// ─────────────────────────────────────────────────────────────
function CapacityBar({ sold, total, hotAt = 0.8 }) {
  const pct = total > 0 ? Math.min(1, sold / total) : 0;
  const hot = pct >= hotAt;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
        <span className="tf-mono">{sold.toLocaleString()} / {total.toLocaleString()}</span>
        <span className="tf-mono">{Math.round(pct * 100)}%</span>
      </div>
      <div style={{ height: 4, background: 'var(--bg-warm)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: hot ? 'var(--accent)' : 'var(--ink)' }}></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KV — key-value row used in summaries, payment breakdowns, etc.
// Replaces the older SummaryLine + KV duplicates.
// ─────────────────────────────────────────────────────────────
function KV({ k, v, mono, bold, muted, size }) {
  const valSize = bold ? 15 : (size || 13);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: size || 14, color: muted ? 'var(--muted)' : 'var(--ink-2)' }}>
      <span style={{ color: 'var(--muted)' }}>{k}</span>
      <span className={mono ? 'tf-mono tf-num' : 'tf-num'} style={{ fontWeight: bold ? 600 : 400, fontSize: valSize, color: muted ? 'var(--muted)' : 'var(--ink-2)' }}>{v}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Fact — compact eyebrow + main value + sub-line block, used in
// hero quick-facts and customer panels.
// ─────────────────────────────────────────────────────────────
function Fact({ label, main, sub, light }) {
  return (
    <div>
      <div className="tf-eyebrow" style={light ? { color: 'rgba(255,255,255,0.7)' } : null}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>{main}</div>
      {sub && <div style={{ fontSize: 12, color: light ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}>{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// IconBadge — the small rounded background-colour icon container
// used in feature cards, action rows, banner icons.
// ─────────────────────────────────────────────────────────────
function IconBadge({ icon, size = 36, tone = 'warm' }) {
  const tones = {
    warm:   { bg: 'var(--bg-warm)',  fg: 'var(--ink-2)' },
    danger: { bg: '#FBEAE7',         fg: 'var(--bad)' },
    ok:     { bg: '#E7F3EC',         fg: 'var(--ok)' },
  };
  const c = tones[tone] || tones.warm;
  return (
    <div style={{ width: size, height: size, borderRadius: 999, background: c.bg, color: c.fg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      {icon}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SecureNote — small monospaced caption with shield icon for
// checkout & payment confirmation lines.
// ─────────────────────────────────────────────────────────────
function SecureNote({ children, style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)',
      letterSpacing: '0.06em', textTransform: 'uppercase', ...style,
    }}>
      <Icon.shield width="12" height="12" /> {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DataTable — chrome for the admin tables. Header columns are
// described once and shared by every row via grid template.
// Usage:
//   <DataTable columns="60px 1fr 200px" headers={['','Event','Venue']}>
//     <DataTable.Row template="60px 1fr 200px">…cells…</DataTable.Row>
//   </DataTable>
// ─────────────────────────────────────────────────────────────
function DataTable({ columns, headers, children }) {
  return (
    <div className="tf-card">
      <div style={{
        display: 'grid', gridTemplateColumns: columns, gap: 16,
        padding: '14px 20px', borderBottom: '1px solid var(--line)',
        fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--muted)',
      }}>
        {headers.map((h, i) => <div key={i}>{h}</div>)}
      </div>
      {children}
    </div>
  );
}
DataTable.Row = function DataTableRow({ template, onClick, children, first, hover = true }) {
  return (
    <div onClick={onClick} style={{
      display: 'grid', gridTemplateColumns: template, gap: 16,
      padding: '16px 20px', borderTop: first ? 'none' : '1px solid var(--line-2)',
      alignItems: 'center', fontSize: 13,
      cursor: onClick ? 'pointer' : 'default', transition: 'background 0.15s',
    }}
    onMouseEnter={onClick && hover ? (e) => e.currentTarget.style.background = 'var(--bg-soft)' : undefined}
    onMouseLeave={onClick && hover ? (e) => e.currentTarget.style.background = 'transparent' : undefined}>
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PaymentMethodGrid — segmented payment-type cards used on the
// payment screen. Driven by a method list + selection state.
// ─────────────────────────────────────────────────────────────
function PaymentMethodGrid({ methods, value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${methods.length}, 1fr)`, gap: 8 }}>
      {methods.map(m => (
        <button key={m.id} onClick={() => onChange(m.id)} style={{
          padding: '14px 12px', borderRadius: 12,
          border: '1px solid ' + (value === m.id ? 'var(--ink)' : 'var(--line)'),
          background: value === m.id ? 'var(--bg-soft)' : '#fff',
          textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{m.label}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{m.sub}</div>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FormField — label + control wrapper to keep all forms aligned.
// ─────────────────────────────────────────────────────────────
function FormField({ label, span, children }) {
  return (
    <div style={span ? { gridColumn: `1 / span ${span}` } : null}>
      <label className="tf-label">{label}</label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Expose to global scope so Babel <script> siblings can use them.
// ─────────────────────────────────────────────────────────────
Object.assign(window, {
  PageHeader, SectionTitle, BackLink, StatusTag, Banner, EmptyState,
  EventThumb, Tabs, PillTabs, KpiCard, CapacityBar, KV, Fact, IconBadge,
  SecureNote, DataTable, PaymentMethodGrid, FormField,
});
