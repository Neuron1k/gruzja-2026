# Ankieta + Noclegi + Interaktywna Legenda — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add accommodation tab, survey results tab, accommodation map markers, and interactive legend toggling to the Georgia 2026 trip planner.

**Architecture:** Single-file SPA (`index.html`, ~389 lines). All CSS is inline in `<style>`, all JS inline in `<script>`. Data is stored as JS objects (like `ATTR`, `DAYS_A`). New features follow the same pattern — add CSS classes, HTML tab panes, JS data objects, and render functions. Google Apps Script provides survey results as JSON via fetch.

**Tech Stack:** Vanilla HTML/CSS/JS, Leaflet.js for maps, Google Apps Script for survey backend, Fetch API.

---

## Task 1: Add CSS for new features

**Files:**
- Modify: `index.html:9-111` (inside `<style>` block)

**Step 1: Add CSS for scrollable tabs, accommodation cards, survey results, and interactive legend**

Add the following CSS rules **before the closing `</style>` tag** (line 111):

```css
/* Scrollable tabs on mobile */
.main-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.main-tabs::-webkit-scrollbar{display:none}
.main-tabs button{white-space:nowrap;min-width:0;flex-shrink:0}

/* Accommodation cards */
.acc-section{margin-bottom:16px}
.acc-section h4{font-size:10px;text-transform:uppercase;letter-spacing:.4px;font-weight:600;color:#e91e63;margin:10px 0 6px}
.acc-section h4:first-child{margin-top:0}
.acc-card{padding:8px 10px;background:#fff;border:1px solid #e8eaed;border-radius:8px;margin-bottom:8px}
.acc-card.recommended{border-color:#e91e63;border-width:2px}
.acc-card.booked{border-color:#34a853;border-width:2px}
.acc-badge{display:inline-block;padding:2px 6px;border-radius:8px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;margin-bottom:4px;margin-right:4px}
.acc-badge.rec{background:#fce4ec;color:#c2185b}
.acc-badge.book{background:#e8f5e9;color:#2e7d32}
.acc-name{font-weight:600;font-size:12px;color:#202124}
.acc-detail{font-size:10px;color:#5f6368;margin-top:2px}
.acc-price{font-size:11px;font-weight:600;color:#e91e63;margin-top:3px}
.acc-links{margin-top:4px}
.acc-links a{color:#1a73e8;text-decoration:none;font-size:10px;margin-right:8px}
.acc-links a:hover{text-decoration:underline}

/* Survey results */
.survey-btn{display:block;width:100%;padding:12px;margin-bottom:16px;background:#1a73e8;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;text-align:center}
.survey-btn:hover{background:#1557b0}
.survey-q{margin-bottom:14px}
.survey-q h4{font-size:11px;color:#202124;font-weight:600;margin-bottom:6px}
.survey-bar-wrap{display:flex;align-items:center;margin-bottom:3px}
.survey-bar-label{width:45%;font-size:10px;color:#3c4043;text-align:right;padding-right:8px}
.survey-bar-track{flex:1;height:16px;background:#f1f3f4;border-radius:8px;overflow:hidden;position:relative}
.survey-bar-fill{height:100%;border-radius:8px;transition:width .3s}
.survey-bar-pct{position:absolute;right:4px;top:0;line-height:16px;font-size:9px;font-weight:600;color:#fff}
.survey-bar-count{font-size:9px;color:#9aa0a6;margin-left:4px;min-width:20px}
.survey-respondents{padding:8px 10px;background:#f8f9fa;border-radius:6px;margin-bottom:12px;font-size:10px;color:#5f6368}
.survey-respondents strong{color:#202124}
.survey-comment{padding:6px 10px;background:#fef7e0;border-left:3px solid #fbbc04;border-radius:0 4px 4px 0;margin-bottom:6px;font-size:10px;color:#3c4043;font-style:italic}
.survey-loading{text-align:center;padding:40px;color:#9aa0a6;font-size:12px}
.survey-error{text-align:center;padding:20px;color:#ea4335;font-size:11px}

/* Interactive legend */
.leg-i{cursor:pointer;user-select:none;transition:opacity .2s}
.leg-i.off{opacity:.35;text-decoration:line-through}
.leg-i.off .leg-d{opacity:.3}
```

