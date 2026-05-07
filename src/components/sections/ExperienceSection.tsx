import { Panel } from "../Panel";

export function ExperienceSection() {
  return (
    <Panel title="03 :: SERVICE.RECORD" tag="01 active deployment">
      <div className="exp-head">
        <div>
          <div className="role">Frontend Engineer</div>
          <div className="dim">Relative Technologies (C SQUAD LLP) · Remote, Hyderabad</div>
        </div>
        <div className="meta">JAN 2023 → PRESENT</div>
      </div>

      <p className="dim" style={{ marginBottom: 8 }}>
        Contributed to frontend across three production Web3/DeFi platforms:
        <span className="hl"> relative.fi</span> (P2P betting, crypto + RWAs),
        <span className="hl"> RFX</span> (DeFi trading on Hyperliquid), and
        <span className="hl"> Reflex</span> (AI-powered trading terminal with sentiment signals).
      </p>

      <ul className="exp-bullets">
        <li>
          Architected SSR for a Web3 environment, resolving hydration mismatches between
          server-rendered markup and browser-only wallet state (MetaMask) — improving SEO
          indexability and initial load.
        </li>
        <li>
          Built core trading and betting interfaces from scratch; the launch scaled to{" "}
          <span className="hl">$25M in volume</span> and{" "}
          <span className="hl">70K+ active users</span> within 60 days.
        </li>
        <li>
          Developed real-time order books, live betting markets, AI-driven sentiment
          dashboards, and interactive charting — translating intricate product requirements
          into responsive, accessible interfaces.
        </li>
        <li>
          Integrated WebSocket connections to stream live market data, order updates, and
          odds changes — with reconnection handling and message batching to keep UIs smooth
          under high-frequency updates.
        </li>
        <li>
          Cut production incidents by <span className="hl">~90%</span> by instrumenting
          Sentry, triaging recurring error patterns, and shipping fixes upstream into shared
          components.
        </li>
        <li>
          Mentored junior engineers and ran code reviews — improving TypeScript adoption and
          consistency in async/data-fetching patterns.
        </li>
      </ul>
    </Panel>
  );
}
