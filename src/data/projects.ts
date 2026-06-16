export interface Project {
  id: string;
  codename: string;
  title: string;
  tags: string[];
  status: string;
  year: string;
  role: string;
  summary: string;
  callout: { v: string; l: string };
  objectives: string[];
  stack: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "PRJ-001",
    codename: "WAYFARER",
    title: "Full-Stack Travel Management Platform",
    tags: ["ADMIN", "BACKEND", "FRONTEND"],
    status: "DEPLOYED",
    year: "2024",
    role: "Full-Stack",
    summary:
      "End-to-end travel ops platform: a scalable Node/TypeScript backend, an internal admin SPA, and an SEO-tuned public site — tied together with real-time comms and natural-language product search.",
    callout: { v: "RAG", l: "natural-language product search" },
    objectives: [
      "Scalable backend in Node.js + TypeScript, with MongoDB, Redis, AWS S3, and real-time WebSocket comms.",
      "RAG pipeline for natural-language product search — embeddings via Gemini, vectors in Pinecone, grounded responses through Gemini Flash.",
      "Admin SPA in React + Vite for internal data management; Next.js public site tuned for SEO and speed.",
      "End-to-end security with JWT + Arcjet; full CI/CD via GitHub Actions.",
    ],
    stack: [
      "Node.js", "TypeScript", "MongoDB", "Redis", "AWS S3", "WebSockets",
      "React", "Vite", "Next.js", "Pinecone", "Gemini Flash",
      "JWT", "Arcjet", "GitHub Actions",
    ],
  },
  {
    id: "PRJ-002",
    codename: "QUILL",
    title: "Product Upload Tool — Chrome Extension",
    tags: ["EXTENSION", "AUTOMATION", "CF WORKERS"],
    status: "DEPLOYED",
    year: "2024",
    role: "Frontend / Automation",
    summary:
      "Manifest V3 extension that automates catalog entry for a tour company — pulling tour data straight out of Google Sheets/Docs and auto-filling a complex Angular admin panel.",
    callout: { v: "~60%", l: "upload time reduced" },
    objectives: [
      "Manifest V3 extension automating product upload — extracts tour data from Google Sheets/Docs via OAuth and auto-fills a complex Angular admin panel.",
      "Resilient parser for non-uniform, unlabelled Google Docs — handling thousands of inconsistently formatted documents.",
      "Backed by a Cloudflare Worker for license-key validation (24h cache); ships a Side Panel UI with code obfuscation for production.",
      "Cut product upload time by ~60%, replacing hours of manual data entry across the catalog.",
    ],
    stack: [
      "Manifest V3", "Chrome APIs", "OAuth", "Google Sheets", "Google Docs",
      "Cloudflare Workers", "Angular", "Side Panel", "Obfuscation",
    ],
  },
];
