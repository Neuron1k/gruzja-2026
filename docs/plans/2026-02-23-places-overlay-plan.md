# Georgia.to Places Map Overlay — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a toggleable map overlay showing 225 scraped georgia.to places with color-coded square markers and category filters in the legend.

**Architecture:** Convert `georgia_to_places.json` to a `var PLACES` JS global. Build markers lazily into a Leaflet `LayerGroup` on first toggle. Filter by 7 tag-based categories via legend UI (desktop) and mobile filter overlay.

**Tech Stack:** Leaflet.js (L.divIcon, L.layerGroup), plain JS globals, no build step.

**Design doc:** `docs/plans/2026-02-23-places-overlay-design.md`

---

### Task 1: Convert JSON to JS data file

**Files:**
- Read: `src/data/georgia_to_places.json`
- Create: `src/data/georgia_to_places.js`

**Step 1: Create the JS file from JSON**

Run this Python script to convert:

```bash
python3 -c "
import json
with open('src/data/georgia_to_places.json') as f:
    data = json.load(f)
lines = ['  ' + json.dumps(item, ensure_ascii=False) for item in data]
content = '// === GEORGIA.TO PLACES ===\nvar PLACES = [\n' + ',\n'.join(lines) + '\n];\n'
with open('src/data/georgia_to_places.js', 'w') as f:
    f.write(content)
print(f'Written {len(data)} places')
"
```

Expected: `Written 225 places`

**Step 2: Add script tag to index.html**

Modify: `index.html:84` — add new script tag after `config.js`, before `app.js`:

```html
<script src="src/data/config.js"></script>
<script src="src/data/georgia_to_places.js"></script>
<script src="src/app.js"></script>
```

**Step 3: Verify PLACES loads**

Open `index.html` in browser, open devtools console, type `PLACES.length`. Expected: `225`.

**Step 4: Commit**

```bash
git add src/data/georgia_to_places.js index.html
git commit -m "feat: convert georgia.to places JSON to JS global"
```

---

### Task 2: Add square marker CSS and category color mapping

**Files:**
- Modify: `src/style.css` (append after line 260)
- Modify: `src/app.js` (add after line 75, after existing `toggleCat` function)

**Step 1: Add `.pm` square marker styles to style.css**

Append to end of `src/style.css`:

```css
/* === PLACES OVERLAY === */
.pm{width:10px;height:10px;border-radius:2px;border:1.5px solid rgba(255,255,255,.9);box-shadow:0 1px 3px rgba(0,0,0,.3);cursor:pointer;transition:transform .12s}
.pm:hover{transform:scale(1.4)}
.pm-dim{opacity:.3!important}
```

**Step 2: Add `getPlaceCategory` function to app.js**

Add after the `toggleCat` closing brace (after line 75 in `src/app.js`):

```javascript
// === PLACES OVERLAY ===
var PLACE_CATS={
  "Natura":       {color:"#2e7d32", keys:["Natura i Przygoda","Krajobrazy Naturalne","Spa i Wellness"]},
  "Kultura":      {color:"#5c6bc0", keys:["Kultura i Sztuka","Kulturalny i Artystyczny","Historia","Miejsca historyczne","Miejsca historyczne i archeologiczne"]},
  "Religia":      {color:"#8d6e63", keys:["Religia","Miejsca religijne"]},
  "Kuchnia":      {color:"#ff8f00", keys:["Kuchnia"]},
  "Rozrywka":     {color:"#ec407a", keys:["Rozrywka","Rekreacja i rozrywka","Rodzina"]},
  "Architektura": {color:"#78909c", keys:["Struktury Architektoniczne","Atrakcje miejskie"]},
  "Inne":         {color:"#bdbdbd", keys:[]}
};

function getPlaceCategory(place){
  var tags=place.tags||[];
  // Flatten compound tags (split on #)
  var flat=[];
  tags.forEach(function(t){
    t.split("#").forEach(function(s){flat.push(s.trim());});
  });
  var cats=Object.keys(PLACE_CATS);
  for(var i=0;i<cats.length-1;i++){
    var cat=cats[i];
    for(var j=0;j<flat.length;j++){
      if(PLACE_CATS[cat].keys.indexOf(flat[j])!==-1) return cat;
    }
  }
  return "Inne";
}
```

