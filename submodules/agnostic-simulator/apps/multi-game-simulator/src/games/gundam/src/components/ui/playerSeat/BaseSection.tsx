import type { CSSProperties } from "react";
import { AnimatedEntityCollection, AnimatedEntitySlot, AnimatedZoneSlot } from "@tcg/simulator-ui";

import { gundamAnimationEntityForCard } from "../../../animation/gundamAnimationVisual.tsx";
import { m } from "../../../lib/i18n/messages.ts";
import { cn } from "../../../lib/utils.ts";
import { resolveCardDimensions } from "../card/card-image-format.ts";
import { GameCard } from "../GameCard.tsx";
import type { GameCardData } from "../types.ts";
import { PlayZoneCardBands } from "./PlayZoneCardBands.tsx";

interface BaseSectionProps {
  readonly cards: readonly GameCardData[];
  readonly label: string;
  readonly isTop: boolean;
  readonly zoneId?: string;
  readonly selectedCardIds?: readonly string[];
  readonly highlightCardIds?: readonly string[];
  readonly onCardClick?: (cardId: string) => void;
  /** Mobile: hide the BASE caption, drop the play-zone bands, and let
   *  the section sit inline next to the shield strip. The card itself
   *  still renders at `tiny` size since that already matches the
   *  ~50×72 footprint we want for the compact mobile plate. */
  readonly compact?: boolean;
  /** Dense HUD mode keeps the Base visible without competing with the battle area. */
  readonly dense?: boolean;
  /** Extra-small Base thumbnail for the two-row mobile combat core. */
  readonly tight?: boolean;
  /** Edge-anchor thumbnail that spans the two mobile combat-core rows. */
  readonly edge?: boolean;
}

export function BaseSection({
  cards,
  label,
  isTop,
  zoneId,
  selectedCardIds = [],
  highlightCardIds = [],
  onCardClick,
  compact = false,
  dense = false,
  tight = false,
  edge = false,
}: BaseSectionProps) {
  const accent = isTop ? "rgba(255,45,122,.45)" : "rgba(76,195,255,.55)";
  // Compact mode uses the smallest card size (`micro`, ≈61×85 at 1/12
  // scale) so the mobile plate footprint is as small as possible.
  // Desktop keeps `tiny` (≈92×128 at 1/8 scale) which still reads at
  // arm's length on a monitor.
  const cardSize = compact ? "micro" : "tiny";
  const cardDimensions = resolveCardDimensions(cardSize);
  const displayWidth = edge ? 52 : tight ? 28 : dense ? 38 : cardDimensions.displayWidth;
  const displayHeight = edge ? 73 : tight ? 39 : dense ? 53 : cardDimensions.displayHeight;
  const cardOffset = edge ? 12 : tight ? 8 : dense ? 10 : compact ? 14 : 42;
  const sectionWidth = displayWidth + Math.max(0, cards.length - 1) * cardOffset;
  const selectedCardSet = new Set(selectedCardIds);
  const highlightedCardSet = new Set(highlightCardIds);
  const statVars: CSSProperties & Record<string, string> = {
    "--play-pill-size": "34px",
    "--play-pill-text-size": "15px",
    "--play-pill-label-size": "8px",
  };
  const content = (
    <section
      role="region"
      aria-label={label}
      className="relative grid flex-none place-items-center"
      data-sim-zone-id={zoneId}
      data-sim-animation-geometry
      style={{ width: sectionWidth, height: displayHeight }}
    >
      <div role="list" className="contents">
        <AnimatedEntityCollection>
          {cards.length > 0 ? (
            cards.map((card, index) => {
              const cardId = card.id;
              const selected = cardId !== undefined && selectedCardSet.has(cardId);
              const highlight = cardId !== undefined && highlightedCardSet.has(cardId);
              const selectionActive = highlightCardIds.length > 0;
              const interactive =
                cardId !== undefined &&
                onCardClick !== undefined &&
                (!selectionActive || highlight);
              const zIndex = highlight ? cards.length + index + 1 : index + 1;
              return (
                <AnimatedEntitySlot
                  key={cardId ?? index}
                  entity={gundamAnimationEntityForCard(card, ownerIdFromZoneId(zoneId))}
                  zoneRef={{
                    kind: "zone",
                    id: zoneId ?? "baseSection",
                    ownerId: ownerIdFromZoneId(zoneId),
                  }}
                  density={compact ? "mini" : "compact"}
                  role="listitem"
                  className="absolute top-0 leading-[0]"
                  style={{ left: index * cardOffset, zIndex, ...statVars }}
                >
                  {interactive ? (
                    <button
                      type="button"
                      aria-label={card.name}
                      aria-pressed={selected}
                      data-card-id={cardId}
                      data-targeting-state={
                        selected ? "selected" : highlight ? "candidate" : undefined
                      }
                      onClick={() => onCardClick(cardId)}
                      className={cn(
                        "relative block leading-[0] rounded-sm text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-accent-hot",
                        selected && "gd-target-selected",
                      )}
                    >
                      <GameCard
                        {...card}
                        size={dense || tight || edge ? undefined : cardSize}
                        scale={edge ? 0.071 : tight ? 0.038 : dense ? 0.052 : undefined}
                        selected={selected}
                        highlight={highlight}
                      />
                      {!compact && <PlayZoneCardBands card={card} section="bottom" />}
                    </button>
                  ) : (
                    <div
                      aria-label={card.name}
                      className="pointer-events-none relative block leading-[0]"
                    >
                      <GameCard
                        {...card}
                        size={dense || tight || edge ? undefined : cardSize}
                        scale={edge ? 0.071 : tight ? 0.038 : dense ? 0.052 : undefined}
                      />
                      {!compact && <PlayZoneCardBands card={card} section="bottom" />}
                    </div>
                  )}
                </AnimatedEntitySlot>
              );
            })
          ) : (
            <div
              className="flex h-full w-full items-center justify-center clip-hud-6 bg-hud-danger/15 px-1 text-center font-mono text-hud-xs font-bold tracking-hud-label text-hud-danger"
              style={{
                border: `1px dashed ${accent}`,
              }}
            >
              {m["sim.seat.base.empty"]()}
            </div>
          )}
        </AnimatedEntityCollection>
      </div>
      {!compact && (
        <div className="font-mono absolute -bottom-[14px] left-1/2 -translate-x-1/2 text-hud-2xs text-hud-text-faint font-bold tracking-hud-label">
          BASE
        </div>
      )}
    </section>
  );

  const ownerId = ownerIdFromZoneId(zoneId);
  return zoneId && ownerId ? (
    <AnimatedZoneSlot
      animationRef={{ kind: "zone", id: zoneId, ownerId }}
      className="flex-none"
      style={{ width: sectionWidth, height: displayHeight }}
    >
      {content}
    </AnimatedZoneSlot>
  ) : (
    content
  );
}

function ownerIdFromZoneId(zoneId: string | undefined): string {
  const separator = zoneId?.indexOf(":") ?? -1;
  return separator >= 0 ? zoneId!.slice(separator + 1) : "";
}
