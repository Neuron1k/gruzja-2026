# Usability Quick Wins — Design

**Data**: 2026-02-22
**Kontekst**: Strona trip planner Gruzja 2026, 9 uczestników, mobile-first

## Problem
Uczestnicy wycieczki korzystają ze strony głównie na telefonach. Obecne problemy:
- Checkboxy pakowania są czysto wizualne (nie działają)
- Fonty zbyt małe na mobile (10-11px)
- Brak szybkiej nawigacji między dniami
- Mapa i lista są odcięte — kliknięcie flyTo() przenosi na mapę bez łatwego powrotu

## Rozwiązanie: 4 Quick Wins

### 1. Działające checkboxy pakowania + localStorage

**Co**: Każdy `pack-item` klikalny (toggle ☐ → ☑), stan w `localStorage('gruzja-packing')`.

**Zachowanie**:
- Klik na item → toggle checked/unchecked
- Checked: zielony ☑, tekst lekko szary z przekreśleniem
- Progress bar na górze: "Spakowano: 5/23"
- Przycisk "Resetuj" na dole czyści localStorage

**Zmiany**: `renderPacking()` w `app.js`, CSS dla `.pack-item.checked` i `.pack-progress`

### 2. Większe fonty i touch targets na mobile

**Co**: Wyłącznie w `@media(max-width:768px)`:
- Bazowy font panelu: 11px → 13px
- Nagłówki sekcji `.ds h4`: 10px → 12px
- Touch targets: min 44px wysokość
- Tab buttons: padding 14px 10px, font 13px
- Day cards `.dc`: padding 14px 16px
- Popup: font 14px
- Mobile nav: font 14px, height 50px

**Zmiany**: Blok `@media` w `style.css`

### 3. Sticky day navigation

**Co**: Pasek z okrągłymi przyciskami 1-8 sticky na górze `#pane-plan`.

**Zachowanie**:
- Aktywny dzień podświetlony (#1a73e8)
- Wielkanoc (dzień 4) z czerwonym akcentem (#ea4335)
- Klik → `sel(i)` (rozwija dzień + zoom mapy)
- Na mobile: horyzontalnie scrollowalny

**Zmiany**: `render()` w `app.js` (generuje HTML paska), CSS `.day-nav`

### 4. Bidirectional map ↔ list

**Co**: Trzy powiązane usprawnienia:

**a) Auto-powrót z mapy**:
- Po `flyTo()` na mobile — floating button "← Wróć do listy"
- Znika po 5s lub po kliknięciu
- Klik → `mobileView('list')`

**b) CTA pod rozwiniętym dniem**:
- Pod sekcją programu: "🗺️ Pokaż wszystkie punkty na mapie"
- Klik → `mobileView('map')` + fitBounds na punkty dnia

**c) Popup → dzień**:
- Popup markera zawiera link "📅 Dzień X" (jeśli atrakcja jest w jakimś dniu)
- Klik → `mobileView('list')` + `sel(dayIndex)`
- Wymaga lookup: attraction ID → day index (zbudować mapę przy init)

**Zmiany**: `flyTo()`, `render()`, inicjalizacja markerów w `app.js`, CSS

## Ograniczenia
- Zapis wyłącznie w localStorage (per-device, per-browser)
- Brak zmian na desktop poza sekcjami 1, 3, 4
- Zero nowych zależności (plain JS + Leaflet)