**Step 2: Verify visually**

Open `index.html` in a browser, confirm no visual regressions on existing content.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add CSS for noclegi, ankieta, and interactive legend"
```

---

## Task 2: Add HTML tab buttons and panes

**Files:**
- Modify: `index.html:122-149` (main-tabs and tab-pane sections)

**Step 1: Add two new tab buttons in main-tabs (line 122-126)**

Replace lines 122-126:
```html
<div class="main-tabs">
<button class="on" onclick="mainTab('plan',this)">📅 Plan</button>
<button onclick="mainTab('budget',this)">💶 Budżet</button>
<button onclick="mainTab('packing',this)">🎒 Pakowanie</button>
</div>
```

With:
```html
<div class="main-tabs">
<button class="on" onclick="mainTab('plan',this)">📅 Plan</button>
<button onclick="mainTab('noclegi',this)">🏨 Noclegi</button>
<button onclick="mainTab('budget',this)">💶 Budżet</button>
<button onclick="mainTab('packing',this)">🎒 Pakowanie</button>
<button onclick="mainTab('ankieta',this)">📋 Ankieta</button>
</div>
```

**Step 2: Add two new tab panes after the existing packing pane (after line 149)**

Insert after the packing pane (`</div>` on line 149), before the panel closing `</div>` on line 150:

```html
<div class="tab-pane" id="pane-noclegi">
<div class="budget-inner" id="noclegiPanel"></div>
</div>
<div class="tab-pane" id="pane-ankieta">
<div class="budget-inner" id="ankietaPanel"></div>
</div>
```

**Step 3: Verify** — click each tab, confirm they all switch correctly (new tabs will be empty).

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Noclegi and Ankieta tab buttons and panes"
```

---

## Task 3: Add accommodation data and render function

**Files:**
- Modify: `index.html` (add `NOCLEGI` JS data array after line 157, add `renderNoclegi()` function after `renderPacking()`)

**Step 1: Add NOCLEGI data array**

Insert after line 157 (after `var DAY6B = {...};`), before the `var map = ...` line:

