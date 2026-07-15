import type { CSSProperties } from "react";
import { CardImage } from "./CardImage";
import { useDragDrop } from "./DragDropContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { ZoneBadge } from "./ZoneBadge";
import type { Side } from "../../engine";
import classes from "./EddiesZone.module.css";

interface EddieCardDisplay {
  cardId?: string;
  definitionId?: string;
  spent?: boolean;
  /** When true, the card is rendered face-up (e.g. just sold this turn). */
  revealed?: boolean;
  imageUrl?: string;
  name?: string;
}

interface EddiesZoneProps {
  count?: number;
  cards?: EddieCardDisplay[];
  cardCount?: number;
  spentCardCount?: number;
  availableCount?: number;
  totalCount?: number;
  opponent?: boolean;
  /** Engine side. Surfaced as `data-side` for e2e queries. */
  side?: Side;
}

export function EddiesZone({
  count = 0,
  cards,
  cardCount = count,
  spentCardCount = 0,
  availableCount = count,
  totalCount = count,
  opponent = false,
  side,
}: EddiesZoneProps) {
  const zoneName = opponent ? "opp-eddies" : "p-eddies";
  const drop = useZoneDroppable(zoneName);
  const { activeSource } = useDragDrop();
  const dropReady = activeSource?.zone === "p-hand" && zoneName === "p-eddies" ? "sell" : undefined;
  const counterLabel = `${availableCount}/${totalCount}`;
  const physicalCards = cards ?? [];
  const physicalSpentCount = physicalCards.filter((card) => card.spent).length;
  const placeholderCount = Math.max(0, cardCount - physicalCards.length);
  const placeholderSpentCount = Math.max(0, spentCardCount - physicalSpentCount);
  const renderedCards = [
    ...physicalCards,
    ...Array.from(
      { length: placeholderCount },
      (_, i): EddieCardDisplay => ({
        spent: i < placeholderSpentCount,
      }),
    ),
  ];
  const readyCards = renderedCards.filter((card) => !card.spent);
  const spentCards = renderedCards.filter((card) => card.spent);
  const orderedCards = [...readyCards, ...spentCards];
  const rowStyle = {
    "--eddie-card-count": Math.max(orderedCards.length, 1),
  } as CSSProperties;

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${opponent ? classes.opponent : ""} ${drop.isOver ? classes.dropOver : ""}`}
      data-testid="eddies-zone"
      data-zone-id={opponent ? "opp-eddieArea" : "p-eddieArea"}
      data-sim-zone-id={opponent ? "opp-eddieArea" : "p-eddieArea"}
      data-side={side}
      data-count={count}
      data-card-count={cardCount}
      data-available-count={availableCount}
      data-total-count={totalCount}
      data-drop-ready={dropReady}
      data-drop-over={drop.isOver ? "true" : "false"}
    >
      <div
        className={classes.counter}
        aria-label={`Eddies ${counterLabel}`}
        data-testid="eddies-counter"
        data-sim-anchor-id={`${opponent ? "opp" : "p"}-eddies`}
        data-available={availableCount}
        data-total={totalCount}
        data-resource="eddies"
        data-sim-value={counterLabel}
        data-player-side={side}
      >
        {counterLabel}
      </div>
      <div className={classes.row} style={rowStyle}>
        {orderedCards.map((card, i) => (
          <div
            key={card.cardId ?? i}
            className={`${classes.card} ${card.spent ? classes.spent : ""} ${card.revealed ? classes.revealed : ""}`}
            data-testid="card"
            data-card-kind="card"
            data-entity-id={card.cardId}
            data-instance-id={card.cardId}
            data-definition-id={card.revealed ? card.definitionId : undefined}
            data-card-name={card.revealed ? card.name : undefined}
            data-sim-entity-id={card.cardId}
            data-face={card.revealed ? undefined : "hidden"}
            data-spent={card.spent ? "true" : "false"}
            data-revealed={card.revealed ? "true" : "false"}
          >
            <CardImage
              faceDown={!card.revealed}
              imageUrl={card.revealed ? card.imageUrl : undefined}
              alt={card.revealed ? (card.name ?? "Sold card") : "Eddie"}
            />
          </div>
        ))}
      </div>
      <ZoneBadge position={opponent ? "top" : "bottom"} label="Eddies">
        Eddies
      </ZoneBadge>
    </div>
  );
}
