# Design: Ankieta + Noclegi + Interaktywna legenda

**Data:** 2026-02-21
**Status:** Zatwierdzony

---

## Cel

Dodanie dwóch nowych sekcji do strony Gruzja 2026:
1. **Noclegi** — informacje o zakwaterowaniu z NOCLEGI.md
2. **Ankieta** — wyniki ankiety Google Forms + link do wypełnienia

Dodatkowo: interaktywna legenda na mapie i markery noclegów.

---

## 1. Tab Noclegi

- Nowy tab w `main-tabs`: `🏨 Noclegi`
- Dane z NOCLEGI.md jako JS obiekt (inline, jak istniejące dane)
- Sekcje wg lokalizacji:
  - **Kutaisi** (2-4.04 + 8-9.04)
  - **Tbilisi** (4-8.04)
  - **Sighnaghi** (6-7.04)
- Każdy nocleg: nazwa, ocena, cena/os./noc, linki Booking/Airbnb
- Oznaczenia: REKOMENDACJA, ZAREZERWOWANO
- Podsumowanie budżetowe na dole
- Styl: spójny z istniejącymi tabami (budget-inner CSS)

## 2. Tab Ankieta

- Nowy tab: `📋 Ankieta`
- **Przycisk "Wypełnij ankietę"** — link do Google Forms (nowa karta)
  - URL: `https://forms.gle/23WicBwzDSRhvPkH8`
- **Wyniki ankiety** — fetch z Google Apps Script endpoint:
  - URL: `https://script.google.com/macros/s/AKfycbyrcISCJHYZ85TKXuaNWTV4TxG8TCt7J5veVm6OarNhLfUaNlMXU-51ZX7ehdrW46YU/exec`
  - Renderowane jako kolorowe słupki procentowe (CSS, bez bibliotek)
  - Lista respondentów (imiona)
  - Cytaty z pola "uwagi"
- Loading/error states

### Struktura ankiety (8 pytań):

1. Imię (tekst)
2. Supra wielkanocna (choice: Tak / Nie / Wszystko mi jedno)
3. Cooking class (choice: Tak / Nie / Wszystko mi jedno)
4. Kazbegi (choice: Jadę / Zostaję / Nie wiem)
5. Łaźnie siarkowe (choice: Tak / Nie / Wszystko mi jedno)
6. Kierowca (choice: Self-drive / Z kierowcą / Wszystko mi jedno)
7. Budżet (choice: do €250 / €350 / €450 / €600 / Bez preferencji)
8. Uwagi (tekst)

## 3. Google Apps Script (doGet)

Kod do wklejenia w edytor Apps Script powiązany z formularzem:
- Czyta arkusz odpowiedzi
- Agreguje wyniki (ile głosów na każdą opcję per pytanie)
- Zwraca JSON z CORS headers
- Format odpowiedzi:
  ```json
  {
    "respondents": ["Ania", "Kamil", ...],
    "questions": [
      {
        "title": "Supra wielkanocna...",
        "type": "choice",
        "results": {"Tak, chcemy!": 5, "Nie": 1, "Wszystko mi jedno": 2}
      },
      ...
    ],
    "comments": ["Super pomysł!", ...]
  }
  ```

## 4. Markery noclegów na mapie

- Kolor: `#e91e63` (różowy/magenta)
- Markery dla rekomendowanych noclegów w każdej lokalizacji
- Lekko przesunięte od istniejących markerów miast
- Popupy z: nazwa, ocena, cena, link do rezerwacji

## 5. Interaktywna legenda

- Każdy element legendy = przycisk toggle (kliknięcie włącza/wyłącza kategorię)
- Wyszarzony tekst + półprzezroczysta kropka = wyłączone
- Nowa pozycja: Noclegi (różowy)
- Kategorie: Nocleg, Atrakcja, Winnica, Dzieci, Kazbegi, Bonus, Noclegi

## 6. Mobile

- `main-tabs`: `overflow-x: auto`, `flex-wrap: nowrap`, `-webkit-overflow-scrolling: touch`
- 5 tabów scrollowalne horyzontalnie
- Legenda: mniejszy font, scroll jeśli potrzebny
- Tab ankiety: przycisk full-width, wyniki poniżej

---

## Technologia

- Zero nowych zależności (vanilla JS/CSS, jak reszta projektu)
- Dane inline jako JS obiekty
- Fetch API do pobrania wyników ankiety
- Google Apps Script jako backend wyników
