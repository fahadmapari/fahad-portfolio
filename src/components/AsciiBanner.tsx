import { useRef, useState } from "react";

const ASCII_NAME = String.raw`
 ███████╗ █████╗ ██╗  ██╗ █████╗ ██████╗     ███╗   ███╗ █████╗ ██████╗  █████╗ ██████╗ ██╗
 ██╔════╝██╔══██╗██║  ██║██╔══██╗██╔══██╗    ████╗ ████║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║
 █████╗  ███████║███████║███████║██║  ██║    ██╔████╔██║███████║██████╔╝███████║██████╔╝██║
 ██╔══╝  ██╔══██║██╔══██║██╔══██║██║  ██║    ██║╚██╔╝██║██╔══██║██╔═══╝ ██╔══██║██╔══██╗██║
 ██║     ██║  ██║██║  ██║██║  ██║██████╔╝    ██║ ╚═╝ ██║██║  ██║██║     ██║  ██║██║  ██║██║
 ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
`;

export const ORIGINAL_CHARS: readonly string[] = Array.from(ASCII_NAME);

export const GLYPH_INDICES: readonly number[] = ORIGINAL_CHARS.reduce<number[]>(
  (acc, ch, idx) => {
    if (ch !== " " && ch !== "\n") acc.push(idx);
    return acc;
  },
  [],
);

export const GLITCH_PALETTE = [
  "█", "▓", "▒", "░",
  "╗", "╔", "╚", "╝",
  "═", "║",
  "╠", "╣", "╦", "╩", "╬",
] as const;

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
