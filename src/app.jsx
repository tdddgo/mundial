/* global React */
const { useState, useMemo, useCallback, useEffect } = React;

// ─── Inline SVG icons (lucide-style) ──────────────────────────────
const Icon = ({ children, size = 16, stroke = 2, fill = "none", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);
const Star = (p) => <Icon {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>;
const Filter = (p) => <Icon {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Icon>;
const Search = (p) => <Icon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>;
const Calendar = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>;
const Clock = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
const MapPin = (p) => <Icon {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>;
const Globe = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Icon>;
const ChevronDown = (p) => <Icon {...p}><polyline points="6 9 12 15 18 9"/></Icon>;
const ChevronUp = (p) => <Icon {...p}><polyline points="18 15 12 9 6 15"/></Icon>;
const ArrowUp = (p) => <Icon {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></Icon>;
const Trophy = (p) => <Icon {...p}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></Icon>;
const X = (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>;
const Check = (p) => <Icon {...p}><polyline points="20 6 9 17 4 12"/></Icon>;
const Bell = (p) => <Icon {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Icon>;
const Plus = (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>;
const Rss = (p) => <Icon {...p}><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></Icon>;
const LayoutGrid = (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Icon>;
const CalIcon = Calendar;
const CalGrid = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="4" x2="9" y2="22"/><line x1="15" y1="4" x2="15" y2="22"/></Icon>;

// ─── Pull globals from data.js ────────────────────────────────────
const { MATCHES, GROUPS, PHASES, PHASE_SHORT, TZ_OPTIONS, FLAG_MAP, COUNTRY_MAP, TEAM_SLUGS, TEAM_COLORS } = window;

// Per-group color (FIFA World Cup 26 vibrant palette)
const GROUP_COLORS = {
  A: "#E11D48", B: "#7C3AED", C: "#2563EB", D: "#0D9488",
  E: "#65A30D", F: "#F59E0B", G: "#EA580C", H: "#DB2777",
  I: "#FB7185", J: "#06B6D4", K: "#4F46E5", L: "#059669",
};
const PHASE_COLORS = {
  "Octavos": "#525252",
  "Cuartos de Octavos": "#404040",
  "Cuartos": "#262626",
  "Semifinal": "#171717",
  "Tercer puesto": "#737373",
  "Final": "#FACC15",
};
const groupColor = (g, phase) => g ? GROUP_COLORS[g] : (PHASE_COLORS[phase] || "#525252");

// ─── Utilities ────────────────────────────────────────────────────
function getDeviceOffset() {
  return -(new Date().getTimezoneOffset() / 60);
}
function adjustTime(timeStr, dateStr, fromOffsetET, toOffset) {
  const [h, m] = timeStr.split(":").map(Number);
  const diff = toOffset - fromOffsetET;
  let newH = h + diff;
  let dayShift = 0;
  if (newH >= 24) { newH -= 24; dayShift = 1; }
  if (newH < 0) { newH += 24; dayShift = -1; }
  let newDate = dateStr;
  if (dayShift !== 0) {
    const d = new Date(dateStr + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + dayShift);
    newDate = d.toISOString().slice(0, 10);
  }
  return { time: `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`, date: newDate };
}
function formatDate(dateStr) {
  const d = new Date(dateStr + "T12:00:00Z");
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${days[d.getUTCDay()]} ${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
}
// Convert ET (GMT-4) match time to UTC Date object
function matchToUTC(m) {
  const [h, mi] = m.time.split(":").map(Number);
  return new Date(Date.UTC(
    +m.date.slice(0,4), +m.date.slice(5,7)-1, +m.date.slice(8,10),
    h + 4, mi, 0
  ));
}
function fmtUTC(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth()+1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}00Z`;
}
function buildCalendarLinks(m) {
  const start = matchToUTC(m);
  const end = new Date(start.getTime() + 2*60*60*1000);
  const startStr = fmtUTC(start);
  const endStr = fmtUTC(end);
  const title = `⚽ ${m.home} vs ${m.away}`;
  const loc = `${m.venue}, ${m.city}`;
  const phase = PHASE_SHORT[m.phase] || m.phase;
  const desc = `${phase}${m.group ? ` - Grupo ${m.group}` : ""} | FIFA World Cup 2026`;
  const enc = encodeURIComponent;
  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${enc(title)}&dates=${startStr}/${endStr}&location=${enc(loc)}&details=${enc(desc)}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${enc(title)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&location=${enc(loc)}&body=${enc(desc)}`,
    yahoo: `https://calendar.yahoo.com/?v=60&title=${enc(title)}&st=${startStr}&et=${endStr}&desc=${enc(desc)}&in_loc=${enc(loc)}`,
  };
}
function singleMatchICS(m) {
  const start = matchToUTC(m);
  const end = new Date(start.getTime() + 2*60*60*1000);
  const phase = PHASE_SHORT[m.phase] || m.phase;
  return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WC2026//ES\r\nMETHOD:PUBLISH\r\nBEGIN:VEVENT\r\nUID:wc2026-match-${m.id}@dashboard\r\nDTSTAMP:${fmtUTC(new Date())}\r\nDTSTART:${fmtUTC(start)}\r\nDTEND:${fmtUTC(end)}\r\nSUMMARY:⚽ ${m.home} vs ${m.away}\r\nLOCATION:${m.venue}\\, ${m.city}\r\nDESCRIPTION:${phase}${m.group ? ` - Grupo ${m.group}` : ""} | FIFA World Cup 2026\r\nBEGIN:VALARM\r\nTRIGGER:-PT15M\r\nACTION:DISPLAY\r\nDESCRIPTION:⚽ ${m.home} vs ${m.away} comienza en 15 min\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
}
function generateICS(matches, tzOffset) {
  let cal = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WorldCup2026//Dashboard//ES\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n`;
  matches.forEach((m) => {
    const adj = adjustTime(m.time, m.date, -4, tzOffset);
    const [h, min] = adj.time.split(":").map(Number);
    const dtStr = adj.date.replace(/-/g, "");
    const startStr = `${dtStr}T${String(h).padStart(2, "0")}${String(min).padStart(2, "0")}00`;
    const endH = h + 2;
    const endStr = `${dtStr}T${String(endH).padStart(2, "0")}${String(min).padStart(2, "0")}00`;
    const uid = `wc2026-match-${m.id}@dashboard`;
    cal += `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTART:${startStr}\r\nDTEND:${endStr}\r\n`;
    cal += `SUMMARY:⚽ ${m.home} vs ${m.away}\r\n`;
    cal += `LOCATION:${m.venue}, ${m.city}\r\n`;
    cal += `DESCRIPTION:${PHASE_SHORT[m.phase] || m.phase}${m.group ? ` - Grupo ${m.group}` : ""} | FIFA World Cup 2026\r\n`;
    cal += `BEGIN:VALARM\r\nTRIGGER:-PT15M\r\nACTION:DISPLAY\r\nDESCRIPTION:⚽ ${m.home} vs ${m.away} comienza en 15 minutos\r\nEND:VALARM\r\n`;
    cal += `END:VEVENT\r\n`;
  });
  cal += `END:VCALENDAR\r\n`;
  return cal;
}

// ─── Match Card ───────────────────────────────────────────────────
function MatchCard({ match, starred, onToggle, onAddCalendar, tzOffset }) {
  const adj = adjustTime(match.time, match.date, -4, tzOffset);
  const isKnockout = match.phase !== "Grupos";
  const homeFlag = FLAG_MAP[match.home];
  const awayFlag = FLAG_MAP[match.away];
  const countryFlag = COUNTRY_MAP[match.city];
  const accent = groupColor(match.group, match.phase);
  const isFinal = match.phase === "Final";

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 12, overflow: "hidden",
      transition: "all 0.2s ease", position: "relative",
      boxShadow: starred ? `0 0 0 2px ${accent}` : "none",
    }}>
      {/* Top color band */}
      <div style={{
        background: accent, color: isFinal ? "#0a0a0a" : "#fff",
        padding: "6px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "var(--display)", fontSize: 14, letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        <span style={{ fontWeight: 400 }}>
          {match.group ? `Grupo ${match.group}` : (PHASE_SHORT[match.phase] || match.phase)}
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, opacity: 0.9 }}>
          M{match.id}
        </span>
      </div>

      <div style={{ display: "flex", padding: "14px 14px 12px", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ name: match.home, flag: homeFlag }, { name: match.away, flag: awayFlag }].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22, lineHeight: 1 }}>{t.flag || "🏳️"}</span>
                <span style={{
                  fontFamily: "var(--display-condensed)", fontWeight: 600, fontSize: 18,
                  color: "var(--text-primary)", textTransform: "uppercase",
                  letterSpacing: "0.01em", lineHeight: 1,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{t.name}</span>
              </div>
            ))}
          </div>

          <div style={{
            display: "flex", flexWrap: "wrap", gap: "4px 10px",
            marginTop: 12, fontSize: 11, color: "var(--text-muted)",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontWeight: 600, color: "var(--text-secondary)" }}>
              <CalIcon size={11}/> {formatDate(adj.date)} · {adj.time}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin size={11}/> {countryFlag ? `${countryFlag} ` : ""}{match.city}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0, alignItems: "center" }}>
          <button
            onClick={() => onToggle(match.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 6, borderRadius: 8,
              color: starred ? accent : "var(--text-muted)",
              transition: "all 0.15s ease",
            }}
            aria-label={starred ? "Quitar de favoritos" : "Marcar como favorito"}
          >
            <Star size={20} fill={starred ? "currentColor" : "none"} stroke={1.8}/>
          </button>
          <button
            onClick={() => onAddCalendar(match)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 6, borderRadius: 8, color: "var(--text-muted)",
              transition: "all 0.15s ease",
            }}
            aria-label="Agregar al calendario"
            title="Agregar al calendario"
          >
            <Plus size={18} stroke={2}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function Pill({ active, onClick, children, color }) {
  const c = color || "var(--accent)";
  return (
    <button onClick={onClick} style={{
      fontFamily: "var(--display-condensed)", fontSize: 13,
      fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
      padding: "6px 14px", borderRadius: 4,
      border: active ? `1px solid ${c}` : "1px solid var(--border)",
      background: active ? c : "var(--card-bg)",
      color: active ? "#fff" : "var(--text-secondary)",
      cursor: "pointer", whiteSpace: "nowrap",
      transition: "all 0.15s ease",
    }}>{children}</button>
  );
}

// ─── Calendar View ────────────────────────────────────────────────
function CalendarView({ matches, starred, tzOffset, onAddCalendar, onToggle }) {
  const [selected, setSelected] = useState(null);
  // Build day → matches map (in user's TZ)
  const byDay = useMemo(() => {
    const map = new Map();
    matches.forEach((m) => {
      const adj = adjustTime(m.time, m.date, -4, tzOffset);
      if (!map.has(adj.date)) map.set(adj.date, []);
      map.get(adj.date).push({ ...m, _adjTime: adj.time });
    });
    map.forEach((arr) => arr.sort((a, b) => a._adjTime.localeCompare(b._adjTime)));
    return map;
  }, [matches, tzOffset]);

  const months = [
    { label: "Junio 2026", year: 2026, month: 5 },
    { label: "Julio 2026", year: 2026, month: 6 },
  ];
  const dayNames = ["L", "M", "M", "J", "V", "S", "D"];

  const renderMonth = ({ label, year, month }) => {
    const first = new Date(Date.UTC(year, month, 1));
    const startOffset = (first.getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);

    return (
      <div key={label} style={{ marginBottom: 24 }}>
        <h3 style={{
          fontFamily: "var(--display)", fontSize: 24, lineHeight: 1,
          textTransform: "uppercase", letterSpacing: "0.02em",
          color: "var(--text-primary)", marginBottom: 10,
        }}>{label}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
          {dayNames.map((dn, i) => (
            <div key={i} style={{
              fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 600,
              textAlign: "center", color: "var(--text-muted)",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>{dn}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i}/>;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const dayMatches = byDay.get(dateStr) || [];
            const favs = dayMatches.filter((m) => starred.has(m.id));
            const hasFav = favs.length > 0;
            const isSel = selected === dateStr;
            const dotColors = [...new Set(favs.map((m) => groupColor(m.group, m.phase)))].slice(0, 4);
            return (
              <button key={i} onClick={() => setSelected(isSel ? null : dateStr)}
                style={{
                  aspectRatio: "1 / 1.05", padding: 4,
                  background: isSel ? "var(--text-primary)" : (hasFav ? "var(--card-bg)" : "transparent"),
                  border: hasFav ? "1px solid var(--border)" : "1px solid transparent",
                  color: isSel ? "var(--bg)" : "var(--text-primary)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
                  cursor: dayMatches.length ? "pointer" : "default",
                  fontFamily: "var(--display-condensed)",
                  opacity: dayMatches.length ? 1 : 0.35,
                }}>
                <span style={{ fontSize: 14, fontWeight: 700, alignSelf: "flex-start" }}>{d}</span>
                <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", minHeight: 6 }}>
                  {hasFav
                    ? dotColors.map((c, j) => (<span key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: c }}/>))
                    : (dayMatches.length > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--text-muted)", opacity: 0.5 }}/>)
                  }
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Stats summary
  const totalFavs = [...byDay.values()].reduce((acc, arr) => acc + arr.filter((m) => starred.has(m.id)).length, 0);
  const daysWithFavs = [...byDay.entries()].filter(([_, arr]) => arr.some((m) => starred.has(m.id))).length;

  const selectedMatches = selected ? (byDay.get(selected) || []) : [];

  return (
    <div>
      {/* Summary */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 16,
      }}>
        <div style={{ flex: 1, padding: "12px 14px", background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 28, lineHeight: 1, color: "var(--accent)" }}>{totalFavs}</div>
          <div style={{ fontFamily: "var(--display-condensed)", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>partidos favoritos</div>
        </div>
        <div style={{ flex: 1, padding: "12px 14px", background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 28, lineHeight: 1, color: "var(--text-primary)" }}>{daysWithFavs}</div>
          <div style={{ fontFamily: "var(--display-condensed)", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>días con partido</div>
        </div>
      </div>

      {months.map(renderMonth)}

      {/* Selected day matches */}
      {selected && (
        <div style={{ marginTop: 8 }}>
          <div style={{
            fontFamily: "var(--display)", fontSize: 22, textTransform: "uppercase",
            color: "var(--text-primary)", marginBottom: 10, letterSpacing: "0.01em",
          }}>{formatDate(selected)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedMatches.map((m) => (
              <MatchCard key={m.id} match={m} starred={starred.has(m.id)} onToggle={onToggle} onAddCalendar={onAddCalendar} tzOffset={tzOffset}/>
            ))}
          </div>
        </div>
      )}

      {!selected && (
        <div style={{
          textAlign: "center", padding: "20px 16px", color: "var(--text-muted)",
          fontFamily: "var(--display-condensed)", fontSize: 12, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          Tap un día para ver los partidos
        </div>
      )}
    </div>
  );
}

// ─── Countdown Banner ─────────────────────────────────────────────
function CountdownBanner({ starred, themeAccent }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const live = useMemo(() => {
    return [...starred].find((m) => {
      const s = matchToUTC(m).getTime();
      return now >= s && now < s + 2 * 60 * 60 * 1000;
    });
  }, [starred, now]);

  const upcoming = useMemo(() => {
    if (live) return null;
    return [...starred]
      .map((m) => ({ m, ts: matchToUTC(m).getTime() }))
      .filter((x) => x.ts > now)
      .sort((a, b) => a.ts - b.ts)[0]?.m;
  }, [starred, now, live]);

  if (!live && !upcoming) return null;

  const m = live || upcoming;
  const homeFlag = FLAG_MAP[m.home] || "🏳️";
  const awayFlag = FLAG_MAP[m.away] || "🏳️";

  let countdownStr = "";
  if (!live) {
    const diff = matchToUTC(upcoming).getTime() - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    if (days > 0) countdownStr = `EN ${days}D ${hours}H ${mins}M`;
    else if (hours > 0) countdownStr = `EN ${hours}H ${mins}M ${String(secs).padStart(2, "0")}S`;
    else countdownStr = `EN ${mins}M ${String(secs).padStart(2, "0")}S`;
  }

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 30,
      margin: "0 -16px 16px",
      background: live ? "#DC2626" : "var(--text-primary)",
      color: live ? "#fff" : "var(--bg)",
      padding: "12px 16px",
      display: "flex", alignItems: "center", gap: 10,
      animation: "fadeIn 0.3s ease",
    }}>
      {live && (
        <span style={{
          width: 10, height: 10, borderRadius: "50%", background: "#fff",
          animation: "livePulse 1.2s ease-in-out infinite",
          flexShrink: 0,
        }}/>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--display-condensed)", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.16em", opacity: 0.75, textTransform: "uppercase",
        }}>
          {live ? "Ahora en vivo" : "Próximo favorito"}
        </div>
        <div style={{
          fontFamily: "var(--display)", fontSize: 18, lineHeight: 1.1, marginTop: 2,
          textTransform: "uppercase", letterSpacing: "0.01em",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {homeFlag} {m.home} <span style={{ opacity: 0.5 }}>vs</span> {m.away} {awayFlag}
        </div>
      </div>
      <div style={{
        fontFamily: "var(--display-condensed)", fontSize: 13, fontWeight: 700,
        letterSpacing: "0.06em", flexShrink: 0,
      }}>
        {live ? "EN VIVO" : countdownStr}
      </div>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────
function Onboarding({ onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [team, setTeam] = useState(null);
  const [champion, setChampion] = useState(null);

  const teams = useMemo(() =>
    [...new Set(MATCHES.filter(m => m.phase === "Grupos").flatMap(m => [m.home, m.away]))].sort()
  , []);

  const next = () => {
    if (step === 0) {
      if (!team) return;
      setStep(1);
    } else {
      onComplete({ team, champion });
    }
  };

  const stepTitle = step === 0 ? "¿A quién vas a alentar?" : "¿Quién será el campeón?";
  const stepHint = step === 0
    ? "Marcamos tus partidos como favoritos automáticamente."
    : "Tu pronóstico se guarda en este dispositivo. Podés cambiarlo después.";
  const stepValue = step === 0 ? team : champion;
  const setStepValue = step === 0 ? setTeam : setChampion;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "var(--bg)", display: "flex", flexDirection: "column",
      animation: "fadeIn 0.3s ease",
    }}>
      {/* Top stripe */}
      <div style={{ display: "flex", height: 6 }}>
        {GROUPS.map((g) => (
          <div key={g} style={{ flex: 1, background: GROUP_COLORS[g] }}/>
        ))}
      </div>

      {/* Step indicator + skip */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px 8px",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8,
              background: i <= step ? "var(--text-primary)" : "var(--border)",
              transition: "all 0.2s",
            }}/>
          ))}
        </div>
        <button onClick={onSkip} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--display-condensed)", fontSize: 12, fontWeight: 600,
          color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em",
        }}>Saltar</button>
      </div>

      {/* Title */}
      <div style={{ padding: "12px 20px 16px" }}>
        <h2 style={{
          fontFamily: "var(--display)", fontSize: 40, lineHeight: 1,
          color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.005em",
        }}>{stepTitle}</h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "var(--text-muted)", marginTop: 8,
        }}>{stepHint}</p>
      </div>

      {/* Team grid */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "0 12px 20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
        gap: 8,
        alignContent: "start",
      }}>
        {teams.map((t) => {
          const selected = stepValue === t;
          const tc = TEAM_COLORS[t] || "#525252";
          return (
            <button key={t} onClick={() => setStepValue(selected ? null : t)}
              style={{
                background: selected ? tc : "var(--card-bg)",
                border: selected ? `2px solid ${tc}` : "1px solid var(--border)",
                color: selected ? "#fff" : "var(--text-primary)",
                padding: "10px 6px", cursor: "pointer", textAlign: "center",
                fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.04em",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                aspectRatio: "1 / 1",
                transition: "all 0.15s",
              }}>
              <span style={{ fontSize: 28, lineHeight: 1 }}>{FLAG_MAP[t] || "🏳️"}</span>
              <span style={{
                fontSize: 10, lineHeight: 1.1,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                maxWidth: "100%",
              }}>{t}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom action */}
      <div style={{
        padding: "12px 20px max(20px, env(safe-area-inset-bottom)) 20px",
        background: "var(--bg-elev)",
        borderTop: "1px solid var(--border)",
      }}>
        <button onClick={next} disabled={step === 0 && !team} style={{
          width: "100%",
          padding: "14px",
          background: (step === 0 && !team) ? "var(--border)" : "var(--text-primary)",
          color: (step === 0 && !team) ? "var(--text-muted)" : "var(--bg)",
          border: "none", cursor: (step === 0 && !team) ? "not-allowed" : "pointer",
          fontFamily: "var(--display-condensed)", fontSize: 14, fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          {step === 0 ? "Siguiente →" : "Entrar al Mundial"}
        </button>
      </div>
    </div>
  );
}

// ─── Bracket View ─────────────────────────────────────────────────
// Match ID aliases used by FIFA brackets in source labels.
const BRACKET_ALIASES = {
  "QF1": 97, "QF2": 98, "QF3": 99, "QF4": 100,
  "SF1": 101, "SF2": 102,
};
function resolveTeam(rawLabel, picks) {
  if (!rawLabel) return rawLabel;
  // "Ganador M73" or "Ganador QF1"
  const winMatch = rawLabel.match(/^Ganador\s+(M\d+|QF\d|SF\d)$/);
  if (winMatch) {
    const ref = winMatch[1];
    const id = ref.startsWith("M") ? parseInt(ref.slice(1), 10) : BRACKET_ALIASES[ref];
    if (picks[id]) return picks[id];
  }
  return rawLabel;
}
function isPickable(label) {
  // Group seed labels like "1° Grupo A", "3° (E/...)" are not pickable yet
  return !/^(1°|2°|3°)/.test(label);
}

function BracketView({ picks, setPicks, myChampion }) {
  const knockoutMatches = useMemo(() => MATCHES.filter((m) => m.phase !== "Grupos"), []);
  const phases = [
    { label: "Octavos · 32avos", phase: "Octavos", ids: knockoutMatches.filter(m => m.phase === "Octavos").map(m => m.id) },
    { label: "16avos", phase: "Cuartos de Octavos", ids: knockoutMatches.filter(m => m.phase === "Cuartos de Octavos").map(m => m.id) },
    { label: "Cuartos", phase: "Cuartos", ids: knockoutMatches.filter(m => m.phase === "Cuartos").map(m => m.id) },
    { label: "Semifinales", phase: "Semifinal", ids: knockoutMatches.filter(m => m.phase === "Semifinal").map(m => m.id) },
    { label: "Final", phase: "Final", ids: [104] },
  ];

  const pick = (matchId, side, team) => {
    if (!isPickable(team)) return;
    setPicks((p) => {
      const next = { ...p, [matchId]: team };
      try { localStorage.setItem("wc2026_bracket", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const clearBracket = () => {
    if (!confirm("¿Borrar todas tus predicciones del bracket?")) return;
    setPicks({});
    try { localStorage.setItem("wc2026_bracket", "{}"); } catch {}
  };

  const championPick = picks[104];
  const finalAccent = championPick ? (TEAM_COLORS[championPick] || "#FACC15") : "#FACC15";

  return (
    <div>
      {/* Header */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border)",
        padding: "16px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          fontFamily: "var(--display)", fontSize: 48, lineHeight: 1,
          color: championPick ? finalAccent : "var(--text-muted)",
          flexShrink: 0,
        }}>🏆</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 700,
            color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em",
          }}>Tu campeón pronosticado</div>
          <div style={{
            fontFamily: "var(--display)", fontSize: 26, lineHeight: 1,
            marginTop: 4, color: championPick ? "var(--text-primary)" : "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: "0.005em",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {championPick ? `${FLAG_MAP[championPick] || ""} ${championPick}` : "—"}
          </div>
        </div>
        {Object.keys(picks).length > 0 && (
          <button onClick={clearBracket} style={{
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--text-muted)", padding: "6px 10px", cursor: "pointer",
            fontFamily: "var(--display-condensed)", fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>Reiniciar</button>
        )}
      </div>

      {/* Phases */}
      {phases.map(({ label, ids }) => (
        <div key={label} style={{ marginBottom: 24 }}>
          <h3 style={{
            fontFamily: "var(--display)", fontSize: 22, lineHeight: 1,
            color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.01em",
            marginBottom: 10,
          }}>{label}</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: ids.length === 1 ? "1fr" : "repeat(auto-fill, minmax(170px, 1fr))",
            gap: 8,
          }}>
            {ids.map((id) => {
              const m = MATCHES.find((x) => x.id === id);
              const homeT = resolveTeam(m.home, picks);
              const awayT = resolveTeam(m.away, picks);
              const picked = picks[m.id];
              const isFinalMatch = m.phase === "Final";
              return (
                <div key={id} style={{
                  background: "var(--card-bg)", border: "1px solid var(--border)",
                  borderTop: isFinalMatch ? `4px solid ${finalAccent}` : "1px solid var(--border)",
                  display: "flex", flexDirection: "column",
                }}>
                  {[{ side: "home", team: homeT }, { side: "away", team: awayT }].map(({ side, team }, i) => {
                    const isPicked = picked === team;
                    const canPick = isPickable(team);
                    const teamColor = TEAM_COLORS[team] || "var(--text-primary)";
                    return (
                      <button key={i}
                        onClick={() => pick(m.id, side, team)}
                        disabled={!canPick}
                        style={{
                          background: isPicked ? teamColor : "transparent",
                          color: isPicked ? "#fff" : (canPick ? "var(--text-primary)" : "var(--text-muted)"),
                          border: "none", padding: "10px 12px",
                          borderTop: i === 1 ? "1px solid var(--border)" : "none",
                          display: "flex", alignItems: "center", gap: 8,
                          cursor: canPick ? "pointer" : "not-allowed",
                          fontFamily: "var(--display-condensed)", fontSize: 13, fontWeight: 600,
                          textAlign: "left", textTransform: "uppercase", letterSpacing: "0.02em",
                          minHeight: 42,
                        }}>
                        <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>
                          {FLAG_MAP[team] || (canPick ? "🏳️" : "?")}
                        </span>
                        <span style={{
                          flex: 1, fontFamily: "var(--display-condensed)", fontWeight: 600,
                          textTransform: "uppercase", letterSpacing: "0.02em",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          fontSize: 12,
                        }}>{team}</span>
                        {isPicked && <Check size={14}/>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Helper */}
      <div style={{
        padding: "16px", background: "var(--bg-elev)",
        fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 600,
        color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em",
        lineHeight: 1.6,
      }}>
        Tap un equipo para marcarlo como ganador. Las posiciones de los grupos (1°, 2°, 3°) aún no están definidas y no se pueden seleccionar hasta junio 2026.
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────
function WorldCupDashboard() {
  const [starred, setStarred] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wc2026_starred") || "[]")); }
    catch { return new Set(); }
  });
  const [searchTeam, setSearchTeam] = useState("");
  const [filterGroup, setFilterGroup] = useState(null);
  const [filterPhase, setFilterPhase] = useState(null);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [tzSetting, setTzSetting] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wc2026_tz") || "\"auto\""); }
    catch { return "auto"; }
  });
  const [groupBy, setGroupBy] = useState(() => {
    try { return localStorage.getItem("wc2026_groupBy") || "group"; }
    catch { return "group"; }
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showTzPicker, setShowTzPicker] = useState(false);
  const [addingMatch, setAddingMatch] = useState(null);
  const [expandedSections, setExpandedSections] = useState(() => {
    try {
      const stored = localStorage.getItem("wc2026_expanded");
      if (stored) return new Set(JSON.parse(stored));
    } catch {}
    // Default: knockouts expanded, groups collapsed (overview-first)
    return new Set(["P1-Octavos", "P2-Cuartos de Octavos", "P3-Cuartos", "P4-Semifinal", "P5-Tercer puesto", "P6-Final"]);
  });
  const [showTop, setShowTop] = useState(false);

  // Onboarding + theme + bracket
  const [myTeam, setMyTeam] = useState(() => localStorage.getItem("wc2026_myTeam") || null);
  const [myChampion, setMyChampion] = useState(() => localStorage.getItem("wc2026_champion") || null);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("wc2026_onboarded"));
  const [bracketPicks, setBracketPicksState] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wc2026_bracket") || "{}"); }
    catch { return {}; }
  });
  const setBracketPicks = useCallback((updater) => {
    setBracketPicksState((prev) => typeof updater === "function" ? updater(prev) : updater);
  }, []);

  const completeOnboarding = useCallback(({ team, champion }) => {
    if (team) {
      setMyTeam(team);
      localStorage.setItem("wc2026_myTeam", team);
      // Auto-star all matches involving this team
      const teamMatchIds = MATCHES.filter((m) => m.home === team || m.away === team).map(m => m.id);
      setStarred((prev) => {
        const next = new Set(prev);
        teamMatchIds.forEach(id => next.add(id));
        try { localStorage.setItem("wc2026_starred", JSON.stringify([...next])); } catch {}
        return next;
      });
    }
    if (champion) {
      setMyChampion(champion);
      localStorage.setItem("wc2026_champion", champion);
      // Pre-fill the final pick with champion (best effort)
      setBracketPicks((p) => {
        const next = { ...p, 104: champion };
        try { localStorage.setItem("wc2026_bracket", JSON.stringify(next)); } catch {}
        return next;
      });
    }
    localStorage.setItem("wc2026_onboarded", "true");
    setShowOnboarding(false);
  }, []);

  const skipOnboarding = useCallback(() => {
    localStorage.setItem("wc2026_onboarded", "true");
    setShowOnboarding(false);
  }, []);

  // Theme accent based on user's team
  const themeAccent = myTeam ? TEAM_COLORS[myTeam] : null;

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleSection = useCallback((key) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      try { localStorage.setItem("wc2026_expanded", JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const tzOffset = tzSetting === "auto" ? getDeviceOffset() : tzSetting;

  useEffect(() => { localStorage.setItem("wc2026_tz", JSON.stringify(tzSetting)); }, [tzSetting]);
  useEffect(() => { localStorage.setItem("wc2026_groupBy", groupBy); }, [groupBy]);

  const toggleStar = useCallback((id) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem("wc2026_starred", JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    let list = MATCHES;
    if (showStarredOnly) list = list.filter((m) => starred.has(m.id));
    if (filterGroup) list = list.filter((m) => m.group === filterGroup);
    if (filterPhase) list = list.filter((m) => m.phase === filterPhase);
    if (searchTeam) {
      const q = searchTeam.toLowerCase();
      list = list.filter((m) => m.home.toLowerCase().includes(q) || m.away.toLowerCase().includes(q));
    }
    return list;
  }, [showStarredOnly, filterGroup, filterPhase, searchTeam, starred]);

  // Sectioned by group (default) or by date
  const sections = useMemo(() => {
    if (groupBy === "calendar" || groupBy === "bracket") return [];
    if (groupBy === "date") {
      const map = new Map();
      filtered.forEach((m) => {
        const adj = adjustTime(m.time, m.date, -4, tzOffset);
        if (!map.has(adj.date)) map.set(adj.date, []);
        map.get(adj.date).push(m);
      });
      return [...map.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, items]) => ({
          key: date,
          title: formatDate(date),
          subtitle: null,
          items: items.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
        }));
    }
    // by group: A, B, C... then knockout phases at the end
    const map = new Map();
    filtered.forEach((m) => {
      const key = m.group ? `G${m.group}` : `P${PHASES.indexOf(m.phase)}-${m.phase}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    });
    const sorted = [...map.entries()].sort((a, b) => {
      const ag = a[0].startsWith("G"), bg = b[0].startsWith("G");
      if (ag && !bg) return -1;
      if (!ag && bg) return 1;
      return a[0].localeCompare(b[0]);
    });
    return sorted.map(([key, items]) => {
      const isGroup = key.startsWith("G");
      const sample = items[0];
      return {
        key,
        title: isGroup ? `Grupo ${key.slice(1)}` : (PHASE_SHORT[sample.phase] || sample.phase),
        subtitle: isGroup
          ? [...new Set(items.flatMap((m) => [m.home, m.away]))].length + " selecciones"
          : "Eliminación directa",
        items: items.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
      };
    });
  }, [filtered, groupBy, tzOffset]);

  const starredMatches = useMemo(() => MATCHES.filter((m) => starred.has(m.id)), [starred]);

  // Webcal subscription URLs — work once deployed (GitHub Pages, etc.)
  const subBase = useMemo(() => {
    if (typeof window === "undefined") return null;
    const { protocol, host, pathname } = window.location;
    if (protocol === "file:" || !host) return null;
    const base = pathname.endsWith("/") ? pathname : pathname.replace(/[^/]*$/, "");
    return `webcal://${host}${base}`;
  }, []);
  const subscribeURL = subBase ? `${subBase}mundial.ics` : null;
  const teamSubURL = (team) => subBase && TEAM_SLUGS[team] ? `${subBase}ics/team-${TEAM_SLUGS[team]}.ics` : null;
  const groupSubURL = (g) => subBase ? `${subBase}ics/group-${g}.ics` : null;

  const downloadICS = async () => {
    if (starredMatches.length === 0) return;
    const ics = generateICS(starredMatches, tzOffset);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const file = new File([blob], "mundial_2026.ics", { type: "text/calendar" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Mundial 2026", text: "Mis partidos del Mundial 2026" });
        return;
      } catch (e) { if (e.name === "AbortError") return; }
    }
    const reader = new FileReader();
    reader.onload = () => {
      const link = document.createElement("a");
      link.href = reader.result;
      link.download = "mundial_2026.ics";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
    };
    reader.readAsDataURL(blob);
  };

  return (
    <>
      {themeAccent && (
        <style>{`
          .app-themed {
            --accent: ${themeAccent};
            --accent-soft: ${themeAccent}22;
          }
        `}</style>
      )}
      {showOnboarding && (
        <Onboarding onComplete={completeOnboarding} onSkip={skipOnboarding}/>
      )}
    <div className={themeAccent ? "app-themed" : ""} style={{
      background: "var(--bg)", color: "var(--text-primary)",
      minHeight: "100vh", maxWidth: 520, margin: "0 auto",
      padding: "0 16px 80px",
    }}>
      {/* Header / Hero */}
      <header style={{
        position: "relative",
        margin: "0 -16px 16px",
        padding: "0 0 24px",
        background: "var(--bg-elev)",
        color: "var(--text-primary)",
        borderBottom: "1px solid var(--border)",
      }}>
        {/* 12-color stripe representing groups */}
        <div style={{ display: "flex", height: 6 }}>
          {GROUPS.map((g) => (
            <div key={g} style={{ flex: 1, background: GROUP_COLORS[g] }}/>
          ))}
        </div>
        <div style={{ padding: "28px 16px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
          }}>
            <span style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: "50%" }}/>
            <span style={{
              fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-secondary)",
            }}>FIFA World Cup 26™</span>
          </div>
          <h1 style={{
            fontFamily: "var(--display)", fontSize: 84, fontWeight: 400,
            lineHeight: 0.86, letterSpacing: "0.005em",
            color: "var(--text-primary)",
            textTransform: "uppercase",
          }}>
            Mundial<br/>
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 12 }}>
              <span>26</span>
              <span style={{
                fontFamily: "var(--display-condensed)", fontWeight: 700,
                fontSize: 13, color: "var(--text-muted)",
                letterSpacing: "0.14em", alignSelf: "flex-end", marginBottom: 12,
              }}>104 PARTIDOS<br/>48 SELECCIONES</span>
            </span>
          </h1>
          <p style={{
            fontFamily: "var(--display-condensed)", fontSize: 13,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--text-secondary)", marginTop: 18,
            display: "flex", flexWrap: "wrap", gap: "4px 14px",
          }}>
            <span>🇺🇸 EE.UU.</span>
            <span>🇲🇽 México</span>
            <span>🇨🇦 Canadá</span>
            <span style={{ color: "var(--text-muted)" }}>· 11 Jun → 19 Jul</span>
          </p>
          {subscribeURL && (
            <a href={subscribeURL}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginTop: 20, padding: "12px 16px",
                background: "var(--text-primary)", color: "var(--bg)",
                border: "none",
                fontFamily: "var(--display-condensed)", fontSize: 12,
                fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                textDecoration: "none", cursor: "pointer",
              }}>
              <Rss size={14}/> Suscribir el calendario completo
            </a>
          )}
        </div>
      </header>

      {/* Countdown banner */}
      <CountdownBanner starred={starredMatches} themeAccent={themeAccent}/>

      {/* Sort toggle */}
      <div style={{
        display: "flex", background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: 10, padding: 3, marginBottom: 12,
      }}>
        {[
          { id: "group", label: "Grupos", Ico: LayoutGrid },
          { id: "date", label: "Fechas", Ico: CalIcon },
          { id: "calendar", label: "Mes", Ico: CalGrid },
          { id: "bracket", label: "Bracket", Ico: Trophy },
        ].map(({ id, label, Ico }) => (
          <button key={id} onClick={() => setGroupBy(id)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "8px 10px", border: "none", borderRadius: 8, cursor: "pointer",
              background: groupBy === id ? "var(--accent)" : "transparent",
              color: groupBy === id ? "#fff" : "var(--text-secondary)",
              fontSize: 12, fontWeight: 600, transition: "all 0.15s ease",
            }}>
            <Ico size={13}/> {label}
          </button>
        ))}
      </div>

      {/* TZ + Filters Row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => setShowTzPicker(!showTzPicker)} style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "var(--card-bg)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "7px 12px", cursor: "pointer",
          fontSize: 12, color: "var(--text-secondary)", fontWeight: 500,
        }}>
          <Globe size={13}/> GMT{tzOffset >= 0 ? "+" : ""}{tzOffset} <ChevronDown size={12}/>
        </button>
        <button onClick={() => setShowFilters(!showFilters)} style={{
          display: "flex", alignItems: "center", gap: 5,
          background: (filterGroup || filterPhase) ? "var(--accent)" : "var(--card-bg)",
          border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px",
          cursor: "pointer", fontSize: 12, fontWeight: 500,
          color: (filterGroup || filterPhase) ? "#fff" : "var(--text-secondary)",
        }}>
          <Filter size={13}/> Filtros
          {(filterGroup || filterPhase) && (
            <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 10, padding: "0 5px", fontSize: 10 }}>
              {[filterGroup && `G${filterGroup}`, filterPhase && PHASE_SHORT[filterPhase]].filter(Boolean).join(", ")}
            </span>
          )}
        </button>
        <button onClick={() => setShowStarredOnly(!showStarredOnly)} style={{
          display: "flex", alignItems: "center", gap: 5,
          background: showStarredOnly ? "var(--accent)" : "var(--card-bg)",
          border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px",
          cursor: "pointer", fontSize: 12, fontWeight: 500,
          color: showStarredOnly ? "#fff" : "var(--text-secondary)",
          marginLeft: "auto",
        }}>
          <Star size={13} fill={showStarredOnly ? "currentColor" : "none"}/> {starred.size}
        </button>
      </div>

      {showTzPicker && (
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border)",
          borderRadius: 10, padding: 12, marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Zona horaria
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {TZ_OPTIONS.map((tz) => (
              <button key={String(tz.value)} onClick={() => { setTzSetting(tz.value); setShowTzPicker(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: tzSetting === tz.value ? "var(--accent-soft)" : "transparent",
                  border: "none", borderRadius: 6, padding: "8px 10px",
                  cursor: "pointer", fontSize: 12, color: "var(--text-primary)",
                  fontWeight: tzSetting === tz.value ? 600 : 400,
                }}>
                {tz.label}
                {tzSetting === tz.value && <Check size={14} style={{ color: "var(--accent)" }}/>}
              </button>
            ))}
          </div>
        </div>
      )}

      {showFilters && (
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border)",
          borderRadius: 10, padding: 14, marginBottom: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Filtrar partidos
            </span>
            {(filterGroup || filterPhase) && (
              <button onClick={() => { setFilterGroup(null); setFilterPhase(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>
                Limpiar
              </button>
            )}
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Grupo</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {GROUPS.map((g) => (
              <Pill key={g} active={filterGroup === g} onClick={() => setFilterGroup(filterGroup === g ? null : g)}>{g}</Pill>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Fase</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {PHASES.map((p) => (
              <Pill key={p} active={filterPhase === p} onClick={() => setFilterPhase(filterPhase === p ? null : p)}>
                {PHASE_SHORT[p]}
              </Pill>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}/>
        <input type="text" placeholder="Buscar selección..." value={searchTeam}
          onChange={(e) => setSearchTeam(e.target.value)}
          style={{
            width: "100%", background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "10px 12px 10px 36px",
            fontSize: 13, color: "var(--text-primary)", outline: "none",
          }}/>
        {searchTeam && (
          <button onClick={() => setSearchTeam("")} style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
          }}><X size={14}/></button>
        )}
      </div>

      {starredMatches.length > 0 && (
        <button onClick={() => setAddingMatch(starredMatches)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10,
          padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
          marginBottom: 20, boxShadow: "0 2px 8px rgba(180,83,9,0.2)", fontFamily: "inherit",
        }}>
          <Plus size={16}/>
          Agregar {starredMatches.length} favorito{starredMatches.length !== 1 ? "s" : ""} al calendario
          <Bell size={14} style={{ opacity: 0.7 }}/>
        </button>
      )}

      {/* Stats / List controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
        <div style={{
          flex: 1, background: "var(--card-bg)", border: "1px solid var(--border)",
          padding: "10px 14px",
        }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 22, lineHeight: 1, color: "var(--text-primary)" }}>{filtered.length}</div>
          <div style={{ fontFamily: "var(--display-condensed)", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Partidos</div>
        </div>
        <div style={{
          flex: 1, background: "var(--card-bg)", border: "1px solid var(--border)",
          padding: "10px 14px",
        }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 22, lineHeight: 1, color: "var(--accent)" }}>{starred.size}</div>
          <div style={{ fontFamily: "var(--display-condensed)", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Favoritos</div>
        </div>
        {groupBy === "group" && (
          <button onClick={() => {
            const allKeys = sections.map(s => s.key);
            const allExpanded = allKeys.every(k => expandedSections.has(k));
            setExpandedSections(allExpanded ? new Set() : new Set(allKeys));
            try { localStorage.setItem("wc2026_expanded", JSON.stringify(allExpanded ? [] : allKeys)); } catch {}
          }} style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            padding: "10px 14px", cursor: "pointer",
            fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 700,
            color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            {sections.every(s => expandedSections.has(s.key)) ? "Colapsar" : "Expandir"}<br/>todo
          </button>
        )}
      </div>

      {/* Sections */}
      {groupBy === "bracket" ? (
        <BracketView picks={bracketPicks} setPicks={setBracketPicks} myChampion={myChampion}/>
      ) : groupBy === "calendar" ? (
        <CalendarView matches={filtered} starred={starred} tzOffset={tzOffset} onAddCalendar={setAddingMatch} onToggle={toggleStar}/>
      ) : sections.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)", fontSize: 14 }}>
          <Search size={32} style={{ marginBottom: 12, opacity: 0.4 }}/>
          <p>No se encontraron partidos</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Ajusta los filtros o la búsqueda</p>
        </div>
      ) : (
        sections.map((section, di) => {
          const isGroupSec = groupBy === "group" && section.key.startsWith("G");
          const letter = isGroupSec ? section.key.slice(1) : null;
          const secColor = letter ? GROUP_COLORS[letter] : (PHASE_COLORS[section.items[0].phase] || "#525252");
          const isCollapsible = groupBy === "group";
          const expanded = !isCollapsible || expandedSections.has(section.key);
          const teams = isGroupSec ? [...new Set(section.items.flatMap(m => [m.home, m.away]))] : [];
          const favs = section.items.filter(m => starred.has(m.id)).length;

          return (
            <div key={section.key} id={`sec-${section.key}`} className="match-enter" style={{ animationDelay: `${di * 0.03}s`, marginBottom: 12 }}>
              <button
                onClick={() => isCollapsible && toggleSection(section.key)}
                disabled={!isCollapsible}
                style={{
                  width: "100%", background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderLeft: `6px solid ${secColor}`,
                  padding: "14px 14px",
                  display: "flex", alignItems: "center", gap: 12,
                  cursor: isCollapsible ? "pointer" : "default",
                  textAlign: "left", color: "inherit",
                  fontFamily: "inherit",
                }}>
                {isGroupSec && (
                  <div style={{
                    width: 48, height: 48, flexShrink: 0,
                    background: secColor, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--display)", fontSize: 36, lineHeight: 1,
                  }}>{letter}</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--display)", fontSize: 22, lineHeight: 1,
                    textTransform: "uppercase", letterSpacing: "0.01em",
                    color: "var(--text-primary)",
                  }}>{section.title}</div>
                  {isGroupSec ? (
                    <div style={{ display: "flex", gap: 8, marginTop: 8, fontSize: 18, lineHeight: 1, flexWrap: "wrap" }}>
                      {teams.map((t, i) => <span key={i} title={t}>{FLAG_MAP[t] || "🏳️"}</span>)}
                    </div>
                  ) : (
                    <div style={{
                      fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 600,
                      color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4,
                    }}>{section.subtitle}</div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{
                    fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 700,
                    color: secColor, textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>{section.items.length} part.</span>
                  {favs > 0 && (
                    <span style={{
                      fontFamily: "var(--display-condensed)", fontSize: 10, fontWeight: 600,
                      color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em",
                      display: "flex", alignItems: "center", gap: 3,
                    }}><Star size={10} fill="currentColor" stroke={2}/> {favs}</span>
                  )}
                  {isCollapsible && (expanded
                    ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }}/>
                    : <ChevronDown size={16} style={{ color: "var(--text-muted)" }}/>)}
                </div>
              </button>
              {expanded && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {section.items.map((m) => (
                    <MatchCard key={m.id} match={m} starred={starred.has(m.id)} onToggle={toggleStar} onAddCalendar={setAddingMatch} tzOffset={tzOffset}/>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Calendar action sheet — single match or array of matches */}
      {addingMatch && (() => {
        const isMulti = Array.isArray(addingMatch);
        const matches = isMulti ? addingMatch : [addingMatch];
        const single = !isMulti ? addingMatch : null;
        const links = single ? buildCalendarLinks(single) : null;

        const open = (url) => { window.open(url, "_blank", "noopener"); setAddingMatch(null); };
        const downloadIcs = async () => {
          const ics = isMulti ? generateICS(matches, tzOffset) : singleMatchICS(single);
          const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
          const fname = isMulti ? "mundial_2026_favoritos.ics" : `${single.home}-vs-${single.away}.ics`.replace(/\s+/g, "_");
          const file = new File([blob], fname, { type: "text/calendar" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: "Mundial 2026" }); setAddingMatch(null); return; }
            catch (e) { if (e.name === "AbortError") { setAddingMatch(null); return; } }
          }
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob); a.download = fname;
          document.body.appendChild(a); a.click();
          setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 100);
          setAddingMatch(null);
        };

        // For favorites: derive unique teams + groups present in selection
        const favTeams = isMulti
          ? [...new Set(matches.flatMap(m => [m.home, m.away]).filter(t => TEAM_SLUGS && TEAM_SLUGS[t]))]
          : [];
        const favGroups = isMulti
          ? [...new Set(matches.map(m => m.group).filter(Boolean))].sort()
          : [];
        const teamSubs = subBase ? favTeams.slice(0, 6).map(t => ({
          label: `Suscribir a ${FLAG_MAP[t] || ""} ${t}`.trim(),
          onClick: () => open(teamSubURL(t)),
          color: "#1a1917", outline: true,
          hint: "Todos sus partidos del Mundial",
        })) : [];
        const groupSubs = subBase ? favGroups.slice(0, 4).map(g => ({
          label: `Suscribir al Grupo ${g}`,
          onClick: () => open(groupSubURL(g)),
          color: "#1a1917", outline: true,
          hint: "Los 6 partidos del grupo",
        })) : [];

        const opts = isMulti
          ? [
              { label: `Descargar ${matches.length} partidos (.ics)`, onClick: downloadIcs, color: "var(--accent)", hint: "Compatible con Apple, Google y Outlook" },
              ...(subscribeURL ? [{ label: "Suscribir al calendario completo", onClick: () => open(subscribeURL), color: "#1a1917", hint: "Los 104 partidos, sincronizados" }] : []),
              ...teamSubs,
              ...groupSubs,
            ]
          : [
              { label: "Google Calendar", onClick: () => open(links.google), color: "#4285F4" },
              { label: "Apple Calendar / iCloud", onClick: downloadIcs, color: "#1a1917" },
              { label: "Outlook", onClick: () => open(links.outlook), color: "#0078D4" },
              { label: "Yahoo", onClick: () => open(links.yahoo), color: "#6001D2" },
              { label: "Descargar .ics", onClick: downloadIcs, color: "var(--text-secondary)", outline: true },
            ];

        const title = isMulti
          ? `${matches.length} partido${matches.length !== 1 ? "s" : ""} favorito${matches.length !== 1 ? "s" : ""}`
          : `${FLAG_MAP[single.home] || ""} ${single.home} vs ${single.away} ${FLAG_MAP[single.away] || ""}`;

        return (
          <div onClick={() => setAddingMatch(null)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            zIndex: 100, animation: "fadeIn 0.2s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              width: "100%", maxWidth: 520,
              background: "var(--bg)", borderRadius: "16px 16px 0 0",
              padding: "16px 16px max(20px, env(safe-area-inset-bottom)) 16px",
              animation: "slideUp 0.25s ease",
            }}>
              <div style={{ width: 36, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 14px" }}/>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                Agregar al calendario
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>
                {title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {opts.map((o, i) => (
                  <button key={i} onClick={o.onClick} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    background: o.outline ? "transparent" : o.color, color: o.outline ? o.color : "#fff",
                    border: o.outline ? "1px solid var(--border)" : "none",
                    borderRadius: 10, padding: "12px 16px",
                    cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                  }}>
                    <span>{o.label}</span>
                    {o.hint && <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.85 }}>{o.hint}</span>}
                  </button>
                ))}
                <button onClick={() => setAddingMatch(null)} style={{
                  background: "transparent", border: "none", color: "var(--text-muted)",
                  padding: "10px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                }}>Cancelar</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Scroll to top FAB */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Volver arriba"
          style={{
            position: "fixed", bottom: 20, right: 20, zIndex: 50,
            width: 48, height: 48,
            background: "var(--text-primary)", color: "var(--bg)",
            border: "none", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            animation: "fadeIn 0.2s ease",
          }}>
          <ArrowUp size={20} stroke={2.4}/>
        </button>
      )}

      <div style={{
        textAlign: "center", padding: "24px 0 8px",
        fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 600,
        color: "var(--text-muted)", lineHeight: 1.7,
        letterSpacing: "0.06em", textTransform: "uppercase",
        borderTop: "1px solid var(--border)", marginTop: 24,
      }}>
        Horarios en GMT{tzOffset >= 0 ? "+" : ""}{tzOffset} · Alarma 15 min antes
        <br/>
        ⚽ Mundial 2026
      </div>
    </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WorldCupDashboard/>);
