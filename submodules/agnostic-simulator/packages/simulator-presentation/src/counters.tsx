import { useEffect, useRef, type CSSProperties } from "react";

/** Visual roles only. Games supply labels, values, visibility and placement. */
export const counterStyles = {
  damage: {
    color: "#f18d91",
    fill: "#631f2d",
    symbol: "M0 -12 C-3 -7 -9 -1 -9 4 A9 9 0 0 0 9 4 C9 -1 3 -7 0 -12Z",
  },
  health: {
    color: "#93d6b0",
    fill: "#204a38",
    symbol: "M0 11 L-10 1 C-20 -12 -3 -17 0 -7 C3 -17 20 -12 10 1Z",
  },
  shield: {
    color: "#9ecaff",
    fill: "#243f64",
    symbol: "M-10 -10 L0 -13 L10 -10 L9 3 Q5 10 0 13 Q-5 10 -9 3Z",
  },
  energy: { color: "#f2d08c", fill: "#584021", symbol: "M2 -14 L-10 3 L-1 3 L-3 14 L11 -4 L2 -4Z" },
  bonus: {
    color: "#c5adee",
    fill: "#46325f",
    symbol: "M-3 -11 H3 V-3 H11 V3 H3 V11 H-3 V3 H-11 V-3 H-3Z",
  },
  neutral: { color: "#c3ced9", fill: "#33414e", symbol: "M0 -12 L11 0 L0 12 L-11 0Z" },
} as const;
export type CounterKind = keyof typeof counterStyles;
export interface CounterArtworkProps {
  count: number;
  label: string;
  kind?: CounterKind;
  color?: string;
  variant?: "round" | "named";
}

/** One high-resolution face for DOM and WebGL; no game dependencies. */
export function paintCounter(
  canvas: HTMLCanvasElement,
  { count, label, kind = "neutral", color, variant = "round" }: CounterArtworkProps,
) {
  const named = variant === "named";
  canvas.width = named ? 320 : 160;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const theme = counterStyles[kind];
  const accent = color ?? theme.color;
  const width = canvas.width;
  const outline = () => {
    ctx.beginPath();
    ctx.roundRect(7, 7, width - 14, 146, named ? 36 : 73);
  };
  outline();
  ctx.shadowColor = "#00000099";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = "#0b1119";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#03070b";
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(14, 14, width - 28, 132, named ? 29 : 66);
  const face = ctx.createLinearGradient(0, 14, 0, 146);
  face.addColorStop(0, theme.fill);
  face.addColorStop(1, "#101720");
  ctx.fillStyle = face;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = accent;
  ctx.stroke();
  ctx.save();
  ctx.translate(named ? 41 : 80, named ? 80 : 40);
  ctx.fillStyle = accent;
  ctx.fill(new Path2D(theme.symbol));
  ctx.restore();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (named) {
    ctx.fillStyle = accent;
    ctx.font = "700 25px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label.toUpperCase(), 66, 80, 130);
  }
  ctx.fillStyle = "#fffaf2";
  const value = String(count);
  ctx.font = `800 ${named ? 58 : value.length > 2 ? 56 : 68}px system-ui, sans-serif`;
  ctx.textAlign = named ? "right" : "center";
  ctx.fillText(value, named ? width - 30 : 80, named ? 82 : 99, named ? 90 : 114);
}

/** Passive, accessible DOM counter. Position it in the caller's board overlay. */
export function CounterBadge({
  count,
  label,
  kind = "neutral",
  color,
  variant = "round",
  size = 36,
  style,
}: CounterArtworkProps & { size?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) paintCounter(ref.current, { count, label, kind, color, variant });
  }, [count, label, kind, color, variant]);
  return (
    <span
      role="img"
      aria-label={`${label}: ${count}`}
      title={`${label}: ${count}`}
      data-counter-kind={kind}
      style={{ display: "inline-flex", flexShrink: 0, pointerEvents: "none", ...style }}
    >
      <canvas
        ref={ref}
        aria-hidden="true"
        style={{ display: "block", height: size, width: size * (variant === "named" ? 2 : 1) }}
      />
    </span>
  );
}
