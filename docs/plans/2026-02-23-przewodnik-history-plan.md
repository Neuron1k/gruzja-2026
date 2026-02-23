# Przewodnik (History per Day) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Przewodnik" tab with family-friendly history/culture texts (~1300 words each) for reading aloud in the car during the Georgia trip.

**Architecture:** New data file `src/data/history.js` with `var HISTORY = [...]` array (one entry per day). New tab "Przewodnik" in main tabs + drawer. Render function `renderPrzewodnik()` builds an accordion of days with readable, styled text sections.

**Tech Stack:** Vanilla JS, HTML, CSS (no build step, same as existing project)

---

### Task 1: Create history data file with Day 1 content

**Files:**
- Create: `src/data/history.js`

**Step 1: Create `src/data/history.js` with structure and Day 1 text**

```js
// === PRZEWODNIK ===
var HISTORY = [
  {"day": 1, "title": "Kutaisi — starożytna stolica Kolchidy", "readTime": "~8 min", "sections": [
    {"heading": "Złote Runo i kraina Kolchów", "paragraphs": [
      "Właśnie wylądowaliście w jednym z najstarszych nieprzerwanie zamieszkanych miast na świecie. Kutaisi liczy sobie ponad trzy tysiące lat — kiedy Rzym był jeszcze małą wioską nad Tybrem, Kutaisi już było stolicą potężnego królestwa Kolchidy.",
      "To właśnie tutaj, według greckiego mitu, Jazon przypłynął ze swoimi Argonautami po Złote Runo. Legenda mówi, że król Kolchidy — Ajetes — ukrył magiczne runo złotego barana w gaju strzeżonym przez smoka, który nigdy nie spał. Jazon zdobył runo dzięki pomocy królewny Medei, która się w nim zakochała. Ciekawostka: Gruzini naprawdę używali owczych skór do wyłapywania złotego pyłu z rzek! Skóry zanurzano w nurtach górskich potoków, a drobinki złota osadzały się w wełnie. Potem suszono je na słońcu i wełna lśniła złotem — stąd prawdopodobnie powstała legenda o Złotym Runie.",
      "Nazwa 'Gruzja' po gruzińsku brzmi zupełnie inaczej — Sakartwelo (საქართველო). Gruzini nazywają siebie Kartwelami, a ich język, kartuli, jest jednym z najstarszych żywych języków świata."
    ]},
    {"heading": "Alfabet, którego nie ma nigdzie indziej", "paragraphs": [
      "Rozglądając się po Kutaisi zobaczycie napisy w bardzo nietypowym piśmie — okrągłe, miękkie literki, które wyglądają trochę jak zawijasy. To alfabet gruziński, mkhedruli, i jest on tak wyjątkowy, że UNESCO wpisał go na listę niematerialnego dziedzictwa ludzkości.",
      "Alfabet gruziński ma 33 litery i nie rozróżnia wielkich i małych liter — wszystkie wyglądają tak samo! Powstał prawdopodobnie w V wieku i jest jednym z zaledwie 14 oryginalnych alfabetów na świecie (czyli takich, które nie pochodzą od innego pisma). Dla porównania — nasz łaciński alfabet pochodzi od greckiego, a grecki od fenickiego.",
      "Spróbujcie zapamiętać jedno słowo: გამარჯობა — czyta się 'gamarjoba' i znaczy 'dzień dobry'. Dosłownie oznacza 'niech ci się powiedzie zwycięstwo'!"
    ]},
    {"heading": "Katedra Bagrati — tysiąc lat historii", "paragraphs": [
      "Dziś zobaczycie Katedrę Bagrati, zbudowaną na wzgórzu Ukimerioni na przełomie X i XI wieku przez króla Bagrata III. To był pierwszy władca, który zjednoczył wszystkie gruzińskie ziemie w jedno królestwo. Katedra była tak imponująca, że przez wieki stanowiła symbol jedności Gruzji.",
      "W 1691 roku Turcy Osmańscy wysadzili katedrę w powietrze podczas inwazji — kopuła i ściany runęły. Przez ponad 300 lat katedra stała w ruinie, ale Gruzini nigdy o niej nie zapomnieli. W 2012 roku zakończono kontrowersyjną rekonstrukcję — UNESCO było tak niezadowolone z jakości odbudowy, że usunęło katedrę z listy Światowego Dziedzictwa! Mimo to, dla Gruzinów Bagrati pozostaje symbolem ich wytrwałości.",
      "Obok katedry zobaczycie Biały Most — nowoczesny most pieszy nad rzeką Rioni, z którego rozpościera się piękny widok na miasto."
    ]},
    {"heading": "Ciekawostki na start 🤩", "paragraphs": [
      "• Gruzja to jedno z najstarszych miejsc produkcji wina na świecie — znaleziono tu naczynia z resztkami wina sprzed 8000 lat! Starożytni Gruzini robili wino w glinianych dzbanach zakopanych w ziemi, zwanych qvevri. Ta metoda jest do dziś używana i jest wpisana na listę UNESCO.",
      "• Waluta Gruzji to lari (GEL). Jeden lari to około 1,30 złotego. Nazwa pochodzi od słowa oznaczającego 'skarb'.",
      "• Gruzini są legendarnymi gospodarzami. Ich tradycyjna uczta — supra — to nie zwykły obiad, ale wielogodzinne święto z dziesiątkami toastów, prowadzone przez tamadę (mistrza ceremonii). UNESCO uznało gruzińską tradycję uczty za niematerialne dziedzictwo!",
      "• Gruzja była drugim krajem na świecie (po Armenii), który przyjął chrześcijaństwo jako religię państwową — w 337 roku naszej ery!"
    ]}
  ]},
  {"day": 2, "title": "Jaskinie, kaniony i dinozaury", "readTime": "~9 min", "sections": []},
  {"day": 3, "title": "Mtskheta i Tbilisi — stara i nowa stolica", "readTime": "~9 min", "sections": []},
  {"day": 4, "title": "Wielkanoc w Gruzji — tradycje i Tbilisi", "readTime": "~9 min", "sections": []},
  {"day": 5, "title": "Kakheti — kraina wina i gościnności", "readTime": "~8 min", "sections": []},
  {"day": 6, "title": "Gruzińska kuchnia — smaki Kaukazu", "readTime": "~9 min", "sections": []},
  {"day": 7, "title": "Gelati i Złoty Wiek Gruzji", "readTime": "~8 min", "sections": []},
  {"day": 8, "title": "Do widzenia, Sakartwelo!", "readTime": "~5 min", "sections": []}
];
```