```javascript
var NOCLEGI = [
  {
    "city": "Kutaisi",
    "dates": "2-4.04 + 8-9.04 (3 noce)",
    "options": [
      {
        "name": "Apartment Soho Tabidze",
        "platform": "Booking.com",
        "rating": 9.7,
        "reviews": 150,
        "location": "0.6 km od centrum",
        "rooms": "2x apartament (2 syp. + 2 łaz. + salon + kuchnia, 65-75 m²)",
        "price": "868 zł / 2 noce (~$12/os./noc)",
        "cancel": "Bezpłatne",
        "recommended": true,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Kutaisi%2C+Georgia&checkin=2026-04-02&checkout=2026-04-04&group_adults=7&group_children=2&age=3&age=5&no_rooms=3&nflt=ht_id%3D201",
        "lat": 42.271,
        "lng": 42.700
      },
      {
        "name": "Apartment BESO",
        "platform": "Booking.com",
        "rating": 8.9,
        "reviews": 376,
        "location": "1 km od centrum",
        "rooms": "2x apartament z balkonem (1 syp. + salon + łaz. + kuchnia)",
        "price": "871 zł / 2 noce (~$12/os./noc)",
        "cancel": "Bezpłatne",
        "recommended": false,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Kutaisi%2C+Georgia&checkin=2026-04-02&checkout=2026-04-04&group_adults=7&group_children=2&age=3&age=5&no_rooms=3&nflt=ht_id%3D201",
        "lat": 42.265,
        "lng": 42.698
      }
    ]
  },
  {
    "city": "Tbilisi",
    "dates": "4-8.04 (4 noce, w tym Wielkanoc 5.04)",
    "options": [
      {
        "name": "Cabernet Corner — Old Tbilisi",
        "platform": "Booking.com",
        "rating": 8.6,
        "reviews": 125,
        "location": "250 m od centrum, Old Tbilisi",
        "rooms": "1 apartament · 4 sypialnie · 2 łazienki · 150 m²",
        "price": "3 375 zł / 4 noce (~$23/os./noc)",
        "cancel": "Bezpłatne",
        "recommended": true,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Tbilisi%2C+Georgia&checkin=2026-04-04&checkout=2026-04-08&group_adults=7&group_children=2&age=3&age=5&no_rooms=3&nflt=ht_id%3D201",
        "lat": 41.691,
        "lng": 44.810
      },
      {
        "name": "Apartament w starym Tbilisi",
        "platform": "Airbnb",
        "rating": 5.0,
        "reviews": 10,
        "location": "Old Tbilisi",
        "rooms": "4 sypialnie · 12 łóżek",
        "price": "1 267 zł / 4 noce (~$8/os./noc)",
        "cancel": "Bezpłatne",
        "recommended": false,
        "booked": false,
        "link": "https://www.airbnb.com/s/Tbilisi--Georgia/homes?checkin=2026-04-04&checkout=2026-04-08&adults=7&children=2&children_ages=3%2C5&min_bedrooms=3&room_types%5B%5D=Entire%20home%2Fapt",
        "lat": 41.693,
        "lng": 44.808
      },
      {
        "name": "Natali Apartment",
        "platform": "Booking.com",
        "rating": 9.1,
        "reviews": 72,
        "location": "2.8 km od centrum",
        "rooms": "3 sypialnie · 1 salon · 150 m²",
        "price": "1 312 zł / 4 noce (~$9/os./noc)",
        "cancel": "Bezpłatne",
        "recommended": false,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Tbilisi%2C+Georgia&checkin=2026-04-04&checkout=2026-04-08&group_adults=7&group_children=2&age=3&age=5&no_rooms=3&nflt=ht_id%3D201",
        "lat": 41.720,
        "lng": 44.795
      }
    ]
  },
  {
    "city": "Sighnaghi",
    "dates": "6-7.04 (1 noc)",
    "options": [
      {
        "name": "Guest House Vista",
        "platform": "Booking.com",
        "rating": 9.4,
        "reviews": 467,
        "location": "7 min od Muzeum Narodowego",
        "rooms": "Pokój dwuosobowy z balkonem — 19 m²",
        "price": "102 zł / 1 noc",
        "cancel": "Bezpłatne",
        "recommended": true,
        "booked": true,
        "link": "https://www.booking.com/hotel/ge/guest-house-vista.html",
        "lat": 41.619,
        "lng": 45.925
      },
      {
        "name": "Zandarashvili Guest House",
        "platform": "Booking.com",
        "rating": 8.9,
        "reviews": 582,
        "location": "1.1 km, lok. 9.6",
        "rooms": "4 pokoje (basic + podwójny + 2x rodzinny)",
        "price": "283 zł / 1 noc (~$8/os.)",
        "cancel": "Bezpłatne",
        "recommended": false,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Sighnaghi&checkin=2026-04-06&checkout=2026-04-07&group_adults=7&group_children=2&age=3&age=5&no_rooms=3",
        "lat": 41.614,
        "lng": 45.918
      }
    ]
  }
];
```

**Step 2: Add renderNoclegi() function**

Insert after `renderPacking()` function (after line 356), before `mainTab()`:

```javascript
function renderNoclegi(){
  var el=document.getElementById("noclegiPanel");
  var h='';
  NOCLEGI.forEach(function(city){
    h+='<h4>📍 '+city.city+' — '+city.dates+'</h4>';
    city.options.forEach(function(opt){
      var cls='acc-card'+(opt.recommended?' recommended':'')+(opt.booked?' booked':'');
      h+='<div class="'+cls+'">';
      if(opt.booked) h+='<span class="acc-badge book">✅ Zarezerwowano</span>';
      if(opt.recommended) h+='<span class="acc-badge rec">⭐ Rekomendacja</span>';
      h+='<div class="acc-name">'+opt.name+'</div>';
      h+='<div class="acc-detail">'+opt.platform+' · ⭐ '+opt.rating+' ('+opt.reviews+') · '+opt.location+'</div>';
      h+='<div class="acc-detail">'+opt.rooms+'</div>';
      h+='<div class="acc-price">'+opt.price+'</div>';
      h+='<div class="acc-detail">Anulowanie: '+opt.cancel+'</div>';
      h+='<div class="acc-links"><a href="'+opt.link+'" target="_blank">🔗 Zobacz na '+opt.platform+'</a></div>';
      h+='</div>';
    });
  });
  // Budget summary
  h+='<h4>💰 Podsumowanie noclegów</h4>';
  h+='<div class="note">Wariant ekonomiczny: ~2 852 zł (~$713) za 8 nocy na 9 osób = <strong>~$10/os./noc</strong><br>';
  h+='Wariant comfort: ~$138/os. za cały tydzień</div>';
  el.innerHTML=h;
}
```

