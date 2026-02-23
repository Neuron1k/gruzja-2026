# Mobile UX Polish + Map Icons + Clustering — Design

## Changes Overview

6 changes in 3 groups:

| ID | Change | Group | Risk |
|----|--------|-------|------|
| A1 | Preserve sheet snap on day change | Mobile UX | Low |
| A2 | Swipe through day attractions at SNAP_PEEK | Mobile UX | Medium |
| A3 | Accordion for Program/Food/Tips | Mobile UX | Low |
| B1 | Compress hamburger menu padding | Filters/Icons | Zero |
| B2 | Material Icons for georgia.to + expanded filters + stronger ATTR style | Filters/Icons | Medium |
| C1 | Marker clustering for georgia.to | Clustering | Low |

## A1: Preserve sheet snap position

In `sel(i)`, change:
```javascript
setSheetSnap(ad!==null?SNAP_PEEK:SNAP_MIN);
```
to:
```javascript
setSheetSnap(ad!==null ? Math.max(sheetSnap, SNAP_PEEK) : SNAP_MIN);
```

If sheet is higher than PEEK, keep it. If at MIN and selecting a day, raise to PEEK.

## A2: Swipe through day attractions

### New global
- `currentPointIdx` — index into `DAYS_A[ad].points[]`, null when no day selected

### Modified swipe logic
```
if swipe horizontal (dx > 50, dx > dy*1.5):
  if (mobile && sheetSnap <= SNAP_PEEK && ad !== null):
    // Swipe through attractions
    points = DAYS_A[ad].points
    if (dx < 0): currentPointIdx = min(idx + 1, points.length - 1)
    if (dx > 0): currentPointIdx = max(idx - 1, 0)
    flyTo(points[currentPointIdx])
  else:
    // Existing: swipe through days
    sel(ad ± 1)
```

### Visual feedback
Show `"← Atrakcja 2/5 →"` indicator in bottom sheet when at SNAP_PEEK with a selected day.

### Reset
- `sel(i)` resets `currentPointIdx = 0`
- Desktop: no change (day swipe only)

## A3: Accordion for Program/Food/Tips

Replace flat `.ds` sections with `<details>/<summary>` in mobile render path:
```html
<details class="ds prog" open><summary><h4>📍 Program</h4></summary>...</details>
<details class="ds food"><summary><h4>🍽 Jedzenie</h4></summary>...</details>
<details class="ds tip"><summary><h4>💡 Tips</h4></summary>...</details>
```

- Program open by default, Food and Tips collapsed
- Desktop render path unchanged (all sections visible)
- CSS for summary: looks like current h4 headers + ▸/▾ indicator

## B1: Compress hamburger menu

CSS changes to `.drawer-links button`:
- `padding`: 14px 16px → 10px 16px
- `min-height`: 52px → 40px

## B2: Material Icons + expanded filters + stronger ATTR

### New dependency
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0"/>
```

### Category → Icon mapping

| Category | Material Icon | Color |
|----------|--------------|-------|
| Natura | `park` | #2e7d32 |
| Kultura | `account_balance` | #5c6bc0 |
| Religia | `church` | #8d6e63 |
| Kuchnia | `restaurant` | #ff8f00 |
| Rozrywka | `attractions` | #ec407a |
| Architektura | `apartment` | #78909c |
| Inne | `place` | #bdbdbd |

### Marker HTML change
```html
<!-- Before: -->
<div class="pm" style="background:#color"></div>
<!-- After: -->
<span class="pm-icon material-symbols-outlined" style="color:#color">icon_name</span>
```

### Filters expanded by default
- Remove `style="display:none"` from `.places-cats`
- Set `placesVisible = true` and call `buildPlacesMarkers(); placesLayer.addTo(map)` at init

### Stronger ATTR markers
- `.cm` border: 2.5px → 3px
- `.cm` box-shadow: stronger `0 2px 6px rgba(0,0,0,.5)`

## C1: Marker clustering

### New dependency
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
```

### Code change
Replace `L.layerGroup()` with `L.markerClusterGroup()`:
```javascript
var placesLayer = L.markerClusterGroup({
  maxClusterRadius: 40,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  iconCreateFunction: function(cluster) {
    var count = cluster.getChildCount();
    var size = count < 10 ? 'small' : count < 50 ? 'medium' : 'large';
    return L.divIcon({
      html: '<div class="pc pc-' + size + '">' + count + '</div>',
      className: '', iconSize: [30, 30]
    });
  }
});
```

### Cluster CSS
```css
.pc { border-radius: 50%; color: #fff; font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,.3); }
.pc-small  { width: 26px; height: 26px; background: #78909c; }
.pc-medium { width: 32px; height: 32px; background: #5c6bc0; }
.pc-large  { width: 38px; height: 38px; background: #1a73e8; }
```

### Filter interaction
`togglePlaceCat` works unchanged — `addLayer`/`removeLayer` on `L.markerClusterGroup` automatically recalculates clusters.

## File changes summary

| File | Changes |
|------|---------|
| `index.html` | Add Material Symbols + markercluster CDN links, update `.places-cats` display |
| `src/app.js` | A1: sheet snap logic, A2: swipe handler + currentPointIdx, A3: accordion in render(), B2: Material Icons in buildPlacesMarkers + init, C1: markerClusterGroup |
| `src/style.css` | A3: details/summary styles, B1: drawer padding, B2: .pm-icon styles + stronger .cm, C1: .pc cluster styles |
