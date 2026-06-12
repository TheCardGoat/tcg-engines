import { m } from "../../../lib/i18n/messages.ts";
import { resolveCardDimensions } from "../card/card-image-format.ts";
import { GameCard } from "../GameCard.tsx";
import type { GameCardData } from "../types.ts";

interface DiscardSlotProps {
  readonly count?: number;
  readonly topCard: GameCardData | null;
  readonly isTop: boolean;
  readonly zoneId?: string;
}

export function DiscardSlot({ count = 0, topCard, isTop, zoneId }: DiscardSlotProps) {
  const accent = isTop ? "rgba(255,45,122,.4)" : "rgba(76,195,255,.4)";
  const { displayWidth, displayHeight } = resolveCardDimensions("micro");
  return (
    <div
      className="relative"
      data-sim-zone-id={zoneId}
      style={{ width: displayWidth, height: displayHeight }}
    >
      {topCard ? (
        <GameCard {...topCard} size="micro" />
      ) : (
        <div
          className="w-full h-full grid place-items-center clip-hud-6"
          style={{
            border: `1px dashed ${accent}`,
            background: "rgba(248,250,254,.6)",
          }}
        >
          <span className="font-mono text-base" style={{ color: accent }}>
            ✕
          </span>
        </div>
      )}
      {count > 0 && (
        <div
          className="font-mono absolute -top-[7px] -right-[7px] z-10 text-hud-xs font-bold bg-[#fbfcfe] text-hud-text-dim px-[5px] py-[1px]"
          style={{ border: "1px solid rgba(255,255,255,.18)" }}
        >
          {String(count).padStart(2, "0")}
        </div>
      )}
      <div className="font-mono absolute -bottom-[14px] left-1/2 -translate-x-1/2 text-hud-2xs text-[#475569] font-bold tracking-hud-label">
        {m["sim.seat.discard.label"]()}
      </div>
    </div>
  );
}
