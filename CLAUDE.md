# Gruzja 2026 — Interactive Trip Planner

## Project Structure

```
index.html              ← Entry point (loads all scripts)
src/
  app.js                ← Rendering logic, Leaflet map, UI
  style.css             ← All styles
  data/
    attractions.js      ← ATTR[] — 29 locations with coords, ratings, descriptions
    days.js             ← DAYS_A[] — 8-day itinerary (program, food, tips)
    accommodations.js   ← NOCLEGI[] — accommodation options per city
    config.js           ← Routes (routeA/B), survey URLs, colors
docs/
  PLAN.md               ← Source of truth for trip details (Polish)
  NOCLEGI.md            ← Detailed accommodation research notes
  apps-script-code.js   ← Google Apps Script for survey backend
```

## Architecture

- **No build step** — plain `<script>` tags, no npm/bundler
- **Leaflet.js** map with custom divIcon markers
- **Data files use `var` globals** — order matters in index.html (data before app.js)
- Language: Polish (user-facing), code comments in Polish/English mix

### app.js Layout (~400 lines)

All rendering and interaction logic lives in `src/app.js`. Key sections:

| Lines | Section | Key globals/functions |
|-------|---------|----------------------|
| 1-18 | Map init + ATTR markers | `map`, `markers{}` (keyed by attraction ID) |
| 20-34 | Accommodation markers | `accMarkers[]` |
| 36-54 | Category filters | `hiddenCats{}`, `toggleCat(color, el)` |
| 56-58 | Route polylines | `lineA`, `lineB` |
| 60-103 | **Day plan rendering** | `ad` (active day index), `render()`, `getDays()` |
| 105-117 | Day selection + map sync | `sel(i)` — toggles day, fits bounds, highlights |
| 119-135 | Extras panel | `toggleExtras()` |
| 137-148 | Fly to marker | `flyTo(id)` — pan map + open popup (+mobile switch) |
| 146-161 | Accommodation tab nav | `goToNocleg(city)` |
| 163-206 | Budget panel | `renderBudget()` |
| 208-250 | Packing panel | `renderPacking()` |
| 252-276 | Accommodations panel | `renderNoclegi()` |
| 278-317 | Survey panel | `renderAnkieta()` — fetches from Apps Script |
| 319-325 | Tab switching | `mainTab(tab, btn)` |
| 327-353 | Mobile filter overlay | `toggleMapFilters()`, `toggleCatMobile()` |
| 355-374 | Marker highlighting | `highlightDayMarkers(dayPoints)` |
| 376-394 | Mobile view toggle | `mobileView(v)` — 'map' or 'list' |
| 396-402 | Init | Calls all render functions |

### Key Global State

- `markers{}` — `{id: {m: L.marker, d: ATTR_object}}` for every attraction
- `ad` — index of currently selected day (null = none)
- `hiddenCats{}` — color keys of hidden categories
- `map` — Leaflet map instance, center `[42.0, 44.0]`, zoom 8

### Rendering Flow

1. `render()` reads `DAYS_A` via `getDays()` (deep clone), builds HTML string, sets `#daysList.innerHTML`
2. Each day card: header (`.dh`) + title (`.dt`) + drive (`.dr`) + expandable details (`.det`)
3. Details contain: split-box (if `d.split`), program (`.ds.prog`), food (`.ds.food`), tips (`.ds.tip`), accommodation
4. `sel(i)` toggles `ad`, calls `render()`, then fits map bounds to `d.points[]` markers and pulses them

### Map Interaction

- `flyTo(id)` — pans to marker, opens popup, auto-switches to map on mobile
- `sel(i)` — highlights day's markers (`.cm-highlight` pulse), dims others (`.cm-dim`)
- `highlightDayMarkers(dayPoints)` — manipulates `.cm` element classes on marker DOM
- Markers use `L.divIcon` with `<div class="cm">` styled circles (color/size from ATTR data)

### Tabs

5 main tabs: Plan (default), Noclegi, Budget, Pakowanie, Ankieta. Switched via `mainTab(tab, btn)`. Each has its own render function called once at init.

## Editing Data Files

Data files are JS with `var NAME = [JSON];` pattern. All data files share the same extraction approach:

```bash
# Extract JSON array from any data file (works for ATTR, DAYS_A, NOCLEGI)
sed -n 's/^var [A-Z_]* = //;s/;$//p' src/data/attractions.js | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin), indent=2, ensure_ascii=False))"
```

### attractions.js

```python
import json, re
with open('src/data/attractions.js') as f:
    content = f.read()
match = re.search(r'var ATTR = (\[.*\]);', content, re.DOTALL)
data = json.loads(match.group(1))
# ... modify data ...
lines = ['  ' + json.dumps(item, ensure_ascii=False) for item in data]
new_content = '// === ATRAKCJE ===\nvar ATTR = [\n' + ',\n'.join(lines) + '\n];\n'
with open('src/data/attractions.js', 'w') as f:
    f.write(new_content)
```

