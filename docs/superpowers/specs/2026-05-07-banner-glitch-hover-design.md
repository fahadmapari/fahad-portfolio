# Banner Glitch-on-Hover — Design

**Date:** 2026-05-07
**Component touched:** `src/components/AsciiBanner.tsx`
**Scope:** Single-file change. No CSS, no API changes, no new dependencies.

## Goal

Add a continuous low-intensity glitch animation to the ASCII "FAHAD MAPARI" banner that activates while the pointer hovers it. The banner remains readable and recognizable throughout — it should feel like the banner is alive/unstable, not corrupted.

## Behavior summary

- **Trigger:** pointer enters the `<pre>` element of the banner.
- **While hovered:** a small subset (~7%) of the banner's glyph cells flicker through random box-drawing characters at a steady ~12fps tick. Cells revert to their original glyph after 1–3 ticks, while new cells are picked.
- **On hover-leave:** tick stops, all overrides clear, banner snaps back to clean state immediately.
- **No transition states between art and plaintext.** Banner stays as ASCII art the whole time.

## Visual specification

- **Glitch density:** 7% of glyph cells active per tick (≈15–20 cells given the current banner size).
- **Tick interval:** 80ms (~12fps). Slow enough to read individual flickers, fast enough to feel alive.
- **Per-cell glitch lifetime:** randomly chosen at 1, 2, or 3 ticks (80–240ms).
- **Glyph palette (random replacements drawn from):** `█ ▓ ▒ ░ ╗ ╔ ╚ ╝ ═ ║ ╠ ╣ ╦ ╩ ╬`
- **Cells excluded from glitching:** any cell whose original character is a space or newline. This preserves the silhouette of the letterforms.

## Architecture

### State model

- **`originalChars: string[]`** — flat array of every character in the ASCII art string, in order. Computed once at module scope (the banner string is a constant).
- **`glyphIndices: number[]`** — indices into `originalChars` where the original char is *not* a space and not a newline. Computed once at module scope.
- **`hovered: boolean`** — React state. Drives whether the tick runs.
- **`overrides: Map<number, { glyph: string; expiresAt: number }>`** — held in a `useRef`. Maps a flat index to its current override glyph and the tick number at which it should revert. Lives outside React state so we can mutate per-tick without re-rendering twice.
- **`tickCount: number`** — held in a `useRef`. Monotonic counter incremented each tick; used as the time base for `expiresAt` comparisons.
- **`displayChars: string[]`** — React state. The currently rendered character array (original with overrides applied). Updated once per tick.

### Tick loop

- Driven by `setInterval(tick, 80)` started in a `useEffect` that depends on `hovered`.
- Cleanup function clears the interval.
- Each tick:
  1. Increment `tickCount`.
  2. Walk `overrides`, delete entries where `expiresAt <= tickCount`.
  3. Pick `Math.round(glyphIndices.length * 0.07)` random indices from `glyphIndices`. Sampling with replacement is acceptable — if the same index is picked twice in one tick, the second assignment simply overwrites the first. For each picked index:
     - Choose a random glyph from the palette.
     - Choose a random lifetime ∈ {1, 2, 3}.
     - Set `overrides[idx] = { glyph, expiresAt: tickCount + lifetime }`.
  4. Compute `nextDisplay` by mapping `originalChars` and replacing positions present in `overrides` with their override glyph.
  5. Call `setDisplayChars(nextDisplay)`.

### Hover-leave reset

When `hovered` flips to `false`:
- The `useEffect` cleanup clears the interval.
- A separate effect (or the same one's cleanup) resets `overrides.clear()` and calls `setDisplayChars(originalChars)`.

### Rendering

- `<pre className="ascii-banner" onMouseEnter={...} onMouseLeave={...}>{displayChars.join("")}</pre>`
- Single text node — no per-char spans. ~600 cells × 12 updates/sec = trivially cheap.

### Reduced motion

- Read `window.matchMedia("(prefers-reduced-motion: reduce)").matches` once at component mount, store in a ref. We do not subscribe to changes — if the user toggles their OS preference mid-session, the page must reload to take effect. This is acceptable for a portfolio site.
- If reduced motion is preferred: hover handlers are no-ops, the tick effect never starts, banner is permanently static. Matches existing accessibility patterns.

### Component signature

Stays identical: `export function AsciiBanner()`. `App.tsx` requires no changes.

## Rationale

- **Why string rebuild instead of per-char `<span>`s:** ~600 cells means 600 DOM nodes if we span each char. We don't need per-cell styling (no color flicker, no per-cell animation), so a single text node is dramatically cheaper to reconcile.
- **Why 7% / 80ms:** dense enough to feel continuously alive, sparse enough that the name "FAHAD MAPARI" is always recognizable. These are tunable constants — easy to adjust during review.
- **Why box-drawing-only palette:** keeps the visual silhouette intact. Foreign characters (#, @, %) would create gaps and "holes" in the letterforms. The palette here is a superset of what the original art uses, so flickered cells look like the banner is unstable rather than corrupted.
- **Why exclude space cells:** spaces define the letterforms' negative space. Glitching a space into a glyph would fill in gaps between letters and break readability immediately.
- **Why `useRef` for `overrides` and `tickCount`:** they're updated on every tick but only the derived `displayChars` needs to drive renders. Storing them in state would cause double renders.

## Out of scope (explicitly not doing)

- Per-cell color flicker or animation.
- Sound effect on hover.
- Touch / tap fallback for non-hover devices.
- Decode-from-noise or art↔plaintext transitions.
- Animating any other element on the page.
- New CSS classes or selectors.

## Testing

Manual verification only — this is purely visual:

1. Hover banner → glitch starts smoothly within one tick (≤80ms).
2. Banner remains readable as "FAHAD MAPARI" throughout the glitch.
3. Move pointer off banner → glitch stops immediately, banner is clean.
4. Re-hover → glitch resumes.
5. Set OS-level reduced motion → hover does nothing.
6. No console warnings, no memory growth across hover/unhover cycles (interval cleanup verified).

## File changes

- **Modify:** `src/components/AsciiBanner.tsx` — replace current static `<pre>` with stateful glitch component. ASCII art string preserved unchanged.

That's the only file touched.
