import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { m } from "../../../lib/i18n/messages.ts";
import { useLayoutMode } from "../../../lib/use-layout-mode.ts";
import { cn } from "../../../lib/utils.ts";
import { GameCard } from "../GameCard.tsx";
import type { GameCardData, PlayerInfo } from "../types.ts";
import type { SeatSide } from "./PlayerSeat.tsx";
import { DeckStack } from "./DeckStack.tsx";
import { DiscardSlot } from "./DiscardSlot.tsx";

interface ResourceAreaRowProps {
  readonly side: SeatSide;
  readonly player: PlayerInfo;
  readonly resourceArea: readonly GameCardData[];
  readonly discard: readonly GameCardData[];
  readonly availableResources: number;
  readonly className?: string;
}

export function ResourceAreaRow({
  side,
  player,
  resourceArea,
  discard,
  availableResources,
  className,
}: ResourceAreaRowProps) {
  const isTop = side === "top";
  const flip = !isTop;
  const isMobile = useLayoutMode() === "mobile";
  const playerId = player.name;

  if (isMobile) {
    return (
      <MobileZoneStrip
        side={side}
        playerId={playerId}
        deckCount={player.deck ?? 0}
        trashCount={player.discard ?? 0}
        discard={discard}
        availableResources={availableResources}
        totalResources={resourceArea.length}
        className={className}
      />
    );
  }

  const factionTint = isTop
    ? "linear-gradient(180deg, rgba(122,18,32,.35), rgba(248,250,254,.6))"
    : "linear-gradient(0deg,   rgba(10,31,92,.35),  rgba(248,250,254,.6))";

  return (
    <div
      className={cn("flex items-center gap-3 px-5 py-2.5 min-h-[76px] relative", className)}
      style={{
        background: factionTint,
        borderBottom: isTop ? "1px solid rgba(45,107,255,.25)" : "none",
        borderTop: isTop ? "none" : "1px solid rgba(45,107,255,.25)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 40px, rgba(45,107,255,.03) 40px 41px)",
        }}
      />
      <div className={cn("flex items-center gap-1.5", flip && "order-3")}>
        <DeckStack
          count={player.deck ?? 0}
          label={m["sim.seat.deck.label"]()}
          zoneId={`deck:${playerId}`}
        />
        <DiscardSlot
          count={player.discard ?? 0}
          topCard={discard.at(-1) ?? null}
          isTop={isTop}
          zoneId={`trash:${playerId}`}
        />
      </div>
      <section
        role="region"
        aria-label={
          isTop
            ? m["sim.seat.resources.listLabelOpponent"]()
            : m["sim.seat.resources.listLabelSelf"]()
        }
        className={cn(
          "flex-1 flex items-center justify-start gap-1 min-h-[52px] relative pl-6",
          flip && "order-2",
        )}
        data-sim-zone-id={`resourceArea:${playerId}`}
        data-sim-resource-anchor-id={playerId}
      >
        <span className="absolute -top-2 left-0 z-10 font-mono text-hud-2xs text-hud-accent/70 font-bold tracking-hud-label bg-hud-deep/90 border border-hud-border/30 rounded-sm px-1.5 py-0.5 pointer-events-none">
          {String(availableResources).padStart(2, "0")}/
          {String(resourceArea.length).padStart(2, "0")}
        </span>
        {resourceArea.length === 0 ? (
          <span className="font-mono text-hud-xs text-white/25 tracking-hud-label">
            {m["sim.seat.resources.empty"]()}
          </span>
        ) : (
          resourceArea.map((c, i) => {
            const used = i >= availableResources;
            return (
              <GameCard key={c.id ?? i} {...c} size="micro" style={{ opacity: used ? 0.45 : 1 }} />
            );
          })
        )}
      </section>
    </div>
  );
}

interface MobileZoneStripProps {
  readonly side: SeatSide;
  readonly playerId: string;
  readonly deckCount: number;
  readonly trashCount: number;
  readonly discard: readonly GameCardData[];
  readonly availableResources: number;
  readonly totalResources: number;
  readonly className?: string;
}

/**
 * Compact mobile replacement for the desktop ResourceAreaRow. Renders a
 * thin (~32px) horizontal strip with three counter chips:
 *   • DECK N      — info only (deck cards are hidden)
 *   • TRASH N     — tap to open a gd-sheet listing the discard pile
 *   • RES A/T     — active / total resource count
 *
 * Matches the "minimal counter strip" pattern from the official Gundam
 * mobile demo. The full resource cards never render here — taking that
 * vertical real estate back is the whole point of the mobile redesign.
 */
