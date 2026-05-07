import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  onDone?: () => void;
  className?: string;
}

export function Typewriter({ text, speed = 24, onDone, className }: TypewriterProps) {
  const [out, setOut] = useState("");

  useEffect(() => {
    let i = 0;
    setOut("");
    const id = window.setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        if (onDone) onDone();
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, onDone]);

  return <span className={className}>{out}</span>;
}
