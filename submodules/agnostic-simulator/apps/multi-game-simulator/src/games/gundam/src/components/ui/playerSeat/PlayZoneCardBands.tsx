import * as HoverCard from "@radix-ui/react-hover-card";

import type { GameCardData } from "../types.ts";
import { CardTagStrip } from "../card/CardTagStrip.tsx";
import { getCardTags } from "../card/card-tags.ts";

/**
 * Lorcana-style overlapping bands around a play-zone card. The band is
 * rendered by the zone (not the card) so its pills sit outside the card
 * art, half-overlapping the top or bottom edge — visible at every
 * in-play scale, never fighting for space with the image.
 *
 * Sizing is driven by CSS custom properties the caller sets on an
 * ancestor (see `PlayZone.tsx` for the defaults):
 *   --play-pill-size, --play-pill-text-size, --play-pill-icon-size,
 *   --play-band-height-top, --play-band-height-bottom, --play-band-overlap.
 *
 * Mirrors `packages/lorcana/.../PlayZoneCardBands.svelte`.
 */
export interface PlayZoneCardBandsProps {
  readonly card: GameCardData;
  readonly section: "top" | "bottom";
}

export function PlayZoneCardBands({ card, section }: PlayZoneCardBandsProps) {
  if (section === "top") {
    // `damage` already surfaces via the center overlay on the card face;
    // drop it from the band so we don't double-encode.
    const tags = getCardTags(card).filter((t) => t.id !== "damage");
    return (
      <div
        className="play-band play-band--top pointer-events-auto"
        data-testid="play-zone-status-band"
        aria-hidden={tags.length === 0}
      >
        {tags.length > 0 && (
          <CardTagStrip tags={tags} maxVisible={4} compact collapseMode="hover-stack" />
        )}
      </div>
    );
  }

  const showStats =
    (card.cardType === "unit" && (card.ap != null || card.hp != null)) ||
    (card.cardType === "base" && card.hp != null);
  return (
    <div
      className="play-band play-band--bottom pointer-events-auto"
      data-testid="play-zone-stats-band"
      aria-hidden={!showStats}
    >
      {showStats && (
        <>
          {card.cardType === "unit" && card.ap != null && (
            <StatCircle label="AP" value={card.ap} delta={card.ap - (card.baseAp ?? card.ap)} />
          )}
          {card.hp != null && (
            <StatCircle label="HP" value={card.hp} delta={card.hp - (card.baseHp ?? card.hp)} />
          )}
        </>
      )}
    </div>
  );
}

interface StatCircleProps {
  readonly label: "AP" | "HP";
  readonly value: number;
  readonly delta: number;
}

function StatCircle({ label, value, delta }: StatCircleProps) {
  const tone =
    delta > 0
      ? "play-pill--buffed"
      : delta < 0
        ? "play-pill--debuffed"
        : label === "AP"
          ? "play-pill--ap"
          : "play-pill--hp";
  const signed = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "";
  const title = `${label} ${value}${signed ? ` (${signed})` : ""}`;
  const description =
    label === "AP"
      ? `Attack Points. A Unit deals damage equal to its AP.`
      : `Hit Points. A Unit or Base is destroyed when its accumulated damage is greater than or equal to its HP.`;
  return (
    <HoverCard.Root openDelay={150} closeDelay={80}>
      <HoverCard.Trigger asChild>
        <button
          type="button"
          data-testid={`play-zone-stat-${label.toLowerCase()}`}
          className={`play-pill ${tone}`}
          aria-label={title}
          title={title}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="play-pill__label" aria-hidden>
            {label}
          </span>
          <span className="play-pill__value">{value}</span>
        </button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="top"
          sideOffset={8}
          className="z-50 max-w-[220px] rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-2 text-[0.7rem] leading-snug text-slate-100 shadow-xl"
        >
          <div className="font-semibold">{title}</div>
          <div className="mt-1 text-slate-300">{description}</div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