**Step 3: Verify in console**

Open devtools, run: `getPlaceCategory(PLACES[0])`. PLACES[0] has tag "Kulturalny i Artystyczny" → expected: `"Kultura"`.

**Step 4: Commit**

```bash
git add src/style.css src/app.js
git commit -m "feat: add place category mapping and square marker styles"
```

---

### Task 3: Build markers lazily and add toggle function

**Files:**
- Modify: `src/app.js` — add after the `PLACE_CATS` / `getPlaceCategory` block from Task 2

**Step 1: Add globals and `buildPlacesMarkers` function**

Add right after `getPlaceCategory`:

```javascript
var placesLayer=L.layerGroup();
var placesVisible=false;
var placesBuilt=false;
var placesMarkers=[];
var hiddenPlaceCats={};

function buildPlacesMarkers(){
  if(placesBuilt) return;
  PLACES.forEach(function(p){
    var cat=getPlaceCategory(p);
    var color=PLACE_CATS[cat].color;
    var icon=L.divIcon({
      html:'<div class="pm" style="background:'+color+'"></div>',
      iconSize:[10,10],iconAnchor:[5,5],className:""
    });
    var pop='<b>'+p.name_pl+'</b>';
    pop+='<div style="font-size:10px;color:#5f6368;margin:2px 0">'+p.region+' · '+cat+'</div>';
    if(p.tags&&p.tags.length) pop+='<div style="font-size:9px;color:#9aa0a6">'+p.tags.join(", ")+'</div>';
    pop+='<a class="pop-link pop-link-gt" href="https://georgia.to'+p.url+'" target="_blank">&#127468;&#127466; Wiecej na georgia.to →</a>';
    var m=L.marker([p.lat,p.lng],{icon:icon});
    m.bindPopup(pop,{maxWidth:240});
    placesLayer.addLayer(m);
    placesMarkers.push({m:m,cat:cat,color:color});
  });
  placesBuilt=true;
}

function togglePlaces(){
  if(placesVisible){
    map.removeLayer(placesLayer);
    placesVisible=false;
  }else{
    buildPlacesMarkers();
    placesLayer.addTo(map);
    placesVisible=true;
  }
  // Update toggle button state
  var btn=document.getElementById('placesToggle');
  if(btn) btn.classList.toggle('on',placesVisible);
  var btnM=document.getElementById('placesToggleMobile');
  if(btnM) btnM.classList.toggle('on',placesVisible);
  // Show/hide category filters
  var filters=document.querySelectorAll('.places-cats');
  filters.forEach(function(el){el.style.display=placesVisible?'flex':'none';});
}

function togglePlaceCat(cat,el){
  if(hiddenPlaceCats[cat]){
    delete hiddenPlaceCats[cat];
    el.classList.remove('off');
  }else{
    hiddenPlaceCats[cat]=true;
    el.classList.add('off');
  }
  // Add/remove matching markers from layer
  placesMarkers.forEach(function(pm){
    if(pm.cat===cat){
      if(hiddenPlaceCats[cat]) placesLayer.removeLayer(pm.m);
      else placesLayer.addLayer(pm.m);
    }
  });
}
```

**Step 2: Verify in console**

Run: `buildPlacesMarkers(); console.log(placesMarkers.length);` → expected: `225`.
Run: `togglePlaces();` → 225 square markers should appear on the map.
Run: `togglePlaces();` → markers should disappear.

**Step 3: Commit**

```bash
git add src/app.js
git commit -m "feat: add lazy place marker builder and toggle functions"
```

---

### Task 4: Add desktop legend UI

**Files:**
- Modify: `index.html:54-62` — extend the `.leg` div

