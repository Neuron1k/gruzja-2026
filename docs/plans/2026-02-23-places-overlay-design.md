# Georgia.to Places Map Overlay — Design

## Problem
The app has 225 scraped places from georgia.to (`georgia_to_places.json`) that are not surfaced to the user. The existing extras panel only shows ~13 ATTR entries with `inPlan: false`. Users want to explore all scraped places on the map.

## Approach: Static JS + LayerGroup overlay

Convert JSON to JS global (`var PLACES`), load via `<script>` tag. Render markers into a Leaflet `LayerGroup` that is toggled ON/OFF from the legend.

### Why this approach
- Consistent with existing architecture (no-build, `var` globals, `<script>` tags)
- Works offline and with `file://`
- 225 entries is small enough to not need clustering or lazy fetch

## Data

### Source
`src/data/georgia_to_places.json` — 225 entries with schema:
```json
{
  "id": "string",
  "name_pl": "Polish name",
  "region": "adjara|kakheti|...",
  "lat": 42.0,
  "lng": 44.0,
  "type": "Attraction|Place",
  "tags": ["tag1", "tag2"],
  "url": "/pl/places-to-go/..."
}
```

### Conversion
Create `src/data/georgia_to_places.js` as `var PLACES = [...];` — same data, JS global format.

### Tag-to-category mapping (7 categories)

| Category | Color | Tags (pattern match) |
|----------|-------|---------------------|
| Natura | `#2e7d32` (dark green) | Natura i Przygoda, Krajobrazy Naturalne, Spa i Wellness |
| Kultura | `#5c6bc0` (indigo) | Kultura i Sztuka, Kulturalny i Artystyczny, Historia, Miejsca historyczne |
| Religia | `#8d6e63` (brown) | Religia, Miejsca religijne |
| Kuchnia | `#ff8f00` (amber) | Kuchnia |
| Rozrywka | `#ec407a` (pink) | Rozrywka, Rekreacja, Rodzina |
| Architektura | `#78909c` (blue-grey) | Struktury Architektoniczne, Atrakcje miejskie |
| Inne | `#bdbdbd` (grey) | no tags, Zakupy, region-only tags |

Tags containing `#` are compound (e.g. `"Kuchnia #Kultura i Sztuka"`) — split on `#` and use the first segment for categorization.

## Map markers

- `L.divIcon` with `<div class="pm">` — **square** 10x10px, border-radius 2px
- Color determined by `getPlaceCategory(place)` function
- Distinct from ATTR markers (round `.cm` circles)
- Popup: name + region + tags + `<a>` link to georgia.to

### LayerGroup architecture
- `placesLayer = L.layerGroup()` — holds all PLACES markers
- Lazy initialization: markers created on first toggle ON (`placesBuilt` flag)
- Toggle ON: `placesLayer.addTo(map)` — toggle OFF: `map.removeLayer(placesLayer)`
- Category filtering: iterate `placesMarkers[]`, add/remove individual markers from `placesLayer`

## UI: Legend filters

### Desktop (panel sidebar)
Existing `.leg` section at bottom of `pane-plan`:
```
[Existing ATTR filters: ● Miasto  ● Atrakcja  ● UNESCO  ...]
─── separator ───
[🗺️ georgia.to] ← main toggle (OFF by default)
  When ON, show category row:
  [■ Natura  ■ Kultura  ■ Religia  ■ Kuchnia  ■ Rozrywka  ■ Architektura  ■ Inne]
```

- Square icons (■) vs round (●) for visual distinction
- Click category = toggle visibility (like existing `toggleCat`)

### Mobile (filter overlay)
Same section appended to the mobile filter overlay (`toggleMapFilters()`).

### Interaction with existing features
- PLACES and ATTR filters are independent
- Day selection (`sel(i)`) does NOT hide PLACES markers — they remain visible
- `flyTo()` only targets ATTR markers (no change needed)

## New globals in app.js

| Variable | Type | Default | Purpose |
|----------|------|---------|---------|
| `placesLayer` | `L.layerGroup` | `null` | Holds all PLACES markers |
| `placesVisible` | `boolean` | `false` | Toggle state |
| `placesBuilt` | `boolean` | `false` | Lazy init flag |
| `placesMarkers` | `Array` | `[]` | `{m: L.marker, cat: string}` refs |
| `hiddenPlaceCats` | `Object` | `{}` | Hidden category keys |

## File changes

| File | Change |
|------|--------|
| `src/data/georgia_to_places.js` | **New** — `var PLACES = [...]` |
| `index.html` | Add `<script>` tag + legend HTML + mobile overlay HTML |
| `src/app.js` | New functions: `togglePlaces()`, `togglePlaceCat()`, `buildPlacesMarkers()`, `getPlaceCategory()` |
| `src/style.css` | Styles for `.pm` (square marker), `.places-filters`, separator |
