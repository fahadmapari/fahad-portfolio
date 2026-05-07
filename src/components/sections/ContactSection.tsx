import { Panel } from "../Panel";

interface ContactSectionProps {
  onResume: () => void;
}

export function ContactSection({ onResume }: ContactSectionProps) {
  return (
    <Panel title="06 :: COMMS" tag="open.channels">
      <div className="contact-grid">
        <div className="contact-cell">
          <div className="label">EMAIL</div>
          <div className="value">
            <a href="mailto:thefahadmapari@gmail.com">thefahadmapari@gmail.com</a>
          </div>
        </div>
        <div className="contact-cell">
          <div className="label">PHONE</div>
          <div className="value">+91 9769598609</div>
        </div>
        <div className="contact-cell">
          <div className="label">GITHUB</div>
          <div className="value">
            <a href="https://github.com/fahadmapari" target="_blank" rel="noreferrer">
              github.com/fahadmapari
            </a>
          </div>
        </div>
        <div className="contact-cell">
          <div className="label">LOCATION</div>
          <div className="value">Mumbai, IN</div>
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <button className="btn solid" onClick={onResume}>
          ▼ Request Resume
        </button>
        <a className="btn" href="mailto:thefahadmapari@gmail.com">
          ↗ Open Channel
        </a>
        <span className="dim" style={{ fontSize: 14, letterSpacing: "0.16em" }}>
          // authentication required to release dossier file
        </span>
      </div>
    </Panel>
  );
}
