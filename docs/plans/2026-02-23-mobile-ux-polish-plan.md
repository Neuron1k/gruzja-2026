# Mobile UX Polish + Map Icons + Clustering — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish mobile UX (sheet snap, attraction swipe, accordion), add Material Icons for georgia.to markers, compress drawer, and add marker clustering.

**Architecture:** All changes are in 3 files (app.js, style.css, index.html). No new data files. Two new CDN dependencies: Material Symbols Outlined font and leaflet.markercluster plugin.

**Tech Stack:** Leaflet.js, leaflet.markercluster (CDN), Material Symbols Outlined (Google Fonts CDN), ES5 JavaScript.

**Design doc:** `docs/plans/2026-02-23-mobile-ux-polish-design.md`

---

### Task 1: Add CDN dependencies (Material Icons + markercluster)

**Files:**
- Modify: `index.html:7-9`

**Step 1: Add new link/script tags to `<head>`**

In `index.html`, after line 8 (`<link rel="stylesheet" href="src/style.css"/>`) and before line 9 (`<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>`), insert these 3 lines:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>
```

Then, after the leaflet.js script tag (currently line 9), add:

```html
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
```

**Step 2: Verify in browser**

Open index.html, open devtools console, type `L.markerClusterGroup`. Expected: function (not undefined).
Check Network tab: Material Symbols font loads.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Material Icons and markercluster CDN dependencies

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Compress drawer menu + stronger ATTR markers

**Files:**
- Modify: `src/style.css:111` (drawer-links button)
- Modify: `src/style.css:205` (mobile drawer-links override)
- Modify: `src/style.css:51` (.cm marker style)

**Step 1: Compress desktop drawer button padding**

In `src/style.css`, line 111, change:
```css
.drawer-links button{display:flex;align-items:center;gap:8px;width:100%;padding:14px 16px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:500;color:#3c4043;text-align:left;transition:background .12s}
```
to:
```css
.drawer-links button{display:flex;align-items:center;gap:8px;width:100%;padding:10px 16px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:500;color:#3c4043;text-align:left;transition:background .12s}
```

**Step 2: Compress mobile drawer button**

In `src/style.css`, line 205, change:
```css
  .drawer-links button{font-size:15px;padding:16px;min-height:52px}
```
to:
```css
  .drawer-links button{font-size:15px;padding:12px 16px;min-height:44px}
```

**Step 3: Strengthen ATTR marker style**

In `src/style.css`, line 51, change:
```css
.cm{border-radius:50%;border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);cursor:pointer;transition:transform .12s}
```
to:
```css
.cm{border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.5);cursor:pointer;transition:transform .12s}
```

**Step 4: Commit**

```bash
git add src/style.css
git commit -m "fix(ui): compress drawer menu padding and strengthen ATTR marker style

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Replace square markers with Material Icons + clustering

This is the biggest change. We replace `L.layerGroup()` with `L.markerClusterGroup()` and change marker icons from colored squares to Material Symbol icons.

**Files:**
- Modify: `src/app.js:77-168` (PLACES OVERLAY section)
- Modify: `src/style.css` (replace .pm styles, add .pm-icon and .pc cluster styles)

**Step 1: Update PLACE_CATS to include icon names**

In `src/app.js`, replace lines 78-86 (the `PLACE_CATS` object) with:

```javascript
var PLACE_CATS={
  "Natura":       {color:"#2e7d32", icon:"park", keys:["Natura i Przygoda","Krajobrazy Naturalne","Spa i Wellness"]},
  "Kultura":      {color:"#5c6bc0", icon:"account_balance", keys:["Kultura i Sztuka","Kulturalny i Artystyczny","Historia","Miejsca historyczne","Miejsca historyczne i archeologiczne"]},
  "Religia":      {color:"#8d6e63", icon:"church", keys:["Religia","Miejsca religijne"]},
  "Kuchnia":      {color:"#ff8f00", icon:"restaurant", keys:["Kuchnia"]},
  "Rozrywka":     {color:"#ec407a", icon:"attractions", keys:["Rozrywka","Rekreacja i rozrywka","Rodzina"]},
  "Architektura": {color:"#78909c", icon:"apartment", keys:["Struktury Architektoniczne","Atrakcje miejskie"]},
  "Inne":         {color:"#bdbdbd", icon:"place", keys:[]}
};
```

