import { useEffect, useRef } from "react";

interface MatrixRainProps {
  on: boolean;
  onDismiss: () => void;
}

const CHARS = "0123456789ABCDEF<>/=+-*[]{}_アイウエオカキクケコサシスセソ";

export function MatrixRain({ on, onDismiss }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!on) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = Math.max(1, Math.floor(c.width / 14));
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * c.height);
    let raf = 0;

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, c.width, c.height);
      const accent =
        getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
        "#ff7a18";
      ctx.fillStyle = accent;
      ctx.font = "16px monospace";
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i];
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(ch, i * 14, y);
        drops[i] = y > c.height + Math.random() * 200 ? 0 : y + 14;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [on, onDismiss]);

  if (!on) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: "auto" }}
      onClick={onDismiss}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "var(--accent)",
          fontFamily: "var(--font)",
          letterSpacing: "0.2em",
          textShadow: "0 0 8px var(--accent-glow)",
        }}
      >
        ▾ DATA RAIN ENGAGED — click or press ESC to disengage ▾
      </div>
    </div>
  );
}
