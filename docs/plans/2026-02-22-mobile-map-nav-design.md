# Mobile Map Day Navigation — Design

**Data**: 2026-02-22
**Kontekst**: Na mobile w trybie mapy nie da sie przeskakiwac miedzy dniami bez wracania do listy. Wyszarzone markery sa zbyt niewidoczne i nie wiadomo do ktorego dnia naleza.

## Problem

1. Brak nawigacji miedzy dniami na mapie — jedyny sposob to "Wroc do listy" → zmien dzien → "Pokaz na mapie"
2. Wyszarzone markery (`opacity: 0.25`, `scale: 0.8`) sa prawie niewidoczne i nieklikalne
3. Brak informacji do ktorego dnia naleza wyszarzone markery

## Rozwiazanie

### 1. Day bar na dole mapy

- `position: fixed`, dolna krawedz mapy, nad przyciskiem "Wroc" i filtrami
- Widoczny tylko w trybie `m-map` (`body.m-map .map-day-bar { display: flex }`)
- Wyglad: identyczny styl jak `.day-nav` na liscie (kolka 1-8, aktywny niebieski, Easter czerwony)
- Zachowanie: `onclick` → `sel(i)` — zoom do punktow + highlight + sync ze stanem `ad`
- Layout: wycentrowany, biale tlo, border-radius, cien — spojne z `.map-back-btn`

```
  ┌─────────────────────────────┐
  │    📋 Lista    🗺️ Mapa     │  ← mobile-nav (top)
  ├─────────────────────────────┤
  │                             │
  │       [ mapa leaflet ]      │
  │                             │
  │  (1)(2)(③)(4)(5)(6)(7)(8)   │  ← map-day-bar (fixed bottom)
  │  [← Wróć]           (🔍)  │  ← existing buttons
  └─────────────────────────────┘
```

### 2. Poprawione wyszarzenie markerow

- **Obecne**: `opacity: 0.25`, `scale(0.8)` — prawie niewidoczne
- **Nowe**: `opacity: 0.5`, bez scale — widoczne i klikalne

### 3. Numerki dni na wyszarzonych markerach

- Uzycie istniejacego `attrToDays` lookup (attraction ID → array of day indices)
- `highlightDayMarkers()` rozszerzona: przy dimowaniu dodaje `<span class="cm-day">3</span>` do marker DOM
- Przy highlightowaniu (aktywne markery) — usuwa numerki, czysta kropka z pulsowaniem
- Numerek: maly (9-10px), bialy tekst na ciemnym tle, pozycjonowany obok kropki
- Markery z wieloma dniami: `"3,5"`
- Tylko na mobile z aktywnym dniem — desktop bez zmian

```
  Aktywny marker (dzień 3):     ● (pulsuje, bez numerka)
  Wyszarzony marker (dzień 5):  ◐ ⁵  (opacity 0.5 + numerek)
  Brak aktywnego dnia:          ● (normalny, bez numerka)
```

### 4. Zmiany w plikach

| Plik | Zmiana |
|------|--------|
| `src/style.css` | `.map-day-bar` styles, poprawione `.cm-dim`, nowy `.cm-day` |
| `src/app.js` | Render `map-day-bar`, rozszerzona `highlightDayMarkers()` |
| `index.html` | Dodany `<div class="map-day-bar">` |

## Ograniczenia

- Desktop: zero zmian
- Zero nowych zaleznosci
- `sel()` dziala identycznie — day bar wolal `sel(i)` jak day-nav na liscie
