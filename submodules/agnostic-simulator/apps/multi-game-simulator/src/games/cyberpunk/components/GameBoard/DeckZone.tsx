import type { SimulatorDeckReveal } from "@tcg/simulator-contract";
import { DeckStackZone } from "@tcg/simulator-ui";

import { cyberpunkCardZoneToSimulatorZone } from "../../engine/projectSimulator";
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
  const resolvedSide = side ?? (opponent ? "opponent" : "player");
  const zone = {
    ...cyberpunkCardZoneToSimulatorZone("deck", resolvedSide),
    count,
    layoutHint: "stack" as const,
  };
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
        <DeckStackZone
          zone={zone}
          entities={[]}
          entityCount={count}
          label="Deck"
          emptyLabel="Deck"
          density="mini"
          reveal={reveal}
          revealPreferredSide={opponent ? "bottom" : "top"}
          className={classes.stack}
          renderTopEntity={() => (
            <div
              className={classes.cardWrap}
              data-sim-entity-id={`${opponent ? "opp" : "p"}-deck-stack`}
              data-testid="deck-stack"
            >
              <CardImage faceDown alt="Deck" />
            </div>
          )}
        />
      </div>
      <ZoneBadge position={opponent ? "bottom" : "top"} label="Deck">
        Deck
      </ZoneBadge>
    </div>
  );
}
