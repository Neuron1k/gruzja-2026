# Mobile UI Overhaul Design

**Date:** 2026-02-22
**Goal:** Maximize usable viewport for day plan content on mobile

## Problem

On mobile, ~235px (28%) of 844px viewport is consumed by UI chrome before day content starts:
- Mobile nav (Lista/Mapa): 50px
- Panel header (title + info + chips): ~85px
- Main tabs (Plan/Noclegi/...): ~48px
- Day nav sticky (1-8 buttons): ~52px

Additionally:
- `map-day-bar` floating bar overlaps "Dodatkowe atrakcje" button (z-index conflict)
- Duplicate day navigation: sticky top row + floating bottom bar
- Extras section awkwardly placed, blocked by floating bar

## Solution

### 1. Mobile nav bar (top 50px)

**Before:** `[Lista] [Mapa]`
**After:** `[hamburger] [Lista] [Mapa]`

Hamburger icon on the left opens a slide-in drawer.

### 2. Slide-in drawer (from left, ~75% width)

Contains:
- Title "Gruzja 2026" + header info (persons, dates, flights)
- Separator
- 4 tab links: Noclegi, Budget, Pakowanie, Ankieta
- Dark overlay backdrop, tap to close
- Clicking a tab: closes drawer + switches to selected tab

### 3. Header — hidden on mobile

`.panel-head` gets `display:none` in mobile media query. Info moved to drawer.

### 4. Main tabs — hidden on mobile

`.main-tabs` gets `display:none` in mobile media query. Tabs accessible via drawer.

### 5. Day nav — floating bar only

- Remove sticky `.day-nav` from list view on mobile
- Floating `.map-day-bar` visible in **both** list and map views
- Add `padding-bottom` to scroll area so content isn't obscured

### 6. Extras — moved to map

- Hide `.extra-toggle` and `.extra-list` on mobile
- Extra attractions already visible as map markers (those with `inPlan: false`)
- Optionally: add "Extras" toggle in map filters

## Result

```
+-------------------------+
| [=] Lista    Map  Mapa  |  <- 50px (only fixed element)
+-------------------------+
|                         |
|  1  Czw 2.04            |  <- content starts immediately
|  Przylot - Kutaisi      |
|  car ~30 min            |
|                         |
|  pin PROGRAM            |
|  - Lot KTW-KUT...      |
|  - Odbior auta          |
|  ...                    |
|  fork JEDZENIE          |
|  ...                    |
|  bulb TIPS              |
|  ...                    |
|                         |
|    (1)(2)(3)...(8)      |  <- floating day bar
+-------------------------+
```

**Space recovered:** ~185px (header 85px + tabs 48px + day-nav 52px)
**New usable viewport:** 794px / 844px = **94% for content**
