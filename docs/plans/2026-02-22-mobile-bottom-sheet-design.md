# Mobile UI Redesign: Bottom Sheet Pattern

**Date:** 2026-02-22
**Status:** Approved

## Problem

Current mobile UI has three main issues:
1. Hamburger menu hides all navigation (Noclegi, Budget, Pakowanie, Ankieta) behind two taps
2. Hard toggle between List and Map views — user sees only one at a time
3. Top bar (50px) wastes premium screen space and is out of thumb reach

Primary usage: Plan + Map = 90% of interactions. Other tabs are secondary.

## Solution: Bottom Sheet over Map

Inspired by Google Maps, Airbnb, Bolt. Single unified view where map is always visible and day plan slides up as a draggable bottom sheet.

### Layout

```
┌─────────────────────────┐
│                         │
│        M A P A          │  ← always visible, 100vh, full width
│     (Leaflet map)       │
│                         │
│    markers visible      │
│                         │
╞═════════════════════════╡  ← drag boundary
│  ▬▬▬  (handle)          │  ← drag handle
│  ① Czw 2.04             │
│  Przylot - Kutaisi       │
│  🚗 ~30 min | 🏠 Kutaisi│
│─────────────────────────│
│  📍 PROGRAM              │
│  • Lot KTW-KUT ↗        │
│  • Katedra Bagrati ↗    │
│  🍽 JEDZENIE             │
│  💡 TIPS                 │
├─────────────────────────┤
│ ❶ ② ③ ④ ⑤ ⑥ ⑦ ⑧  ☰   │  ← bottom bar (fixed)
└─────────────────────────┘
```

### Snap Points

| Snap | Height | Content visible | Map visible |
|------|--------|-----------------|-------------|
| Peek | ~35vh | Day header + start of program | Yes, upper ~65% |
| Half | ~60vh | Full day details (program, food, tips) | Yes, upper ~40% |
| Full | ~92vh | Full content with scroll | Hidden behind sheet |

### Bottom Bar (always fixed at bottom)

- Day pills: `1 2 3 4 5 6 7 8` — quick day navigation
- Hamburger `☰` — opens bottom drawer with secondary tabs
- Total height: ~56px

### Interactions

**Drag handle:**
- Drag up → sheet grows to next snap point
- Drag down → sheet shrinks to previous snap point
- Implementation: touch events + requestAnimationFrame, no libraries

**Scroll inside sheet:**
- At `full` snap → normal content scroll
- At `peek`/`half` with scrollTop === 0 → drag gesture resizes sheet
- Same pattern as Google Maps

**Day change:**
- Tap pill in bottom bar → change day, sheet returns to `peek`, map fitBounds to new markers
- Swipe left/right inside sheet → prev/next day (existing behavior preserved)

**FlyTo (prog-link click):**
- Sheet auto-shrinks to `peek`
- Map pans to marker, opens popup
- No separate "back to list" button needed

### Secondary Tabs (Drawer)

Hamburger (☰) in bottom bar opens a bottom-up fullscreen drawer:

```
┌─────────────────────────┐
│  ✕  Gruzja 2026          │
│─────────────────────────│
│  🏨 Noclegi              │
│  💶 Budżet               │
│  🎒 Pakowanie            │
│  📋 Ankieta              │
│                         │
│  ─── Info ───           │
│  9 osób · Kutaisi       │
│  2-9 kwietnia 2026      │
└─────────────────────────┘
```

- Select tab → drawer closes, sheet goes `full`, shows selected tab content
- Return to Plan: tap any day pill

### What Gets Removed (mobile only)

- Top bar (`.mobile-nav`) — no longer needed
- Separate list/map view toggle (`mobileView()`, `m-map`/`m-list` classes)
- "Wróć do listy" floating button
- Current `map-day-bar` (replaced by bottom bar pills)

### What Stays

- Desktop layout unchanged (400px panel + map)
- Map controls (zoom, layers) — topright
- Map filter button (🔍) — always visible on mobile (not just in map view)
- Marker behavior (highlight, popup, day badges)
- Swipe for day navigation
- Drawer content/functionality (just new trigger point)

## Technical Approach

- Pure CSS + vanilla JS (no libraries, consistent with project)
- Touch gesture handling via `touchstart`/`touchmove`/`touchend`
- CSS `transform: translateY()` for smooth sheet animation
- `will-change: transform` for GPU acceleration
- `@media (max-width: 768px)` scoping — desktop unaffected
- Map `invalidateSize()` on snap transitions
