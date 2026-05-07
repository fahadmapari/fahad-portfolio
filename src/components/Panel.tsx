import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  tag?: string;
  children: ReactNode;
}

export function Panel({ title, tag, children }: PanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <span>{title}</span>
        {tag && <span className="tag">{tag}</span>}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}