function MobileZoneStrip({
  side,
  playerId,
  deckCount,
  trashCount,
  discard,
  availableResources,
  totalResources,
  className,
}: MobileZoneStripProps) {
  const isTop = side === "top";
  const [trashOpen, setTrashOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 min-h-[32px] flex-shrink-0 relative text-hud-text",
        className,
      )}
      style={{
        background: isTop
          ? "linear-gradient(180deg, rgba(255,45,122,.06), rgba(248,250,254,.4))"
          : "linear-gradient(0deg, rgba(45,107,255,.06), rgba(248,250,254,.4))",
        borderBottom: isTop ? "1px solid rgba(45,107,255,.18)" : "none",
        borderTop: isTop ? "none" : "1px solid rgba(45,107,255,.18)",
      }}
    >
      <Chip
        label={m["sim.seat.deck.label"]()}
        value={String(deckCount)}
        zoneId={`deck:${playerId}`}
      />
      <Chip
        label={m["sim.seat.discard.label"]()}
        value={String(trashCount)}
        zoneId={`trash:${playerId}`}
        // Gate on `discard.length` (not `trashCount`) so the chip matches
        // what the sheet would actually render. Avoids the mismatch
        // window where the count is non-zero but the cards array hasn't
        // been hydrated yet — opening would show a misleading empty
        // sheet keyed by the discard-empty message.
        onClick={discard.length > 0 ? () => setTrashOpen(true) : undefined}
      />
      <Chip
        label={m["sim.seat.resources.label"]()}
        value={`${availableResources}/${totalResources}`}
        accent="blue"
        zoneId={`resourceArea:${playerId}`}
      />
      <TrashSheet open={trashOpen} onOpenChange={setTrashOpen} cards={discard} />
    </div>
  );
}

interface ChipProps {
  readonly label: string;
  readonly value: string;
  readonly accent?: "blue" | "neutral";
  readonly onClick?: () => void;
  readonly zoneId?: string;
}

function Chip({ label, value, accent = "neutral", onClick, zoneId }: ChipProps) {
  const interactive = Boolean(onClick);
  const valueColor = accent === "blue" ? "#2d6bff" : "#1a2542";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      data-sim-zone-id={zoneId}
      data-sim-resource-anchor-id={
        zoneId?.startsWith("resourceArea:") ? zoneId.slice(13) : undefined
      }
      className={cn(
        "flex items-center gap-1 px-2 py-0.5 clip-hud-3 border tracking-hud-label font-mono text-hud-2xs uppercase",
        "border-hud-border bg-white/80",
        interactive ? "cursor-pointer hover:border-hud-border-hot" : "cursor-default",
      )}
    >
      <span className="text-hud-text-faint">{label}</span>
      <span className="font-display text-hud-md font-extrabold" style={{ color: valueColor }}>
        {value}
      </span>
    </button>
  );
}

interface TrashSheetProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly cards: readonly GameCardData[];
}

/**
 * Bottom sheet listing the discard pile cards on mobile. Uses Radix
 * Dialog primitives directly (instead of the styled wrapper) so we
 * inherit focus trap, ESC-to-close, and `aria-modal` semantics for
 * keyboard / AT users — but apply the existing `gd-sheet` classes
 * verbatim so the visual is identical to the previous custom-DOM
 * implementation.
 */
function TrashSheet({ open, onOpenChange, cards }: TrashSheetProps) {
  // Render newest-on-top to match the rest of the UI, which treats
  // `discard.at(-1)` as the visible top of the pile (see DiscardSlot).
  // `[...cards]` clones before reverse to avoid mutating the upstream
  // readonly array.
  const ordered = [...cards].reverse();
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="gd-sheet-backdrop" />
        <DialogPrimitive.Content
          className="gd-sheet focus:outline-none"
          aria-label={m["sim.seat.discard.label"]()}
        >
          <div className="gd-sheet-grabber" aria-hidden />
          <header className="flex items-center justify-between px-4 py-2 border-b border-hud-border">
            <DialogPrimitive.Title className="font-display text-hud-md font-extrabold tracking-hud-display text-hud-text">
              {m["sim.seat.discard.label"]()} · {cards.length}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close"
              className="font-mono text-hud-xs text-hud-text-muted px-2 py-1 hover:text-hud-text"
            >
              ✕
            </DialogPrimitive.Close>
          </header>
          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-3 gap-2 place-items-center">
            {ordered.length === 0 ? (
              <span className="col-span-3 font-mono text-hud-xs text-hud-text-faint">
                {m["sim.seat.discard.empty"]()}
              </span>
            ) : (
              ordered.map((c, i) => <GameCard key={c.id ?? i} {...c} size="small" />)
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
