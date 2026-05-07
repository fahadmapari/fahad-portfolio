import { useEffect, useState } from "react";

const SAMPLES = [
  "0x3FE2 :: tcp.in 204.0.5.91:443",
  "buf.flush ok",
  "cache.hit /api/markets/btc",
  "ws.heartbeat 0x01",
  "auth.jwt verify ok",
  "render.frame 16.4ms",
  "rag.query gemini-flash",
  "pinecone.match score=0.91",
  "edge.fetch cf-worker-72",
  "react.hydrate root",
  "sentry.batch flush=12",
  "signal.entropy 0.412",
  "0x4A11 :: ssh.tunnel 7741",
  "redis.evict lru",
  "node.gc young 4.2ms",
  "cron.tick 30s",
  "graphql.exec 12 fields",
  "s3.put assets/*.gz",
  "wallet.connect metamask",
  "orderbook.delta +1.4%",
];

export function DataStream() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLines((prev) => {
        const next = [...prev, SAMPLES[Math.floor(Math.random() * SAMPLES.length)]];
        return next.slice(-18);
      });
    }, 600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="datastream" aria-hidden="true">
      {lines.map((l, i) => (
        <div className="line" key={`${i}-${l}`}>
          {l}
        </div>
      ))}
    </div>
  );
}
