# Usability Quick Wins Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve mobile usability of the Georgia 2026 trip planner with 4 quick wins: working packing checkboxes, bigger mobile fonts, sticky day nav, and bidirectional map-list navigation.

**Architecture:** All changes in 2 files (`src/app.js`, `src/style.css`) plus minor HTML in `index.html`. No new dependencies. State persistence via `localStorage`. Plain JS with Leaflet.

**Tech Stack:** Vanilla JS, Leaflet.js, CSS, localStorage

---

### Task 1: Interactive packing checkboxes with localStorage

**Files:**
- Modify: `src/app.js:213-255` (replace `renderPacking()`)
- Modify: `src/style.css:76-81` (update `.pack-item` styles, add `.pack-item.checked`, `.pack-progress`)

**Step 1: Add packing CSS styles**

Append after line 81 in `src/style.css` (after `.budget-inner .pack-item.important::before`):

```css
.budget-inner .pack-item.checked{color:#9aa0a6;text-decoration:line-through}
.budget-inner .pack-item.checked::before{content:"\2611";color:#34a853}
.budget-inner .pack-item.checked.important::before{content:"\2611";color:#34a853}
.pack-progress{padding:8px 0 4px;font-size:11px;color:#5f6368}
.pack-progress-bar{height:6px;background:#f1f3f4;border-radius:3px;margin-top:4px;overflow:hidden}
.pack-progress-fill{height:100%;background:#34a853;border-radius:3px;transition:width .3s}
.pack-reset{display:block;margin:12px 0 0;padding:8px;border:1px solid #dadce0;border-radius:8px;background:#fff;cursor:pointer;font-size:11px;color:#ea4335;text-align:center;width:100%}
.pack-reset:hover{background:#fce8e6}
```

**Step 2: Rewrite `renderPacking()` in `src/app.js`**

Replace lines 213-255 with:

```js
// === PAKOWANIE ===
var PACK_ITEMS=[
  {cat:"\ud83d\udc55 Ubrania",items:null},
  {text:"Kurtka przeciwdeszczowa (kwiecie\u0144 = kapry\u015bny!)",imp:true},
  {text:"Polar / bluza na wieczory (g\u00f3ry ch\u0142odne)"},
  {text:"Wygodne buty do chodzenia (du\u017co bruku!)"},
  {text:"Sanda\u0142y / klapki (\u0142a\u017anie siarkowe)"},
  {text:"Koszulki, spodnie na ~20\u00b0C dzie\u0144 / ~8\u00b0C noc"},
  {text:"Czapka z daszkiem / okulary"},
  {cat:"\ud83d\udc76 Dla ch\u0142opc\u00f3w (3 i 5 lat)"},
  {text:"Przek\u0105ski na drog\u0119 (du\u017co!)"},
  {text:"Lekki w\u00f3zek spacerowy (opcja)"},
  {text:"Bluzy zapasowe (khinkali = ba\u0142agan)"},
  {cat:"\ud83d\udcc4 Dokumenty"},
  {text:"Paszport (min. 6 mies. wa\u017cno\u015bci!)",imp:true},
  {text:"Revolut / karta wielowalutowa (GEL!)",imp:true},
  {text:"Ubezpieczenie podr\u00f3\u017cne + EKUZ"},
  {text:"Wydruk rezerwacji (hotel, auto, loty)"},
  {text:"Prawo jazdy (kat. B wystarczy)"},
  {cat:"\ud83d\udc8a Apteczka"},
  {text:"Ibuprofen / paracetamol"},
  {text:"Leki na biegunk\u0119 (zmiana kuchni!)"},
  {text:"Plastry, \u015brodek odka\u017caj\u0105cy"},
  {text:"Krem z filtrem SPF30+"},
  {text:"\u015arodek na komary (wieczory nad rzek\u0105)"},
  {cat:"\ud83d\ude97 W aucie"},
  {text:"Foteliki \u2014 NA MIEJSCU (CheckInKutaisi: gratis!)"},
  {text:"Nawigacja offline (Maps.me lub Google Maps)"},
  {text:"\u0141adowarka USB / powerbank"},
  {text:"Woda, chusteczki mokre"},
  {cat:"\ud83d\udcf1 Technika"},
  {text:"SIM / eSIM (Magti/Geocell na lotnisku, ~\u20ac5)"},
  {text:"Powerbank"}
];

function getPackState(){
  try{return JSON.parse(localStorage.getItem("gruzja-packing"))||{};}catch(e){return {};}
}
function savePackState(s){
  try{localStorage.setItem("gruzja-packing",JSON.stringify(s));}catch(e){}
}
function togglePack(idx){
  var s=getPackState();
  if(s[idx]) delete s[idx]; else s[idx]=true;
  savePackState(s);
  renderPacking();
}
function resetPacking(){
  try{localStorage.removeItem("gruzja-packing");}catch(e){}
  renderPacking();
}

function renderPacking(){
  var el=document.getElementById("packingPanel");
  var state=getPackState();
  var total=0,checked=0;
  PACK_ITEMS.forEach(function(p,i){
    if(p.text){total++;if(state[i])checked++;}
  });
  var pct=total>0?Math.round(checked/total*100):0;
  var h='<div class="pack-progress">Spakowano: <strong>'+checked+'/'+total+'</strong>';
  h+='<div class="pack-progress-bar"><div class="pack-progress-fill" style="width:'+pct+'%"></div></div></div>';
  PACK_ITEMS.forEach(function(p,i){
    if(p.cat){
      h+='<div class="pack-cat">'+p.cat+'</div>';
    }else{
      var cls='pack-item'+(p.imp?' important':'')+(state[i]?' checked':'');
      h+='<div class="'+cls+'" onclick="togglePack('+i+')">'+p.text+'</div>';
    }
  });
  h+='<div class="note" style="margin-top:12px">\ud83d\udd0c Adapter gniazdka NIE jest potrzebny \u2014 Gruzja ma takie same gniazdka jak Polska (typ C/F).</div>';
  h+='<button class="pack-reset" onclick="resetPacking()">\u21bb Resetuj pakowanie</button>';
  el.innerHTML=h;
}
```

