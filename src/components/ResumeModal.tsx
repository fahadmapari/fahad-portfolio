import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { beep } from "../lib/sound";

const RESUME_URL = "/assets/Fahad_Mapari_Resume_2026.pdf";

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  soundOn: boolean;
}

type Phase = "input" | "verifying" | "granted";

export function ResumeModal({ open, onClose, soundOn }: ResumeModalProps) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [logLines, setLogLines] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhase("input");
    setEmail("");
    setLogLines([]);
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!valid) return;
    setPhase("verifying");
    const seq = [
      "> opening secure channel ...",
      "> handshake k7741 :: ok",
      `> registering operator <${email}> ...`,
      "> verifying clearance level ...",
      "> writing log to manifest.7741 ...",
      "> decrypting dossier package ...",
      "> ✓ ACCESS GRANTED — releasing file mapari.cv.pdf",
    ];
    let i = 0;
    const tick = () => {
      if (i >= seq.length) {
        setPhase("granted");
        const a = document.createElement("a");
        a.href = RESUME_URL;
        a.download = "Fahad_Mapari_Resume_2026.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        if (soundOn) beep(1320, 0.08, 0.05);
        return;
      }
      setLogLines((s) => [...s, seq[i]]);
      if (soundOn) beep(700 + Math.random() * 200, 0.02, 0.03);
      i++;
      window.setTimeout(tick, 280 + Math.random() * 220);
    };
    window.setTimeout(tick, 200);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>▣ DOSSIER.RELEASE.PROTOCOL</span>
          <button className="x" onClick={onClose} aria-label="close">
            [ X ]
          </button>
        </div>
        <div className="modal-body">
          {phase === "input" && (
            <form onSubmit={submit}>
              <div className="dim" style={{ marginBottom: 8 }}>
                ▸ MU-TH-UR requires operator identification before releasing personnel file.
              </div>
              <div style={{ marginBottom: 14 }}>
                <span className="hl">PERSONNEL.FILE</span> :: fahad_mapari.cv.pdf
                <span className="mute" style={{ marginLeft: 12 }}>// 99 KB · v.2026</span>
              </div>
              <label
                className="dim"
                style={{ display: "block", marginBottom: 6, letterSpacing: "0.16em" }}
              >
                ▸ ENTER OPERATOR EMAIL:
              </label>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@vessel.uss"
                spellCheck={false}
                autoComplete="email"
              />
              <div className="modal-row">
                <button className="btn solid" type="submit" disabled={!valid}>
                  ▸ AUTHENTICATE
                </button>
                <button className="btn" type="button" onClick={onClose}>
                  ABORT
                </button>
              </div>
              <div
                className="mute"
                style={{ marginTop: 14, fontSize: 14, letterSpacing: "0.14em" }}
              >
                * email is not stored on a server — this is a sandboxed session.
              </div>
            </form>
          )}

          {phase === "verifying" && (
            <div style={{ minHeight: 200 }}>
              {logLines.map((l, i) => (
                <div key={i} style={{ color: "var(--fg)" }}>
                  {l}
                </div>
              ))}
              <span className="cursor">█</span>
            </div>
          )}

          {phase === "granted" && (
            <div>
              {logLines.map((l, i) => (
                <div key={i} style={{ color: "var(--fg)" }}>
                  {l}
                </div>
              ))}
              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  border: "1px solid var(--accent)",
                  color: "var(--accent)",
                  letterSpacing: "0.14em",
                }}
              >
                ✓ DOWNLOAD INITIATED — check your browser
              </div>
              <div className="modal-row">
                <a className="btn solid" href={RESUME_URL} download>
                  ▼ Re-download
                </a>
                <button className="btn" onClick={onClose}>
                  CLOSE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
