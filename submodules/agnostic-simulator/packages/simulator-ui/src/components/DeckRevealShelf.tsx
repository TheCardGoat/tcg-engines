import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { SimulatorDeckReveal, SimulatorDeckRevealCard } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardInspector } from "./CardInspector";
import { ViewerSafeCardImage } from "./ViewerSafeCardImage";

export interface DeckRevealShelfProps {
  reveal: SimulatorDeckReveal | undefined;
  className?: string;
  compact?: boolean;
  /** Preferred physical side for the expanded view; collision handling may flip it. */
  preferredSide?: "top" | "bottom";
}

export function DeckRevealShelf({
  reveal,
  className,
  compact = false,
  preferredSide = "bottom",
}: DeckRevealShelfProps) {
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
  const singleCard = cards.length === 1;
  const hiddenRemainder = Math.max(0, reveal.count - cards.length);

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cx(
            "deck-reveal-shelf pointer-events-auto grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 rounded-md border border-[color-mix(in_srgb,var(--game-accent)_48%,transparent)] bg-[color-mix(in_srgb,var(--board-surface)_86%,black_14%)] text-left text-[var(--board-text)] shadow-[0_12px_28px_rgb(0_0_0/0.42)] transition-colors hover:border-[var(--game-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--game-accent)]",
            compact ? "min-h-11 w-[calc(100%_-_0.5rem)] max-w-28 px-2 py-1" : "min-w-[180px] p-1.5",
            className,
          )}
          data-testid="deck-reveal-shelf"
          data-reveal-position={reveal.position}
          data-reveal-visibility={reveal.visibility}
          data-reveal-count={reveal.count}
          aria-label={`View ${label}: ${reveal.count} ${reveal.count === 1 ? "card" : "cards"}`}
        >
          <span className="min-w-0 text-[10px] font-black uppercase leading-none tracking-[0.08em] text-[var(--game-accent)]">
            {label}
          </span>
          <span className="rounded-full border border-white/15 bg-black/40 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
            {reveal.count}
          </span>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="deck-reveal-popover z-[1000] grid max-h-[min(32rem,calc(100vh-2rem))] w-[min(16rem,calc(100vw-2rem))] gap-3 overflow-y-auto rounded-lg border border-[var(--board-border)] bg-[var(--board-surface)] p-2.5 text-[var(--board-text)] shadow-[0_18px_42px_rgb(0_0_0/0.5)]"
          data-testid="deck-reveal-popover"
          side={preferredSide}
          align="center"
          sideOffset={8}
          collisionPadding={16}
          avoidCollisions
          sticky="always"
        >
          <header className="flex items-center justify-between gap-3">
            <strong className="text-xs font-black uppercase tracking-[0.08em] text-[var(--game-accent)]">
              {label}
            </strong>
            <span className="text-xs font-bold text-[var(--board-muted)]">
              {reveal.count} {reveal.count === 1 ? "card" : "cards"}
            </span>
          </header>
          <div
            className={cx(
              "grid gap-2",
              singleCard
                ? "grid-cols-1 justify-items-center"
                : "grid-cols-[repeat(auto-fill,minmax(72px,1fr))]",
            )}
          >
            {cards.map((card, index) => {
              const key = card.entityId ?? `${reveal.id}-${index}`;
              const thumbnail = (
                <span
                  className={cx(
                    "relative grid place-items-center overflow-hidden rounded-[4px] border bg-slate-950 text-center shadow-sm",
                    singleCard ? "h-32 w-24" : "min-h-20",
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
                      className="h-full w-full object-contain"
                      loading="eager"
                    />
                  ) : identityVisible ? (
                    <span className="line-clamp-3 px-1 text-[10px] font-bold leading-[1.15] text-white/90">
                      {card.title ?? "Revealed"}
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-[0.08em] text-white/45">
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
              <span className="grid min-h-16 min-w-11 place-items-center rounded-[4px] border border-white/15 bg-black/50 px-1 text-xs font-black text-white">
                +{hiddenRemainder}
              </span>
            ) : null}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
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