**Step 3: Verify manually**

Open `index.html` in browser, go to Pakowanie tab:
- Expected: Progress bar "Spakowano: 0/21" at top
- Click an item → checkbox turns green ☑, text gets strikethrough, counter updates
- Refresh page → checked items persist
- Click "Resetuj" → all unchecked, counter resets to 0/21

**Step 4: Commit**

```bash
git add src/app.js src/style.css
git commit -m "feat: add interactive packing checkboxes with localStorage"
```

---

### Task 2: Bigger fonts and touch targets on mobile

**Files:**
- Modify: `src/style.css:94-102` (expand `@media(max-width:768px)` block)

**Step 1: Add mobile font overrides**

Replace the `@media(max-width:768px)` block (lines 94-102) with:

```css
@media(max-width:768px){
  .mobile-nav{display:flex;height:50px}
  .mobile-nav button{font-size:14px}
  body{flex-direction:column;overflow:hidden;height:100vh}
  .panel{width:100%!important;min-width:0!important;height:calc(100vh - 50px);margin-top:50px;border-right:none}
  #map{height:calc(100vh - 50px);margin-top:50px;width:100%}
  body.m-map .panel{display:none}
  body.m-list #map{display:none}
  body.m-map .map-filter-btn{display:flex}
  .dc{padding:14px 16px}
  .dd{font-size:13px}
  .dt{font-size:12px}
  .dr{font-size:11px}
  .ds{font-size:12px;padding:9px 11px}
  .ds h4{font-size:12px}
  .ds li{margin-bottom:3px;min-height:32px;display:flex;align-items:center}
  .ds a{font-size:12px}
  .food-item{min-height:36px;display:flex;align-items:center;flex-wrap:wrap;gap:4px}
  .prog-link{min-height:40px;display:flex;align-items:center}
  .main-tabs button{padding:14px 10px;font-size:13px}
  .tab-pane .budget-inner{font-size:12px}
  .budget-inner h4{font-size:12px}
  .budget-inner .pack-item{min-height:40px;display:flex;align-items:center;font-size:12px}
  .budget-inner .pack-cat{font-size:12px}
  .budget-inner .brow{padding:6px 0;font-size:12px}
  .budget-inner .note{font-size:11px}
  .budget-inner td{font-size:12px;padding:6px 8px}
  .budget-inner th{font-size:11px;padding:6px 8px}
  .leaflet-popup-content{font-size:14px}
  .pop-badge{font-size:10px}
  .pop-link{font-size:13px;min-height:40px;display:flex;align-items:center}
  .extra-toggle button{font-size:13px;padding:12px}
  .ex{padding:12px 14px;font-size:12px}
  .leg{padding:10px 14px;font-size:12px;gap:12px}
  .leg-i{gap:5px;min-height:36px}
  .leg-d{width:10px;height:10px}
  .acc-name{font-size:13px}
  .acc-detail{font-size:11px}
  .acc-price{font-size:12px}
  .acc-links a{font-size:12px;min-height:40px;display:inline-flex;align-items:center}
}
```