**Step 1: Add toggle button and category filters to legend**

Replace the existing `.leg` div (lines 54-62 of `index.html`):

```html
<div class="leg">
<div class="leg-i" onclick="toggleCat('#1a73e8',this)"><div class="leg-d" style="background:#1a73e8"></div>Miasto</div>
<div class="leg-i" onclick="toggleCat('#ea4335',this)"><div class="leg-d" style="background:#ea4335"></div>Atrakcja</div>
<div class="leg-i" onclick="toggleCat('#9c27b0',this)"><div class="leg-d" style="background:#9c27b0"></div>Winnica</div>
<div class="leg-i" onclick="toggleCat('#34a853',this)"><div class="leg-d" style="background:#34a853"></div>Dzieci</div>
<div class="leg-i" onclick="toggleCat('#f9ab00',this)"><div class="leg-d" style="background:#f9ab00"></div>Kazbegi</div>
<div class="leg-i" onclick="toggleCat('#ff7043',this)"><div class="leg-d" style="background:#ff7043"></div>Bonus</div>
<div class="leg-i" onclick="toggleCat('#e91e63',this)"><div class="leg-d" style="background:#e91e63"></div>Noclegi</div>
<div class="leg-sep"></div>
<div class="leg-i leg-places" id="placesToggle" onclick="togglePlaces()"><div class="leg-d leg-d-sq" style="background:#78909c"></div>georgia.to</div>
<div class="places-cats" style="display:none">
<div class="leg-i" onclick="togglePlaceCat('Natura',this)"><div class="leg-d leg-d-sq" style="background:#2e7d32"></div>Natura</div>
<div class="leg-i" onclick="togglePlaceCat('Kultura',this)"><div class="leg-d leg-d-sq" style="background:#5c6bc0"></div>Kultura</div>
<div class="leg-i" onclick="togglePlaceCat('Religia',this)"><div class="leg-d leg-d-sq" style="background:#8d6e63"></div>Religia</div>
<div class="leg-i" onclick="togglePlaceCat('Kuchnia',this)"><div class="leg-d leg-d-sq" style="background:#ff8f00"></div>Kuchnia</div>
<div class="leg-i" onclick="togglePlaceCat('Rozrywka',this)"><div class="leg-d leg-d-sq" style="background:#ec407a"></div>Rozrywka</div>
<div class="leg-i" onclick="togglePlaceCat('Architektura',this)"><div class="leg-d leg-d-sq" style="background:#78909c"></div>Architektura</div>
<div class="leg-i" onclick="togglePlaceCat('Inne',this)"><div class="leg-d leg-d-sq" style="background:#bdbdbd"></div>Inne</div>
</div>
</div>
```

**Step 2: Add separator and square icon styles to style.css**

Append to `src/style.css`:

```css
.leg-sep{width:100%;height:1px;background:#e0e0e0;margin:2px 0}
.leg-d-sq{border-radius:2px!important}
.leg-places.on{background:#e8f0fe;border-radius:8px;padding:1px 6px;margin:-1px -6px}
.places-cats{display:flex;flex-wrap:wrap;gap:8px;width:100%}
```

**Step 3: Verify visually**

Open the app on desktop. The legend should show:
1. Original 7 round-dot category filters
2. A horizontal separator line
3. A "georgia.to" toggle with a square icon
4. Clicking it shows markers AND reveals the 7 place-category filters below
5. Clicking a category filter hides/shows those markers

**Step 4: Commit**

```bash
git add index.html src/style.css
git commit -m "feat: add places overlay toggle and filters to desktop legend"
```

---

### Task 5: Add mobile filter overlay support

**Files:**
- Modify: `src/app.js:514-528` — extend `toggleMapFilters()` function

**Step 1: Extend `toggleMapFilters` to include places section**

Replace the `toggleMapFilters` function (lines 514-528 of `src/app.js`) with:

