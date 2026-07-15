import type { SimulatorDeckReveal } from "@tcg/simulator-contract";
import { DeckRevealShelf } from "@tcg/simulator-ui";

import { CardImage } from "./CardImage";
import { useZoneDroppable } from "./useZoneDroppable";
import { ZoneBadge } from "./ZoneBadge";
import classes from "./DeckZone.module.css";

interface DeckZoneProps {
  count?: number;
  opponent?: boolean;
  side?: "player" | "opponent";
  reveal?: SimulatorDeckReveal;
}

export function DeckZone({ count = 40, opponent = false, side, reveal }: DeckZoneProps) {
  const zoneName = opponent ? "opp-deck" : "p-deck";
  const drop = useZoneDroppable(zoneName);

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${drop.isOver ? classes.dropOver : ""}`}
      data-testid="deck-zone"
      data-zone-id={opponent ? "opp-deck" : "p-deck"}
      data-sim-zone-id={opponent ? "opp-deck" : "p-deck"}
      data-side={side}
      data-count={count}
      data-has-reveal={reveal ? "true" : "false"}
    >
      <div className={classes.inner}>
        {count > 0 ? (
          <div className={classes.cardWrap}>
            <CardImage faceDown alt="Deck" />
            <span className={classes.count}>{count}</span>
          </div>
        ) : (
          <div className={classes.empty} />
        )}
      </div>
      {reveal ? (
        <DeckRevealShelf
          reveal={reveal}
          compact
          className={`${classes.revealShelf} ${opponent ? classes.revealShelfOpponent : ""}`}
        />
      ) : null}
      <ZoneBadge position={opponent ? "bottom" : "top"} label="Deck">
        Deck
      </ZoneBadge>
    </div>
  );
}
