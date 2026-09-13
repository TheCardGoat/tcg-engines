import { m } from "../../../lib/i18n/messages.ts";

const GUNDAM_CARD_BACK_IMAGE =
  "https://cdn.tcg.online/public/gundam/simulator/gundam_card_back_blue.webp";

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
      <img
        src={GUNDAM_CARD_BACK_IMAGE}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {highlight ? <div className="pointer-events-none absolute inset-0 bg-hud-info/10" /> : null}
    </div>
  );
}
