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
  return <pre className="ascii-banner">{ASCII_NAME}</pre>;
}
