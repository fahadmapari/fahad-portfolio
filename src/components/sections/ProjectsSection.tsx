import { navigate } from "../../lib/router";

export function ProjectsSection() {
  return (
    <section className="panel">
      <div className="panel-header">
        <span>04 :: FIELD.PROJECTS</span>
        <span className="tag">02 records</span>
      </div>
      <div style={{ padding: 0 }}>
        <div className="proj-grid">
          <article className="proj">
            <div className="proj-id">PRJ-001</div>
            <h3>Full-Stack Travel Management Platform</h3>
            <div className="proj-tags">ADMIN · BACKEND · FRONTEND</div>
            <ul>
              <li>
                Scalable backend in Node.js + TypeScript, with MongoDB, Redis, AWS S3, and
                real-time WebSocket comms.
              </li>
              <li>
                RAG pipeline for natural-language product search — embeddings via Gemini,
                vectors in Pinecone, grounded responses through Gemini Flash.
              </li>
              <li>
                Admin SPA in React + Vite for internal data management; Next.js public site
                tuned for SEO and speed.
              </li>
              <li>End-to-end security with JWT + Arcjet; full CI/CD via GitHub Actions.</li>
            </ul>
          </article>

          <article className="proj">
            <div className="proj-id">PRJ-002</div>
            <h3>Product Upload Tool — Chrome Extension</h3>
            <div className="proj-tags">EXTENSION · AUTOMATION · CF WORKERS</div>
            <ul>
              <li>
                Manifest V3 extension automating product upload for a tour company — extracts
                tour data from Google Sheets/Docs via OAuth and auto-fills a complex Angular
                admin panel.
              </li>
              <li>
                Resilient parser for non-uniform, unlabelled Google Docs — handling thousands
                of inconsistently formatted documents.
              </li>
              <li>
                Backed by a Cloudflare Worker for license-key validation (24h cache); ships a
                Side Panel UI with code obfuscation for production.
              </li>
              <li>
                Cut product upload time by <span className="hl">~60%</span>, replacing hours
                of manual data entry across the catalog.
              </li>
            </ul>
          </article>
        </div>

        {/* View all projects link */}
        <div className="proj-view-all">
          <a
            href="/projects"
            className="view-all-btn"
            onClick={(e) => {
              e.preventDefault();
              navigate("/projects");
            }}
          >
            VIEW ALL PROJECTS ›
          </a>
        </div>
      </div>
    </section>
  );
}