Only Day 1 has full sections; days 2-8 have empty `sections: []` — they'll be filled in Task 6.

**Step 2: Verify the file loads without errors**

Open `index.html` in a browser (after adding the script tag in Task 2), open DevTools Console. No errors expected about HISTORY.

**Step 3: Commit**

```bash
git add src/data/history.js
git commit -m "feat: add history data file with Day 1 content"
```

---

### Task 2: Wire up HTML — script tag, tab button, pane

**Files:**
- Modify: `index.html:43-49` (main-tabs buttons)
- Modify: `index.html:84-86` (add new tab-pane)
- Modify: `index.html:92-97` (add script tag)
- Modify: `index.html:29-34` (drawer links)

**Step 1: Add script tag for history.js**

In `index.html`, after the `config.js` script tag (line 95), add:

```html
<script src="src/data/history.js"></script>
```

So the order becomes: attractions → days → accommodations → config → history → georgia_to_places → app.

**Step 2: Add "Przewodnik" button to main-tabs**

In `index.html`, after the Ankieta button (line 48), add:

```html
<button onclick="mainTab('przewodnik',this)">📚 Przewodnik</button>
```

**Step 3: Add tab-pane for Przewodnik**

After `pane-ankieta` div (line 84-86), add:

```html
<div class="tab-pane" id="pane-przewodnik">
<div class="budget-inner" id="przewodnikPanel"></div>
</div>
```

**Step 4: Add drawer link for mobile**

In the drawer-links section (after the Ankieta button, line 32), add:

```html
<button onclick="drawerTab('przewodnik')">📚 Przewodnik</button>
```

**Step 5: Verify in browser**

- Desktop: 6 tabs visible (Plan, Noclegi, Budżet, Pakowanie, Ankieta, Przewodnik)
- Clicking "Przewodnik" shows empty pane (no error)
- Mobile: drawer has "Przewodnik" link

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: wire up Przewodnik tab in HTML"
```

---

### Task 3: Render function in app.js

**Files:**
- Modify: `src/app.js:596` (before `// === TABS ===` comment, insert renderPrzewodnik)
- Modify: `src/app.js:856-872` (drawerTab function — add przewodnik case)
- Modify: `src/app.js:886-890` (init section — call renderPrzewodnik)

**Step 1: Add `renderPrzewodnik()` function**

Insert before the `// === TABS ===` line in `src/app.js`:

