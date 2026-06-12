import { CardImage } from "./CardImage";
import { simZoneAnchor } from "./animationAnchors";
import { useZoneDroppable } from "./useZoneDroppable";
import { ZoneBadge } from "./ZoneBadge";
import classes from "./DeckZone.module.css";

interface DeckZoneProps {
  count?: number;
  opponent?: boolean;
  side?: "player" | "opponent";
}

export function DeckZone({ count = 40, opponent = false, side }: DeckZoneProps) {
  const zoneName = opponent ? "opp-deck" : "p-deck";
  const drop = useZoneDroppable(zoneName);

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${drop.isOver ? classes.dropOver : ""}`}
      data-testid="deck-zone"
      data-side={side}
      data-count={count}
      {...simZoneAnchor({ id: zoneName, side, visibility: "secret", role: "deck" })}
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
      <ZoneBadge position={opponent ? "bottom" : "top"}>Deck</ZoneBadge>
    </div>
  );
}