**Step 3: Call renderNoclegi() at init**

At line 367 (where `render(); renderBudget(); renderPacking();` are), add `renderNoclegi();`:

```javascript
render();
renderBudget();
renderPacking();
renderNoclegi();
```

**Step 4: Verify** — click "🏨 Noclegi" tab, confirm accommodation cards render correctly.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add Noclegi tab with accommodation data and rendering"
```

---

## Task 4: Add accommodation markers on the map

**Files:**
- Modify: `index.html` (marker creation section, lines 165-175, and legend lines 135-142)

**Step 1: Add accommodation markers after the main ATTR marker loop**

Insert after line 175 (after the `});` closing the `ATTR.forEach`):

```javascript
var accMarkers=[];
NOCLEGI.forEach(function(city){
  city.options.forEach(function(opt){
    if(!opt.recommended && !opt.booked) return;
    var pop='<span class="pop-badge" style="background:#fce4ec;color:#c2185b">Nocleg</span><b>'+opt.name+'</b>';
    pop+='<div class="pop-r">⭐ '+opt.rating+'/5 ('+opt.reviews+' opinii)</div>';
    pop+=opt.platform+' · '+opt.location+'<br>';
    pop+='<strong>'+opt.price+'</strong><br>';
    pop+='<a class="pop-link" href="'+opt.link+'" target="_blank">🔗 Rezerwuj</a>';
    var m=L.marker([opt.lat,opt.lng],{icon:mkI("#e91e63",14)}).addTo(map);
    m.bindPopup(pop,{maxWidth:260});
    accMarkers.push(m);
    markers['acc_'+opt.name.replace(/\s/g,'_')]={m:m,d:{color:"#e91e63",cat:"Zakwaterowanie"}};
  });
});
```

**Step 2: Verify** — pink markers should appear near Kutaisi, Tbilisi, and Sighnaghi, slightly offset from existing blue city markers.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add pink accommodation markers on map"
```

---

## Task 5: Make legend interactive (toggle marker categories)

**Files:**
- Modify: `index.html:135-142` (legend HTML) and add JS toggle function

**Step 1: Replace static legend HTML (lines 135-142) with interactive version**

Replace:
```html
<div class="leg">
<div class="leg-i"><div class="leg-d" style="background:#1a73e8"></div>Nocleg</div>
<div class="leg-i"><div class="leg-d" style="background:#ea4335"></div>Atrakcja</div>
<div class="leg-i"><div class="leg-d" style="background:#9c27b0"></div>Winnica</div>
<div class="leg-i"><div class="leg-d" style="background:#34a853"></div>Dzieci</div>
<div class="leg-i"><div class="leg-d" style="background:#f9ab00"></div>Kazbegi</div>
<div class="leg-i"><div class="leg-d" style="background:#ff7043"></div>Bonus</div>
</div>
```

With:
```html
<div class="leg">
<div class="leg-i" onclick="toggleCat('#1a73e8',this)"><div class="leg-d" style="background:#1a73e8"></div>Nocleg</div>
<div class="leg-i" onclick="toggleCat('#ea4335',this)"><div class="leg-d" style="background:#ea4335"></div>Atrakcja</div>
<div class="leg-i" onclick="toggleCat('#9c27b0',this)"><div class="leg-d" style="background:#9c27b0"></div>Winnica</div>
<div class="leg-i" onclick="toggleCat('#34a853',this)"><div class="leg-d" style="background:#34a853"></div>Dzieci</div>
<div class="leg-i" onclick="toggleCat('#f9ab00',this)"><div class="leg-d" style="background:#f9ab00"></div>Kazbegi</div>
<div class="leg-i" onclick="toggleCat('#ff7043',this)"><div class="leg-d" style="background:#ff7043"></div>Bonus</div>
<div class="leg-i" onclick="toggleCat('#e91e63',this)"><div class="leg-d" style="background:#e91e63"></div>Noclegi</div>
</div>
```

