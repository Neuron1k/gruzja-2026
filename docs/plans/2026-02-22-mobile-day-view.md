# Mobile Single-Day View Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace accordion day list with single-day full view on mobile, add swipe gestures, hide unnecessary header elements.

**Architecture:** Changes in `render()` to detect mobile and render single-day vs list. Touch event handlers for swipe. CSS-only hiding of Easter chip and legend on mobile.

**Tech Stack:** Vanilla JS, CSS media queries, Touch Events API

---

### Task 1: Hide Easter chip and legend filters on mobile

**Files:**
- Modify: `src/style.css` — add rules inside `@media(max-width:768px)` block

**Step 1: Add CSS rules**

Inside the `@media(max-width:768px)` block, add:

```css
  .chip-easter{display:none}
  .leg{display:none}
```

**Step 2: Commit**

```bash
git add src/style.css
git commit -m "feat: hide easter chip and legend filters on mobile"
```

---

### Task 2: Single-day view on mobile

**Files:**
- Modify: `src/app.js` — rewrite `render()` to branch on mobile/desktop, add mobile day rendering

**Step 1: Modify `render()` function**

The current `render()` (app.js) generates a day-nav bar followed by a list of 8 day cards with accordion expand/collapse. Replace with a version that:

On mobile (`window.innerWidth<=768`):
- If `ad` is null, set `ad=0` (always show a day)
- Generate day-nav bar (same as now)
- Generate ONLY the active day (`days[ad]`) with full content visible (no `.det` toggle — all sections always shown)
- Include header with day number, date, title, drive/nocleg info
- Include all sections: split-box (if applicable), program, food, tips, "show on map" CTA, nocleg link
- Add prev/next navigation arrows at the bottom:
  - If not first day: "← Dzień N · [title]" linking to `sel(ad-1)`
  - If not last day: "Dzień N · [title] →" linking to `sel(ad+1)`

On desktop (`window.innerWidth>768`):
- Keep the existing list+accordion behavior exactly as-is

The day-nav generation (lines 84-89) stays the same for both modes.

**Step 2: Update `sel()` function**

On mobile, `sel()` should NOT toggle (clicking same day again should NOT deselect). Change:
```js
// Old:
ad=ad===i?null:i;
// New (mobile):
if(window.innerWidth<=768) ad=i;
else ad=ad===i?null:i;
```

**Step 3: Initialize `ad=0` on mobile**

In the INIT section at the bottom of app.js, before `render()`, set `ad=0` if mobile:
```js
if(window.innerWidth<=768) ad=0;
```

**Step 4: Add CSS for mobile day view**

Add new styles for the mobile-specific day view elements (nav arrows etc.) and responsive overrides inside `@media(max-width:768px)`.

Nav arrows: `.day-arrows` container with flexbox, `justify-content: space-between`, styled as subtle buttons.

**Step 5: Handle resize**

In the existing `window.addEventListener('resize',...)`, if crossing the 768px boundary, call `render()` to switch between modes.

**Step 6: Commit**

```bash
git add src/app.js src/style.css
git commit -m "feat: single-day view on mobile with nav arrows"
```

---

### Task 3: Swipe gestures between days

**Files:**
- Modify: `src/app.js` — add touch event listeners for swipe

**Step 1: Add swipe handler**

After the `render()` and `sel()` functions, add a swipe detection module:

```js
// === SWIPE ===
(function(){
  if(window.innerWidth>768) return;
  var startX=0,startY=0,scrollEl=null;
  document.addEventListener('touchstart',function(e){
    scrollEl=document.getElementById('daysList');
    if(!scrollEl||!scrollEl.contains(e.target)) return;
    startX=e.touches[0].clientX;
    startY=e.touches[0].clientY;
  },{passive:true});
  document.addEventListener('touchend',function(e){
    if(!scrollEl) return;
    var endX=e.changedTouches[0].clientX;
    var endY=e.changedTouches[0].clientY;
    var dx=endX-startX;
    var dy=endY-startY;
    if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5){
      var days=getDays();
      if(dx<0 && ad<days.length-1) sel(ad+1);
      else if(dx>0 && ad>0) sel(ad-1);
    }
    scrollEl=null;
  },{passive:true});
})();
```

Key details:
- Only activates on mobile (>768px check at init)
- Threshold: 50px horizontal AND horizontal > 1.5× vertical (avoid triggering on scroll)
- Swipe left = next day, swipe right = previous day
- Passive event listeners for performance
- Only triggers if touch started inside `#daysList`

**Step 2: Re-initialize swipe on resize**

Modify the existing resize listener to re-evaluate swipe availability. Since the IIFE runs once, we need to make it work even if the user resizes. Simplest: always attach listeners but check `window.innerWidth<=768` inside the handler.

**Step 3: Commit**

```bash
git add src/app.js
git commit -m "feat: add swipe gestures between days on mobile"
```

---

### Task 4: Final verification

**Step 1: Test on mobile simulator**

- Easter chip hidden
- Legend filters hidden
- Day 1 shown by default (full plan, not accordion)
- Day-nav: click number → full plan of that day
- Swipe left → next day, swipe right → previous
- Nav arrows at bottom: "← Dzień 2" / "Dzień 4 →"
- Day 1: no left arrow. Day 8: no right arrow.
- "Pokaż na mapie" CTA still works
- Popup "📅 Dzień X" links still work (goToDay)
- Desktop: unchanged (list + accordion)

**Step 2: Commit if needed**

```bash
git add -A
git commit -m "feat: mobile day view - complete"
```