```js
// === PRZEWODNIK ===
var przewodnikOpen=null;
function togglePrzewodnik(i){
  przewodnikOpen=(przewodnikOpen===i)?null:i;
  renderPrzewodnik();
}
function renderPrzewodnik(){
  var el=document.getElementById("przewodnikPanel");
  if(!el) return;
  var h='<div class="przew-intro">📖 Teksty do czytania na głos w aucie — ~10 min na dzień.<br>Jedna osoba czyta, reszta słucha!</div>';
  HISTORY.forEach(function(day,i){
    var isOpen=przewodnikOpen===i;
    var cls='przew-day'+(isOpen?' open':'');
    h+='<div class="'+cls+'" onclick="togglePrzewodnik('+i+')">';
    h+='<div class="przew-hdr">';
    h+='<div class="dn">'+day.day+'</div>';
    h+='<div class="przew-title">'+day.title+'</div>';
    h+='<span class="przew-time">'+day.readTime+'</span>';
    h+='</div>';
    if(isOpen){
      h+='<div class="przew-body" onclick="event.stopPropagation()">';
      if(day.sections.length===0){
        h+='<p class="przew-empty">Tekst w przygotowaniu...</p>';
      } else {
        day.sections.forEach(function(s){
          h+='<h4>'+s.heading+'</h4>';
          s.paragraphs.forEach(function(p){
            h+='<p>'+p+'</p>';
          });
        });
      }
      h+='</div>';
    }
    h+='</div>';
  });
  el.innerHTML=h;
}
```

**Step 2: Add przewodnik to drawerTab function**

In the `drawerTab()` function, find the chain of if/else for tab rendering on mobile (around line 867-870). Add a new case:

```js
else if(tab==='przewodnik'){bsEl.innerHTML='<div class="budget-inner" id="przewodnikPanel"></div>';renderPrzewodnik();}
```

Also in the desktop tab matching section (around line 877), add the matching condition:

```js
||(tab==='przewodnik'&&b.textContent.indexOf('Przewodnik')!==-1)
```

**Step 3: Call renderPrzewodnik in init section**

After `renderAnkieta();` (line 890), add:

```js
renderPrzewodnik();
```

**Step 4: Verify in browser**

- Click "Przewodnik" tab → see list of 8 days
- Click Day 1 → accordion opens, full text visible
- Click Day 2 → shows "Tekst w przygotowaniu..."
- Click Day 1 again → closes
- Mobile: drawer → Przewodnik → bottom sheet shows same content

**Step 5: Commit**

```bash
git add src/app.js
git commit -m "feat: add renderPrzewodnik accordion function"
```

---

### Task 4: CSS styles for Przewodnik

**Files:**
- Modify: `src/style.css` (append at end)

**Step 1: Add Przewodnik styles**

Append to end of `src/style.css`:

```css
/* === PRZEWODNIK === */
.przew-intro{padding:12px 14px;font-size:11px;color:#5f6368;line-height:1.5;border-bottom:1px solid #f0f0f0;background:#fffbf0}
.przew-day{border-bottom:1px solid #f0f0f0;cursor:pointer;transition:background .12s}
.przew-day:hover{background:#f8f9fa}
.przew-day.open{background:#fffbf0;border-left:3px solid #e8a735}
.przew-hdr{display:flex;align-items:center;gap:8px;padding:12px 14px}
.przew-hdr .dn{background:#e8a735;flex-shrink:0}
.przew-title{font-size:12px;font-weight:600;color:#202124;flex:1}
.przew-time{font-size:10px;color:#9aa0a6;white-space:nowrap;background:#f1f3f4;padding:2px 8px;border-radius:10px}
.przew-body{padding:4px 18px 20px;font-size:13px;line-height:1.75;color:#3c4043;cursor:default}
.przew-body h4{font-size:13px;font-weight:700;color:#e8a735;margin:18px 0 6px;padding-bottom:4px;border-bottom:1px solid #f0e6cc}
.przew-body h4:first-child{margin-top:4px}
.przew-body p{margin:0 0 10px;text-align:left}
.przew-empty{color:#9aa0a6;font-style:italic;text-align:center;padding:20px 0}
```

Key design decisions:
- Warm amber/sepia color scheme (`#e8a735`, `#fffbf0`) — distinct from the blue Plan tab
- Larger font (13px vs 11px in plan) and generous line-height (1.75) for readability
- The `.dn` circle reuses the existing day-number styling but with amber background

**Step 2: Verify in browser**

- Przewodnik tab: warm amber styling, larger readable text
- Day accordion: click to expand, pleasant reading experience
- Mobile: same styling works in bottom sheet

**Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: add warm amber styles for Przewodnik tab"
```

---

### Task 5: Verify full integration end-to-end

**Files:** None (testing only)

**Step 1: Desktop verification**

- Load `index.html` in browser
- Click through all 6 tabs — each works, no JS errors in console
- Click "Przewodnik" → see 8-day accordion
- Open Day 1 → readable text with sections
- Open Day 2 → "Tekst w przygotowaniu..."
- Open Day 1 while Day 2 is open → Day 2 closes, Day 1 opens

**Step 2: Mobile verification**

- Resize to mobile width (≤768px)
- Open drawer (hamburger) → "Przewodnik" link visible
- Click it → bottom sheet shows Przewodnik content at full height
- Scroll through text — smooth, readable

**Step 3: No-regression check**

- Switch to Plan tab → day accordion still works
- Select a day → map highlights markers
- flyTo works → markers open popups
- Other tabs (Noclegi, Budżet, Pakowanie, Ankieta) render correctly

---

### Task 6: Write remaining history content (Days 2-8)

**Files:**
- Modify: `src/data/history.js` (fill in empty sections arrays)

This is the content-heavy task. Write ~1300 words per day, family-friendly, mix of narrative and facts. Each day's content should relate to that day's attractions and destinations.

**Day 2: Jaskinie, kaniony i dinozaury**
- Sections: How caves form (stalactites for kids!), Prometheus cave myth connection, Sataplia dinosaur footprints (real dinosaurs walked here!), Georgian geology (Caucasus formation), canyon/river formations

**Day 3: Mtskheta i Tbilisi — stara i nowa stolica**
- Sections: Mtskheta as ancient capital (3000 years), Saint Nino and the cross of grapevine, Jvari monastery inspiration for Lermontov, founding myth of Tbilisi (King Gorgasali's falcon & hot springs), Silk Road city

**Day 4: Wielkanoc w tradycji gruzińskiej + Tbilisi historia**
- Sections: Georgian Easter traditions (red eggs, jejili wheat grass), Georgian Orthodox Christianity, Narikala fortress (1500 years), Dry Bridge Market origins, Chronicle of Georgia monument

**Day 5: Kakheti — kraina wina**
- Sections: 8000-year wine history, qvevri (clay vessels, UNESCO), how supra works (tamada, toasts), Kakheti region landscape, Georgian hospitality philosophy

**Day 6: Kuchnia gruzińska**
- Sections: Khinkali origin story (mountain warriors), khachapuri regional variations, Georgian food philosophy, cooking as culture, why Georgian food is trending worldwide

**Day 7: Gelati i Złoty Wiek**
- Sections: David the Builder and Golden Age, Gelati Academy (medieval university!), Queen Tamar, churchkhela (Georgian "Snickers"), Georgian crafts and souvenirs

**Day 8: Pożegnanie z Gruzją**
- Sections: Shorter (~800 words). What makes Georgia unique, how to stay connected with Georgian culture, useful phrases recap, "Nakhvamdis!" (goodbye)

**Step 1: Write Days 2-4 sections**

Fill in the empty sections arrays in `history.js` for days 2, 3, and 4 with full text following the same format as Day 1.

**Step 2: Verify days 2-4 in browser**

Open Przewodnik tab, expand each day, verify text renders correctly, no JSON syntax errors.

**Step 3: Commit**

```bash
git add src/data/history.js
git commit -m "feat: add Przewodnik content for days 2-4"
```

**Step 4: Write Days 5-7 sections**

Fill in sections for days 5, 6, and 7.

**Step 5: Verify days 5-7 in browser**

**Step 6: Commit**

```bash
git add src/data/history.js
git commit -m "feat: add Przewodnik content for days 5-7"
```

**Step 7: Write Day 8 section (shorter)**

Fill in sections for day 8 (~800 words, farewell theme).

**Step 8: Verify Day 8 + full scroll-through of all 8 days**

**Step 9: Commit**

```bash
git add src/data/history.js
git commit -m "feat: add Przewodnik content for day 8 — complete all days"
```

---

### Task 7: Final polish and verification

**Files:**
- Potentially: `src/style.css` (minor tweaks if needed)

**Step 1: Full end-to-end test desktop + mobile**

- All 8 days have content
- Accordion open/close works
- Text is readable and well-formatted
- No console errors
- All other tabs still work

**Step 2: Content review**

- Read through each day's text for accuracy and tone
- Verify family-friendly language
- Check that content matches the day's attractions

**Step 3: Final commit if any tweaks were needed**

```bash
git add -A
git commit -m "feat: polish Przewodnik tab — final adjustments"
```
