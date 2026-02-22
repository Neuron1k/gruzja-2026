# Mobile UI Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Maximize usable viewport for day plan content on mobile by removing redundant UI chrome and adding a slide-in drawer for secondary navigation.

**Architecture:** No-build vanilla JS/CSS app. All changes in 3 files: `index.html` (drawer HTML + hamburger button), `src/style.css` (drawer styles + mobile overrides), `src/app.js` (drawer toggle + tab switching logic). Desktop layout unchanged — all changes scoped inside `@media(max-width:768px)`.

**Tech Stack:** Plain HTML/CSS/JS, Leaflet.js map (untouched)

**Design doc:** `docs/plans/2026-02-22-mobile-ui-overhaul-design.md`

---

### Task 1: Hide header, tabs, sticky day-nav, and extras on mobile (CSS only)

**Files:**
- Modify: `src/style.css` — inside existing `@media(max-width:768px)` block (line 119-168)

**Step 1: Add mobile-only hiding rules**

Add these rules inside the existing `@media(max-width:768px)` block (after line 168, before the closing `}`):

```css
  .panel-head{display:none}
  .main-tabs{display:none}
  .day-nav{display:none}
  .extra-toggle{display:none}
  .extra-list{display:none}
```

**Step 2: Verify visually**

Open `http://localhost:8765/index.html` in a 390x844 viewport.
Expected: header, tabs, sticky day buttons, and extras button are all gone. Day content starts immediately below mobile nav. The floating day bar at the bottom still works.

**Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat(mobile): hide header, tabs, day-nav, extras on mobile"
```

---

### Task 2: Add hamburger button to mobile nav

**Files:**
- Modify: `index.html` line 12
- Modify: `src/style.css` — add `.mobile-nav .hamburger` styles

**Step 1: Add hamburger button to HTML**

Replace line 12 of `index.html`:

```html
<div class="mobile-nav"><button id="btn-list" class="active" onclick="mobileView('list')">📋 Lista</button><button id="btn-map" onclick="mobileView('map')">🗺️ Mapa</button></div>
```

with:

```html
<div class="mobile-nav"><button class="hamburger" onclick="toggleDrawer()">☰</button><button id="btn-list" class="active" onclick="mobileView('list')">📋 Lista</button><button id="btn-map" onclick="mobileView('map')">🗺️ Mapa</button></div>
```

**Step 2: Style the hamburger button**

Add these rules to `src/style.css` (outside media query, near `.mobile-nav` at ~line 99):

```css
.mobile-nav .hamburger{flex:none;width:50px;border:none;border-bottom:3px solid transparent;background:#fff;cursor:pointer;font-size:22px;color:#5f6368;padding:0}
```

**Step 3: Verify visually**

Expected: ☰ button appears on the left of mobile nav, before Lista and Mapa. Nothing happens when clicked yet.

**Step 4: Commit**

```bash
git add index.html src/style.css
git commit -m "feat(mobile): add hamburger button to mobile nav"
```

---

### Task 3: Add slide-in drawer HTML and CSS

**Files:**
- Modify: `index.html` — add drawer HTML after mobile-nav div (line 12)
- Modify: `src/style.css` — add drawer styles

**Step 1: Add drawer HTML**

In `index.html`, after the closing `</div>` of `mobile-nav` (end of line 12) and before `<div class="panel">` (line 13), add:

```html
<div class="drawer-overlay" id="drawerOverlay" onclick="toggleDrawer()"></div>
<div class="drawer" id="drawer">
<div class="drawer-head">
<h2>Gruzja 2026</h2>
<div class="drawer-sub">9 osob (7 doroslych + 2 dzieci)</div>
<div class="drawer-sub">Kutaisi &middot; 2-9 kwietnia 2026</div>
<div class="drawer-sub">&#9992; Przylot 2.04 11:30 &middot; Wylot 9.04 12:30</div>
<div class="drawer-sub">&#129370; Wielkanoc: ndz 5.04</div>
</div>
<div class="drawer-links">
<button onclick="drawerTab('noclegi')">🏨 Noclegi</button>
<button onclick="drawerTab('budget')">💶 Budżet</button>
<button onclick="drawerTab('packing')">🎒 Pakowanie</button>
<button onclick="drawerTab('ankieta')">📋 Ankieta</button>
<button onclick="drawerTab('plan')">📅 Plan dnia</button>
</div>
</div>
```

**Step 2: Add drawer CSS**

Add to `src/style.css` (after `.mobile-nav` rules, outside media query):

```css
.drawer-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2500}
.drawer-overlay.open{display:block}
.drawer{position:fixed;top:0;left:0;bottom:0;width:75%;max-width:300px;background:#fff;z-index:3000;transform:translateX(-100%);transition:transform .25s ease;box-shadow:4px 0 16px rgba(0,0,0,.15);display:flex;flex-direction:column;overflow-y:auto}
.drawer.open{transform:translateX(0)}
.drawer-head{padding:20px 16px 16px;border-bottom:1px solid #e0e0e0}
.drawer-head h2{font-size:18px;color:#202124;margin-bottom:6px}
.drawer-sub{font-size:11px;color:#5f6368;line-height:1.6}
.drawer-links{padding:8px 0}
.drawer-links button{display:flex;align-items:center;gap:8px;width:100%;padding:14px 16px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:500;color:#3c4043;text-align:left;transition:background .12s}
.drawer-links button:hover{background:#f1f3f4}
```

**Step 3: Verify visually**

Expected: Drawer is not visible (hidden off-screen via `translateX(-100%)`). Overlay is `display:none`. No visual change to page.

**Step 4: Commit**

```bash
git add index.html src/style.css
git commit -m "feat(mobile): add slide-in drawer HTML and CSS"
```

---

### Task 4: Add drawer toggle and tab-switching JS

**Files:**
- Modify: `src/app.js` — add `toggleDrawer()` and `drawerTab()` functions

**Step 1: Add drawer functions**

In `src/app.js`, add before the `// === INIT ===` section (before line 588):

```js
// === DRAWER ===
function toggleDrawer(){
  document.getElementById('drawer').classList.toggle('open');
  document.getElementById('drawerOverlay').classList.toggle('open');
}
function drawerTab(tab){
  toggleDrawer();
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

**Step 2: Verify functionally**

1. Click ☰ → drawer slides in from left, dark overlay appears
2. Click overlay → drawer closes
3. Click "🏨 Noclegi" in drawer → drawer closes, noclegi tab shows
4. Click ☰ again → "📅 Plan dnia" → returns to plan view

**Step 3: Commit**

```bash
git add src/app.js
git commit -m "feat(mobile): add drawer toggle and tab-switching logic"
```

---

### Task 5: Ensure floating day-bar has proper clearance

**Files:**
- Modify: `src/style.css` — adjust `padding-bottom` on `.scroll` in mobile media query

**Step 1: Increase scroll padding**

In the mobile media query, find:
```css
  .scroll{padding-bottom:60px}
```

Change to:
```css
  .scroll{padding-bottom:70px}
```

This ensures the bottom of day content (navigation arrows) clears the floating day bar.

**Step 2: Verify scroll clearance**

Scroll to the bottom of any day. Expected: day arrows ("← Dzień 1" / "Dzień 3 →") are fully visible above the floating day bar.

**Step 3: Commit**

```bash
git add src/style.css
git commit -m "fix(mobile): increase scroll padding for floating day bar clearance"
```

---

### Task 6: Final visual verification and cleanup

**Step 1: Full mobile walkthrough**

Check all these scenarios at 390x844 viewport:

1. **List view initial load**: Only mobile-nav (50px) visible as chrome, day 1 content fills the rest
2. **Swipe between days**: Works as before via floating bar or swipe gesture
3. **Drawer opens/closes**: Smooth slide-in, overlay dims background, tap overlay to close
4. **All tabs accessible**: Noclegi, Budzet, Pakowanie, Ankieta all reachable via drawer
5. **"Plan dnia" in drawer**: Returns to day plan view
6. **Map view**: Floating day bar still shows, filter button works, back button works
7. **Desktop (>768px)**: Everything looks exactly the same as before (header, tabs, day-nav all visible)

**Step 2: Commit any fixups if needed**

```bash
git add -A
git commit -m "fix(mobile): final adjustments for mobile UI overhaul"
```

---

## Summary of changes

| File | What changes |
|------|-------------|
| `index.html` | Add hamburger button, drawer overlay + drawer HTML |
| `src/style.css` | Drawer styles + hide header/tabs/day-nav/extras on mobile |
| `src/app.js` | `toggleDrawer()` + `drawerTab()` functions |

**Desktop**: Zero visual changes — all new CSS rules are either scoped to new elements (drawer) or inside `@media(max-width:768px)`.
