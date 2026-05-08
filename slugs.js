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
const { MATCHES, GROUPS, PHASES, PHASE_SHORT, TZ_OPTIONS, FLAG_MAP, COUNTRY_MAP, TEAM_SLUGS } = window;

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
    <div style={{
      background: "var(--bg)", color: "var(--text-primary)",
      minHeight: "100vh", maxWidth: 520, margin: "0 auto",
      padding: "0 16px 80px",
    }}>
      {/* Header / Hero */}
      <header style={{
        position: "relative", overflow: "hidden",
        margin: "0 -16px 16px", padding: "32px 16px 24px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        color: "#fafafa",
      }}>
        {/* Geometric pattern grid */}
        <svg viewBox="0 0 520 200" preserveAspectRatio="none" aria-hidden="true" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5,
        }}>
          <defs>
            <pattern id="wcgrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="30" height="30" fill="#E11D48" opacity="0.18"/>
              <rect x="30" y="0" width="30" height="30" fill="#7C3AED" opacity="0.18"/>
              <rect x="0" y="30" width="30" height="30" fill="#06B6D4" opacity="0.18"/>
              <rect x="30" y="30" width="30" height="30" fill="#F59E0B" opacity="0.18"/>
            </pattern>
          </defs>
          <rect width="520" height="200" fill="url(#wcgrid)"/>
          <circle cx="460" cy="40" r="55" fill="#E11D48" opacity="0.65"/>
          <rect x="380" y="110" width="80" height="80" fill="#FACC15" opacity="0.55"/>
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8,
            padding: "4px 10px", background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{
              fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase", color: "#fafafa",
            }}>FIFA World Cup 26™</span>
          </div>
          <h1 style={{
            fontFamily: "var(--display)", fontSize: 76, fontWeight: 400,
            lineHeight: 0.85, letterSpacing: "0.005em",
            color: "#fafafa", marginTop: 4,
            textTransform: "uppercase",
          }}>
            Mundial<br/>
            <span style={{ display: "inline-block" }}>26</span>
            <span style={{
              display: "inline-block", verticalAlign: "top", marginLeft: 8, marginTop: 6,
              width: 14, height: 14, background: "#E11D48",
            }}/>
          </h1>
          <p style={{
            fontFamily: "var(--display-condensed)", fontSize: 12,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#a3a3a3", marginTop: 12,
          }}>
            🇺🇸 EE.UU. · 🇲🇽 México · 🇨🇦 Canadá — 11 Jun → 19 Jul
          </p>
          {subscribeURL && (
            <a href={subscribeURL}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                marginTop: 18, padding: "10px 14px",
                background: "#E11D48", color: "#fff",
                border: "none",
                fontFamily: "var(--display-condensed)", fontSize: 12,
                fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                textDecoration: "none", cursor: "pointer",
              }}>
              <Rss size={13}/> Suscribir todos los partidos
            </a>
          )}
        </div>
      </header>

      {/* Sort toggle */}
      <div style={{
        display: "flex", background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: 10, padding: 3, marginBottom: 12,
      }}>
        {[
          { id: "group", label: "Por grupo", Ico: LayoutGrid },
          { id: "date", label: "Por fecha", Ico: CalIcon },
          { id: "calendar", label: "Calendario", Ico: CalGrid },
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
                  background: tzSetting === tz.value ? "var(--accent-light)" : "transparent",
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

      {/* Stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { val: filtered.length, label: "Partidos", color: "var(--text-primary)" },
          { val: starred.size, label: "Favoritos", color: "var(--accent)" },
          { val: sections.length, label: groupBy === "group" ? "Secciones" : "Jornadas", color: "var(--text-primary)" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "10px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sections */}
      {groupBy === "calendar" ? (
        <CalendarView matches={filtered} starred={starred} tzOffset={tzOffset} onAddCalendar={setAddingMatch} onToggle={toggleStar}/>
      ) : sections.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)", fontSize: 14 }}>
          <Search size={32} style={{ marginBottom: 12, opacity: 0.4 }}/>
          <p>No se encontraron partidos</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Ajusta los filtros o la búsqueda</p>
        </div>
      ) : (
        sections.map((section, di) => (
          <div key={section.key} className="match-enter" style={{ animationDelay: `${di * 0.03}s`, marginBottom: 24 }}>
            {(() => {
              const isGroupSec = groupBy === "group" && section.key.startsWith("G");
              const letter = isGroupSec ? section.key.slice(1) : null;
              const secColor = letter ? GROUP_COLORS[letter] : (groupBy === "group" ? (PHASE_COLORS[section.items[0].phase] || "#525252") : "var(--text-primary)");
              return (
                <div style={{
                  display: "flex", alignItems: "stretch", marginBottom: 12,
                  position: "sticky", top: 0, zIndex: 2,
                  background: "var(--bg)", paddingTop: 4, paddingBottom: 4,
                }}>
                  {isGroupSec && (
                    <div style={{
                      width: 56, background: secColor, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--display)", fontSize: 36, lineHeight: 1,
                      letterSpacing: "0.02em", marginRight: 12,
                    }}>{letter}</div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "var(--display)", fontSize: 28, lineHeight: 1,
                      letterSpacing: "0.01em", textTransform: "uppercase",
                      color: "var(--text-primary)",
                    }}>{section.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      {section.subtitle && (
                        <span style={{
                          fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 600,
                          color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em",
                        }}>{section.subtitle}</span>
                      )}
                      <span style={{
                        fontFamily: "var(--display-condensed)", fontSize: 11, fontWeight: 600,
                        color: secColor, textTransform: "uppercase", letterSpacing: "0.08em",
                      }}>· {section.items.length} part.</span>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {section.items.map((m) => (
                <MatchCard key={m.id} match={m} starred={starred.has(m.id)} onToggle={toggleStar} onAddCalendar={setAddingMatch} tzOffset={tzOffset}/>
              ))}
            </div>
          </div>
        ))
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

      <div style={{
        fontSize: 10, color: "var(--text-muted)", lineHeight: 1.6,
        borderTop: "1px solid var(--border)", marginTop: 20,
      }}>
        Horarios en GMT{tzOffset >= 0 ? "+" : ""}{tzOffset} · Alarma 15 min antes del inicio
        <br/>
        Hecho con ⚽ para el Mundial 2026
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WorldCupDashboard/>);