```javascript
function toggleMapFilters(){
  var ov=document.getElementById("mapFilterOverlay");
  if(ov.classList.contains("show")){ov.classList.remove("show");return;}
  var cats=[
    ["#1a73e8","Miasto"],["#ea4335","Atrakcja"],["#9c27b0","Winnica"],
    ["#34a853","Dzieci"],["#f9ab00","Kazbegi"],["#ff7043","Bonus"],["#e91e63","Noclegi"]
  ];
  var h='<div style="font-size:10px;font-weight:600;color:#5f6368;text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Filtry</div>';
  cats.forEach(function(c){
    var off=hiddenCats[c[0]]?" off":"";
    h+='<div class="leg-i'+off+'" onclick="toggleCatMobile(\''+c[0]+'\',this)"><div class="leg-d" style="background:'+c[0]+'"></div>'+c[1]+'</div>';
  });
  // Places overlay section
  h+='<div style="border-top:1px solid #e0e0e0;margin:6px 0 4px"></div>';
  h+='<div class="leg-i'+(placesVisible?' on':'')+'" id="placesToggleMobile" onclick="togglePlaces()"><div class="leg-d leg-d-sq" style="background:#78909c"></div>georgia.to</div>';
  if(placesVisible){
    var pcats=[["Natura","#2e7d32"],["Kultura","#5c6bc0"],["Religia","#8d6e63"],["Kuchnia","#ff8f00"],["Rozrywka","#ec407a"],["Architektura","#78909c"],["Inne","#bdbdbd"]];
    pcats.forEach(function(c){
      var off=hiddenPlaceCats[c[0]]?" off":"";
      h+='<div class="leg-i'+off+'" onclick="togglePlaceCat(\''+c[0]+'\',this)"><div class="leg-d leg-d-sq" style="background:'+c[1]+'"></div>'+c[0]+'</div>';
    });
  }
  ov.innerHTML=h;
  ov.classList.add("show");
}
```

**Step 2: Update `togglePlaces` to re-render mobile overlay when open**

In the existing `togglePlaces` function (from Task 3), add at the end (before the closing brace):

```javascript
  // Re-render mobile overlay if open
  var ov=document.getElementById("mapFilterOverlay");
  if(ov&&ov.classList.contains("show")){
    ov.classList.remove("show");
    toggleMapFilters();
  }
```

**Step 3: Verify on mobile**

Open app at ≤768px width (or use DevTools device toolbar):
1. Tap the 🔍 filter button on the map
2. See original ATTR filters + separator + "georgia.to" toggle
3. Tap "georgia.to" — markers appear, overlay closes and re-opens showing category filters
4. Tap a category to hide/show those markers

**Step 4: Commit**

```bash
git add src/app.js
git commit -m "feat: add places overlay to mobile filter overlay"
```

---

### Task 6: Final polish and verification

**Files:**
- Possibly: `src/style.css`, `src/app.js` (minor adjustments)

**Step 1: Test desktop flow end-to-end**

1. Open `index.html` in browser (desktop width)
2. Verify legend shows separator + georgia.to toggle
3. Click georgia.to → 225 markers appear as colored squares
4. Verify category filters appear below toggle
5. Click "Natura" → natura markers hide, click again → they return
6. Click georgia.to again → all places markers disappear, category filters hide
7. Select a day (click day 1) → ATTR markers highlight, PLACES markers stay unchanged
8. Verify ATTR filters still work independently

**Step 2: Test mobile flow end-to-end**

1. Resize to ≤768px (or use device toolbar)
2. Tap 🔍 filter button
3. Verify georgia.to toggle appears with separator
4. Toggle ON → markers appear, overlay refreshes with categories
5. Filter a category → those markers hide
6. Toggle OFF → markers disappear
7. Verify bottom bar day selection still works

**Step 3: Test popups**

1. Click a square marker → popup shows: name, region, category, tags, georgia.to link
2. Verify link opens correct georgia.to page
3. Close popup, verify no console errors

**Step 4: Final commit if any polish needed**

```bash
git add -A
git commit -m "feat: polish places overlay UI"
```
