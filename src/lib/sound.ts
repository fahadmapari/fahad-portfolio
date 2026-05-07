type Win = Window & { webkitAudioContext?: typeof AudioContext };

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (_ctx) return _ctx;
  const Ctor = window.AudioContext || (window as Win).webkitAudioContext;
  if (!Ctor) return null;
  try {
    _ctx = new Ctor();
  } catch {
    _ctx = null;
  }
  return _ctx;
}

export function beep(freq = 880, dur = 0.02, vol = 0.04): void {
  const ctx = getCtx();
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "square";
  o.frequency.value = freq;
  g.gain.value = vol;
  o.connect(g).connect(ctx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.stop(ctx.currentTime + dur + 0.01);
}