**Step 2: Verify manually**

Open in mobile simulator (Chrome DevTools → responsive mode, iPhone SE or similar):
- Expected: All text noticeably larger
- Tap targets comfortable (no accidental taps on wrong items)
- Desktop layout unchanged

**Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: increase fonts and touch targets on mobile"
```

---

### Task 3: Sticky day navigation bar

**Files:**
- Modify: `src/app.js:68-107` (add day-nav HTML inside `render()`)
- Modify: `src/style.css` (add `.day-nav` styles before `@media` block)

**Step 1: Add day-nav CSS**

Insert before the `@media(max-width:768px)` block in `src/style.css`:

```css
.day-nav{display:flex;gap:4px;padding:8px 14px;border-bottom:1px solid #e0e0e0;background:#fff;position:sticky;top:0;z-index:10;flex-shrink:0}
.day-nav button{width:32px;height:32px;border-radius:50%;border:2px solid #dadce0;background:#fff;cursor:pointer;font-size:12px;font-weight:700;color:#5f6368;transition:all .15s;flex-shrink:0;padding:0}
.day-nav button:hover{background:#f1f3f4}
.day-nav button.dn-on{background:#1a73e8;color:#fff;border-color:#1a73e8}
.day-nav button.dn-easter{border-color:#ea4335}
.day-nav button.dn-easter.dn-on{background:#ea4335;border-color:#ea4335}
```

And inside the `@media(max-width:768px)` block, add:

```css
  .day-nav{gap:6px;padding:8px 12px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
  .day-nav::-webkit-scrollbar{display:none}
  .day-nav button{width:36px;height:36px;font-size:13px}
```

**Step 2: Add day-nav HTML generation in `render()`**

Modify `render()` in `src/app.js`. After `var days=getDays(),h="";` on line 69, insert the day-nav bar generation:

```js
  h+='<div class="day-nav">';
  days.forEach(function(d,i){
    var cls='dn-btn'+(ad===i?' dn-on':'')+(d.easter?' dn-easter':'');
    h+='<button class="'+cls+'" onclick="event.stopPropagation();sel('+i+')">'+d.num+'</button>';
  });
  h+='</div>';
```

**Important:** The `.day-nav` needs to be inside `#daysList` (which is inside `.scroll`). The `position:sticky;top:0` will keep it stuck at the top of the scroll container.

**Step 3: Auto-scroll day-nav on selection**

Add to `sel()` function in `src/app.js`, right after `render();` on line 111, add:

```js
  if(ad!==null){
    var navBtn=document.querySelector('.day-nav .dn-on');
    if(navBtn)navBtn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }
```

Note: This goes inside the existing `sel()` function, before the existing `if(ad!==null)` block — so actually merge it into the existing block. The final `sel()` should look like:

```js
function sel(i){
  ad=ad===i?null:i;
  render();
  if(ad!==null){
    var navBtn=document.querySelector('.day-nav .dn-on');
    if(navBtn)navBtn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    var days=getDays(),d=days[ad],bounds=[];
    d.points.forEach(function(pid){if(markers[pid])bounds.push(markers[pid].m.getLatLng());});
    if(bounds.length>1)map.fitBounds(bounds,{padding:[50,50],maxZoom:11});
    else if(bounds.length===1)map.setView(bounds[0],11);
    setTimeout(function(){highlightDayMarkers(d.points);},100);
  }else{
    highlightDayMarkers(null);
  }
}
```

**Step 4: Verify manually**

- Expected: Row of numbered circles 1-8 at top of Plan tab
- Click "5" → day 5 expands, button 5 highlighted blue, map zooms
- Day 4 (easter) has red accent border
- Scroll down through day details → nav bar stays stuck at top
- On mobile: nav bar horizontally scrollable if needed

**Step 5: Commit**

```bash
git add src/app.js src/style.css
git commit -m "feat: add sticky day navigation bar"
```

---

### Task 4: Bidirectional map ↔ list navigation

This task has 3 sub-parts: (a) auto-return button, (b) "show on map" CTA per day, (c) popup day link.

**Files:**
- Modify: `src/app.js:1-19` (add `attrToDays` lookup after ATTR marker init)
- Modify: `src/app.js:68-107` (add CTA in `render()`)
- Modify: `src/app.js:141-149` (update `flyTo()`)
- Modify: `src/style.css` (add `.map-back-btn`, `.day-map-cta`, `.pop-day-link` styles)
- Modify: `index.html:54-56` (add back button element)

**Step 1: Add CSS styles**

Append to `src/style.css` (before the `@media` block):

```css
.map-back-btn{display:none;position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:1600;padding:10px 20px;background:#fff;border:2px solid #1a73e8;border-radius:24px;box-shadow:0 2px 12px rgba(0,0,0,.25);cursor:pointer;font-size:13px;font-weight:600;color:#1a73e8;white-space:nowrap;transition:all .2s}
.map-back-btn:hover{background:#e8f0fe}
.map-back-btn.show{display:block}
.day-map-cta{margin-top:6px;padding:8px;background:#e8f0fe;border-radius:6px;text-align:center;cursor:pointer;font-size:11px;font-weight:600;color:#1a73e8;transition:background .12s}
.day-map-cta:hover{background:#d2e3fc}
.pop-day-link{display:inline-block;margin-top:4px;padding:3px 8px;background:#e8f0fe;border-radius:10px;color:#1a73e8;text-decoration:none;font-size:10px;font-weight:600;cursor:pointer}
.pop-day-link:hover{background:#d2e3fc}
```

Inside the `@media(max-width:768px)` block, add:

```css
  .day-map-cta{font-size:13px;padding:12px;min-height:44px;display:flex;align-items:center;justify-content:center}
  .pop-day-link{font-size:12px;padding:5px 10px;min-height:36px;display:inline-flex;align-items:center}
```

**Step 2: Add back button to `index.html`**

In `index.html`, after line 56 (`<div class="map-filter-overlay"...>`), add:

```html
<button class="map-back-btn" id="mapBackBtn" onclick="mobileView('list');hideBackBtn()">&larr; Wroc do listy</button>
```

**Step 3: Build `attrToDays` lookup map**

In `src/app.js`, after line 59 (the route polylines), add:

```js
// === ATTRACTION → DAY LOOKUP ===
var attrToDays={};
DAYS_A.forEach(function(d,i){
  d.points.forEach(function(pid){
    if(!attrToDays[pid]) attrToDays[pid]=[];
    attrToDays[pid].push(i);
  });
});
```

**Step 4: Update marker popups to include day links**

Modify the ATTR marker loop (lines 9-19 in `src/app.js`). After line 14 (`if(a.georgiaTo)...`), before `var m=L.marker(...)`, add:

```js
  if(attrToDays[a.id]){
    attrToDays[a.id].forEach(function(di){
      pop+='<br><span class="pop-day-link" onclick="goToDay('+di+')">\ud83d\udcc5 Dzie\u0144 '+(di+1)+'</span>';
    });
  }
```

Note: `attrToDays` must be built BEFORE the ATTR marker loop. Since the route lines are after markers currently, we need to move the `attrToDays` computation before the ATTR loop — OR we can build it at the top of the file right after `DAYS_A` is loaded (it's available as a global). So place the `attrToDays` block at line 8, right before `ATTR.forEach(...)`.

Revised placement:

```js
// Line 8 (before ATTR.forEach):
var attrToDays={};
DAYS_A.forEach(function(d,i){
  d.points.forEach(function(pid){
    if(!attrToDays[pid]) attrToDays[pid]=[];
    attrToDays[pid].push(i);
  });
});
```

**Step 5: Add `goToDay()` function**

In `src/app.js`, after `flyTo()` (after line 149), add:

```js
function goToDay(i){
  if(window.innerWidth<=768) mobileView('list');
  ad=i;
  render();
  var card=document.querySelectorAll('.dc')[i];
  if(card) card.scrollIntoView({behavior:'smooth',block:'start'});
}
```

**Step 6: Update `flyTo()` to show back button on mobile**

Replace `flyTo()` (lines 141-149) with:

```js
var backBtnTimer=null;
function showBackBtn(){
  var btn=document.getElementById('mapBackBtn');
  if(btn){btn.classList.add('show');clearTimeout(backBtnTimer);backBtnTimer=setTimeout(hideBackBtn,5000);}
}
function hideBackBtn(){
  var btn=document.getElementById('mapBackBtn');
  if(btn)btn.classList.remove('show');
  clearTimeout(backBtnTimer);
}

function flyTo(id){
  if(markers[id]){
    var m=markers[id].m;
    if(!map.hasLayer(m))m.addTo(map);
    if(window.innerWidth<=768){mobileView('map');showBackBtn();}
    map.setView(m.getLatLng(),12);
    setTimeout(function(){m.openPopup();},200);
  }
}
```

**Step 7: Add "Show on map" CTA in `render()`**

In `render()` in `src/app.js`, after the tips section (after `h+="</ul></div>";` for tips), and before the nocleg section, add:

```js
    h+='<div class="day-map-cta" onclick="event.stopPropagation();showDayOnMap('+i+')">\ud83d\uddfa\ufe0f Pokaz wszystkie punkty na mapie</div>';
```

**Step 8: Add `showDayOnMap()` function**

In `src/app.js`, after `goToDay()`, add:

```js
function showDayOnMap(i){
  var days=getDays(),d=days[i],bounds=[];
  d.points.forEach(function(pid){if(markers[pid])bounds.push(markers[pid].m.getLatLng());});
  if(window.innerWidth<=768){mobileView('map');showBackBtn();}
  if(bounds.length>1)map.fitBounds(bounds,{padding:[50,50],maxZoom:12});
  else if(bounds.length===1)map.setView(bounds[0],12);
  highlightDayMarkers(d.points);
}
```

**Step 9: Verify manually**

Test on mobile (Chrome DevTools responsive mode):

a) Auto-return:
- In Plan tab, click a `prog-link` item (e.g., "Katedra Bagrati") → switches to map
- Expected: Floating "← Wróć do listy" button appears at bottom center
- Click it → returns to list view. Button disappears.
- Wait 5s without clicking → button fades away automatically

b) Day CTA:
- Expand day 1 → scroll to bottom of day details
- Expected: Blue "🗺️ Pokaż wszystkie punkty na mapie" button
- Click → switches to map, fits bounds to day 1 markers, highlights them

c) Popup → Day:
- On map, click a marker (e.g., Kutaisi)
- Expected: Popup shows "📅 Dzień 1", "📅 Dzień 2", etc. (one per day it appears in)
- Click "📅 Dzień 1" → switches to list, day 1 expanded and scrolled into view

**Step 10: Commit**

```bash
git add src/app.js src/style.css index.html
git commit -m "feat: add bidirectional map-list navigation"
```

---

### Task 5: Final verification and cleanup

**Step 1: Full manual test pass**

Open `index.html` in browser and verify:

1. Desktop:
   - Day nav bar visible, clickable, highlights active day
   - Packing checkboxes work, persist on refresh
   - Map popups show "📅 Dzień X" links
   - All existing functionality still works (tabs, extras, budget, survey)

2. Mobile (Chrome DevTools → iPhone SE):
   - Fonts noticeably larger, comfortable to tap
   - Day nav scrollable horizontally
   - Packing progress bar + checkboxes work
   - flyTo shows back button, auto-disappears
   - "Pokaż na mapie" CTA works per day
   - Popup day links switch back to list

**Step 2: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: usability quick wins - complete"
```
