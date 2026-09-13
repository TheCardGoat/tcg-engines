import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { m } from "../../../lib/i18n/messages.ts";

import { GameCardVisual } from "../GameCard.tsx";
import { CardInfoBody } from "../CardInfoDialog.tsx";
import type { GameCardData } from "../types.ts";

interface ZoneCardModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly label: string;
  readonly emptyLabel: string;
  readonly cards: readonly GameCardData[];
  readonly newestFirst?: boolean;
}

/** Lists cards from a public zone without exposing the identities of hidden piles. */
export function ZoneCardModal({
  open,
  onOpenChange,
  label,
  emptyLabel,
  cards,
  newestFirst = false,
}: ZoneCardModalProps) {
  const ordered = newestFirst ? [...cards].reverse() : cards;
  const [inspectedCard, setInspectedCard] = useState<GameCardData | null>(null);

  const inspectedTrigger = useRef<HTMLButtonElement | null>(null);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setInspectedCard(null);
        onOpenChange(nextOpen);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="gd-sheet-backdrop" />
        <DialogPrimitive.Content
          className="gd-sheet gd-dark-surface mx-auto max-w-xl focus:outline-none"
          aria-label={label}
          aria-describedby={undefined}
        >
          <div className="gd-sheet-grabber" aria-hidden />
          <header className="flex items-center justify-between border-b border-hud-border px-4 py-2">
            <DialogPrimitive.Title className="font-display text-hud-md font-extrabold tracking-hud-display text-hud-text">
              {label} · {cards.length}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close"
              className="flex size-11 items-center justify-center font-mono text-hud-xs text-hud-text-muted hover:text-hud-text"
            >
              ✕
            </DialogPrimitive.Close>
          </header>
          {inspectedCard ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <button
                type="button"
                className="sticky -top-3 z-10 mb-3 min-h-11 w-full bg-hud-surface px-3 text-left text-hud-text hover:bg-hud-surface-raised focus-visible:outline focus-visible:outline-hud-accent-hot"
                autoFocus
                onClick={() => {
                  setInspectedCard(null);
                  requestAnimationFrame(() => inspectedTrigger.current?.focus());
                }}
              >
                ← Back to {label}
              </button>
              <div className="relative overflow-hidden rounded-lg border border-hud-border">
                <CardInfoBody card={inspectedCard} />
              </div>
            </div>
          ) : null}
          <div
            hidden={inspectedCard !== null}
            className={`${inspectedCard ? "hidden" : "grid"} min-h-0 flex-1 grid-cols-[repeat(auto-fit,minmax(122px,1fr))] place-items-center gap-3 overflow-y-auto p-3`}
          >
            {ordered.length === 0 ? (
              <span className="col-span-full font-mono text-hud-xs text-hud-text-muted">
                {emptyLabel}
              </span>
            ) : (
              ordered.map((card, index) => (
                <button
                  key={card.id ?? index}
                  type="button"
                  aria-label={`Inspect ${card.name}${card.cardType === "resource" ? ` · ${card.exerted ? m["sim.seat.resources.rested"]() : m["sim.seat.resources.ready"]()}` : ""}`}
                  className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-hud-accent-hot"
                  onClick={(event) => {
                    inspectedTrigger.current = event.currentTarget;
                    setInspectedCard(card);
                  }}
                >
                  <GameCardVisual
                    {...card}
                    // Gallery buttons own inspection; these are not battlefield action anchors.
                    id={undefined}
                    size="small"
                    // Zone galleries keep the full face readable inside each grid cell.
                    style={{ transform: "none" }}
                  />
                  {card.cardType === "resource" ? (
                    <span className="mt-1 block rounded-sm bg-hud-surface-raised px-2 py-1 text-xs font-bold text-hud-text">
                      {card.exerted
                        ? m["sim.seat.resources.rested"]()
                        : m["sim.seat.resources.ready"]()}
                    </span>
                  ) : null}
                </button>
              ))
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
