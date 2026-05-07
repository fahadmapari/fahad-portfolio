import { Panel } from "../Panel";

const GROUPS = [
  {
    title: "LANGUAGES",
    items: ["JavaScript", "TypeScript", "HTML5", "CSS", "SQL"],
  },
  {
    title: "FRONTEND",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Table",
      "React Hook Form",
      "Zod",
      "SWR",
      "Redux",
      "GraphQL",
    ],
  },
  {
    title: "BACKEND",
    items: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Redis",
      "WebSockets",
      "REST APIs",
      "GraphQL",
      "JWT",
      "Pinecone",
      "RAG pipelines",
    ],
  },
  {
    title: "INFRA / TOOLING",
    items: [
      "Cloudflare Workers",
      "AWS S3",
      "Git",
      "GitHub Actions",
      "CI/CD",
      "Nginx",
      "PM2",
      "Linux",
      "Sentry",
    ],
  },
];

export function SkillsSection() {
  const total = GROUPS.reduce((s, g) => s + g.items.length, 0);
  return (
    <Panel title="02 :: TECH.STACK" tag={`${total} entries`}>
      <div className="skill-grid">
        {GROUPS.map((g) => (
          <div className="skill-block" key={g.title}>
            <h4>{g.title}</h4>
            <div className="chips">
              {g.items.map((it) => (
                <span className="chip" key={it}>
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
