# Banner Glitch-on-Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a continuous low-intensity glitch animation to the ASCII banner that activates on hover (~7% of glyph cells flicker through random box-drawing characters at ~12fps, banner stays readable).

**Architecture:** Single-file rewrite of `src/components/AsciiBanner.tsx`. Pure React state + `setInterval` tick loop. Overrides held in `useRef` (mutated each tick) and a separate `displayChars` state drives renders. Module-scope constants for the original char array and the glyph-cell indices (computed once). Reduced-motion respected via `matchMedia` read once at mount.

**Tech Stack:** React 19, TypeScript, Vite. No test framework in this project — verification is `npm run build` (type-check + bundle) plus manual browser check. Spec: [docs/superpowers/specs/2026-05-07-banner-glitch-hover-design.md](../specs/2026-05-07-banner-glitch-hover-design.md).

**Note on testing:** This portfolio has no test infrastructure (no Vitest, no Jest — `package.json` has only `dev`, `build`, `lint`, `preview`). Adding test infrastructure for a single visual hover effect is out of scope. Each task uses `npm run build` for type-check verification and ends with a manual browser check at the end of the plan.

---

## File Structure

- **Modify:** `src/components/AsciiBanner.tsx` — replace the static `<pre>` component with a stateful glitch component. Keeps `export function AsciiBanner()` signature so [src/App.tsx](../../../src/App.tsx) requires no changes.

That is the only file touched in this plan.

---

## Task 1: Extract module-scope constants (ascii char array, glyph indices, palette)

Refactor the existing constant into a structure that the glitch loop can use, without yet adding any glitch behavior. The component still renders identically. This is a safe, isolated change we can verify with `npm run build` before adding any new behavior.

**Files:**
- Modify: `src/components/AsciiBanner.tsx` (whole file)

- [ ] **Step 1: Replace the file with the constants-extracted version**

Open [src/components/AsciiBanner.tsx](../../../src/components/AsciiBanner.tsx) and replace its full contents with:

```tsx
const ASCII_NAME = String.raw`
 ███████╗ █████╗ ██╗  ██╗ █████╗ ██████╗     ███╗   ███╗ █████╗ ██████╗  █████╗ ██████╗ ██╗
 ██╔════╝██╔══██╗██║  ██║██╔══██╗██╔══██╗    ████╗ ████║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║
 █████╗  ███████║███████║███████║██║  ██║    ██╔████╔██║███████║██████╔╝███████║██████╔╝██║
 ██╔══╝  ██╔══██║██╔══██║██╔══██║██║  ██║    ██║╚██╔╝██║██╔══██║██╔═══╝ ██╔══██║██╔══██╗██║
 ██║     ██║  ██║██║  ██║██║  ██║██████╔╝    ██║ ╚═╝ ██║██║  ██║██║     ██║  ██║██║  ██║██║
 ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
`;

const ORIGINAL_CHARS: readonly string[] = Array.from(ASCII_NAME);

const GLYPH_INDICES: readonly number[] = ORIGINAL_CHARS.reduce<number[]>(
  (acc, ch, idx) => {
    if (ch !== " " && ch !== "\n") acc.push(idx);
    return acc;
  },
  [],
);

const GLITCH_PALETTE = [
  "█", "▓", "▒", "░",
  "╗", "╔", "╚", "╝",
  "═", "║",
  "╠", "╣", "╦", "╩", "╬",
] as const;

export function AsciiBanner() {
  return <pre className="ascii-banner">{ASCII_NAME}</pre>;
}
```

What changed: the ASCII string is unchanged, but we now also export-equivalent (module-scope) `ORIGINAL_CHARS`, `GLYPH_INDICES`, and `GLITCH_PALETTE` constants. The component itself still renders the static banner — so this commit is a pure refactor with no behavior change.

- [ ] **Step 2: Type-check and bundle**

Run: `npm run build`

Expected: build succeeds with no TypeScript errors. (If there are unrelated pre-existing errors in the project, note them but do not fix them in this task.)