**Step 2: Replace `L.layerGroup()` with `L.markerClusterGroup()`**

In `src/app.js`, replace line 104:
```javascript
var placesLayer=L.layerGroup();
```
with:
```javascript
var placesLayer=L.markerClusterGroup({
  maxClusterRadius:40,
  spiderfyOnMaxZoom:true,
  showCoverageOnHover:false,
  iconCreateFunction:function(cluster){
    var count=cluster.getChildCount();
    var sz=count<10?'small':count<50?'medium':'large';
    return L.divIcon({html:'<div class="pc pc-'+sz+'">'+count+'</div>',className:'',iconSize:[30,30]});
  }
});
```

**Step 3: Update `buildPlacesMarkers` to use Material Icons**

In `src/app.js`, replace lines 110-128 (the `buildPlacesMarkers` function) with:

```javascript
function buildPlacesMarkers(){
  if(placesBuilt) return;
  PLACES.forEach(function(p){
    var cat=getPlaceCategory(p);
    var info=PLACE_CATS[cat];
    var icon=L.divIcon({
      html:'<span class="pm-icon material-symbols-outlined" style="color:'+info.color+'">'+info.icon+'</span>',
      iconSize:[20,20],iconAnchor:[10,10],className:""
    });
    var pop='<b>'+p.name_pl+'</b>';
    pop+='<div style="font-size:10px;color:#5f6368;margin:2px 0">'+p.region+' · '+cat+'</div>';
    if(p.tags&&p.tags.length) pop+='<div style="font-size:9px;color:#9aa0a6">'+p.tags.join(", ")+'</div>';
    pop+='<a class="pop-link pop-link-gt" href="https://georgia.to'+p.url+'" target="_blank">&#127468;&#127466; Wiecej na georgia.to →</a>';
    var m=L.marker([p.lat,p.lng],{icon:icon});
    m.bindPopup(pop,{maxWidth:240});
    placesLayer.addLayer(m);
    placesMarkers.push({m:m,cat:cat,color:info.color});
  });
  placesBuilt=true;
}
```

**Step 4: Update CSS — replace .pm with .pm-icon, add cluster styles**

In `src/style.css`, replace lines 261-264:
```css
/* === PLACES OVERLAY === */
.pm{width:10px;height:10px;border-radius:2px;border:1.5px solid rgba(255,255,255,.9);box-shadow:0 1px 3px rgba(0,0,0,.3);cursor:pointer;transition:transform .12s}
.pm:hover{transform:scale(1.4)}
.pm-dim{opacity:.3!important}
```
with:
```css
/* === PLACES OVERLAY === */
.pm-icon{font-size:18px;cursor:pointer;transition:transform .12s;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4));line-height:1}
.pm-icon:hover{transform:scale(1.3)}
.pc{border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3)}
.pc-small{width:26px;height:26px;background:#78909c}
.pc-medium{width:32px;height:32px;background:#5c6bc0}
.pc-large{width:38px;height:38px;background:#1a73e8}
```

**Step 5: Update legend icons (desktop + mobile) to show Material Icons**

In `index.html`, update the places-cats section (lines 64-72). Replace each `<div class="leg-d leg-d-sq" style="background:COLOR"></div>` with `<span class="material-symbols-outlined" style="color:COLOR;font-size:14px">ICON</span>`:

