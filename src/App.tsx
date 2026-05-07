import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { beep } from "./lib/sound";
import { BootSequence } from "./components/BootSequence";
import { StatusBar } from "./components/StatusBar";
import { AsciiBanner } from "./components/AsciiBanner";
import { Typewriter } from "./components/Typewriter";
import { DataStream } from "./components/DataStream";
import { ResumeModal } from "./components/ResumeModal";
import { EggConsole } from "./components/EggConsole";
import { MatrixRain } from "./components/MatrixRain";
import { AboutSection } from "./components/sections/AboutSection";
import { SkillsSection } from "./components/sections/SkillsSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { EducationSection } from "./components/sections/EducationSection";
import { ContactSection } from "./components/sections/ContactSection";

interface SectionDef {
  id: SectionId;
  label: string;
  num: string;
}

type SectionId =
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "contact";

const SECTIONS: SectionDef[] = [
  { id: "about", label: "DOSSIER", num: "01" },
  { id: "skills", label: "TECH.STACK", num: "02" },
  { id: "experience", label: "SERVICE", num: "03" },
  { id: "projects", label: "PROJECTS", num: "04" },
  { id: "education", label: "TRAINING", num: "05" },
  { id: "contact", label: "COMMS", num: "06" },
];

function App() {
  const [booting, setBooting] = useState(true);
  const [active, setActive] = useState<SectionId>("about");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [eggOpen, setEggOpen] = useState(false);
  const [matrixOn, setMatrixOn] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Global keys: ` toggles egg shell, Esc closes overlays in order
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`" || (e.ctrlKey && e.key === "/")) {
        e.preventDefault();
        setEggOpen((v) => !v);
      }
      if (e.key === "Escape") {
        if (matrixOn) setMatrixOn(false);
        else if (eggOpen) setEggOpen(false);
        else if (resumeOpen) setResumeOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [matrixOn, eggOpen, resumeOpen]);

  // Listen for matrix easter-egg dispatch from console
  useEffect(() => {
    const onMatrix = () => setMatrixOn(true);
    window.addEventListener("egg:matrix", onMatrix);
    return () => window.removeEventListener("egg:matrix", onMatrix);
  }, []);

  // Ambient keyboard/click beeps — AudioContext warms on first user gesture
  useEffect(() => {
    const onClick = () => beep(640, 0.015, 0.025);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Track which section is in view, sync nav highlight.
  // The .terminal-page is the scroll container, so it must be the IO root.
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".terminal-page");
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top) {
          const id = (top.target as HTMLElement).dataset.sectionId as SectionId | undefined;
          if (id) setActive(id);
        }
      },
      { root, rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.3, 0.6] },
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: SectionId) => {
    const el = sectionRefs.current[id];
    const container = document.querySelector<HTMLElement>(".terminal-page");
    if (!el || !container) return;
    const head = container.querySelector<HTMLElement>(".terminal-head");
    const offset = (head?.offsetHeight ?? 200) + 16;
    const delta = el.getBoundingClientRect().top - container.getBoundingClientRect().top;
    container.scrollTo({
      top: container.scrollTop + delta - offset,
      behavior: "smooth",
    });
  };

  const sectionRender: Record<SectionId, ReactNode> = {
    about: <AboutSection />,
    skills: <SkillsSection />,
    experience: <ExperienceSection />,
    projects: <ProjectsSection />,
    education: <EducationSection />,
    contact: <ContactSection onResume={() => setResumeOpen(true)} />,
  };

  return (
    <>
      {booting && <BootSequence onDone={() => setBooting(false)} />}

      <div className="crt-bg" aria-hidden="true" />

      <main className="terminal-page">
        <div className="terminal-page-inner">
          <header className="terminal-head">
            <StatusBar />
            <AsciiBanner />

            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <span className="prompt" />
              <Typewriter
                text="welcome, operator. this dossier is classified — handle with care."
                speed={18}
              />
            </div>

            <nav className="topnav" role="tablist">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  className={active === s.id ? "active" : ""}
                  onClick={() => {
                    scrollTo(s.id);
                    beep(900, 0.02, 0.04);
                  }}
                >
                  <span className="num">{s.num}</span>
                  {s.label}
                </button>
              ))}
              <button onClick={() => setResumeOpen(true)}>
                <span className="num">▼</span>RESUME
              </button>
            </nav>
          </header>

          {SECTIONS.map((s) => (
            <div
              key={s.id}
              ref={(el) => {
                sectionRefs.current[s.id] = el;
              }}
              data-section-id={s.id}
            >
              {sectionRender[s.id]}
            </div>
          ))}

          <div className="footer">
            <span>FAHAD MAPARI · FRONTEND ENGINEER · MUMBAI/IN</span>
            <span>
              PRESS <span className="hl">`</span> FOR DEBUG SHELL
            </span>
            <span>© 2026 · MU-TH-UR 6000</span>
          </div>
        </div>
      </main>

      <div className="crt-fx" aria-hidden="true" />
      <DataStream />

      <ResumeModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        soundOn={true}
      />
      <EggConsole
        open={eggOpen}
        onClose={() => setEggOpen(false)}
        onDownload={() => {
          setEggOpen(false);
          setResumeOpen(true);
        }}
      />
      <MatrixRain on={matrixOn} onDismiss={() => setMatrixOn(false)} />
    </>
  );
}

export default App;