**Step 2: Add toggleCat() function**

Insert after `var accMarkers=[];` block (from Task 4), before the route variables:

```javascript
var hiddenCats={};
function toggleCat(color,el){
  if(hiddenCats[color]){
    delete hiddenCats[color];
    el.classList.remove("off");
    Object.keys(markers).forEach(function(id){
      var mk=markers[id];
      if(mk.d.color===color){
        if(color==="#f9ab00"&&cv!=="B") return;
        if(!mk.d.variantB || cv==="B") mk.m.addTo(map);
      }
    });
  }else{
    hiddenCats[color]=true;
    el.classList.add("off");
    Object.keys(markers).forEach(function(id){
      var mk=markers[id];
      if(mk.d.color===color) map.removeLayer(mk.m);
    });
  }
}
```

**Step 3: Verify** — click legend items, markers of that color should hide/show. Click again to restore. The legend item should go grey/strikethrough when off.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: interactive legend toggles marker categories on map"
```

---

## Task 6: Add Google Apps Script code for survey results

**Files:**
- Create: `docs/apps-script-code.js` (code for user to paste into Google Apps Script editor)

**Step 1: Write the Apps Script doGet function**

Create file `docs/apps-script-code.js`:

```javascript
/**
 * Google Apps Script — doGet() for Gruzja 2026 survey results.
 *
 * SETUP:
 * 1. Open the Google Form in edit mode
 * 2. Click "..." menu → Script editor
 * 3. Paste this code, replacing any existing content
 * 4. Click Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL — it's already in index.html
 *
 * After any code changes: Deploy → Manage deployments → Edit → New version → Deploy
 */

function doGet() {
  var form = FormApp.getActiveForm();
  var responses = form.getResponses();
  var items = form.getItems();

  var respondents = [];
  var questions = [];
  var comments = [];

  // Process each form item
  items.forEach(function(item, idx) {
    var title = item.getTitle();
    var type = item.getType();

    if (type == FormApp.ItemType.TEXT && idx === 0) {
      // First text field = name
      responses.forEach(function(resp) {
        var itemResp = resp.getResponseForItem(item);
        if (itemResp) respondents.push(itemResp.getResponse());
      });
    } else if (type == FormApp.ItemType.MULTIPLE_CHOICE) {
      var mcItem = item.asMultipleChoiceItem();
      var choices = mcItem.getChoices().map(function(c) { return c.getValue(); });
      var results = {};
      choices.forEach(function(c) { results[c] = 0; });

      responses.forEach(function(resp) {
        var itemResp = resp.getResponseForItem(item);
        if (itemResp) {
          var val = itemResp.getResponse();
          if (results.hasOwnProperty(val)) results[val]++;
          else results[val] = 1;
        }
      });

      questions.push({
        title: title,
        type: "choice",
        results: results
      });
    } else if (type == FormApp.ItemType.PARAGRAPH_TEXT || (type == FormApp.ItemType.TEXT && idx > 0)) {
      // Long text = comments
      responses.forEach(function(resp) {
        var itemResp = resp.getResponseForItem(item);
        if (itemResp && itemResp.getResponse().trim()) {
          comments.push(itemResp.getResponse().trim());
        }
      });
    }
  });

  var output = JSON.stringify({
    respondents: respondents,
    questions: questions,
    comments: comments,
    total: responses.length,
    updated: new Date().toISOString()
  });

  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}
```

**Step 2: Commit**

```bash
git add docs/apps-script-code.js
git commit -m "feat: add Google Apps Script doGet code for survey results API"
```

---

## Task 7: Add Ankieta tab with fetch and rendering

**Files:**
- Modify: `index.html` (add `renderAnkieta()` function and survey-specific rendering)

**Step 1: Add the SURVEY_URL constant and renderAnkieta() function**

Insert after `renderNoclegi()` function, before `mainTab()`:

```javascript
var SURVEY_URL="https://script.google.com/macros/s/AKfycbyrcISCJHYZ85TKXuaNWTV4TxG8TCt7J5veVm6OarNhLfUaNlMXU-51ZX7ehdrW46YU/exec";
var SURVEY_FORM="https://forms.gle/23WicBwzDSRhvPkH8";
var surveyColors=["#1a73e8","#ea4335","#34a853","#f9ab00","#9c27b0","#ff7043","#e91e63"];

