// ─── MATCH DATABASE — FIFA World Cup 2026 ─────────────────────────
// Times stored in ET (GMT-4). Adjusted client-side.
window.MATCHES = [
  // June 11
  { id: 1, group: "A", phase: "Grupos", home: "México", away: "Sudáfrica", date: "2026-06-11", time: "19:00", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: 2, group: "A", phase: "Grupos", home: "Corea del Sur", away: "Chequia", date: "2026-06-11", time: "22:00", venue: "Estadio Akron", city: "Zapopan" },
  // June 12
  { id: 3, group: "B", phase: "Grupos", home: "Canadá", away: "Bosnia y Herzegovina", date: "2026-06-12", time: "19:00", venue: "BMO Field", city: "Toronto" },
  { id: 4, group: "D", phase: "Grupos", home: "Estados Unidos", away: "Paraguay", date: "2026-06-12", time: "21:00", venue: "SoFi Stadium", city: "Inglewood" },
  // June 13
  { id: 5, group: "B", phase: "Grupos", home: "Qatar", away: "Suiza", date: "2026-06-13", time: "19:00", venue: "Levi's Stadium", city: "Santa Clara" },
  { id: 6, group: "C", phase: "Grupos", home: "Brasil", away: "Marruecos", date: "2026-06-13", time: "18:00", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: 7, group: "C", phase: "Grupos", home: "Haití", away: "Escocia", date: "2026-06-13", time: "21:00", venue: "Gillette Stadium", city: "Foxborough" },
  // June 14
  { id: 8, group: "D", phase: "Grupos", home: "Australia", away: "Turquía", date: "2026-06-14", time: "12:00", venue: "BC Place", city: "Vancouver" },
  { id: 9, group: "E", phase: "Grupos", home: "Alemania", away: "Curazao", date: "2026-06-14", time: "13:00", venue: "NRG Stadium", city: "Houston" },
  { id: 10, group: "F", phase: "Grupos", home: "Países Bajos", away: "Japón", date: "2026-06-14", time: "16:00", venue: "AT&T Stadium", city: "Arlington" },
  { id: 11, group: "E", phase: "Grupos", home: "Costa de Marfil", away: "Ecuador", date: "2026-06-14", time: "19:00", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { id: 12, group: "F", phase: "Grupos", home: "Suecia", away: "Túnez", date: "2026-06-14", time: "22:00", venue: "Estadio BBVA", city: "Monterrey" },
  // June 15
  { id: 13, group: "H", phase: "Grupos", home: "España", away: "Cabo Verde", date: "2026-06-15", time: "12:00", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: 14, group: "G", phase: "Grupos", home: "Bélgica", away: "Egipto", date: "2026-06-15", time: "15:00", venue: "Lumen Field", city: "Seattle" },
  { id: 15, group: "H", phase: "Grupos", home: "Arabia Saudita", away: "Uruguay", date: "2026-06-15", time: "18:00", venue: "Hard Rock Stadium", city: "Miami" },
  { id: 16, group: "G", phase: "Grupos", home: "Irán", away: "Nueva Zelanda", date: "2026-06-15", time: "21:00", venue: "SoFi Stadium", city: "Inglewood" },
  // June 16
  { id: 17, group: "I", phase: "Grupos", home: "Francia", away: "Senegal", date: "2026-06-16", time: "15:00", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: 18, group: "I", phase: "Grupos", home: "Irak", away: "Noruega", date: "2026-06-16", time: "18:00", venue: "Gillette Stadium", city: "Foxborough" },
  { id: 19, group: "J", phase: "Grupos", home: "Argentina", away: "Argelia", date: "2026-06-16", time: "21:00", venue: "Arrowhead Stadium", city: "Kansas City" },
  // June 17
  { id: 20, group: "J", phase: "Grupos", home: "Austria", away: "Jordania", date: "2026-06-17", time: "00:00", venue: "Levi's Stadium", city: "Santa Clara" },
  { id: 21, group: "K", phase: "Grupos", home: "Portugal", away: "RD Congo", date: "2026-06-17", time: "13:00", venue: "NRG Stadium", city: "Houston" },
  { id: 22, group: "L", phase: "Grupos", home: "Inglaterra", away: "Croacia", date: "2026-06-17", time: "16:00", venue: "AT&T Stadium", city: "Arlington" },
  { id: 23, group: "L", phase: "Grupos", home: "Ghana", away: "Panamá", date: "2026-06-17", time: "19:00", venue: "BMO Field", city: "Toronto" },
  { id: 24, group: "K", phase: "Grupos", home: "Uzbekistán", away: "Colombia", date: "2026-06-17", time: "22:00", venue: "Estadio Azteca", city: "Ciudad de México" },
  // June 18
  { id: 25, group: "A", phase: "Grupos", home: "Chequia", away: "Sudáfrica", date: "2026-06-18", time: "12:00", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: 26, group: "B", phase: "Grupos", home: "Suiza", away: "Bosnia y Herzegovina", date: "2026-06-18", time: "15:00", venue: "SoFi Stadium", city: "Inglewood" },
  { id: 27, group: "B", phase: "Grupos", home: "Canadá", away: "Qatar", date: "2026-06-18", time: "18:00", venue: "BC Place", city: "Vancouver" },
  { id: 28, group: "A", phase: "Grupos", home: "México", away: "Corea del Sur", date: "2026-06-18", time: "21:00", venue: "Estadio Akron", city: "Zapopan" },
  // June 19
  { id: 29, group: "D", phase: "Grupos", home: "Estados Unidos", away: "Australia", date: "2026-06-19", time: "15:00", venue: "Lumen Field", city: "Seattle" },
  { id: 30, group: "C", phase: "Grupos", home: "Escocia", away: "Marruecos", date: "2026-06-19", time: "18:00", venue: "Gillette Stadium", city: "Foxborough" },
  { id: 31, group: "C", phase: "Grupos", home: "Brasil", away: "Haití", date: "2026-06-19", time: "20:30", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { id: 32, group: "D", phase: "Grupos", home: "Turquía", away: "Paraguay", date: "2026-06-19", time: "23:00", venue: "Levi's Stadium", city: "Santa Clara" },
  // June 20
  { id: 33, group: "F", phase: "Grupos", home: "Países Bajos", away: "Suecia", date: "2026-06-20", time: "13:00", venue: "NRG Stadium", city: "Houston" },
  { id: 34, group: "E", phase: "Grupos", home: "Alemania", away: "Costa de Marfil", date: "2026-06-20", time: "16:00", venue: "BMO Field", city: "Toronto" },
  { id: 35, group: "E", phase: "Grupos", home: "Ecuador", away: "Curazao", date: "2026-06-20", time: "20:00", venue: "Arrowhead Stadium", city: "Kansas City" },
  // June 21
  { id: 36, group: "F", phase: "Grupos", home: "Túnez", away: "Japón", date: "2026-06-21", time: "00:00", venue: "Estadio BBVA", city: "Monterrey" },
  { id: 37, group: "H", phase: "Grupos", home: "España", away: "Arabia Saudita", date: "2026-06-21", time: "12:00", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: 38, group: "G", phase: "Grupos", home: "Bélgica", away: "Irán", date: "2026-06-21", time: "15:00", venue: "SoFi Stadium", city: "Inglewood" },
  { id: 39, group: "H", phase: "Grupos", home: "Uruguay", away: "Cabo Verde", date: "2026-06-21", time: "18:00", venue: "Hard Rock Stadium", city: "Miami" },
  { id: 40, group: "G", phase: "Grupos", home: "Nueva Zelanda", away: "Egipto", date: "2026-06-21", time: "21:00", venue: "BC Place", city: "Vancouver" },
  // June 22
  { id: 41, group: "J", phase: "Grupos", home: "Argentina", away: "Austria", date: "2026-06-22", time: "13:00", venue: "AT&T Stadium", city: "Arlington" },
  { id: 42, group: "I", phase: "Grupos", home: "Francia", away: "Irak", date: "2026-06-22", time: "17:00", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { id: 43, group: "I", phase: "Grupos", home: "Noruega", away: "Senegal", date: "2026-06-22", time: "20:00", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: 44, group: "J", phase: "Grupos", home: "Jordania", away: "Argelia", date: "2026-06-22", time: "23:00", venue: "Levi's Stadium", city: "Santa Clara" },
  // June 23
  { id: 45, group: "K", phase: "Grupos", home: "Portugal", away: "Uzbekistán", date: "2026-06-23", time: "13:00", venue: "NRG Stadium", city: "Houston" },
  { id: 46, group: "L", phase: "Grupos", home: "Inglaterra", away: "Ghana", date: "2026-06-23", time: "16:00", venue: "Gillette Stadium", city: "Foxborough" },
  { id: 47, group: "L", phase: "Grupos", home: "Panamá", away: "Croacia", date: "2026-06-23", time: "19:00", venue: "BMO Field", city: "Toronto" },
  { id: 48, group: "K", phase: "Grupos", home: "Colombia", away: "RD Congo", date: "2026-06-23", time: "22:00", venue: "Estadio Akron", city: "Zapopan" },
  // June 24
  { id: 49, group: "B", phase: "Grupos", home: "Suiza", away: "Canadá", date: "2026-06-24", time: "15:00", venue: "BC Place", city: "Vancouver" },
  { id: 50, group: "B", phase: "Grupos", home: "Bosnia y Herzegovina", away: "Qatar", date: "2026-06-24", time: "15:00", venue: "Lumen Field", city: "Seattle" },
  { id: 51, group: "C", phase: "Grupos", home: "Escocia", away: "Brasil", date: "2026-06-24", time: "18:00", venue: "Hard Rock Stadium", city: "Miami" },
  { id: 52, group: "C", phase: "Grupos", home: "Marruecos", away: "Haití", date: "2026-06-24", time: "18:00", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: 53, group: "A", phase: "Grupos", home: "Chequia", away: "México", date: "2026-06-24", time: "21:00", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: 54, group: "A", phase: "Grupos", home: "Sudáfrica", away: "Corea del Sur", date: "2026-06-24", time: "21:00", venue: "Estadio BBVA", city: "Monterrey" },
  // June 25
  { id: 55, group: "E", phase: "Grupos", home: "Curazao", away: "Costa de Marfil", date: "2026-06-25", time: "16:00", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { id: 56, group: "E", phase: "Grupos", home: "Ecuador", away: "Alemania", date: "2026-06-25", time: "16:00", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: 57, group: "F", phase: "Grupos", home: "Japón", away: "Suecia", date: "2026-06-25", time: "19:00", venue: "AT&T Stadium", city: "Arlington" },
  { id: 58, group: "F", phase: "Grupos", home: "Túnez", away: "Países Bajos", date: "2026-06-25", time: "19:00", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: 59, group: "D", phase: "Grupos", home: "Turquía", away: "Estados Unidos", date: "2026-06-25", time: "22:00", venue: "SoFi Stadium", city: "Inglewood" },
  { id: 60, group: "D", phase: "Grupos", home: "Paraguay", away: "Australia", date: "2026-06-25", time: "22:00", venue: "Levi's Stadium", city: "Santa Clara" },
  // June 26
  { id: 61, group: "I", phase: "Grupos", home: "Noruega", away: "Francia", date: "2026-06-26", time: "15:00", venue: "Gillette Stadium", city: "Foxborough" },
  { id: 62, group: "I", phase: "Grupos", home: "Senegal", away: "Irak", date: "2026-06-26", time: "15:00", venue: "BMO Field", city: "Toronto" },
  { id: 63, group: "H", phase: "Grupos", home: "Cabo Verde", away: "Arabia Saudita", date: "2026-06-26", time: "20:00", venue: "NRG Stadium", city: "Houston" },
  { id: 64, group: "H", phase: "Grupos", home: "Uruguay", away: "España", date: "2026-06-26", time: "20:00", venue: "Estadio Akron", city: "Zapopan" },
  { id: 65, group: "G", phase: "Grupos", home: "Egipto", away: "Irán", date: "2026-06-26", time: "23:00", venue: "Lumen Field", city: "Seattle" },
  { id: 66, group: "G", phase: "Grupos", home: "Nueva Zelanda", away: "Bélgica", date: "2026-06-26", time: "23:00", venue: "BC Place", city: "Vancouver" },
  // June 27
  { id: 67, group: "L", phase: "Grupos", home: "Panamá", away: "Inglaterra", date: "2026-06-27", time: "17:00", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: 68, group: "L", phase: "Grupos", home: "Croacia", away: "Ghana", date: "2026-06-27", time: "17:00", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { id: 69, group: "K", phase: "Grupos", home: "Colombia", away: "Portugal", date: "2026-06-27", time: "19:30", venue: "Hard Rock Stadium", city: "Miami" },
  { id: 70, group: "K", phase: "Grupos", home: "RD Congo", away: "Uzbekistán", date: "2026-06-27", time: "19:30", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: 71, group: "J", phase: "Grupos", home: "Argelia", away: "Austria", date: "2026-06-27", time: "22:00", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: 72, group: "J", phase: "Grupos", home: "Jordania", away: "Argentina", date: "2026-06-27", time: "22:00", venue: "AT&T Stadium", city: "Arlington" },
  // Round of 32
  { id: 73, group: null, phase: "Octavos", home: "2° Grupo A", away: "2° Grupo B", date: "2026-06-28", time: "15:00", venue: "SoFi Stadium", city: "Inglewood" },
  { id: 74, group: null, phase: "Octavos", home: "1° Grupo C", away: "2° Grupo F", date: "2026-06-29", time: "13:00", venue: "NRG Stadium", city: "Houston" },
  { id: 75, group: null, phase: "Octavos", home: "1° Grupo E", away: "3° (A/B/C/D/F)", date: "2026-06-29", time: "16:30", venue: "Gillette Stadium", city: "Foxborough" },
  { id: 76, group: null, phase: "Octavos", home: "1° Grupo F", away: "2° Grupo C", date: "2026-06-29", time: "21:00", venue: "Estadio BBVA", city: "Monterrey" },
  { id: 77, group: null, phase: "Octavos", home: "2° Grupo E", away: "2° Grupo I", date: "2026-06-30", time: "13:00", venue: "AT&T Stadium", city: "Arlington" },
  { id: 78, group: null, phase: "Octavos", home: "1° Grupo I", away: "3° (C/D/F/G/H)", date: "2026-06-30", time: "17:00", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: 79, group: null, phase: "Octavos", home: "1° Grupo A", away: "3° (C/E/F/H/I)", date: "2026-06-30", time: "21:00", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: 80, group: null, phase: "Octavos", home: "1° Grupo L", away: "3° (E/H/I/J/K)", date: "2026-07-01", time: "12:00", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: 81, group: null, phase: "Octavos", home: "1° Grupo G", away: "3° (A/E/H/I/J)", date: "2026-07-01", time: "16:00", venue: "Lumen Field", city: "Seattle" },
  { id: 82, group: null, phase: "Octavos", home: "1° Grupo D", away: "3° (B/E/F/I/J)", date: "2026-07-01", time: "20:00", venue: "Levi's Stadium", city: "Santa Clara" },
  { id: 83, group: null, phase: "Octavos", home: "1° Grupo H", away: "2° Grupo J", date: "2026-07-02", time: "15:00", venue: "SoFi Stadium", city: "Inglewood" },
  { id: 84, group: null, phase: "Octavos", home: "2° Grupo K", away: "2° Grupo L", date: "2026-07-02", time: "19:00", venue: "BMO Field", city: "Toronto" },
  { id: 85, group: null, phase: "Octavos", home: "1° Grupo B", away: "3° (E/F/G/I/J)", date: "2026-07-02", time: "23:00", venue: "BC Place", city: "Vancouver" },
  { id: 86, group: null, phase: "Octavos", home: "2° Grupo D", away: "2° Grupo G", date: "2026-07-03", time: "14:00", venue: "AT&T Stadium", city: "Arlington" },
  { id: 87, group: null, phase: "Octavos", home: "1° Grupo J", away: "2° Grupo H", date: "2026-07-03", time: "18:00", venue: "Hard Rock Stadium", city: "Miami" },
  { id: 88, group: null, phase: "Octavos", home: "1° Grupo K", away: "3° (D/E/I/J/L)", date: "2026-07-03", time: "21:30", venue: "Arrowhead Stadium", city: "Kansas City" },
  // Round of 16
  { id: 89, group: null, phase: "Cuartos de Octavos", home: "Ganador M73", away: "Ganador M75", date: "2026-07-04", time: "13:00", venue: "NRG Stadium", city: "Houston" },
  { id: 90, group: null, phase: "Cuartos de Octavos", home: "Ganador M74", away: "Ganador M77", date: "2026-07-04", time: "17:00", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { id: 91, group: null, phase: "Cuartos de Octavos", home: "Ganador M76", away: "Ganador M78", date: "2026-07-05", time: "16:00", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: 92, group: null, phase: "Cuartos de Octavos", home: "Ganador M79", away: "Ganador M82", date: "2026-07-05", time: "20:00", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: 93, group: null, phase: "Cuartos de Octavos", home: "Ganador M80", away: "Ganador M81", date: "2026-07-06", time: "15:00", venue: "AT&T Stadium", city: "Arlington" },
  { id: 94, group: null, phase: "Cuartos de Octavos", home: "Ganador M83", away: "Ganador M85", date: "2026-07-06", time: "20:00", venue: "Lumen Field", city: "Seattle" },
  { id: 95, group: null, phase: "Cuartos de Octavos", home: "Ganador M84", away: "Ganador M87", date: "2026-07-07", time: "12:00", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: 96, group: null, phase: "Cuartos de Octavos", home: "Ganador M86", away: "Ganador M88", date: "2026-07-07", time: "16:00", venue: "BC Place", city: "Vancouver" },
  // Quarterfinals
  { id: 97, group: null, phase: "Cuartos", home: "Ganador M89", away: "Ganador M90", date: "2026-07-09", time: "16:00", venue: "Gillette Stadium", city: "Foxborough" },
  { id: 98, group: null, phase: "Cuartos", home: "Ganador M91", away: "Ganador M92", date: "2026-07-10", time: "15:00", venue: "SoFi Stadium", city: "Inglewood" },
  { id: 99, group: null, phase: "Cuartos", home: "Ganador M93", away: "Ganador M94", date: "2026-07-11", time: "17:00", venue: "Hard Rock Stadium", city: "Miami" },
  { id: 100, group: null, phase: "Cuartos", home: "Ganador M95", away: "Ganador M96", date: "2026-07-11", time: "21:00", venue: "Arrowhead Stadium", city: "Kansas City" },
  // Semifinals
  { id: 101, group: null, phase: "Semifinal", home: "Ganador QF1", away: "Ganador QF2", date: "2026-07-14", time: "15:00", venue: "AT&T Stadium", city: "Arlington" },
  { id: 102, group: null, phase: "Semifinal", home: "Ganador QF3", away: "Ganador QF4", date: "2026-07-15", time: "15:00", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  // Third place
  { id: 103, group: null, phase: "Tercer puesto", home: "Perdedor SF1", away: "Perdedor SF2", date: "2026-07-18", time: "17:00", venue: "Hard Rock Stadium", city: "Miami" },
  // Final
  { id: 104, group: null, phase: "Final", home: "Ganador SF1", away: "Ganador SF2", date: "2026-07-19", time: "15:00", venue: "MetLife Stadium", city: "East Rutherford" },
];

window.GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
window.PHASES = ["Grupos", "Octavos", "Cuartos de Octavos", "Cuartos", "Semifinal", "Tercer puesto", "Final"];
window.PHASE_SHORT = {
  "Grupos": "Grupos",
  "Octavos": "32avos",
  "Cuartos de Octavos": "16avos",
  "Cuartos": "Cuartos",
  "Semifinal": "Semis",
  "Tercer puesto": "3er puesto",
  "Final": "Final",
};

window.TZ_OPTIONS = [
  { label: "Auto (dispositivo)", value: "auto" },
  { label: "GMT-3 (Buenos Aires / São Paulo)", value: -3 },
  { label: "GMT-4 (Santiago / Caracas)", value: -4 },
  { label: "GMT-5 (Bogotá / Lima / CDMX)", value: -5 },
  { label: "GMT-6 (CDMX invierno)", value: -6 },
  { label: "GMT+0 (Londres)", value: 0 },
  { label: "GMT+1 (Madrid / París)", value: 1 },
  { label: "GMT+2 (El Cairo)", value: 2 },
  { label: "GMT+9 (Tokio)", value: 9 },
];

window.FLAG_MAP = {
  "México": "🇲🇽", "Sudáfrica": "🇿🇦", "Corea del Sur": "🇰🇷", "Chequia": "🇨🇿",
  "Canadá": "🇨🇦", "Bosnia y Herzegovina": "🇧🇦", "Estados Unidos": "🇺🇸", "Paraguay": "🇵🇾",
  "Qatar": "🇶🇦", "Suiza": "🇨🇭", "Brasil": "🇧🇷", "Marruecos": "🇲🇦",
  "Haití": "🇭🇹", "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Australia": "🇦🇺", "Turquía": "🇹🇷",
  "Alemania": "🇩🇪", "Curazao": "🇨🇼", "Países Bajos": "🇳🇱", "Japón": "🇯🇵",
  "Costa de Marfil": "🇨🇮", "Ecuador": "🇪🇨", "Suecia": "🇸🇪", "Túnez": "🇹🇳",
  "España": "🇪🇸", "Cabo Verde": "🇨🇻", "Bélgica": "🇧🇪", "Egipto": "🇪🇬",
  "Arabia Saudita": "🇸🇦", "Uruguay": "🇺🇾", "Irán": "🇮🇷", "Nueva Zelanda": "🇳🇿",
  "Francia": "🇫🇷", "Senegal": "🇸🇳", "Irak": "🇮🇶", "Noruega": "🇳🇴",
  "Argentina": "🇦🇷", "Argelia": "🇩🇿", "Austria": "🇦🇹", "Jordania": "🇯🇴",
  "Portugal": "🇵🇹", "RD Congo": "🇨🇩", "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croacia": "🇭🇷",
  "Ghana": "🇬🇭", "Panamá": "🇵🇦", "Uzbekistán": "🇺🇿", "Colombia": "🇨🇴",
};

window.COUNTRY_MAP = {
  "Ciudad de México": "🇲🇽", "Zapopan": "🇲🇽", "Monterrey": "🇲🇽",
  "Toronto": "🇨🇦", "Vancouver": "🇨🇦",
};

// Primary brand color per team — used when user picks "their" team
window.TEAM_COLORS = {
  "Argentina": "#6CB4EE", "Brasil": "#009C3B", "México": "#006847",
  "España": "#AA151B", "Francia": "#0055A4", "Inglaterra": "#CE1124",
  "Alemania": "#FFCE00", "Países Bajos": "#FF6B00", "Portugal": "#C8102E",
  "Estados Unidos": "#0A3161", "Canadá": "#D52B1E", "Uruguay": "#75AADB",
  "Colombia": "#FCD116", "Ecuador": "#FFD100", "Paraguay": "#D52B1E",
  "Bélgica": "#FAE042", "Croacia": "#171796", "Suiza": "#D52B1E",
  "Dinamarca": "#C8102E", "Polonia": "#DC143C", "Marruecos": "#C1272D",
  "Senegal": "#00853F", "Costa de Marfil": "#FF8200", "Ghana": "#FCD116",
  "Egipto": "#CE1126", "Sudáfrica": "#007749", "Túnez": "#E70013",
  "Argelia": "#006233", "Cabo Verde": "#003893", "RD Congo": "#007FFF",
  "Japón": "#BC002D", "Corea del Sur": "#003478", "Australia": "#FFCD00",
  "Irán": "#239F40", "Arabia Saudita": "#006C35", "Qatar": "#8D1B3D",
  "Irak": "#CE1126", "Jordania": "#000000", "Uzbekistán": "#1EB53A",
  "Nueva Zelanda": "#000000", "Curazao": "#002868", "Haití": "#00209F",
  "Escocia": "#0065BD", "Chequia": "#11457E", "Bosnia y Herzegovina": "#002F6C",
  "Suecia": "#FECC00", "Noruega": "#EF2B2D", "Austria": "#ED2939",
  "Turquía": "#E30A17", "Panamá": "#005AA7",
};