```html
<div class="places-cats" style="display:none">
<div class="leg-i" onclick="togglePlaceCat('Natura',this)"><span class="material-symbols-outlined" style="color:#2e7d32;font-size:14px">park</span>Natura</div>
<div class="leg-i" onclick="togglePlaceCat('Kultura',this)"><span class="material-symbols-outlined" style="color:#5c6bc0;font-size:14px">account_balance</span>Kultura</div>
<div class="leg-i" onclick="togglePlaceCat('Religia',this)"><span class="material-symbols-outlined" style="color:#8d6e63;font-size:14px">church</span>Religia</div>
<div class="leg-i" onclick="togglePlaceCat('Kuchnia',this)"><span class="material-symbols-outlined" style="color:#ff8f00;font-size:14px">restaurant</span>Kuchnia</div>
<div class="leg-i" onclick="togglePlaceCat('Rozrywka',this)"><span class="material-symbols-outlined" style="color:#ec407a;font-size:14px">attractions</span>Rozrywka</div>
<div class="leg-i" onclick="togglePlaceCat('Architektura',this)"><span class="material-symbols-outlined" style="color:#78909c;font-size:14px">apartment</span>Architektura</div>
<div class="leg-i" onclick="togglePlaceCat('Inne',this)"><span class="material-symbols-outlined" style="color:#bdbdbd;font-size:14px">place</span>Inne</div>
</div>
```

**Step 6: Update `toggleMapFilters` mobile icons to match**

In `src/app.js`, in the `toggleMapFilters` function (line 621-626), replace the pcats forEach block. Change:
```javascript
      h+='<div class="leg-i'+off+'" onclick="togglePlaceCat(\''+c[0]+'\',this)"><div class="leg-d leg-d-sq" style="background:'+c[1]+'"></div>'+c[0]+'</div>';
```
to:
```javascript
      var icon=PLACE_CATS[c[0]].icon;
      h+='<div class="leg-i'+off+'" onclick="togglePlaceCat(\''+c[0]+'\',this)"><span class="material-symbols-outlined" style="color:'+c[1]+';font-size:14px">'+icon+'</span>'+c[0]+'</div>';
```

**Step 7: Make georgia.to ON by default + filters expanded**

In `src/app.js`, at the end of the INIT section (after line 900), add:
```javascript
buildPlacesMarkers();
placesLayer.addTo(map);
placesVisible=true;
var ptBtn=document.getElementById('placesToggle');
if(ptBtn) ptBtn.classList.add('on');
```

In `index.html` line 64, remove `style="display:none"` from `.places-cats`:
```html
<div class="places-cats">
```

**Step 8: Verify in browser**

1. Open app — georgia.to markers should be Material Icons (church, park, etc.) with clustering
2. Zoom out — see cluster circles with numbers
3. Click cluster — zooms in
4. Category filters visible, clicking hides/shows
5. Toggle georgia.to OFF — all markers + clusters disappear

**Step 9: Commit**

```bash
git add src/app.js src/style.css index.html
git commit -m "feat: Material Icons for georgia.to markers + marker clustering

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Preserve sheet snap on day change

**Files:**
- Modify: `src/app.js:306`

**Step 1: Change snap logic in `sel()`**

In `src/app.js`, line 306, change:
```javascript
    setSheetSnap(ad!==null?SNAP_PEEK:SNAP_MIN);
```
to:
```javascript
    setSheetSnap(ad!==null?Math.max(sheetSnap,SNAP_PEEK):SNAP_MIN);
```

**Step 2: Verify on mobile**

1. Open app at <=768px width
2. Select day 1 — sheet at PEEK (35%)
3. Drag sheet up to HALF (60%)
4. Tap day 2 in bottom bar — sheet should STAY at 60%, not snap to 35%
5. Deselect day (tap same day again) — sheet goes to MIN

**Step 3: Commit**

```bash
git add src/app.js
git commit -m "fix(mobile): preserve bottom sheet snap position on day change

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Accordion for Program/Food/Tips on mobile

**Files:**
- Modify: `src/app.js:229-242` (mobile render path)
- Modify: `src/style.css` (append accordion styles)

