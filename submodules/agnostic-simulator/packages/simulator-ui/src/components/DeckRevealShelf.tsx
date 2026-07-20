import type { SimulatorDeckReveal, SimulatorDeckRevealCard } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardInspector } from "./CardInspector";
import { ViewerSafeCardImage } from "./ViewerSafeCardImage";

export interface DeckRevealShelfProps {
  reveal: SimulatorDeckReveal | undefined;
  className?: string;
  compact?: boolean;
}

export function DeckRevealShelf({ reveal, className, compact = false }: DeckRevealShelfProps) {
  if (!reveal || reveal.count <= 0) {
    return null;
  }

  const identityVisible = reveal.visibility === "public" && reveal.cards.length > 0;
  const label = `${reveal.position === "bottom" ? "Bottom" : "Top"} revealed`;
  const cards: SimulatorDeckRevealCard[] = identityVisible
    ? reveal.cards
    : Array.from({ length: Math.min(reveal.count, 5) }, (_, index) => ({
        entityId: `${reveal.id}-hidden-${index}`,
      }));
  const hiddenRemainder = Math.max(0, reveal.count - cards.length);

  return (
    <div
      className={cx(
        "deck-reveal-shelf pointer-events-auto rounded-md border border-[color-mix(in_srgb,var(--game-accent)_48%,transparent)] bg-[color-mix(in_srgb,var(--board-surface)_86%,black_14%)] p-1.5 text-[var(--board-text)] shadow-[0_12px_28px_rgb(0_0_0/0.42)]",
        compact ? "min-w-[132px]" : "min-w-[180px]",
        className,
      )}
      data-testid="deck-reveal-shelf"
      data-reveal-position={reveal.position}
      data-reveal-visibility={reveal.visibility}
      data-reveal-count={reveal.count}
      aria-label={`${label}: ${reveal.count} ${reveal.count === 1 ? "card" : "cards"}`}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[10px] font-black uppercase leading-none tracking-[0.08em] text-[var(--game-accent)]">
          {label}
        </span>
        <span className="rounded-full border border-white/15 bg-black/40 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
          {reveal.count}
        </span>
      </div>
      <div className="flex max-w-[240px] gap-1 overflow-hidden">
        {cards.map((card, index) => {
          const key = card.entityId ?? `${reveal.id}-${index}`;
          const thumbnail = (
            <span
              className={cx(
                "relative grid shrink-0 place-items-center overflow-hidden rounded-[4px] border bg-slate-950 text-center shadow-sm",
                compact ? "h-[42px] w-[30px]" : "h-[56px] w-[40px]",
                identityVisible ? "border-white/28" : "border-dashed border-white/24",
              )}
              data-testid="deck-reveal-card"
              data-card-id={card.entityId}
              title={identityVisible ? card.title : "Revealed card"}
              style={card.frameColor ? { borderColor: card.frameColor } : undefined}
            >
              {identityVisible && card.imageUrl ? (
                <ViewerSafeCardImage
                  entity={revealCardToEntity(card, reveal, index)}
                  alt={card.title ?? "Revealed card"}
                  fill
                  className="h-full w-full"
                  imageClassName="h-full w-full object-cover"
                  loading="eager"
                />
              ) : identityVisible ? (
                <span className="line-clamp-3 px-0.5 text-[8px] font-bold leading-[1.05] text-white/90">
                  {card.title ?? "Revealed"}
                </span>
              ) : (
                <span className="text-[8px] font-black uppercase tracking-[0.08em] text-white/45">
                  Hidden
                </span>
              )}
            </span>
          );

          return identityVisible ? (
            <CardInspector key={key} entity={revealCardToEntity(card, reveal, index)}>
              {thumbnail}
            </CardInspector>
          ) : (
            <span key={key}>{thumbnail}</span>
          );
        })}
        {hiddenRemainder > 0 ? (
          <span className="grid h-[42px] min-w-[28px] place-items-center rounded-[4px] border border-white/15 bg-black/50 px-1 text-[10px] font-black text-white">
            +{hiddenRemainder}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function revealCardToEntity(
  card: SimulatorDeckRevealCard,
  reveal: SimulatorDeckReveal,
  index: number,
) {
  const title = card.title ?? "Revealed card";
  return {
    id: card.entityId ?? `${reveal.id}-revealed-${index}`,
    title,
    subtitle: card.subtitle ?? `${reveal.position === "bottom" ? "Bottom" : "Top"} revealed`,
    kind: "card" as const,
    ownerId: reveal.ownerId ?? "unknown",
    face: "public" as const,
    states: [],
    stats: [],
    traits: [],
    imageUrl: card.imageUrl,
    frameStyle: card.frameColor ? { color: card.frameColor } : undefined,
  };
}
