# Mobile Bottom Sheet UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the mobile hamburger + list/map toggle with a Google Maps-style bottom sheet over a persistent map.

**Architecture:** Map stays fullscreen on mobile. A draggable bottom sheet slides over it with day plan content. A fixed bottom bar holds day pills + hamburger. Secondary tabs (Noclegi, Budget, Pakowanie, Ankieta) open via bottom-up drawer from hamburger. Desktop layout is completely untouched — all changes are scoped behind `@media (max-width: 768px)`.

**Tech Stack:** Vanilla JS, CSS transforms, touch events. No libraries. Leaflet.js for map (existing).

**Design doc:** `docs/plans/2026-02-22-mobile-bottom-sheet-design.md`

---

### Task 1: Add bottom sheet + bottom bar HTML structure

**Files:**
- Modify: `index.html:11-12` (replace mobile-nav), `index.html:71-75` (after map)

**Step 1: Replace mobile-nav with bottom-bar and add bottom-sheet container**

In `index.html`, replace the existing mobile-nav div (line 12):
```html
<div class="mobile-nav"><button class="hamburger" onclick="toggleDrawer()">☰</button><button id="btn-list" class="active" onclick="mobileView('list')">📋 Lista</button><button id="btn-map" onclick="mobileView('map')">🗺️ Mapa</button></div>
```

With:
```html
<div class="mobile-nav"><button class="hamburger" onclick="toggleDrawer()">☰</button><button id="btn-list" class="active" onclick="mobileView('list')">📋 Lista</button><button id="btn-map" onclick="mobileView('map')">🗺️ Mapa</button></div>
<div class="bottom-sheet" id="bottomSheet">
<div class="bs-handle" id="bsHandle"><div class="bs-handle-bar"></div></div>
<div class="bs-content" id="bsContent"></div>
</div>
<div class="bottom-bar" id="bottomBar"></div>
```

