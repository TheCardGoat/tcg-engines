import { m } from "../../../lib/i18n/messages.ts";

export interface CardBackProps {
  readonly width: number;
  readonly height: number;
  readonly highlight?: boolean;
  readonly ghost?: boolean;
  readonly useContainerSize?: boolean;
  readonly accent?: string;
}

export function CardBack({
  width,
  height,
  highlight,
  ghost,
  useContainerSize = false,
  accent,
}: CardBackProps) {
  const chamfer = Math.max(3, Math.round(width * 0.08));
  const tint = accent ?? "#2b1d5e";

  const sizingStyle = useContainerSize
    ? {
        width: `var(--zone-card-width, ${width}px)`,
        height: `var(--zone-card-height, ${height}px)`,
      }
    : { width, height };

  return (
    <div
      role="img"
      aria-label={m["sim.card.faceDown.aria"]()}
      className="relative flex-shrink-0 bg-hud-deep overflow-hidden"
      style={{
        ...sizingStyle,
        opacity: ghost ? 0.5 : 1,
        border: `1px solid ${highlight ? "#2d6bff" : accent ? `${tint}88` : "rgba(211,186,132,.35)"}`,
        boxShadow: highlight
          ? "0 0 10px rgba(45,107,255,.55), 0 2px 4px rgba(0,0,0,.5)"
          : accent
            ? `0 2px 4px rgba(0,0,0,.55), 0 0 6px ${tint}33`
            : "0 2px 4px rgba(0,0,0,.55)",
        background: accent
          ? `radial-gradient(circle at 50% 40%, ${tint} 0%, ${tint}33 55%, #060619 100%)`
          : "radial-gradient(circle at 50% 40%, #2b1d5e 0%, #14103a 55%, #060619 100%)",
        clipPath: `polygon(${chamfer}px 0, 100% 0, 100% calc(100% - ${chamfer}px), calc(100% - ${chamfer}px) 100%, 0 100%, 0 ${chamfer}px)`,
      }}
    >
      <div
        className="absolute inset-[10%] border"
        style={{
          borderColor: accent ? `${tint}44` : "rgba(211,186,132,.18)",
          clipPath: `polygon(${chamfer / 2}px 0, 100% 0, 100% calc(100% - ${chamfer / 2}px), calc(100% - ${chamfer / 2}px) 100%, 0 100%, 0 ${chamfer / 2}px)`,
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: width * 0.36,
          height: width * 0.36,
          background: accent
            ? `radial-gradient(circle, ${tint}cc 0%, ${tint}66 55%, ${tint}22 100%)`
            : "radial-gradient(circle, #d3ba84 0%, #8b6f3a 55%, #3a2b15 100%)",
          boxShadow: accent
            ? `inset 0 0 6px rgba(0,0,0,.6), 0 0 8px ${tint}55`
            : "inset 0 0 6px rgba(0,0,0,.6), 0 0 8px rgba(211,186,132,.3)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0, rgba(255,255,255,.05) 1px, transparent 1px, transparent 3px)",
        }}
      />
    </div>
  );
}
