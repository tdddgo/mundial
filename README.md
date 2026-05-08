# Mundial 2026 · Dashboard ⚽

Dashboard del **FIFA World Cup 2026** (EE.UU. · México · Canadá). Ordena los 104 partidos por **grupos** o por **fecha**, marca tus favoritos y exporta un `.ics` con alarmas para tu calendario.

> 11 Jun – 19 Jul 2026 · 12 grupos · 48 selecciones

## Características

- 📋 **Ordenado por grupos del Mundial** (A–L) por defecto, con eliminatorias agrupadas al final por fase
- 📅 Vista alternativa **por fecha** (jornada por jornada)
- ⭐ Favoritos persistentes (localStorage)
- 🌍 Conversión automática de zona horaria (Auto + 8 zonas predefinidas)
- 🔍 Búsqueda por selección + filtros por grupo y fase
- 📥 Exportación a `.ics` con alarma 15 min antes (Web Share API en iOS, descarga directa en escritorio)
- 🌗 Modo oscuro automático
- 📱 Diseño mobile-first

## Cómo correrlo

**No requiere build.** Es un sitio estático:

```bash
# clonar y abrir
git clone https://github.com/<tu-usuario>/mundial.git
cd mundial

# servir localmente con cualquier servidor estático
python3 -m http.server 8000
# o
npx serve .
```

Luego abrir [http://localhost:8000](http://localhost:8000).

> **Nota:** abrir `index.html` directamente con `file://` no funciona porque el navegador bloquea la carga de `src/app.jsx`. Usa cualquier servidor local.

## Deploy en GitHub Pages

1. Sube el repo a GitHub.
2. **Settings → Pages → Source: `main` branch · `/ (root)`**.
3. Listo: queda publicado en `https://<usuario>.github.io/mundial/`.

## Estructura

```
mundial/
├── index.html       # entry point (carga React + Babel desde CDN)
├── src/
│   ├── data.js      # base de datos de los 104 partidos
│   └── app.jsx      # componente React principal
├── README.md
├── LICENSE
└── .gitignore
```

## Stack

- React 18 (UMD desde CDN)
- Babel Standalone (transpila el JSX en el navegador)
- DM Sans + Instrument Serif (Google Fonts)
- Iconos SVG inline (estilo Lucide)
- `Intl` + cálculo manual de offset para conversión horaria
- localStorage para persistencia

## Datos

Los horarios base están en **ET (GMT-4)** y se ajustan al cliente. La fuente del fixture es el calendario oficial FIFA 2026; las eliminatorias muestran cruces simbólicos (`1° Grupo X`, `Ganador M73`, etc.) hasta que se conozcan los equipos reales.

## Licencia

MIT — ver [LICENSE](LICENSE).
