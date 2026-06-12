import type { CSSProperties } from "react";

import { resolveCardDimensions } from "../card/card-image-format.ts";
import { GameCard } from "../GameCard.tsx";
import type { GameCardData } from "../types.ts";
import { PlayZoneCardBands } from "./PlayZoneCardBands.tsx";

interface BaseSectionProps {
  readonly cards: readonly GameCardData[];
  readonly label: string;
  readonly isTop: boolean;
  readonly zoneId?: string;
  /** Mobile: hide the BASE caption, drop the play-zone bands, and let
   *  the section sit inline next to the shield strip. The card itself
   *  still renders at `tiny` size since that already matches the
   *  ~50×72 footprint we want for the compact mobile plate. */
  readonly compact?: boolean;
}

export function BaseSection({ cards, label, isTop, zoneId, compact = false }: BaseSectionProps) {
  const accent = isTop ? "rgba(255,45,122,.45)" : "rgba(76,195,255,.55)";
  const card = cards[0] ?? null;
  // Compact mode uses the smallest card size (`micro`, ≈61×85 at 1/12
  // scale) so the mobile plate footprint is as small as possible.
  // Desktop keeps `tiny` (≈92×128 at 1/8 scale) which still reads at
  // arm's length on a monitor.
  const cardSize = compact ? "micro" : "tiny";
  const { displayWidth, displayHeight } = resolveCardDimensions(cardSize);
  const statVars: CSSProperties & Record<string, string> = {
    "--play-pill-size": "34px",
    "--play-pill-text-size": "15px",
    "--play-pill-label-size": "8px",
  };
  return (
    <section
      role="region"
      aria-label={label}
      className="relative grid place-items-center"
      data-sim-zone-id={zoneId}
      style={{ width: displayWidth, height: displayHeight }}
    >
      <div role="list" className="contents">
        {card ? (
          <div
            role="listitem"
            aria-label={card.name}
            className="relative inline-block"
            style={statVars}
          >
            <GameCard {...card} size={cardSize} />
            {!compact && <PlayZoneCardBands card={card} section="bottom" />}
          </div>
        ) : (
          <div
            className="w-full h-full clip-hud-6"
            style={{
              border: `1px dashed ${accent}`,
              background: "rgba(248,250,254,.6)",
            }}
          />
        )}
      </div>
      {!compact && (
        <div className="font-mono absolute -bottom-[14px] left-1/2 -translate-x-1/2 text-hud-2xs text-hud-text-faint font-bold tracking-hud-label">
          BASE
        </div>
      )}
    </section>
  );
}