**Step 1: Wrap mobile sections in `<details>` tags**

In `src/app.js`, in the mobile render path, replace lines 230-242:

```javascript
    sh+='<div class="ds prog"><h4>&#128205; Program</h4>'+renderProgram(d.program)+'</div>';
    sh+='<div class="ds food"><h4>&#127869; Jedzenie</h4>';
    d.food.forEach(function(f){
      sh+='<div class="food-item"><span class="food-name">'+f[0]+'</span>';
      if(f[1]) sh+=' <span class="food-stars">&#11088; '+f[1]+'</span>';
      if(f[2]) sh+=' <span style="color:#5f6368">'+f[2]+'</span>';
      if(f[3]) sh+=' <a href="'+f[3]+'" target="_blank">Maps</a>';
      sh+="</div>";
    });
    sh+="</div>";
    sh+='<div class="ds tip"><h4>&#128161; Tips</h4><ul>';
    d.tips.forEach(function(t){sh+="<li>"+t+"</li>";});
    sh+="</ul></div>";
```

with:

```javascript
    sh+='<details class="ds prog" open onclick="event.stopPropagation()"><summary><h4>&#128205; Program</h4></summary>'+renderProgram(d.program)+'</details>';
    sh+='<details class="ds food" onclick="event.stopPropagation()"><summary><h4>&#127869; Jedzenie</h4></summary>';
    d.food.forEach(function(f){
      sh+='<div class="food-item"><span class="food-name">'+f[0]+'</span>';
      if(f[1]) sh+=' <span class="food-stars">&#11088; '+f[1]+'</span>';
      if(f[2]) sh+=' <span style="color:#5f6368">'+f[2]+'</span>';
      if(f[3]) sh+=' <a href="'+f[3]+'" target="_blank">Maps</a>';
      sh+="</div>";
    });
    sh+="</details>";
    sh+='<details class="ds tip" onclick="event.stopPropagation()"><summary><h4>&#128161; Tips</h4></summary><ul>';
    d.tips.forEach(function(t){sh+="<li>"+t+"</li>";});
    sh+="</ul></details>";
```

**Step 2: Add accordion CSS**

Append to end of `src/style.css`:

```css
/* === ACCORDION (mobile) === */
.bs-content details.ds{cursor:default}
.bs-content details.ds summary{cursor:pointer;list-style:none;user-select:none;display:flex;align-items:center;gap:4px}
.bs-content details.ds summary::-webkit-details-marker{display:none}
.bs-content details.ds summary::after{content:"▸";font-size:10px;color:#9aa0a6;margin-left:auto}
.bs-content details.ds[open] summary::after{content:"▾"}
.bs-content details.ds summary h4{margin:0}
```

**Step 3: Verify on mobile**

1. Open app at <=768px, select a day, drag sheet to FULL
2. Program section should be open (has `open` attribute)
3. Jedzenie and Tips sections should be collapsed (just headers visible)
4. Tap "Jedzenie" header — section expands
5. Desktop should remain unchanged (no `<details>` in desktop path)

**Step 4: Commit**

```bash
git add src/app.js src/style.css
git commit -m "feat(mobile): accordion sections for Program/Food/Tips in bottom sheet

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Swipe through day attractions at SNAP_PEEK

**Files:**
- Modify: `src/app.js:175` (add `currentPointIdx` global)
- Modify: `src/app.js:300-320` (add reset in `sel()`)
- Modify: `src/app.js:828-849` (swipe handler IIFE)
- Modify: `src/app.js:212-258` (add indicator in mobile render)
- Modify: `src/style.css` (append indicator styles)

**Step 1: Add global variable**

In `src/app.js`, after line 175 (`var ad=null;`), add:
```javascript
var currentPointIdx=null;
```

**Step 2: Reset in `sel()`**

In `src/app.js`, in the `sel` function, after the line `ad=ad===i?null:i;` (line 301), add:
```javascript
  currentPointIdx=ad!==null?0:null;