Note: We keep `.mobile-nav` for now (it's hidden by default, only shown in `@media`). We'll hide it later in Task 4 when we switch mobile CSS. The new elements (`.bottom-sheet`, `.bottom-bar`) will be hidden on desktop and only shown on mobile.

Also, remove the old `map-back-btn` (line 74) and `map-day-bar` (line 75) since they'll be replaced:
```html
<!-- REMOVE these two lines -->
<button class="map-back-btn" id="mapBackBtn" onclick="mobileView('list');hideBackBtn()">&larr; Wroc do listy</button>
<div class="map-day-bar" id="mapDayBar"></div>
```

**Step 2: Verify**

Open `http://localhost:8765` in desktop browser — should look exactly the same (new elements hidden by default).

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat(mobile): add bottom sheet and bottom bar HTML structure"
```

---

### Task 2: Add bottom sheet and bottom bar CSS

**Files:**
- Modify: `src/style.css` — add new rules at end, modify `@media` block

**Step 1: Add base CSS for bottom sheet and bottom bar (before media query)**

Append these rules before the `@media(max-width:768px)` block (before line 130):

```css
/* === BOTTOM SHEET === */
.bottom-sheet{display:none}
.bottom-bar{display:none}

@media(max-width:768px){
  /* ... existing rules ... */
}
```

**Step 2: Add mobile-specific bottom sheet CSS inside the media query**

Replace the entire `@media(max-width:768px)` block (lines 130-185) with the updated version. Key changes:
- Hide `.mobile-nav` instead of showing it
- Hide `.panel` completely (content moves to bottom sheet)
- Map is fullscreen
- Bottom sheet positioned fixed from bottom
- Bottom bar fixed at very bottom

New media query content:

```css
@media(max-width:768px){
  /* === LAYOUT: map fullscreen, panel hidden === */
  body{flex-direction:column;overflow:hidden;height:100vh}
  .mobile-nav{display:none!important}
  .panel{display:none!important}
  #map{position:fixed;top:0;left:0;right:0;bottom:0;height:100vh!important;width:100vw!important;margin:0;z-index:1}

  /* === BOTTOM BAR (fixed at bottom) === */
  .bottom-bar{display:flex;position:fixed;bottom:0;left:0;right:0;height:56px;background:#fff;border-top:1px solid #dadce0;z-index:1100;align-items:center;padding:0 8px;gap:4px;box-shadow:0 -2px 8px rgba(0,0,0,.1)}
  .bottom-bar button{width:36px;height:36px;border-radius:50%;border:2px solid #dadce0;background:#fff;cursor:pointer;font-size:13px;font-weight:700;color:#5f6368;transition:all .15s;flex-shrink:0;padding:0}
  .bottom-bar button:hover{background:#f1f3f4}
  .bottom-bar button.dn-on{background:#1a73e8;color:#fff;border-color:#1a73e8}
  .bottom-bar button.dn-easter{border-color:#ea4335}
  .bottom-bar button.dn-easter.dn-on{background:#ea4335;border-color:#ea4335}
  .bottom-bar .bb-hamburger{width:40px;height:40px;border:none;border-radius:50%;background:#f1f3f4;font-size:20px;color:#5f6368;margin-left:auto;cursor:pointer;display:flex;align-items:center;justify-content:center}

  /* === BOTTOM SHEET === */
  .bottom-sheet{display:block;position:fixed;left:0;right:0;bottom:56px;z-index:1050;background:#fff;border-radius:16px 16px 0 0;box-shadow:0 -4px 20px rgba(0,0,0,.15);will-change:transform;transition:transform .3s cubic-bezier(.4,0,.2,1);overflow:hidden}
  .bs-handle{padding:10px 0 6px;cursor:grab;touch-action:none;display:flex;justify-content:center}
  .bs-handle-bar{width:36px;height:4px;border-radius:2px;background:#dadce0}
  .bs-content{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}

  /* === DAY CONTENT inside bottom sheet === */
  .bs-content .dc{padding:14px 16px;border-bottom:1px solid #f0f0f0;cursor:default}
  .bs-content .dc.on{background:#e8f0fe;border-left:3px solid #1a73e8}
  .bs-content .dc.easter-bg{background:#fef7f0}
  .bs-content .dc.easter-bg.on{background:#fce8e6;border-left-color:#ea4335}
  .bs-content .dh{display:flex;align-items:center;gap:7px}
  .bs-content .dn{background:#1a73e8;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
  .bs-content .dc.easter-bg .dn{background:#ea4335}
  .bs-content .dd{font-weight:600;font-size:13px;color:#202124}
  .bs-content .dt{font-size:12px;color:#5f6368;margin-left:31px}
  .bs-content .dr{font-size:11px;color:#9aa0a6;margin-left:31px;margin-top:1px}
  .bs-content .det{display:block;padding:4px 14px 12px}
  .bs-content .ds{font-size:12px;padding:9px 11px;margin-top:6px;background:#f8f9fa;border-radius:6px}
  .bs-content .ds h4{font-size:12px}
  .bs-content .ds li{margin-bottom:3px;min-height:32px;display:flex;align-items:center}
  .bs-content .ds a{font-size:12px}
  .bs-content .food-item{min-height:36px;display:flex;align-items:center;flex-wrap:wrap;gap:4px}
  .bs-content .prog-link{min-height:40px;display:flex;align-items:center}
  .bs-content .day-map-cta{font-size:13px;padding:12px;min-height:44px;display:flex;align-items:center;justify-content:center}
  .bs-content .day-arrows{display:flex;justify-content:space-between;padding:12px 0;margin-top:8px;border-top:1px solid #e0e0e0;gap:8px}
  .bs-content .day-arrow{font-size:13px;min-height:44px;display:flex;align-items:center}

  /* === SECONDARY TAB CONTENT in sheet === */
  .bs-content .budget-inner{padding:12px 14px;font-size:12px;line-height:1.6}
  .bs-content .budget-inner h4{font-size:12px}
  .bs-content .budget-inner .pack-item{min-height:40px;display:flex;align-items:center;font-size:12px}
  .bs-content .budget-inner .pack-cat{font-size:12px}
  .bs-content .budget-inner .brow{padding:6px 0;font-size:12px}
  .bs-content .budget-inner .note{font-size:11px}
  .bs-content .budget-inner td{font-size:12px;padding:6px 8px}
  .bs-content .budget-inner th{font-size:11px;padding:6px 8px}

  /* === MAP ADJUSTMENTS === */
  .map-filter-btn{display:flex!important;bottom:126px}
  .map-filter-overlay{bottom:180px}
  .map-day-bar{display:none!important}
  .map-back-btn{display:none!important}

  /* === POPUPS === */
  .leaflet-popup-content{font-size:14px}
  .pop-badge{font-size:10px}
  .pop-link{font-size:12px;min-height:0;display:block;padding:2px 0}
  .pop-day-link{font-size:11px;padding:4px 10px;min-height:0;display:block;width:fit-content}

  /* === BOTTOM DRAWER (secondary tabs) === */
  .drawer{top:auto;left:0;right:0;bottom:0;width:100%;max-width:100%;height:auto;max-height:85vh;transform:translateY(100%);border-radius:16px 16px 0 0;box-shadow:0 -4px 20px rgba(0,0,0,.2)}
  .drawer.open{transform:translateY(0)}
  .drawer-head{padding:16px;border-bottom:1px solid #e0e0e0;display:flex;align-items:center;gap:12px}
  .drawer-head h2{font-size:16px;flex:1}
  .drawer-close{width:36px;height:36px;border:none;border-radius:50%;background:#f1f3f4;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5f6368;order:-1}
  .drawer-links button{font-size:15px;padding:16px;min-height:52px}
}
```

**Step 3: Verify**

Open in desktop browser — no change. Open in mobile viewport (390x844) — map should be fullscreen, bottom sheet and bar visible (but empty content).

**Step 4: Commit**

```bash
git add src/style.css
git commit -m "feat(mobile): add CSS for bottom sheet, bottom bar, and bottom drawer"
```

---

### Task 3: Implement bottom bar rendering

**Files:**
- Modify: `src/app.js` — add `renderBottomBar()` function, call in init

**Step 1: Add renderBottomBar function**

Add after the existing `renderMapDayBar()` function (after line 557 in app.js):

```js
// === BOTTOM BAR ===
function renderBottomBar(){
  var bar=document.getElementById('bottomBar');
  if(!bar) return;
  var days=getDays(),h='';
  days.forEach(function(d,i){
    var cls=''+(ad===i?' dn-on':'')+(d.easter?' dn-easter':'');
    h+='<button class="'+cls.trim()+'" onclick="event.stopPropagation();sel('+i+')">'+d.num+'</button>';
  });
  h+='<button class="bb-hamburger" onclick="toggleDrawer()">☰</button>';
  bar.innerHTML=h;
}
```

**Step 2: Call renderBottomBar in init and in sel()**

At the end of the init block (line 633), add:
```js
renderBottomBar();
```

In `sel()` function (after the `renderMapDayBar()` call on line 205), add:
```js
renderBottomBar();
```

**Step 3: Verify**

Mobile viewport: bottom bar should show day pills 1-8 and hamburger button. Clicking pills should change day (though content won't appear in sheet yet).

**Step 4: Commit**

```bash
git add src/app.js
git commit -m "feat(mobile): implement bottom bar with day pills and hamburger"
```

---

### Task 4: Render day content into bottom sheet on mobile

**Files:**
- Modify: `src/app.js` — modify `render()` function to write into `#bsContent` on mobile

**Step 1: Modify render() to target bottom sheet on mobile**

In the `render()` function, after the existing mobile branch (the `if(isMobile)` block around line 128), add code to also write into the bottom sheet:

At the **end** of the `render()` function (just before line 198 `document.getElementById("daysList").innerHTML=h;`), add a new branch:

Replace lines 127-198 (the entire isMobile logic + innerHTML assignment) with:

```js
  var isMobile = window.innerWidth <= 768;
  var bsEl = document.getElementById('bsContent');
  if(isMobile && bsEl){
    // Mobile: render into bottom sheet
    if(ad===null) ad=0;
    var d=days[ad], i=ad;
    var sh='<div class="dc on'+(d.easter?' easter-bg':'')+'">';
    sh+='<div class="dh"><div class="dn">'+d.num+'</div><div class="dd">'+d.date+'</div></div>';
    sh+='<div class="dt">'+d.title+'</div>';
    var cityOnly=d.nocleg?d.nocleg.split(' \u00b7 ')[0]:null;
    sh+='<div class="dr">&#128663; '+d.drive+(cityOnly?' &nbsp;|&nbsp; \ud83c\udfe0 '+cityOnly:'')+'</div>';
    sh+='<div class="det">';
    if(d.split) sh+='<div class="ds split-box"><h4>&#128161; OPCJA SPLIT</h4>Kazdy wybiera swoja opcje! Chetni na Kazbegi z lokalnym kierowca (caly dzien, dorosli). Reszta do Sighnaghi z noclegiem (Guest House Vista, free cancel!) lub spokojny dzien w Tbilisi. Cooking class razem w dniu 6!</div>';
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
    sh+='<div class="day-map-cta" onclick="event.stopPropagation();showDayOnMap('+i+')">\ud83d\uddfa\ufe0f Pokaz wszystkie punkty na mapie</div>';
    if(d.nocleg){
      var nCity=d.nocleg.split(' \u00b7 ')[0];
      sh+='<div class="ds" style="background:#e8f5e9;border:1px solid #c8e6c9;text-align:center;font-weight:600;color:#2e7d32;cursor:pointer" onclick="event.stopPropagation();goToNocleg(\''+nCity.replace(/'/g,"\\'")+'\')">\ud83c\udfe0 Nocleg: '+d.nocleg+'</div>';
    }
    sh+='</div>'; // close .det
    sh+='<div class="day-arrows">';
    if(ad>0) sh+='<div class="day-arrow day-arrow-prev" onclick="sel('+(ad-1)+')">&larr; Dzie\u0144 '+days[ad-1].num+' &middot; '+days[ad-1].title+'</div>';
    else sh+='<div class="day-arrow"></div>';
    if(ad<days.length-1) sh+='<div class="day-arrow day-arrow-next" onclick="sel('+(ad+1)+')">Dzie\u0144 '+days[ad+1].num+' &middot; '+days[ad+1].title+' &rarr;</div>';
    else sh+='<div class="day-arrow"></div>';
    sh+='</div>';
    sh+='</div>'; // close .dc
    bsEl.innerHTML=sh;
    // Don't write to daysList on mobile (it's hidden)
    document.getElementById("daysList").innerHTML='';
  } else {
    // Desktop: existing list+accordion into daysList
    days.forEach(function(d,i){
      var cls="dc"+(d.easter?" easter-bg":"")+(ad===i?" on":"");
      h+='<div class="'+cls+'" onclick="sel('+i+')">';
      h+='<div class="dh"><div class="dn">'+d.num+'</div><div class="dd">'+d.date+'</div></div>';
      h+='<div class="dt">'+d.title+'</div>';
      var cityOnly=d.nocleg?d.nocleg.split(' \u00b7 ')[0]:null;
      h+='<div class="dr">&#128663; '+d.drive+(cityOnly?' &nbsp;|&nbsp; \ud83c\udfe0 '+cityOnly:'')+'</div>';
      h+='<div class="det'+(ad===i?" show":"")+'">';
      if(d.split) h+='<div class="ds split-box"><h4>&#128161; OPCJA SPLIT</h4>Kazdy wybiera swoja opcje! Chetni na Kazbegi z lokalnym kierowca (caly dzien, dorosli). Reszta do Sighnaghi z noclegiem (Guest House Vista, free cancel!) lub spokojny dzien w Tbilisi. Cooking class razem w dniu 6!</div>';
      h+='<div class="ds prog"><h4>&#128205; Program</h4>'+renderProgram(d.program)+'</div>';
      h+='<div class="ds food"><h4>&#127869; Jedzenie</h4>';
      d.food.forEach(function(f){
        h+='<div class="food-item"><span class="food-name">'+f[0]+'</span>';
        if(f[1]) h+=' <span class="food-stars">&#11088; '+f[1]+'</span>';
        if(f[2]) h+=' <span style="color:#5f6368">'+f[2]+'</span>';
        if(f[3]) h+=' <a href="'+f[3]+'" target="_blank">Maps</a>';
        h+="</div>";
      });
      h+="</div>";
      h+='<div class="ds tip"><h4>&#128161; Tips</h4><ul>';
      d.tips.forEach(function(t){h+="<li>"+t+"</li>";});
      h+="</ul></div>";
      h+='<div class="day-map-cta" onclick="event.stopPropagation();showDayOnMap('+i+')">\ud83d\uddfa\ufe0f Pokaz wszystkie punkty na mapie</div>';
      if(d.nocleg){
        var nCity=d.nocleg.split(' \u00b7 ')[0];
        h+='<div class="ds" style="background:#e8f5e9;border:1px solid #c8e6c9;text-align:center;font-weight:600;color:#2e7d32;cursor:pointer" onclick="event.stopPropagation();goToNocleg(\''+nCity.replace(/'/g,"\\'")+'\')">\ud83c\udfe0 Nocleg: '+d.nocleg+'</div>';
      }
      h+="</div></div>";
    });
    document.getElementById("daysList").innerHTML=h;
  }
```

Note: The day-nav rendering (lines 121-126) should only happen on desktop. Wrap it:
```js
  if(!isMobile){
    h+='<div class="day-nav">';
    days.forEach(function(d,i){
      var cls=''+(ad===i?' dn-on':'')+(d.easter?' dn-easter':'');
      h+='<button class="'+cls.trim()+'" onclick="event.stopPropagation();sel('+i+')">'+d.num+'</button>';
    });
    h+='</div>';
  }
```

**Step 2: Verify**

Mobile viewport: bottom sheet should show current day's content. Day pills in bottom bar should switch content. Desktop should work exactly as before.

**Step 3: Commit**

```bash
git add src/app.js
git commit -m "feat(mobile): render day content into bottom sheet instead of panel"
```

---

### Task 5: Implement bottom sheet snap/drag gestures

**Files:**
- Modify: `src/app.js` — add sheet gesture handling code

**Step 1: Add snap point constants and sheet controller**

Add after the `renderBottomBar()` function:

```js
// === BOTTOM SHEET GESTURES ===
var SNAP_PEEK=0.35, SNAP_HALF=0.60, SNAP_FULL=0.92;
var sheetSnap=SNAP_PEEK;
var sheetDragging=false;
var sheetStartY=0, sheetStartSnap=0;

function setSheetSnap(snap){
  sheetSnap=snap;
  var sheet=document.getElementById('bottomSheet');
  if(!sheet) return;
  var vh=window.innerHeight;
  var barH=56;
  var maxH=vh-barH;
  var h=Math.round(snap*maxH);
  sheet.style.height=h+'px';
  sheet.style.transition='height .3s cubic-bezier(.4,0,.2,1)';
  var content=document.getElementById('bsContent');
  if(content){
    var handleH=40;
    content.style.height=(h-handleH)+'px';
    // At full snap allow scroll, otherwise disable
    if(snap>=SNAP_FULL-0.01){
      content.style.overflowY='auto';
    } else {
      content.style.overflowY='hidden';
      content.scrollTop=0;
    }
  }
  // Resize map after transition
  setTimeout(function(){if(typeof map!=='undefined')map.invalidateSize();},350);
}

function initSheetGestures(){
  var handle=document.getElementById('bsHandle');
  var sheet=document.getElementById('bottomSheet');
  var content=document.getElementById('bsContent');
  if(!handle||!sheet) return;

  // Handle drag
  handle.addEventListener('touchstart',function(e){
    sheetDragging=true;
    sheetStartY=e.touches[0].clientY;
    sheetStartSnap=sheetSnap;
    sheet.style.transition='none';
  },{passive:true});

  document.addEventListener('touchmove',function(e){
    if(!sheetDragging) return;
    var dy=sheetStartY-e.touches[0].clientY;
    var vh=window.innerHeight;
    var barH=56;
    var maxH=vh-barH;
    var newH=Math.round(sheetStartSnap*maxH)+dy;
    newH=Math.max(80,Math.min(maxH,newH));
    sheet.style.height=newH+'px';
    if(content){
      var handleH=40;
      content.style.height=(newH-handleH)+'px';
      content.style.overflowY='hidden';
    }
  },{passive:true});

  document.addEventListener('touchend',function(e){
    if(!sheetDragging) return;
    sheetDragging=false;
    // Determine closest snap
    var vh=window.innerHeight;
    var barH=56;
    var maxH=vh-barH;
    var currentH=parseInt(sheet.style.height)||0;
    var currentRatio=currentH/maxH;
    var snaps=[SNAP_PEEK,SNAP_HALF,SNAP_FULL];
    var closest=snaps[0];
    snaps.forEach(function(s){
      if(Math.abs(s-currentRatio)<Math.abs(closest-currentRatio)) closest=s;
    });
    setSheetSnap(closest);
  },{passive:true});

  // Content drag-to-resize: when at top of scroll in half/peek, drag up to expand
  var contentStartY=0,contentDragging=false;
  content.addEventListener('touchstart',function(e){
    contentStartY=e.touches[0].clientY;
    contentDragging=false;
  },{passive:true});

  content.addEventListener('touchmove',function(e){
    if(sheetSnap>=SNAP_FULL-0.01 && content.scrollTop>0) return;
    if(content.scrollTop<=0){
      var dy=contentStartY-e.touches[0].clientY;
      if(dy>10 && sheetSnap<SNAP_FULL){
        // Dragging up from scrolltop=0 → expand sheet
        contentDragging=true;
        sheetDragging=true;
        sheetStartY=contentStartY;
        sheetStartSnap=sheetSnap;
        sheet.style.transition='none';
      } else if(dy<-10 && sheetSnap>SNAP_PEEK){
        // Dragging down from scrolltop=0 → shrink sheet
        contentDragging=true;
        sheetDragging=true;
        sheetStartY=contentStartY;
        sheetStartSnap=sheetSnap;
        sheet.style.transition='none';
      }
    }
  },{passive:true});

  // Initial snap
  setSheetSnap(SNAP_PEEK);
}
```

**Step 2: Call initSheetGestures in init**

At the end of init block, add:
```js
if(window.innerWidth<=768) initSheetGestures();
```

Also call `setSheetSnap(SNAP_PEEK)` after `render()` in the resize listener:
```js
window.addEventListener('resize',function(){
  if(window.innerWidth>768){
    document.body.classList.remove('m-map','m-list');
    if(typeof map!=='undefined')map.invalidateSize();
  } else {
    setSheetSnap(sheetSnap);
  }
  render();
});
```

**Step 3: Verify**

Mobile viewport: drag the handle bar up/down. Sheet should snap to 3 positions. At full height, content should scroll. At peek/half, dragging content up should expand sheet.

**Step 4: Commit**

```bash
git add src/app.js
git commit -m "feat(mobile): implement bottom sheet drag gestures with 3 snap points"
```

---

### Task 6: Wire up day selection + flyTo with sheet snapping

**Files:**
- Modify: `src/app.js` — modify `sel()`, `flyTo()`, `showDayOnMap()`

**Step 1: Update sel() to snap sheet to peek on day change**

In the `sel()` function, add after `render()`:
```js
if(window.innerWidth<=768){
  renderBottomBar();
  setSheetSnap(SNAP_PEEK);
}
```

**Step 2: Update flyTo() to shrink sheet**

In `flyTo()` function, replace the mobile handling:
```js
// Old:
if(window.innerWidth<=768){mobileView('map');showBackBtn();}

// New:
if(window.innerWidth<=768){setSheetSnap(SNAP_PEEK);}
```

**Step 3: Update showDayOnMap() similarly**

In `showDayOnMap()`, replace:
```js
// Old:
if(window.innerWidth<=768){mobileView('map');showBackBtn();}

// New:
if(window.innerWidth<=768){setSheetSnap(SNAP_PEEK);}
```

**Step 4: Update goToDay() for bottom sheet**

In `goToDay()`, replace:
```js
// Old:
if(window.innerWidth<=768) mobileView('list');

// New:
if(window.innerWidth<=768) setSheetSnap(SNAP_HALF);
```

**Step 5: Verify**

- Click a day pill → sheet goes to peek, map shows markers
- Click a prog-link → sheet shrinks to peek, map flies to marker
- "Pokaz na mapie" button → sheet shrinks to peek, map shows bounds

**Step 6: Commit**

```bash
git add src/app.js
git commit -m "feat(mobile): wire day selection and flyTo with sheet snap behavior"
```

---

### Task 7: Implement bottom drawer for secondary tabs

**Files:**
- Modify: `src/app.js` — update `toggleDrawer()`, `drawerTab()`
- Modify: `index.html` — add close button to drawer

**Step 1: Add close button to drawer HTML**

In `index.html`, inside the drawer-head div (line 15-21), add a close button:
```html
<div class="drawer-head">
<button class="drawer-close" onclick="toggleDrawer()">✕</button>
<h2>Gruzja 2026</h2>
<div class="drawer-sub">9 osob (7 doroslych + 2 dzieci)</div>
<div class="drawer-sub">Kutaisi &middot; 2-9 kwietnia 2026</div>
<div class="drawer-sub">&#9992; Przylot 2.04 11:30 &middot; Wylot 9.04 12:30</div>
<div class="drawer-sub">&#129370; Wielkanoc: ndz 5.04</div>
</div>
```

**Step 2: Update drawerTab() to show content in bottom sheet**

Replace `drawerTab()` function:

```js
function drawerTab(tab){
  toggleDrawer();
  if(window.innerWidth<=768){
    // Mobile: show tab content in bottom sheet
    var bsEl=document.getElementById('bsContent');
    if(!bsEl) return;
    var h='';
    if(tab==='plan'){
      render();
      renderBottomBar();
      setSheetSnap(SNAP_PEEK);
      return;
    }
    if(tab==='budget'){h='<div class="budget-inner" id="budgetPanel"></div>';bsEl.innerHTML=h;renderBudget();}
    else if(tab==='packing'){h='<div class="budget-inner" id="packingPanel"></div>';bsEl.innerHTML=h;renderPacking();}
    else if(tab==='noclegi'){h='<div class="budget-inner" id="noclegiPanel"></div>';bsEl.innerHTML=h;renderNoclegi();}
    else if(tab==='ankieta'){h='<div class="budget-inner" id="ankietaPanel"></div>';bsEl.innerHTML=h;renderAnkieta();}
    setSheetSnap(SNAP_FULL);
    return;
  }
  // Desktop: existing behavior
  var btn=document.querySelector('.main-tabs button');
  document.querySelectorAll('.main-tabs button').forEach(function(b){
    b.classList.remove('on');
    if((tab==='plan'&&b.textContent.indexOf('Plan')!==-1)||(tab==='noclegi'&&b.textContent.indexOf('Noclegi')!==-1)||(tab==='budget'&&b.textContent.indexOf('Bud')!==-1)||(tab==='packing'&&b.textContent.indexOf('Pakowanie')!==-1)||(tab==='ankieta'&&b.textContent.indexOf('Ankieta')!==-1)){
      b.classList.add('on');btn=b;
    }
  });
  mainTab(tab,btn);
}
```

**Step 3: Update goToNocleg() for mobile**

In `goToNocleg()`, add mobile branch:
```js
function goToNocleg(city){
  if(window.innerWidth<=768){
    drawerTab('noclegi');
    setTimeout(function(){
      var headers=document.querySelectorAll('#noclegiPanel h4');
      var parts=city.split(/ lub | \/ /);
      for(var i=0;i<headers.length;i++){
        for(var p=0;p<parts.length;p++){
          if(headers[i].textContent.indexOf(parts[p].trim())!==-1){
            headers[i].scrollIntoView({behavior:'smooth',block:'start'});
            return;
          }
        }
      }
    },100);
    return;
  }
  // Desktop: existing behavior
  var btn=document.querySelector('.main-tabs button:nth-child(2)');
  mainTab('noclegi',btn);
  setTimeout(function(){
    var headers=document.querySelectorAll('#noclegiPanel h4');
    var parts=city.split(/ lub | \/ /);
    for(var i=0;i<headers.length;i++){
      for(var p=0;p<parts.length;p++){
        if(headers[i].textContent.indexOf(parts[p].trim())!==-1){
          headers[i].scrollIntoView({behavior:'smooth',block:'start'});
          return;
        }
      }
    }
  },50);
}
```

**Step 4: Verify**

- Hamburger in bottom bar opens drawer from bottom
- Selecting "Noclegi" closes drawer, shows noclegi content in sheet at full height
- Selecting "Plan dnia" returns to day plan in sheet
- Clicking day pill returns to plan view

**Step 5: Commit**

```bash
git add index.html src/app.js
git commit -m "feat(mobile): implement bottom drawer for secondary tabs"
```

---

### Task 8: Update swipe gestures for bottom sheet

**Files:**
- Modify: `src/app.js` — update swipe IIFE to target bsContent

**Step 1: Update swipe target**

Replace the swipe IIFE (lines 584-607) to also work with bsContent:

```js
(function(){
  var startX=0,startY=0;
  document.addEventListener('touchstart',function(e){
    var target=document.getElementById('bsContent')||document.getElementById('daysList');
    if(!target||!target.contains(e.target)) return;
    startX=e.touches[0].clientX;
    startY=e.touches[0].clientY;
  },{passive:true});
  document.addEventListener('touchend',function(e){
    if(window.innerWidth>768){
      var scrollEl=document.getElementById('daysList');
      if(!scrollEl||!scrollEl.contains(e.target)) return;
    } else {
      var scrollEl=document.getElementById('bsContent');
      if(!scrollEl||!scrollEl.contains(e.target)) return;
    }
    var endX=e.changedTouches[0].clientX;
    var endY=e.changedTouches[0].clientY;
    var dx=endX-startX;
    var dy=endY-startY;
    if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5){
      var days=getDays();
      if(dx<0 && ad<days.length-1) sel(ad+1);
      else if(dx>0 && ad>0) sel(ad-1);
    }
  },{passive:true});
})();
```

**Step 2: Verify**

Swipe left/right inside the bottom sheet content area switches days.

**Step 3: Commit**

```bash
git add src/app.js
git commit -m "feat(mobile): update swipe gestures for bottom sheet"
```

---

### Task 9: Clean up old mobile code

**Files:**
- Modify: `src/app.js` — remove/guard old mobile-only code
- Modify: `src/style.css` — remove orphaned styles

**Step 1: Guard mobileView() function**

The `mobileView()` function and related code (`showBackBtn`, `hideBackBtn`, `m-map`/`m-list` classes) are no longer needed on mobile. Guard them:

In `mobileView()`, add early return for new bottom sheet mode:
```js
function mobileView(v){
  // Bottom sheet mode: no-op (map is always visible)
  if(window.innerWidth<=768 && document.getElementById('bottomSheet')) return;
  // ... existing desktop code ...
}
```

Remove the line that adds `m-list` on load (line 575):
```js
// Old:
if(window.innerWidth<=768)document.body.classList.add('m-list');

// New:
if(window.innerWidth<=768){
  // Bottom sheet mode: map always visible, no m-list/m-map needed
} else {
  // desktop doesn't use these classes
}
```

**Step 2: Clean up resize handler**

Update the resize handler to call bottom sheet functions:
```js
window.addEventListener('resize',function(){
  if(window.innerWidth>768){
    document.body.classList.remove('m-map','m-list');
    if(typeof map!=='undefined')map.invalidateSize();
  } else {
    if(typeof setSheetSnap==='function') setSheetSnap(sheetSnap);
    renderBottomBar();
  }
  render();
});
```

**Step 3: Verify**

Full end-to-end test:
1. Mobile viewport: map visible, bottom sheet with day plan, bottom bar with pills
2. Drag sheet up/down through 3 snap points
3. Tap day pills to switch days
4. Tap prog-link → sheet shrinks, map flies to marker
5. Hamburger → drawer opens from bottom → select tab → content in sheet
6. Swipe left/right switches days
7. Desktop viewport: everything works exactly as before (accordion list + map)

**Step 4: Commit**

```bash
git add src/app.js src/style.css
git commit -m "refactor(mobile): clean up old list/map toggle code"
```

---

### Task 10: Polish and visual refinements

**Files:**
- Modify: `src/style.css` — visual polish
- Modify: `src/app.js` — edge cases

**Step 1: Add safe area support for notched phones**

In the bottom-bar CSS rule, add:
```css
.bottom-bar{padding-bottom:env(safe-area-inset-bottom)}
```

In the bottom-sheet CSS, ensure it respects the bar + safe area:
```css
.bottom-sheet{bottom:calc(56px + env(safe-area-inset-bottom))}
```

**Step 2: Add initial map fit on mobile**

In the init block, after `render()`, if mobile, fit map to current day's bounds:
```js
if(window.innerWidth<=768 && ad!==null){
  var days=getDays(),d=days[ad],bounds=[];
  d.points.forEach(function(pid){if(markers[pid])bounds.push(markers[pid].m.getLatLng());});
  if(bounds.length>1)map.fitBounds(bounds,{padding:[50,50],maxZoom:11});
  else if(bounds.length===1)map.setView(bounds[0],11);
  setTimeout(function(){highlightDayMarkers(d.points);},100);
}
```

**Step 3: Ensure map filter button positions correctly**

Verify `.map-filter-btn` is above the bottom sheet at peek position. Adjust in CSS if needed:
```css
.map-filter-btn{bottom:calc(35vh + 70px)}
```

**Step 4: Full verification**

Test on multiple viewport sizes (375x667 iPhone SE, 390x844 iPhone 14, 412x915 Pixel 7). Verify:
- Sheet snap points feel natural
- Content is readable at each snap
- Map markers are clickable when sheet is at peek
- Drawer opens/closes smoothly
- Day pills all fit in bottom bar
- No z-index conflicts with Leaflet popups
- Desktop: zero changes

**Step 5: Commit**

```bash
git add src/style.css src/app.js
git commit -m "feat(mobile): polish bottom sheet with safe areas and initial map fit"
```
