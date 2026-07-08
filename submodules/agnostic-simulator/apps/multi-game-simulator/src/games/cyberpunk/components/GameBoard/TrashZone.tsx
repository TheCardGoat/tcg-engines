import { Card } from "./Card";
import { useMoveSelection } from "./MoveSelectionContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { ZoneBadge } from "./ZoneBadge";
import { useEngineOptional } from "../../engine";
import classes from "./TrashZone.module.css";

interface TrashZoneCard {
  imageUrl: string;
  name: string;
  cardId?: string;
  definitionId?: string;
  cardType?: "legend" | "unit" | "gear" | "program";
  color?: "blue" | "green" | "red" | "yellow";
  spent?: boolean;
  playedThisTurn?: boolean;
  faceDown?: boolean;
}

interface TrashZoneProps {
  topCard?: TrashZoneCard;
  cards?: readonly TrashZoneCard[];
  opponent?: boolean;
  side?: "player" | "opponent";
  count?: number;
}

export function TrashZone({ topCard, cards, opponent = false, side, count = 0 }: TrashZoneProps) {
  const zoneName = opponent ? "opp-trash" : "p-trash";
  const drop = useZoneDroppable(zoneName);
  const engine = useEngineOptional();
  const moveSelection = useMoveSelection();
  const resolvingProgramId = engine
    ? (resolvingProgramIdFromPrompt(engine.prompts.player.choice) ??
      resolvingProgramIdFromPrompt(engine.prompts.opponent.choice) ??
      (moveSelection.selection?.moveId === "playCard" &&
      moveSelection.selection.sourceCardType === "program"
        ? moveSelection.selection.sourceCardId
        : undefined))
    : undefined;
  const hideResolvingTopCard = Boolean(topCard?.cardId && topCard.cardId === resolvingProgramId);
  const trashCards = cards ?? (topCard ? [topCard] : []);

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${drop.isOver ? classes.dropOver : ""}`}
      data-testid="trash-zone"
      data-zone-id={opponent ? "opp-trash" : "p-trash"}
      data-sim-zone-id={opponent ? "opp-trash" : "p-trash"}
      data-side={side}
      data-count={count}
    >
      <div className={classes.inner}>
        {topCard ? (
          <div
            className={classes.cardWrap}
            data-testid="trash-card"
            data-card-id={topCard.cardId}
            data-instance-id={topCard.cardId}
            data-definition-id={topCard.definitionId}
            data-sim-entity-id={topCard.cardId}
            data-card-name={topCard.name}
            data-resolving-program={hideResolvingTopCard ? "true" : undefined}
          >
            <Card
              imageUrl={topCard.imageUrl}
              name={topCard.name}
              definitionId={topCard.definitionId}
              cardId={topCard.cardId}
              cardType={topCard.cardType}
              color={topCard.color}
              zone={zoneName}
              index={0}
              side={side}
            />
          </div>
        ) : (
          <div className={classes.empty} />
        )}
      </div>
      <div data-testid="trash-card-list" hidden>
        {trashCards.map((card, index) => (
          <div
            key={`${card.cardId ?? card.definitionId ?? card.name}-${index}`}
            data-testid="trash-zone-card"
            data-zone-index={index}
            data-card-id={card.cardId}
            data-instance-id={card.cardId}
            data-definition-id={card.definitionId}
            data-card-name={card.name}
            data-card-type={card.cardType}
            data-card-color={card.color}
            data-face-down={card.faceDown ? "true" : undefined}
            data-played-this-turn={card.playedThisTurn ? "true" : "false"}
            data-spent={card.spent ? "true" : "false"}
          />
        ))}
      </div>
      <ZoneBadge position={opponent ? "top" : "bottom"}>Trash</ZoneBadge>
    </div>
  );
}

function resolvingProgramIdFromPrompt(
  choice: NonNullable<ReturnType<typeof useEngineOptional>>["prompts"]["player"]["choice"],
): string | undefined {
  if (
    choice?.type === "chooseTarget" &&
    choice.payload.type === "effectTarget" &&
    choice.payload.source?.cardId
  ) {
    return choice.payload.source.cardId;
  }
  return undefined;
}