**Coordinate Validation** — Georgia bounding box: lat 40–43, lng 42–47.
```python
for a in data:
    assert 40 < a['lat'] < 43, f"{a['id']}: bad lat"
    assert 42 < a['lng'] < 47, f"{a['id']}: bad lng"
```

### days.js

```python
import json, re
with open('src/data/days.js') as f:
    content = f.read()
match = re.search(r'var DAYS_A = (\[.*\]);', content, re.DOTALL)
data = json.loads(match.group(1))
# ... modify data ...
lines = ['  ' + json.dumps(item, ensure_ascii=False) for item in data]
new_content = '// === PLAN DZIENNY ===\nvar DAYS_A = [\n' + ',\n'.join(lines) + '\n];\n'
with open('src/data/days.js', 'w') as f:
    f.write(new_content)
```

**Day object schema:**
```json
{
  "num": 1, "date": "Czw 2.04", "title": "Przylot - Kutaisi",
  "drive": "~30 min", "easter": false, "split": false,
  "points": ["kut_air", "kutaisi", "bagrati"],
  "nocleg": "Kutaisi · Apt Soho Tabidze",
  "program": ["plain string", ["clickable text", "attr_id"], "---"],
  "food": [["Name", "4.5 (800)", "Note", "https://gmap_url"]],
  "tips": ["tip string"]
}
```

- `program[]` items: string = plain text, `[text, attrId]` = clickable map link, `"---"` = separator
- `food[]` items: `[name, rating, note, gmapUrl]` — all strings, empty string if N/A
- `nocleg`: null on last day (no accommodation)
- `split`: only on day 5, triggers split-box rendering

### accommodations.js

```python
import json, re
with open('src/data/accommodations.js') as f:
    content = f.read()
match = re.search(r'var NOCLEGI = (\[.*\]);', content, re.DOTALL)
data = json.loads(match.group(1))
# ... modify ...
lines = ['  ' + json.dumps(item, ensure_ascii=False) for item in data]
new_content = '// === NOCLEGI ===\nvar NOCLEGI = [\n' + ',\n'.join(lines) + '\n];\n'
with open('src/data/accommodations.js', 'w') as f:
    f.write(new_content)
```

### Quick edits with jq (via node)

For small targeted changes without rewriting the whole file:

```bash
# Read a specific day's program (0-indexed)
node -e "var DAYS_A=$(sed 's/var DAYS_A = //;s/;$//' src/data/days.js); console.log(JSON.stringify(DAYS_A[0].program, null, 2))"

# List all attraction IDs
node -e "var ATTR=$(sed 's/var ATTR = //;s/;$//' src/data/attractions.js); ATTR.forEach(a=>console.log(a.id, a.name))"

# Validate all program attrId references exist in ATTR
node -e "
var ATTR=$(sed 's/var ATTR = //;s/;$//' src/data/attractions.js);
var DAYS_A=$(sed 's/var DAYS_A = //;s/;$//' src/data/days.js);
var ids=new Set(ATTR.map(a=>a.id));
DAYS_A.forEach(d=>d.program.forEach(p=>{
  if(Array.isArray(p)&&!ids.has(p[1])) console.error('MISSING: day '+d.num+' ref '+p[1]);
}));
console.log('Done');
"
```

## Data Sync: PLAN.md → data files

- `docs/PLAN.md` is the source of truth for trip content
- `days.js` mirrors PLAN.md day-by-day structure (program, food, tips)
- `attractions.js` contains map markers referenced by `days.js` via `points[]` IDs
- When updating PLAN.md, sync changes to the corresponding data file

## Key Conventions

- Attraction IDs are short lowercase strings (e.g., `chronicle`, `mtatsminda`)
- `inPlan: true/false` controls whether marker appears in main itinerary vs extras
- `days: [N]` links attraction to day numbers in DAYS_A
- Each day's `points[]` array references attraction IDs for map highlighting
- Accommodation markers only show if `recommended: true` or `booked: true`

### Clickable Program Items

Program items in `days.js` support two formats:
- **Plain string**: `"Spacer nad rzeka Rioni"` — renders as normal text
- **Tuple with attraction ID**: `["Katedra Bagrati + Bialy Most", "bagrati"]` — renders as a clickable link that flies to the marker on the map and opens its popup

When adding new program items, use the tuple format `[text, attrId]` whenever the item corresponds to an attraction in `attractions.js`. The `attrId` must match an `id` field in `ATTR[]`. Items without a map location (e.g., "Supra", "Odbior auta") should remain plain strings. On mobile, clicking a linked item auto-switches to map view.
