# Mobile Map Day Navigation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a day navigation bar on the mobile map view and improve dimmed marker visibility with day number labels.

**Architecture:** Three independent changes: (1) HTML + CSS for a fixed day-bar on the map, (2) JS to render/sync it, (3) enhanced `highlightDayMarkers()` with day-number badges on dimmed markers. All changes scoped to mobile only — desktop untouched.

**Tech Stack:** Vanilla JS, Leaflet.js, plain CSS

---

### Task 1: Add map day-bar HTML element

**Files:**
- Modify: `index.html:57` (after `mapBackBtn`, before scripts)

**Step 1: Add the day-bar container div**

In `index.html`, after the `mapBackBtn` button (line 57) and before the blank line, add:

```html
<div class="map-day-bar" id="mapDayBar"></div>
```

The content will be rendered dynamically by JS (same pattern as `mapFilterOverlay`).

**Step 2: Verify**

Open `index.html` in Chrome with DevTools mobile emulation (iPhone SE or similar). The div should exist in DOM but be invisible (no styles yet).

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add map-day-bar container element"
```

---

### Task 2: Style the map day-bar and improve dimmed markers

**Files:**
- Modify: `src/style.css:200` (before `@keyframes marker-pulse`, after `.map-filter-overlay` rules)
- Modify: `src/style.css:205` (the `.cm-dim` rule)

**Step 1: Add `.map-day-bar` styles**

After line 204 (`.map-filter-overlay .leg-i{...}`), add these rules:

```css
.map-day-bar{display:none;position:fixed;bottom:70px;left:50%;transform:translateX(-50%);z-index:1500;background:#fff;border-radius:24px;box-shadow:0 2px 12px rgba(0,0,0,.25);padding:6px 10px;gap:6px;align-items:center}
.map-day-bar button{width:34px;height:34px;border-radius:50%;border:2px solid #dadce0;background:#fff;cursor:pointer;font-size:12px;font-weight:700;color:#5f6368;transition:all .15s;padding:0;flex-shrink:0}
.map-day-bar button.dn-on{background:#1a73e8;color:#fff;border-color:#1a73e8}
.map-day-bar button.dn-easter{border-color:#ea4335}
.map-day-bar button.dn-easter.dn-on{background:#ea4335;border-color:#ea4335}
```

Note: `bottom: 70px` places it above the existing `map-back-btn` (which is at `bottom: 20px`) and the `map-filter-btn` (also at `bottom: 20px`).

**Step 2: Show the day-bar only in mobile map mode**

Inside the `@media(max-width:768px)` block, add:

```css
body.m-map .map-day-bar{display:flex}
```

This goes right after the existing `body.m-map .map-filter-btn{display:flex}` rule (line 127).

**Step 3: Fix dimmed markers — reduce harshness**

Change the existing `.cm-dim` rule from:

```css
.cm-dim{opacity:.25!important;transform:scale(0.8)!important}
```

to:

```css
.cm-dim{opacity:.5!important}
```

Removes `scale(0.8)` and increases opacity from 0.25 to 0.5. Markers stay full size and are much easier to see and click.

**Step 4: Add `.cm-day` badge style for day numbers on dimmed markers**

After the `.cm-dim` rule, add:

```css
.cm-day{position:absolute;top:-6px;right:-10px;background:rgba(0,0,0,.65);color:#fff;font-size:8px;font-weight:700;padding:1px 3px;border-radius:6px;line-height:1;white-space:nowrap;pointer-events:none}
```

**Step 5: Verify**

Open in Chrome mobile emulation:
- Switch to map view → the day-bar should appear at the bottom as a horizontal pill with 8 circles (once JS is added in Task 3)
- For now, just verify the empty `#mapDayBar` div becomes visible as a white pill (tiny since empty)

**Step 6: Commit**

```bash
git add src/style.css
git commit -m "feat: style map day-bar, soften dimmed markers, add day badge"
```

---

### Task 3: Render day-bar content and wire up interaction

**Files:**
- Modify: `src/app.js` — functions `mobileView()`, `sel()`, and new `renderMapDayBar()`

**Step 1: Add `renderMapDayBar()` function**

Add this function right before the `// === MOBILE VIEW ===` comment (before line 514 in current app.js):

```javascript
function renderMapDayBar(){
  var bar=document.getElementById('mapDayBar');
  if(!bar) return;
  var days=getDays(),h='';
  days.forEach(function(d,i){
    var cls=''+(ad===i?' dn-on':'')+(d.easter?' dn-easter':'');
    h+='<button class="'+cls.trim()+'" onclick="event.stopPropagation();sel('+i+')">'+d.num+'</button>';
  });
  bar.innerHTML=h;
}
```

This mirrors the day-nav rendering in `render()` — same button classes, same `sel(i)` onclick.

**Step 2: Call `renderMapDayBar()` from `mobileView('map')`**

In the `mobileView()` function, inside the `if(v==='map')` branch, add `renderMapDayBar();` after the `map.invalidateSize()` setTimeout:

```javascript
if(v==='map'){
  b.classList.add('m-map');b.classList.remove('m-list');
  document.getElementById('btn-map').classList.add('active');
  document.getElementById('btn-list').classList.remove('active');
  setTimeout(function(){if(typeof map!=='undefined')map.invalidateSize();},150);
  renderMapDayBar();
}
```

**Step 3: Keep day-bar in sync when `sel(i)` changes the active day**

In the `sel()` function, add `renderMapDayBar();` call after `render();`:

```javascript
function sel(i){
  if(window.innerWidth<=768) ad=i;
  else ad=ad===i?null:i;
  render();
  renderMapDayBar();
  // ... rest of sel() unchanged
```

**Step 4: Also render on init if starting in map mode**

At the bottom of app.js, after the existing init calls, add:

```javascript
renderMapDayBar();
```

**Step 5: Verify**

- Open in Chrome mobile emulation
- Switch to map view → day-bar appears at bottom with 8 numbered circles
- Click day 3 → map zooms to day 3 points, button 3 highlights blue
- Click day 5 (Easter) → map zooms to day 5 points, button 5 highlights red
- Switch to list → day-bar hidden. Switch back to map → day-bar visible, correct day still highlighted
- Click "Wroc do listy" → day-bar hidden

**Step 6: Commit**

```bash
git add src/app.js
git commit -m "feat: render map day-bar and sync with day selection"
```

---

### Task 4: Add day-number badges on dimmed markers

**Files:**
- Modify: `src/app.js` — function `highlightDayMarkers()`

**Step 1: Rewrite `highlightDayMarkers()` to add/remove day badges**

Replace the entire `highlightDayMarkers()` function with:

```javascript
function highlightDayMarkers(dayPoints){
  Object.keys(markers).forEach(function(id){
    var el=markers[id].m.getElement&&markers[id].m.getElement();
    if(!el) return;
    var dot=el.querySelector('.cm');
    if(!dot) return;
    // Remove any existing day badge
    var existing=dot.querySelector('.cm-day');
    if(existing) existing.remove();
    if(!dayPoints){
      dot.classList.remove('cm-dim','cm-highlight');
      return;
    }
    if(dayPoints.indexOf(id)!==-1){
      // Active day marker: highlight, no badge
      dot.classList.remove('cm-dim');
      dot.classList.add('cm-highlight');
    }else{
      // Dimmed marker: show day number badge
      dot.classList.remove('cm-highlight');
      dot.classList.add('cm-dim');
      if(attrToDays[id]){
        var badge=document.createElement('span');
        badge.className='cm-day';
        badge.textContent=attrToDays[id].map(function(di){return di+1;}).join(',');
        dot.appendChild(badge);
      }
    }
  });
}
```

Key changes:
- Removes any existing `.cm-day` badge first (prevents duplicates)
- For dimmed markers: checks `attrToDays[id]` and adds a `<span class="cm-day">` with human-readable day numbers (1-indexed)
- For active markers: no badge, just highlight pulse
- When `dayPoints` is null (no day selected): remove all badges and dim/highlight classes

**Step 2: Verify**

- Open in Chrome mobile emulation
- Select day 3 on the map day-bar
- Day 3 markers pulse (blue glow) — NO day badge on them
- Other markers are dimmed (opacity 0.5, full size) with small number badges like "1", "5", "3,5"
- Select a different day → badges update to match
- Click "Wroc do listy" → all badges removed, markers return to normal

**Step 3: Commit**

```bash
git add src/app.js
git commit -m "feat: show day-number badges on dimmed markers"
```

---

### Task 5: Adjust button stacking to prevent overlap

**Files:**
- Modify: `src/style.css` — `.map-back-btn` and `.map-filter-btn` positions

**Step 1: Move back button and filter button to avoid overlap with day-bar**

The day-bar sits at `bottom: 70px`. The back button and filter button are both at `bottom: 20px`. The filter overlay is at `bottom: 74px`. We need to verify there's no visual overlap.

Check in mobile emulation with day-bar visible + back button visible + filter overlay open. If they overlap, adjust:

- `.map-back-btn`: keep at `bottom: 20px` (below day-bar — fine)
- `.map-filter-btn`: keep at `bottom: 20px; right: 16px` (below day-bar on the right — fine)
- `.map-filter-overlay`: currently at `bottom: 74px` — may overlap with day-bar. If so, change to `bottom: 120px`
- `.map-day-bar`: `bottom: 70px` centered — sits between the bottom buttons and the filter overlay

If no overlap → no changes needed, just verify and commit.

**Step 2: Verify final layout**

All three states should look clean:
1. Map view, no day selected: day-bar visible (no button highlighted), back button hidden
2. Map view, day selected via day-bar: day-bar with highlighted button, markers zoomed + badges
3. Map view, after `flyTo()` from list: back button visible + day-bar visible, no overlap

**Step 3: Commit (if changes made)**

```bash
git add src/style.css
git commit -m "fix: adjust button positioning to prevent overlap with day-bar"
```

---

### Task 6: Final verification and cleanup

**Step 1: Full regression test on mobile**

1. Open in Chrome mobile emulation (iPhone SE, 375px)
2. List view → select day 3 → "Pokaz na mapie" → map shows day 3 points, day-bar shows "3" highlighted
3. On map → click day 6 in day-bar → zooms to day 6 points, dimmed markers show badges
4. Click dimmed marker (e.g., from day 2) → popup opens with "Dzien 2" link
5. Click "Wroc do listy" → list shows day 6 expanded, day-bar hidden
6. Swipe left on list → day 7, switch to map → day-bar shows "7" highlighted
7. Click filter button → filter overlay opens, no overlap with day-bar

**Step 2: Desktop regression**

1. Open at full width (>768px) — no day-bar visible
2. Click days in accordion — normal behavior, no dimmed marker badges (desktop unchanged)
3. Resize window from desktop to mobile — day-bar appears, body gets `m-list` class

**Step 3: Final commit if any fixes**

```bash
git add -A
git commit -m "fix: final adjustments for mobile map day navigation"
```