function renderAnkieta(){
  var el=document.getElementById("ankietaPanel");
  el.innerHTML='<a class="survey-btn" href="'+SURVEY_FORM+'" target="_blank">📝 Wypełnij ankietę</a>'+
    '<div class="survey-loading">⏳ Ładowanie wyników ankiety...</div>';
  fetch(SURVEY_URL)
    .then(function(r){return r.json();})
    .then(function(data){
      var h='<a class="survey-btn" href="'+SURVEY_FORM+'" target="_blank">📝 Wypełnij ankietę</a>';
      // Respondents
      h+='<div class="survey-respondents">Odpowiedzi: <strong>'+data.total+'</strong> — '+data.respondents.join(", ")+'</div>';
      // Questions
      data.questions.forEach(function(q,qi){
        h+='<div class="survey-q"><h4>'+q.title+'</h4>';
        var total=0;
        Object.keys(q.results).forEach(function(k){total+=q.results[k];});
        Object.keys(q.results).forEach(function(k,ki){
          var count=q.results[k];
          var pct=total>0?Math.round(count/total*100):0;
          var color=surveyColors[ki%surveyColors.length];
          h+='<div class="survey-bar-wrap">';
          h+='<div class="survey-bar-label">'+k+'</div>';
          h+='<div class="survey-bar-track"><div class="survey-bar-fill" style="width:'+pct+'%;background:'+color+'"><span class="survey-bar-pct">'+(pct>8?pct+'%':'')+'</span></div></div>';
          h+='<div class="survey-bar-count">'+count+'</div>';
          h+='</div>';
        });
        h+='</div>';
      });
      // Comments
      if(data.comments&&data.comments.length){
        h+='<div class="survey-q"><h4>💬 Uwagi i pomysły</h4>';
        data.comments.forEach(function(c){
          h+='<div class="survey-comment">"'+c+'"</div>';
        });
        h+='</div>';
      }
      el.innerHTML=h;
    })
    .catch(function(err){
      el.innerHTML='<a class="survey-btn" href="'+SURVEY_FORM+'" target="_blank">📝 Wypełnij ankietę</a>'+
        '<div class="survey-error">❌ Nie udało się załadować wyników.<br>Sprawdź czy Apps Script jest wdrożony.<br><small>'+err.message+'</small></div>';
    });
}
```

**Step 2: Call renderAnkieta() at init**

Update the init calls:

```javascript
render();
renderBudget();
renderPacking();
renderNoclegi();
renderAnkieta();
```

**Step 3: Verify** — click "📋 Ankieta" tab. If Apps Script is deployed, survey results render as color bars. If not yet deployed, error message appears with the "Wypełnij ankietę" button still working.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Ankieta tab with survey results fetching and bar charts"
```

---

## Task 8: Final verification and cleanup commit

**Step 1: Test all features end-to-end**

Open `index.html` in browser and verify:

1. **Desktop:** All 5 tabs work (Plan, Noclegi, Budżet, Pakowanie, Ankieta)
2. **Mobile (Chrome DevTools):** Tabs scroll horizontally, all tabs accessible
3. **Noclegi tab:** Cards render with badges, links open in new tab
4. **Ankieta tab:** Button links to Google Forms, results load (or graceful error)
5. **Map markers:** Pink accommodation markers appear near cities
6. **Legend:** Click each legend item to toggle marker visibility, click again to restore
7. **Existing features:** Plan variants A/B, day selection, extras, budget, packing — all still work

**Step 2: Commit any remaining fixes**

```bash
git add index.html
git commit -m "fix: final adjustments after end-to-end testing"
```

---

## Post-Implementation: Deploy Apps Script

After the code is in `index.html`, the user needs to:

1. Open the Google Form in edit mode
2. Click "⋮" menu → **Script editor**
3. Paste the code from `docs/apps-script-code.js`
4. Click **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** — the URL should match the one already in `index.html`
6. Reload the page — survey results should now appear
