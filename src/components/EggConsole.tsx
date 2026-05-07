import { useEffect, useRef, useState } from "react";

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    "available commands:",
    "  help            — this list",
    "  whoami          — operator status",
    "  ls              — list dossier sections",
    "  cat about       — print bio",
    "  contact         — comms",
    "  download        — open resume protocol",
    "  matrix          — engage data rain",
    "  coffee          — make some",
    "  sudo rm -rf /   — DO NOT",
    "  uname -a        — system",
    "  clear           — wipe console",
    "  exit            — close console",
  ],
  whoami: () => [
    "operator: fahad.mapari",
    "role:     frontend.engineer",
    "uid:      7741",
    "shell:    /bin/bash-not-really",
  ],
  ls: () => [
    "drwxr-xr-x  01_dossier",
    "drwxr-xr-x  02_tech_stack",
    "drwxr-xr-x  03_service_record",
    "drwxr-xr-x  04_field_projects",
    "drwxr-xr-x  05_training",
    "drwxr-xr-x  06_comms",
    "-rw-r--r--  resume.pdf  (gated)",
  ],
  "cat about": () => [
    "frontend engineer w/ 3 prod web3+defi launches.",
    "ssr in a wallet world, real-time order books, sentiment dashboards.",
    "→ relative.fi · RFX · Reflex",
  ],
  contact: () => [
    "email:  thefahadmapari@gmail.com",
    "phone:  +91 9769598609",
    "github: github.com/fahadmapari",
  ],
  "uname -a": () => [
    "MU-TH-UR 6000 mapari-f 2.6.7741 #1 SMP nostromo x86_64 GNU/Linux",
  ],
  coffee: () => [
    "brewing ........... ☕",
    "[ FAIL ] HTTP 418 — i'm a teapot.",
  ],
  matrix: () => {
    window.dispatchEvent(new CustomEvent("egg:matrix"));
    return ["engaging code rain. press ESC or run any command to disengage."];
  },
  "sudo rm -rf /": () => [
    "[sudo] password for operator: *********",
    "rm: it is dangerous to operate on '/'",
    "rm: refusing without --no-preserve-root",
    "→ nice try, operator.",
  ],
};

interface EggConsoleProps {
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function EggConsole({ open, onClose, onDownload }: EggConsoleProps) {
  const [history, setHistory] = useState<string[]>([
    "MU-TH-UR debug shell // type `help` for commands",
  ]);
  const [val, setVal] = useState("");
  const inRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && inRef.current) inRef.current.focus();
  }, [open]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setHistory((h) => [...h, `> ${cmd}`]);
    if (!cmd) return;
    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    if (cmd === "exit") {
      setHistory((h) => [...h, "closing console..."]);
      window.setTimeout(onClose, 200);
      return;
    }
    if (cmd === "download") {
      onDownload();
      return;
    }
    const fn = COMMANDS[cmd];
    if (fn) {
      const out = fn();
      setHistory((h) => [...h, ...out]);
    } else {
      setHistory((h) => [...h, `bash: ${cmd}: command not found — try \`help\``]);
    }
  };

  if (!open) return null;
  return (
    <div className="egg-console" onClick={() => inRef.current?.focus()}>
      <div className="lines">
        {history.map((l, i) => (
          <div
            key={i}
            style={{ color: l.startsWith(">") ? "var(--accent)" : "var(--fg)" }}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="input-row">
        <span style={{ color: "var(--accent)" }}>operator@mapari ~ $</span>
        <input
          ref={inRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              run(val);
              setVal("");
            }
            if (e.key === "Escape") onClose();
          }}
          spellCheck={false}
          autoComplete="off"
        />
        <span className="cursor">█</span>
      </div>
    </div>
  );
}
