# Przewodnik — Sekcja "W aucie" (History per Day)

**Data:** 2026-02-23
**Status:** Approved

## Cel

Dodanie sekcji "Przewodnik" z tekstami do czytania na głos w aucie (~10 min/dzień).
Jedna osoba czyta dla wszystkich — family-friendly, narracja + ciekawostki o historii
i kulturze Gruzji, dopasowane do atrakcji danego dnia.

## Wymagania

- **Styl:** Mix narracji (opowieść) i faktów/ciekawostek
- **Odbiorcy:** Family-friendly (5-latek złapie coś ciekawego)
- **Długość:** ~1300 słów/dzień (~8-10 min czytania na głos)
- **Język:** Polski
- **UI:** Osobny tab główny "Przewodnik" z akordeonem dni

## Architektura danych

Nowy plik `src/data/history.js` z globalem `var HISTORY = [...]`.

```js
var HISTORY = [
  {
    "day": 1,
    "title": "Kutaisi — starożytna stolica Kolchidy",
    "readTime": "~8 min",
    "sections": [
      {
        "heading": "Złote Runo i Kolchida",
        "paragraphs": [
          "Wylądowaliście w Kutaisi — ...",
          "Według greckiego mitu..."
        ]
      },
      {
        "heading": "Ciekawostki 🤩",
        "paragraphs": ["• Gruzja ma swój własny alfabet..."]
      }
    ]
  }
];
```

## UI

- Nowy button w `.main-tabs`: `📚 Przewodnik`
- Nowy `tab-pane` id `pane-przewodnik`
- Akordeon 8 dni (klik = rozwiń)
- Styl czytelny: większy font, line-height 1.7, ciepłe tło
- Nagłówek dnia: numer + tytuł + chip readTime
- Sekcje: h4 heading + p paragraphs

## Treść per dzień

| Dzień | Temat przewodni |
|-------|-----------------|
| 1 | Kutaisi, Kolchida, Złote Runo, alfabet gruziński |
| 2 | Jaskinie, geologia Gruzji, dinozaury (Sataplia!) |
| 3 | Mtskheta (stara stolica), chrześcijaństwo w Gruzji, Tbilisi |
| 4 | Wielkanoc, tradycje gruzińskie, Narikala, historia Tbilisi |
| 5 | Kakheti — kraina wina, qvevri (UNESCO), gruzińska supra |
| 6 | Kuchnia gruzińska — khinkali, khachapuri, historia jedzenia |
| 7 | Gelati, Złoty Wiek Gruzji, rzemiosło i churchkhela |
| 8 | Podsumowanie, pożegnanie z Gruzją |

## Podejście implementacyjne

1. Stworzenie `src/data/history.js` z pełnymi tekstami (8 dni)
2. Dodanie `<script src="src/data/history.js">` w `index.html`
3. Dodanie tabu "Przewodnik" w HTML + drawer
4. Funkcja `renderPrzewodnik()` w `app.js`
5. Style CSS dla czytelnego tekstu