- [ ] **Step 3: Visual sanity check**

Run: `npm run dev` in a separate terminal, open the browser, confirm the banner renders identically to before. Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/components/AsciiBanner.tsx
git commit -m "refactor(banner): extract char array, glyph indices, glitch palette as constants"
```

---

## Task 2: Add hover state and reduced-motion gate (no animation yet)

Add `onMouseEnter` / `onMouseLeave` handlers that flip a `hovered` boolean, and a reduced-motion check that disables hover entirely when set. No tick loop yet — just the wiring.

**Files:**
- Modify: `src/components/AsciiBanner.tsx`

- [ ] **Step 1: Update the component to add hover state and reduced-motion ref**

Replace the component body (everything from `export function AsciiBanner()` to the end of the file) with:

```tsx
import { useRef, useState } from "react";

export function AsciiBanner() {
  const [hovered, setHovered] = useState(false);
  const reducedMotionRef = useRef<boolean>(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const onEnter = () => {
    if (reducedMotionRef.current) return;
    setHovered(true);
  };
  const onLeave = () => {
    if (reducedMotionRef.current) return;
    setHovered(false);
  };

  // hovered state will drive the glitch loop in the next task.
  // For now, we just render the static banner with hover handlers wired up.
  void hovered;

  return (
    <pre
      className="ascii-banner"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {ASCII_NAME}
    </pre>
  );
}
```

The `void hovered;` line silences the "declared but never read" TypeScript/lint warning for one task. We remove it in Task 3.

Make sure to add the `import { useRef, useState } from "react";` line at the top of the file (above `const ASCII_NAME`).

- [ ] **Step 2: Type-check and bundle**

Run: `npm run build`

Expected: build succeeds with no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`

Expected: no new lint errors introduced by this change. (Pre-existing project errors, if any, are not in scope.)

- [ ] **Step 4: Commit**

```bash
git add src/components/AsciiBanner.tsx
git commit -m "feat(banner): wire up hover state and reduced-motion guard"
```

---

## Task 3: Add the glitch tick loop and override-driven rendering

Add the `useEffect`-driven `setInterval` tick that mutates an overrides map and pushes a fresh `displayChars` array on each frame. Render the override-applied string. This is the task that delivers the visible feature.

**Files:**
- Modify: `src/components/AsciiBanner.tsx`

- [ ] **Step 1: Replace the component with the full glitch implementation**

Replace the entire component (everything from `export function AsciiBanner()` to the end of the file) with:

```tsx
const TICK_MS = 80;
const GLITCH_DENSITY = 0.07;
const MIN_LIFETIME_TICKS = 1;
const MAX_LIFETIME_TICKS = 3;

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function AsciiBanner() {
  const [hovered, setHovered] = useState(false);
  const [displayChars, setDisplayChars] = useState<readonly string[]>(ORIGINAL_CHARS);

  const reducedMotionRef = useRef<boolean>(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const overridesRef = useRef<Map<number, { glyph: string; expiresAt: number }>>(new Map());
  const tickCountRef = useRef<number>(0);

  const onEnter = () => {
    if (reducedMotionRef.current) return;
    setHovered(true);
  };
  const onLeave = () => {
    if (reducedMotionRef.current) return;
    setHovered(false);
  };

  useEffect(() => {
    if (!hovered) {
      // Reset on hover-leave: clear overrides, snap back to clean banner.
      overridesRef.current.clear();
      tickCountRef.current = 0;
      setDisplayChars(ORIGINAL_CHARS);
      return;
    }

    const tick = () => {
      tickCountRef.current += 1;
      const now = tickCountRef.current;
      const overrides = overridesRef.current;

      // 1. Drop expired overrides.
      for (const [idx, entry] of overrides) {
        if (entry.expiresAt <= now) overrides.delete(idx);
      }

      // 2. Pick fresh cells to glitch.
      const numToGlitch = Math.round(GLYPH_INDICES.length * GLITCH_DENSITY);
      for (let i = 0; i < numToGlitch; i++) {
        const idx = pickRandom(GLYPH_INDICES);
        const glyph = pickRandom(GLITCH_PALETTE);
        const lifetime =
          MIN_LIFETIME_TICKS +
          Math.floor(Math.random() * (MAX_LIFETIME_TICKS - MIN_LIFETIME_TICKS + 1));
        overrides.set(idx, { glyph, expiresAt: now + lifetime });
      }

      // 3. Build the next display array.
      if (overrides.size === 0) {
        setDisplayChars(ORIGINAL_CHARS);
        return;
      }
      const next = ORIGINAL_CHARS.slice();
      for (const [idx, entry] of overrides) {
        next[idx] = entry.glyph;
      }
      setDisplayChars(next);
    };

    const id = window.setInterval(tick, TICK_MS);
    return () => {
      window.clearInterval(id);
    };
  }, [hovered]);

  return (
    <pre
      className="ascii-banner"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {displayChars.join("")}
    </pre>
  );
}
```

Update the React import at the top of the file to:

```tsx
import { useEffect, useRef, useState } from "react";
```

What this does, in plain terms:
- On hover-enter, the effect runs the tick every 80ms.
- Each tick: garbage-collects expired overrides, picks ~7% of glyph cells fresh, assigns each a random palette glyph + a 1–3 tick lifetime, and pushes a new `displayChars` array.
- On hover-leave, the effect's cleanup clears the interval, then the effect re-runs (because `hovered` changed) and immediately resets to clean.
- Reduced-motion: hover handlers are no-ops, so `hovered` never flips to true, so the effect's `if (!hovered) return;` branch keeps the banner clean forever.

- [ ] **Step 2: Type-check and bundle**

Run: `npm run build`

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`

Expected: no new lint errors introduced. (The `void hovered;` placeholder from Task 2 is gone, replaced by real usage.)

- [ ] **Step 4: Manual browser verification**

Run `npm run dev` in a separate terminal. Open the local URL it prints. Then run through this checklist in the browser:

1. Hover banner with the mouse → glitch starts within ~80ms.
2. Banner is still readable as "FAHAD MAPARI" while glitching.
3. Move mouse off the banner → glitch stops, banner snaps to clean immediately.
4. Re-hover → glitch resumes.
5. Open DevTools, simulate reduced motion (Rendering panel → "Emulate CSS media feature prefers-reduced-motion: reduce"), reload, hover banner → no glitch.
6. Open DevTools console → no warnings or errors related to the banner.

If any check fails, debug before committing. Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 5: Commit**

```bash
git add src/components/AsciiBanner.tsx
git commit -m "feat(banner): glitch-on-hover with continuous low-intensity flicker"
```

---

## Final verification

- [ ] **Confirm the diff is scoped to one file**

Run: `git diff main..HEAD --stat`

Expected: only `src/components/AsciiBanner.tsx` (and the previously committed spec/plan docs) shows up. No other source files changed.

- [ ] **Confirm production build still works**

Run: `npm run build`

Expected: clean build, no errors. Bundle size delta should be small (a few hundred bytes).

---

## Tunable constants (for review feedback)

If the user wants to adjust feel after seeing it live, these are the dials in [src/components/AsciiBanner.tsx](../../../src/components/AsciiBanner.tsx):

- `TICK_MS` — frame interval in ms (default `80` = ~12fps). Lower = more frantic.
- `GLITCH_DENSITY` — fraction of glyph cells active per tick (default `0.07`). Higher = more chaotic.
- `MIN_LIFETIME_TICKS` / `MAX_LIFETIME_TICKS` — how long a glitched cell stays glitched (default 1–3 ticks = 80–240ms). Higher = "thicker" trails of glitch.
- `GLITCH_PALETTE` — the random glyph pool. Adding `▀ ▄ ▌ ▐` would add half-block flicker; adding non-box chars would change the aesthetic.