```

**Step 3: Add attraction indicator to mobile render**

In `src/app.js`, in the mobile render path, after the line that renders `.dr` (line 227: `sh+='<div class="dr">...`), add:

```javascript
    if(d.points&&d.points.length>1) sh+='<div class="attr-indicator" id="attrIndicator">← Atrakcja 1/'+d.points.length+' →</div>';
```

**Step 4: Modify swipe handler**

In `src/app.js`, replace the entire swipe IIFE (lines 828-849) with:

```javascript
// === SWIPE ===
(function(){
  var startX=0,startY=0;
  document.addEventListener('touchstart',function(e){
    var target=window.innerWidth<=768?document.getElementById('bsContent'):document.getElementById('daysList');
    if(!target||!target.contains(e.target)) return;
    startX=e.touches[0].clientX;
    startY=e.touches[0].clientY;
  },{passive:true});
  document.addEventListener('touchend',function(e){
    var target=window.innerWidth<=768?document.getElementById('bsContent'):document.getElementById('daysList');
    if(!target||!target.contains(e.target)) return;
    var endX=e.changedTouches[0].clientX;
    var endY=e.changedTouches[0].clientY;
    var dx=endX-startX;
    var dy=endY-startY;
    if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5){
      // Mobile at SNAP_PEEK with a day selected: swipe through attractions
      if(window.innerWidth<=768 && sheetSnap<=SNAP_PEEK && ad!==null){
        var days=getDays(),pts=days[ad].points;
        if(pts&&pts.length>0){
          if(currentPointIdx===null) currentPointIdx=0;
          if(dx<0 && currentPointIdx<pts.length-1) currentPointIdx++;
          else if(dx>0 && currentPointIdx>0) currentPointIdx--;
          flyTo(pts[currentPointIdx]);
          var ind=document.getElementById('attrIndicator');
          if(ind) ind.textContent='← Atrakcja '+(currentPointIdx+1)+'/'+pts.length+' →';
        }
        return;
      }
      // Default: swipe through days
      var days=getDays();
      if(dx<0 && ad!==null && ad<days.length-1) sel(ad+1);
      else if(dx>0 && ad!==null && ad>0) sel(ad-1);
    }
  },{passive:true});
})();
```

**Step 5: Add indicator CSS**

Append to end of `src/style.css`:

```css
.attr-indicator{text-align:center;font-size:10px;color:#9aa0a6;padding:4px 0;letter-spacing:.3px}
```

**Step 6: Verify on mobile**

1. Open app at <=768px, select day 1
2. Sheet is at PEEK — swipe left on the sheet content
3. Map should fly to 2nd attraction of the day, indicator updates "← Atrakcja 2/3 →"
4. Swipe left again — 3rd attraction
5. Swipe right — back to 2nd
6. Drag sheet up to HALF or FULL — swipe should change DAYS (not attractions)
7. Select a different day — index resets to 1

**Step 7: Commit**

```bash
git add src/app.js src/style.css
git commit -m "feat(mobile): swipe through day attractions at SNAP_PEEK

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: Final verification

**Step 1: Desktop full test**
1. Open app at desktop width
2. Verify georgia.to markers show as Material Icons with clustering
3. Zoom out — clusters show numbers
4. Click cluster — zooms in
5. Category filters work (toggle hides/shows markers)
6. Toggle georgia.to OFF — all gone
7. ATTR markers are clearly visible (stronger shadow/border)
8. Day selection works independently

**Step 2: Mobile full test**
1. Open at <=768px
2. Hamburger menu: items are more compact
3. Select day → sheet at PEEK, swipe through attractions
4. Drag sheet to FULL → accordion sections visible
5. Program open, Food/Tips collapsed — tap to open
6. Change day — sheet stays at current height
7. Filter button → georgia.to toggle + Material Icon filters

**Step 3: Commit if any fixes needed**

```bash
git add -A
git commit -m "fix: polish and verify mobile UX changes

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
