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
const LayoutGrid = (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Icon>;
const CalIcon = Calendar;

// ─── Pull globals from data.js ────────────────────────────────────
const { MATCHES, GROUPS, PHASES, PHASE_SHORT, TZ_OPTIONS, FLAG_MAP, COUNTRY_MAP } = window;

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
function MatchCard({ match, starred, onToggle, tzOffset }) {
  const adj = adjustTime(match.time, match.date, -4, tzOffset);
  const isKnockout = match.phase !== "Grupos";
  const homeFlag = FLAG_MAP[match.home];
  const awayFlag = FLAG_MAP[match.away];
  const countryFlag = COUNTRY_MAP[match.city];

  return (
    <div style={{
      background: starred ? "var(--card-starred)" : "var(--card-bg)",
      border: starred ? "1px solid var(--accent)" : "1px solid var(--border)",
      borderRadius: 10, padding: "14px 16px",
      transition: "all 0.2s ease", position: "relative", overflow: "hidden",
    }}>
      {isKnockout && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: match.phase === "Final" ? "var(--gold)" : "var(--accent)",
          color: "#fff", fontSize: 9, fontWeight: 700,
          padding: "3px 10px 3px 12px", borderRadius: "0 0 0 8px",
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          {PHASE_SHORT[match.phase] || match.phase}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[{ name: match.home, flag: homeFlag }, { name: match.away, flag: awayFlag }].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{t.flag || "🏳️"}</span>
                <span style={{
                  fontWeight: 600, fontSize: 14, color: "var(--text-primary)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{t.name}</span>
              </div>
            ))}
          </div>

          <div style={{
            display: "flex", flexWrap: "wrap", gap: "4px 12px",
            marginTop: 10, fontSize: 11, color: "var(--text-muted)",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <CalIcon size={11}/> {formatDate(adj.date)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Clock size={11}/> {adj.time}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin size={11}/> {countryFlag ? `${countryFlag} ` : ""}{match.city}
            </span>
            {match.group && (
              <span style={{
                background: "var(--group-badge)", color: "var(--text-secondary)",
                padding: "1px 6px", borderRadius: 4, fontWeight: 600, fontSize: 10,
              }}>Grupo {match.group}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => onToggle(match.id)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 6, borderRadius: 8, flexShrink: 0,
            color: starred ? "var(--accent)" : "var(--text-muted)",
            transition: "all 0.15s ease",
          }}
          aria-label={starred ? "Quitar de favoritos" : "Marcar como favorito"}
        >
          <Star size={20} fill={starred ? "currentColor" : "none"} stroke={1.8}/>
        </button>
      </div>
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 12, fontWeight: active ? 600 : 500,
      padding: "6px 14px", borderRadius: 20,
      border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
      background: active ? "var(--accent)" : "var(--card-bg)",
      color: active ? "#fff" : "var(--text-secondary)",
      cursor: "pointer", whiteSpace: "nowrap",
      transition: "all 0.15s ease",
    }}>{children}</button>
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
      {/* Header */}
      <header style={{ padding: "28px 0 20px", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <Trophy size={18} style={{ color: "var(--accent)" }} stroke={2.2}/>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--accent)",
          }}>FIFA World Cup</span>
        </div>
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 32, fontWeight: 400, lineHeight: 1.1,
          color: "var(--text-primary)", marginTop: 4,
        }}>Mundial 2026</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
          EE.UU. · México · Canadá — 11 Jun – 19 Jul
        </p>
      </header>

      {/* Sort toggle */}
      <div style={{
        display: "flex", background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: 10, padding: 3, marginBottom: 12,
      }}>
        {[
          { id: "group", label: "Por grupo", Ico: LayoutGrid },
          { id: "date", label: "Por fecha", Ico: CalIcon },
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
        <button onClick={downloadICS} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10,
          padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
          marginBottom: 20, boxShadow: "0 2px 8px rgba(180,83,9,0.2)",
        }}>
          <Calendar size={16}/>
          Descargar {starredMatches.length} partido{starredMatches.length !== 1 ? "s" : ""} (.ics)
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
      {sections.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)", fontSize: 14 }}>
          <Search size={32} style={{ marginBottom: 12, opacity: 0.4 }}/>
          <p>No se encontraron partidos</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Ajusta los filtros o la búsqueda</p>
        </div>
      ) : (
        sections.map((section, di) => (
          <div key={section.key} className="match-enter" style={{ animationDelay: `${di * 0.03}s`, marginBottom: 24 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
              position: "sticky", top: 0, background: "var(--bg)", zIndex: 2,
              paddingTop: 4, paddingBottom: 4,
            }}>
              {groupBy === "group" && section.key.startsWith("G") && (
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "var(--accent)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13, fontFamily: "'Instrument Serif', serif",
                }}>{section.key.slice(1)}</div>
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.01em" }}>
                  {section.title}
                </div>
                {section.subtitle && (
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
                    {section.subtitle}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, height: 1, background: "var(--border)", marginLeft: 4 }}/>
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>
                {section.items.length} partido{section.items.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {section.items.map((m) => (
                <MatchCard key={m.id} match={m} starred={starred.has(m.id)} onToggle={toggleStar} tzOffset={tzOffset}/>
              ))}
            </div>
          </div>
        ))
      )}

      <div style={{
        textAlign: "center", padding: "32px 0 16px",
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
