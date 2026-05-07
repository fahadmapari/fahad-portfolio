import { useEffect, useState } from "react";

const LINES = [
  "WEYLAND-YUTANI INDUSTRIES // MU-TH-UR 6000 SERIES",
  "TERMINAL ID: PERSONNEL.LINK.7741   NODE: MAPARI-F",
  "",
  "[ OK ] cold-boot vector loaded",
  "[ OK ] memory check ............. 64K nominal",
  "[ OK ] cryolink .................. ESTABLISHED",
  "[ .. ] decrypting personnel record",
  "       .... pass 1 of 3 :: signature ok",
  "       .... pass 2 of 3 :: integrity ok",
  "       .... pass 3 of 3 :: clearance LEVEL-4 confirmed",
  "[ OK ] handshake complete",
  "",
  "OPENING DOSSIER //  fahad.mapari // frontend.engineer",
];

interface BootSequenceProps {
  onDone: () => void;
}

export function BootSequence({ onDone }: BootSequenceProps) {
  const [shown, setShown] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let timer: number;
    const tick = () => {
      if (i >= LINES.length) {
        setDone(true);
        timer = window.setTimeout(onDone, 500);
        return;
      }
      const line = LINES[i];
      setShown((s) => [...s, line]);
      i++;
      const delay = line === "" ? 80 : 70 + Math.random() * 90;
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 200);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="boot"
      style={{ opacity: done ? 0 : 1, transition: "opacity 0.35s" }}
    >
      <div>
        {shown.map((l, i) => (
          <div key={i}>{l || " "}</div>
        ))}
        {!done && <span className="cursor">█</span>}
      </div>
    </div>
  );
}
