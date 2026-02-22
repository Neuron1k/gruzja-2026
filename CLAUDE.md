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

## Editing Data Files

Data files are JS with `var NAME = [JSON];` pattern. Edit programmatically with:

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

### Coordinate Validation

After editing coordinates, always validate:
```python
for a in data:
    assert 40 < a['lat'] < 43, f"{a['id']}: bad lat"
    assert 42 < a['lng'] < 47, f"{a['id']}: bad lng"
```

Georgia bounding box: lat 40–43, lng 42–47. Anything outside = wrong country.

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
