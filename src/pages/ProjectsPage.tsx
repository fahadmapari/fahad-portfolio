import { useState, useEffect } from "react";
import { StatusBar } from "../components/StatusBar";
import { Typewriter } from "../components/Typewriter";
import { DataStream } from "../components/DataStream";
import { PROJECTS, type Project } from "../data/projects";
import { navigate } from "../lib/router";

// ── Access Log animation ─────────────────────────────────────────
function AccessLog({ project }: { project: Project }) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    setLines([]);
    const seq = [
      `> mounting ${project.id} :: ${project.codename}`,
      "> decrypting field notes ............ ok",
      "> clearance LEVEL-4 :: ACCESS GRANTED",
    ];
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (i >= seq.length) return;
      const line = seq[i];
      setLines((s) => [...s, line]);
      i++;
      timer = setTimeout(tick, 240 + Math.random() * 180);
    };
    timer = setTimeout(tick, 120);
    return () => clearTimeout(timer);
  }, [project.id]);

  return (
    <div className="pf-log" aria-live="polite">
      {lines.map((l, i) => (
        <div key={i} className={l.includes("ok") || l.includes("GRANTED") ? "ok" : ""}>
          {l}
        </div>
      ))}
      <span className="cursor">█</span>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────
function Callout({ v, l }: { v: string; l: string }) {
  return (
    <div className="proj-callout">
      <span className="v">{v}</span>
      <span className="l">{l}</span>
    </div>
  );
}

function StackPills({ stack }: { stack: string[] }) {
  return (
    <div className="proj-stack">
      {stack.map((s) => (
        <span className="pill" key={s}>{s}</span>
      ))}
    </div>
  );
}

// ── Grid Dossier layout ──────────────────────────────────────────
function GridLayout() {
  return (
    <section className="panel">
      <div className="panel-header">
        <span>04 :: FIELD.PROJECTS</span>
        <span className="tag">{PROJECTS.length} records</span>
      </div>
      <div style={{ padding: 0 }}>
        <div className="proj-grid">
          {PROJECTS.map((p) => (
            <article className="proj" key={p.id}>
              <div className="proj-id">{p.id}</div>
              <div className="codename">CODENAME · {p.codename}</div>
              <h3>{p.title}</h3>
              <div className="proj-tags">{p.tags.join(" · ")}</div>
              <div className="proj-meta">
                <span>STATUS <b style={{ color: "var(--accent)" }}>● {p.status}</b></span>
                <span>ROLE <b>{p.role}</b></span>
                <span>YEAR <b>{p.year}</b></span>
              </div>
              <Callout v={p.callout.v} l={p.callout.l} />
              <ul>
                {p.objectives.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
              <StackPills stack={p.stack} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── File Browser layout ──────────────────────────────────────────
function BrowserLayout() {
  const [sel, setSel] = useState(0);
  const safeSel = Math.min(sel, Math.max(0, PROJECTS.length - 1));
  const project = PROJECTS[safeSel] ?? PROJECTS[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, PROJECTS.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pf-browser">
      {/* ── left: file list ── */}
      <div className="pf-list">
        <div className="pf-list-head">▸ ARCHIVE.INDEX</div>

        {PROJECTS.map((p, i) => (
          <button
            key={p.id}
            className={"pf-file" + (i === safeSel ? " active" : "")}
            onClick={() => setSel(i)}
          >
            <span className="fid">{p.id}</span>
            <span className="fname">{p.codename}</span>
            <span className="fmeta">{p.tags.join(" · ")}</span>
          </button>
        ))}

        <div className="pf-list-foot">
          {PROJECTS.length} file{PROJECTS.length === 1 ? "" : "s"}
          <div className="pf-kbdhint">
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate
          </div>
        </div>
      </div>

      {/* ── right: detail pane ── */}
      <div className="pf-detail">
        <div className="pf-detail-bar">▸ {project.id} // {project.title}</div>
        <div className="pf-detail-body">
          <div className="codename">CODENAME · {project.codename}</div>
          <h3>{project.title}</h3>
          <div className="proj-meta">
            <span>STATUS <b style={{ color: "var(--accent)" }}>● {project.status}</b></span>
            <span>ROLE <b>{project.role}</b></span>
            <span>YEAR <b>{project.year}</b></span>
            <span>TAGS <b>{project.tags.join(" / ")}</b></span>
          </div>

          <AccessLog project={project} />

          <p className="dim" style={{ margin: "10px 0 14px" }}>{project.summary}</p>

          <Callout v={project.callout.v} l={project.callout.l} />

          <ul>
            {project.objectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>

          <StackPills stack={project.stack} />
        </div>
      </div>
    </div>
  );
}

// ── Page shell ───────────────────────────────────────────────────
export function ProjectsPage() {
  const [layout, setLayout] = useState<"grid" | "browser">("browser");

  return (
    <>
      <div className="crt-bg" aria-hidden="true" />

      <main className="terminal-page">
        <div className="terminal-page-inner">
          <StatusBar />

          {/* header row */}
          <div className="pf-top">
            <div className="pf-title">
              <div className="crumb">WEYLAND-YUTANI // DOSSIER · 04 — FIELD PROJECTS</div>
              <h1>PROJECT ARCHIVE</h1>
            </div>
            <a
              className="pf-back"
              href="/"
              onClick={(e) => { e.preventDefault(); navigate("/"); }}
            >
              ‹ RETURN TO TERMINAL
            </a>
          </div>

          <div style={{ margin: "6px 0 12px" }}>
            <span className="prompt" />
            <Typewriter
              text="declassified field records. select a file to inspect the operation."
              speed={16}
            />
          </div>

          {/* layout toggle */}
          <div className="pf-top" style={{ margin: "8px 0 4px" }}>
            <div className="pf-toggle" role="tablist" aria-label="layout">
              <button
                className={layout === "grid" ? "active" : ""}
                onClick={() => setLayout("grid")}
              >
                <span className="gl">▦</span>GRID DOSSIER
              </button>
              <button
                className={layout === "browser" ? "active" : ""}
                onClick={() => setLayout("browser")}
              >
                <span className="gl">▤</span>FILE BROWSER
              </button>
            </div>
            <span className="dim" style={{ fontSize: 14, letterSpacing: "0.14em" }}>
              LAYOUT :: {layout === "grid" ? "GRID DOSSIER" : "FILE BROWSER"}
            </span>
          </div>

          {layout === "grid" ? <GridLayout /> : <BrowserLayout />}

          <div className="footer">
            <span>FAHAD MAPARI · FRONTEND ENGINEER · MUMBAI/IN</span>
            <span>{PROJECTS.length} RECORDS · CLEARANCE LVL-4</span>
            <span>
              <a
                href="/"
                style={{ color: "var(--accent)" }}
                onClick={(e) => { e.preventDefault(); navigate("/"); }}
              >
                ‹ back to terminal
              </a>
            </span>
          </div>
        </div>
      </main>

      <div className="crt-fx" aria-hidden="true" />
      <DataStream />
    </>
  );
}
