# Mobile Single-Day View — Design

**Data**: 2026-02-22
**Kontekst**: Odchudzenie mobile UI, więcej miejsca na plan dnia

## Problem
Na mobile za dużo przestrzeni zajmują zbędne elementy (Easter chip, legenda filtrów), a lista 8 accordionów wymaga scrollowania do otwartego dnia.

## Rozwiązanie

### 1. Ukryj zbędne elementy na mobile
- `.chip-easter` → `display:none` w `@media(max-width:768px)`
- `.leg` (legenda filtrów) → `display:none` w `@media(max-width:768px)` — filtry dostępne przez przycisk 🔍 na mapie
- Desktop: bez zmian

### 2. Single-day view na mobile
- `render()` sprawdza `window.innerWidth<=768`
- Mobile: generuje TYLKO aktywny dzień (pełny plan, bez accordion toggle)
- Desktop: generuje listę z accordionem (jak dotąd)
- Na start: `ad=0` na mobile (dzień 1 wyświetlony od razu)
- Day-nav (1-8) sticky na górze — przełącza dni

### 3. Swipe między dniami
- Touch events na `.scroll` kontenerze (touchstart/touchmove/touchend)
- Próg: >50px przesunięcia horyzontalnego = zmiana dnia
- Kierunek: swipe lewo = następny dzień, swipe prawo = poprzedni
- Vanilla JS, bez zewnętrznych bibliotek (~30 linii)
- Tylko mobile (window.innerWidth<=768)

### 4. Strzałki nawigacji na dole dnia
- Pod noclegiem: "← Dzień 2 · Jaskinie | Dzień 4 · WIELKANOC →"
- Klik strzałki = `sel(i-1)` lub `sel(i+1)`
- Dzień 1: brak lewej strzałki. Dzień 8: brak prawej.

## Ograniczenia
- Desktop nie zmieniony (lista z accordionem)
- Swipe tylko na mobile
- Zero nowych zależności
