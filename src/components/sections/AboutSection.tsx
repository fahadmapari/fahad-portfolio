import { Panel } from "../Panel";

export function AboutSection() {
  return (
    <Panel title="01 :: DOSSIER" tag="personnel.identify">
      <dl className="kv">
        <dt>NAME</dt>
        <dd>Fahad Mapari</dd>
        <dt>ROLE</dt>
        <dd>Frontend Engineer / Full-Stack Developer</dd>
        <dt>LOCATION</dt>
        <dd>Mumbai, Maharashtra — IN</dd>
        <dt>STATUS</dt>
        <dd>
          <span className="hl">● ONLINE</span> · open to remote engagements
        </dd>
        <dt>SPECIALTY</dt>
        <dd>React / Next.js · Real-time UIs · Web3 trading interfaces · RAG pipelines</dd>
      </dl>
      <p style={{ marginTop: 18, color: "var(--fg)" }}>
        Frontend engineer with a backend habit. I build the messy parts of trading and
        betting platforms — order books that don't tear under load, Web3 hydration without
        flicker, and the connective tissue between WebSocket feeds, wallets, and the people
        staring at them. Three production launches; one of them did{" "}
        <span className="hl">$25M</span> in volume in its first sixty days.
      </p>
    </Panel>
  );
}
