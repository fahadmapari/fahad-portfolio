import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const stamp =
    `${now.getUTCFullYear()}.${pad(now.getUTCMonth() + 1)}.${pad(now.getUTCDate())} ` +
    `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;

  return (
    <div className="statusbar">
      <div className="seg">
        <span className="blip" />
        <span>MU-TH-UR 6000</span>
        <span className="dim">// NODE MAPARI-F</span>
      </div>
      <div className="seg" style={{ justifyContent: "center" }}>
        <span className="dim">SESSION</span>
        <span>{stamp}</span>
      </div>
      <div className="seg" style={{ justifyContent: "flex-end" }}>
        <span className="dim">CLEARANCE</span>
        <span style={{ color: "var(--accent)" }}>LVL-4</span>
      </div>
    </div>
  );
}
