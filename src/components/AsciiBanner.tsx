import { useEffect, useRef, useState } from "react";

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

  const reducedMotionRef = useRef(
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
