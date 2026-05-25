// Admin screens for TicketFlash

const { useState: useStateA, useMemo: useMemoA } = React;

function AdminShell({ children, title, eyebrow, action }) {
  return (
    <div className="tf-container" style={{ padding: '40px 32px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 28 }}>
        <div>
          <div className="tf-eyebrow">{eyebrow}</div>
          <h1 className="tf-display" style={{ fontSize: 56, margin: '8px 0 0' }}>{title}</h1>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ──────────────── OVERVIEW
function AdminOverview({ events, navigate }) {
  const kpis = [
    { label: 'Revenue (30d)', value: '₫ 2.84B', delta: '+18.4%', up: true, sub: 'vs. last period' },
    { label: 'Tickets sold (30d)', value: '12,847', delta: '+12.1%', up: true, sub: '4,210 last 7d' },
    { label: 'Active events', value: '24', delta: '+3', up: true, sub: '8 on sale this week' },
    { label: 'Avg checkout', value: '1.4s', delta: '−240ms', up: true, sub: 'p95 latency' },
  ];

  return (
    <AdminShell eyebrow="Admin · Overview" title="Today's pulse." action={<button className="tf-btn tf-btn-ink"><Icon.plus />New event</button>}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((k, i) => (
          <KpiCard key={i} {...k} />
        ))}
      </div>

      {/* Chart + Live ops */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 24 }}>
        <div className="tf-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div className="tf-eyebrow">Revenue · 14 days</div>
              <div className="tf-display" style={{ fontSize: 32, marginTop: 4 }}>₫ 1.42<span style={{ fontSize: 22, color: 'var(--muted)' }}>B</span></div>
            </div>
            <div style={{ display: 'flex', gap: 6, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              {['7d', '14d', '30d', '90d'].map((p, i) => (
                <button key={p} style={{ padding: '4px 10px', borderRadius: 999, border: '1px solid var(--line)', background: i === 1 ? 'var(--ink)' : '#fff', color: i === 1 ? '#fff' : 'var(--muted)' }}>{p}</button>
              ))}
            </div>
          </div>
          <RevenueChart />
        </div>

        <div className="tf-card" style={{ padding: 28 }}>
          <div className="tf-eyebrow">Live operations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            <LiveStat label="Active sessions" value="3,247" pulse />
            <LiveStat label="In checkout" value="284" pulse warm />
            <LiveStat label="Holds expiring (2min)" value="42" pulse warm />
            <LiveStat label="Payments processing" value="18" pulse warm />
            <LiveStat label="Webhook queue (RMQ)" value="2,104" />
            <LiveStat label="Notification workers" value="6 / 8" />
          </div>
          <div style={{ marginTop: 16, padding: 12, background: '#E7F3EC', borderRadius: 8, fontSize: 12, color: '#0F4F2D', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, background: 'var(--ok)', borderRadius: 999 }}></span>
            All systems operational · Rate limiter healthy
          </div>
        </div>
      </div>

      {/* Top events + Recent bookings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginTop: 24 }}>
        <div className="tf-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="tf-eyebrow">Top performing</div>
            <a style={{ fontSize: 12, color: 'var(--muted)' }} onClick={() => navigate('admin-events')}>All events →</a>
          </div>
          <div style={{ marginTop: 16 }}>
            {events.slice(0, 5).map((ev, i) => {
              const sold = 800 - (i * 110) + 200;
              const total = 1200;
              const pct = (sold / total) * 100;
              return (
                <div key={ev.id} style={{ display: 'grid', gridTemplateColumns: '32px 48px 1fr 100px 80px', gap: 14, alignItems: 'center', padding: '12px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}>
                  <div className="tf-mono" style={{ fontSize: 12, color: 'var(--muted-2)' }}>{String(i + 1).padStart(2, '0')}</div>
                  <EventThumb event={ev} size="xs" width={48} />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{ev.dateLabel} · {ev.venue}</div>
                  </div>
                  <CapacityBar sold={sold} total={total} hotAt={2} />
                  <div className="tf-num" style={{ fontWeight: 500, textAlign: 'right' }}>{TF_FMT.shortCurrency((sold * 2_000_000))}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="tf-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="tf-eyebrow">Recent bookings</div>
            <a style={{ fontSize: 12, color: 'var(--muted)' }} onClick={() => navigate('admin-bookings')}>All →</a>
          </div>
          <div style={{ marginTop: 8 }}>
            {TF_BOOKINGS_SEED.slice(0, 6).map((b, i) => {
              const ev = events.find(e => e.id === b.event);
              return (
                <div key={b.id} onClick={() => navigate(`admin-booking:${b.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none', cursor: 'pointer' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 999, background: b.status === 'CONFIRMED' ? 'var(--ok)' : b.status === 'PENDING' ? '#C97B16' : 'var(--bad)' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13 }}><span className="tf-mono">{b.id}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{ev?.title} · {b.user}</div>
                  </div>
                  <div style={{ fontSize: 12, textAlign: 'right' }}>
                    <div className="tf-num" style={{ fontWeight: 500 }}>{TF_FMT.shortCurrency(b.total)}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{b.created.split(' ')[1]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function LiveStat({ label, value, pulse, warm }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
      <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        {pulse && <span className={warm ? 'tf-pulse' : ''} style={{ width: 6, height: 6, background: warm ? 'var(--warn)' : 'var(--ok)', borderRadius: 999 }}></span>}
        {label}
      </span>
      <span className="tf-num tf-mono" style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function RevenueChart() {
  // Bar chart with 14 days
  const data = [42, 48, 35, 58, 62, 71, 49, 55, 68, 84, 76, 92, 88, 110];
  const max = Math.max(...data);
  return (
    <div style={{ marginTop: 24, height: 200, display: 'flex', alignItems: 'end', gap: 6 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ width: '100%', height: `${(v / max) * 100}%`, background: i === data.length - 1 ? 'var(--accent)' : i >= data.length - 3 ? 'var(--ink)' : 'var(--ink-2)', opacity: i === data.length - 1 ? 1 : i >= data.length - 3 ? 1 : 0.3, borderRadius: 3, transition: 'opacity 0.2s' }}></div>
          <span style={{ fontSize: 9, color: 'var(--muted-2)', fontFamily: 'var(--font-mono)' }}>{['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'][i]}</span>
        </div>
      ))}
    </div>
  );
}

// ──────────────── EVENTS LIST
function AdminEvents({ events, navigate }) {
  const [tab, setTab] = useStateA('all');
  const tabs = [
    { id: 'all', label: 'All', count: events.length },
    { id: 'onsale', label: 'On sale', count: events.filter(e => e.onSale).length },
    { id: 'draft', label: 'Drafts', count: 2 },
    { id: 'past', label: 'Past', count: 14 },
  ];
  return (
    <AdminShell eyebrow="Admin · Events" title="Manage events." action={<button className="tf-btn tf-btn-ink" onClick={() => navigate('admin-event-new')}><Icon.plus />New event</button>}>
      <Tabs tabs={tabs} active={tab} onChange={setTab} style={{ marginBottom: 16 }} />

      <DataTable
        columns="60px 1fr 200px 140px 140px 120px 40px"
        headers={['', 'Event', 'Venue', 'Date', 'Tickets sold', 'Revenue', '']}>
        {events.map((ev, i) => {
          const sold = 800 - (i * 90);
          const cap = 1200;
          return (
            <DataTable.Row key={ev.id} first={i === 0} template="60px 1fr 200px 140px 140px 120px 40px">
              <EventThumb event={ev} size="xs" />
              <div>
                <div style={{ fontWeight: 500 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{ev.subtitle}</div>
              </div>
              <div style={{ fontSize: 13 }}>
                <div>{ev.venue}</div>
                <div style={{ color: 'var(--muted)', fontSize: 11 }}>{ev.city}</div>
              </div>
              <div style={{ fontSize: 13 }}>
                <div>{ev.dateLabel}</div>
                <div style={{ color: 'var(--muted)', fontSize: 11 }}>{ev.timeLabel}</div>
              </div>
              <CapacityBar sold={sold} total={cap} />
              <div className="tf-num" style={{ fontWeight: 500 }}>{TF_FMT.shortCurrency(sold * 1_800_000)}</div>
              <button style={{ background: 'transparent', border: 0, color: 'var(--muted)' }}><Icon.arrow /></button>
            </DataTable.Row>
          );
        })}
      </DataTable>
    </AdminShell>
  );
}

// ──────────────── NEW EVENT FORM
function AdminEventNew({ navigate }) {
  const [step, setStep] = useStateA(1);
  const [form, setForm] = useStateA({
    title: '', subtitle: '', category: 'Concert', venue: '', city: 'Ho Chi Minh City', date: '', time: '20:00',
    description: '',
    classes: [
      { name: 'VIP', price: 3000000, capacity: 100, perks: '' },
      { name: 'Standard', price: 1500000, capacity: 500, perks: '' },
      { name: 'General Admission', price: 800000, capacity: 800, perks: '' },
    ],
  });
  const update = (k, v) => setForm({ ...form, [k]: v });
  const updateClass = (i, k, v) => {
    const c = [...form.classes]; c[i] = { ...c[i], [k]: v }; setForm({ ...form, classes: c });
  };
  return (
    <AdminShell eyebrow="Admin · Events · New" title="Create event."
      action={
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="tf-btn tf-btn-ghost" onClick={() => navigate('admin-events')}>Cancel</button>
          <button className="tf-btn tf-btn-ink">Save draft</button>
          <button className="tf-btn tf-btn-primary">Publish <Icon.arrow /></button>
        </div>
      }>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {['Details', 'Tickets', 'Review'].map((l, i) => (
          <button key={i} onClick={() => setStep(i + 1)} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8, color: step === i + 1 ? 'var(--ink)' : 'var(--muted-2)' }}>
            <span style={{ width: 22, height: 22, borderRadius: 999, border: '1px solid currentColor', display: 'grid', placeItems: 'center', fontSize: 11 }}>{i + 1}</span>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48 }}>
        <div>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="tf-card" style={{ padding: 24 }}>
                <div className="tf-eyebrow" style={{ marginBottom: 16 }}>Basics</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="tf-label">Event title</label>
                    <input className="tf-input" placeholder="e.g. The Weeknd Live in Vietnam" value={form.title} onChange={(e) => update('title', e.target.value)} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="tf-label">Subtitle / tour</label>
                    <input className="tf-input" placeholder="After Hours Til Dawn Tour" value={form.subtitle} onChange={(e) => update('subtitle', e.target.value)} />
                  </div>
                  <div>
                    <label className="tf-label">Category</label>
                    <select className="tf-select" value={form.category} onChange={(e) => update('category', e.target.value)}>
                      {['Concert', 'Theater', 'Sports', 'Festival', 'Conference'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="tf-label">Genre</label>
                    <input className="tf-input" placeholder="R&B / Pop" />
                  </div>
                </div>
              </div>

              <div className="tf-card" style={{ padding: 24 }}>
                <div className="tf-eyebrow" style={{ marginBottom: 16 }}>Venue & date</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="tf-label">Venue</label>
                    <select className="tf-select">
                      <option>Phú Thọ Stadium</option>
                      <option>Mỹ Đình National Stadium</option>
                      <option>Saigon Opera House</option>
                      <option>GEM Center</option>
                      <option>+ Add new venue</option>
                    </select>
                  </div>
                  <div>
                    <label className="tf-label">Date</label>
                    <input className="tf-input" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
                  </div>
                  <div>
                    <label className="tf-label">Time</label>
                    <input className="tf-input" type="time" value={form.time} onChange={(e) => update('time', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="tf-card" style={{ padding: 24 }}>
                <div className="tf-eyebrow" style={{ marginBottom: 16 }}>Description</div>
                <textarea className="tf-textarea" rows="5" placeholder="Tell ticket buyers what to expect..." value={form.description} onChange={(e) => update('description', e.target.value)}></textarea>
              </div>

              <div className="tf-card" style={{ padding: 24 }}>
                <div className="tf-eyebrow" style={{ marginBottom: 16 }}>Hero artwork</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 24, border: '1px dashed var(--line)', borderRadius: 12 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 8, background: 'linear-gradient(135deg, var(--bg-warm), var(--line))', display: 'grid', placeItems: 'center' }}>
                    <Icon.plus width="20" height="20" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>Upload poster (16:10)</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>PNG or JPG · 2400×1500 recommended · Up to 8 MB</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="tf-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div className="tf-eyebrow">Ticket classes</div>
                <button className="tf-btn tf-btn-ghost tf-btn-sm"><Icon.plus /> Add class</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {form.classes.map((c, i) => (
                  <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 16, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: 12, alignItems: 'end' }}>
                    <div>
                      <label className="tf-label">Class name</label>
                      <input className="tf-input" value={c.name} onChange={(e) => updateClass(i, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="tf-label">Price (VND)</label>
                      <input className="tf-input tf-mono" value={c.price} onChange={(e) => updateClass(i, 'price', +e.target.value)} />
                    </div>
                    <div>
                      <label className="tf-label">Capacity</label>
                      <input className="tf-input tf-mono" value={c.capacity} onChange={(e) => updateClass(i, 'capacity', +e.target.value)} />
                    </div>
                    <button style={{ width: 36, height: 36, border: '1px solid var(--line)', background: '#fff', borderRadius: 8, color: 'var(--muted)' }}>
                      <Icon.close />
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-soft)', borderRadius: 8, fontSize: 12, color: 'var(--muted)' }}>
                Total capacity: <b className="tf-num">{form.classes.reduce((a, b) => a + (+b.capacity || 0), 0).toLocaleString()}</b> · Estimated max revenue: <b className="tf-num">{TF_FMT.shortCurrency(form.classes.reduce((a, b) => a + b.price * b.capacity, 0))}</b>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="tf-card" style={{ padding: 24 }}>
              <div className="tf-eyebrow" style={{ marginBottom: 16 }}>Review & publish</div>
              <ReviewLine label="Title" value={form.title || '—'} />
              <ReviewLine label="Subtitle" value={form.subtitle || '—'} />
              <ReviewLine label="Category" value={form.category} />
              <ReviewLine label="When" value={(form.date || 'Not set') + ' · ' + form.time} />
              <ReviewLine label="Ticket classes" value={`${form.classes.length} · total capacity ${form.classes.reduce((a, b) => a + (+b.capacity || 0), 0)}`} />
              <div style={{ marginTop: 20, padding: 16, borderRadius: 10 }}>
                <Banner tone="warning" title="Heads up">
                  Once published, ticket classes can be deactivated but not deleted (booking integrity).
                </Banner>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button className="tf-btn tf-btn-ghost" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</button>
            <button className="tf-btn tf-btn-ink" onClick={() => setStep(Math.min(3, step + 1))}>{step === 3 ? 'Publish event' : 'Continue'} <Icon.arrow /></button>
          </div>
        </div>

        {/* Live preview */}
        <div>
          <div style={{ position: 'sticky', top: 88 }}>
            <div className="tf-eyebrow" style={{ marginBottom: 12 }}>Live preview</div>
            <div className="tf-card" style={{ overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/10', background: 'linear-gradient(135deg, #29261b, #6E2BA6, #E5392F)', display: 'flex', alignItems: 'end', padding: 18, color: '#fff', position: 'relative' }}>
                <div>
                  <div className="tf-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>{form.category}</div>
                  <div className="tf-display" style={{ fontSize: 28, lineHeight: 1, marginTop: 4 }}>{form.title || 'Untitled event'}</div>
                  <div className="tf-display tf-italic" style={{ fontSize: 16, opacity: 0.85 }}>{form.subtitle || 'Add a subtitle…'}</div>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>{form.date || 'Set date'} · {form.city}</div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {form.classes.map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 10px', background: 'var(--bg-soft)', borderRadius: 6 }}>
                      <span>{c.name || 'Untitled class'}</span>
                      <span className="tf-mono">{TF_FMT.shortCurrency(c.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, fontFamily: 'var(--font-mono)', textAlign: 'center' }}>How it'll look in browse</div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function ReviewLine({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, padding: '10px 0', borderTop: '1px solid var(--line-2)', fontSize: 14 }}>
      <span className="tf-eyebrow" style={{ paddingTop: 2 }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

// ──────────────── BOOKINGS
function AdminBookings({ events, navigate }) {
  const [filter, setFilter] = useStateA('all');
  const all = TF_BOOKINGS_SEED;
  const filtered = filter === 'all' ? all : all.filter(b => b.status.toLowerCase() === filter);
  return (
    <AdminShell eyebrow="Admin · Bookings" title="All bookings." action={
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="tf-btn tf-btn-ghost"><Icon.download /> Export CSV</button>
        <button className="tf-btn tf-btn-ink"><Icon.bolt /> Issue refund</button>
      </div>
    }>
      <Tabs tabs={[
        { id: 'all', label: 'All', count: all.length },
        { id: 'confirmed', label: 'Confirmed', count: all.filter(b => b.status === 'CONFIRMED').length },
        { id: 'pending', label: 'Pending', count: all.filter(b => b.status === 'PENDING').length },
        { id: 'cancelled', label: 'Cancelled', count: all.filter(b => b.status === 'CANCELLED').length },
      ]} active={filter} onChange={setFilter} style={{ marginBottom: 16 }} />

      <DataTable
        columns="150px 1fr 220px 100px 130px 130px 40px"
        headers={['Booking ID', 'Event / customer', 'Created', 'Tickets', 'Total', 'Status', '']}>
        {filtered.map((b, i) => {
          const ev = events.find(e => e.id === b.event);
          return (
            <DataTable.Row key={b.id} first={i === 0}
              template="150px 1fr 220px 100px 130px 130px 40px"
              onClick={() => navigate(`admin-booking:${b.id}`)}>
              <div className="tf-mono" style={{ fontSize: 12 }}>{b.id}</div>
              <div>
                <div style={{ fontWeight: 500 }}>{ev?.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>{b.user}</div>
              </div>
              <div className="tf-mono" style={{ color: 'var(--muted)', fontSize: 12 }}>{b.created}</div>
              <div className="tf-num">{b.tickets}</div>
              <div className="tf-num" style={{ fontWeight: 500 }}>{TF_FMT.shortCurrency(b.total)}</div>
              <StatusTag status={b.status} />
              <button style={{ background: 'transparent', border: 0, color: 'var(--muted)' }}><Icon.arrow /></button>
            </DataTable.Row>
          );
        })}
      </DataTable>
    </AdminShell>
  );
}

// ──────────────── VENUES
function AdminVenues() {
  const venues = [
    { name: 'Phú Thọ Stadium', city: 'Ho Chi Minh City', capacity: 25000, events: 8 },
    { name: 'Mỹ Đình National Stadium', city: 'Hanoi', capacity: 40000, events: 12 },
    { name: 'Saigon Opera House', city: 'Ho Chi Minh City', capacity: 468, events: 24 },
    { name: 'GEM Center', city: 'Ho Chi Minh City', capacity: 1200, events: 18 },
    { name: 'Arena Hà Đông', city: 'Hanoi', capacity: 8000, events: 4 },
    { name: 'White Palace', city: 'Ho Chi Minh City', capacity: 600, events: 9 },
    { name: 'The Loop', city: 'Ho Chi Minh City', capacity: 800, events: 6 },
  ];
  return (
    <AdminShell eyebrow="Admin · Venues" title="Venues." action={<button className="tf-btn tf-btn-ink"><Icon.plus />Add venue</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {venues.map((v, i) => (
          <div key={i} className="tf-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
              <div>
                <div className="tf-display" style={{ fontSize: 24, lineHeight: 1.1 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><Icon.pin width="12" height="12" />{v.city}</div>
              </div>
              <button style={{ background: 'transparent', border: 0, color: 'var(--muted)', fontSize: 18 }}>⋯</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div className="tf-eyebrow">Capacity</div>
                <div className="tf-display tf-num" style={{ fontSize: 22, marginTop: 2 }}>{v.capacity.toLocaleString()}</div>
              </div>
              <div>
                <div className="tf-eyebrow">Events</div>
                <div className="tf-display tf-num" style={{ fontSize: 22, marginTop: 2 }}>{v.events}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

window.AdminOverview = AdminOverview;
window.AdminEvents = AdminEvents;
window.AdminEventNew = AdminEventNew;
window.AdminBookings = AdminBookings;
window.AdminVenues = AdminVenues;
