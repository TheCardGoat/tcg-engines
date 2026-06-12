import { Card } from "./Card";
import { simEntityAnchor, simZoneAnchor } from "./animationAnchors";
import { useMoveSelection } from "./MoveSelectionContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { ZoneBadge } from "./ZoneBadge";
import { useEngineOptional } from "../../engine";
import classes from "./TrashZone.module.css";

interface TrashZoneProps {
  topCard?: {
    imageUrl: string;
    name: string;
    cardId?: string;
    cardType?: "legend" | "unit" | "gear" | "program";
    color?: "blue" | "green" | "red" | "yellow";
  };
  opponent?: boolean;
  side?: "player" | "opponent";
  count?: number;
}

export function TrashZone({ topCard, opponent = false, side, count = 0 }: TrashZoneProps) {
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

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${drop.isOver ? classes.dropOver : ""}`}
      data-testid="trash-zone"
      data-side={side}
      data-count={count}
      {...simZoneAnchor({ id: zoneName, side, visibility: "public", role: "discard" })}
    >
      <div className={classes.inner}>
        {topCard ? (
          <div
            className={classes.cardWrap}
            data-testid="trash-card"
            data-card-id={topCard.cardId}
            data-card-name={topCard.name}
            data-resolving-program={hideResolvingTopCard ? "true" : undefined}
            {...simEntityAnchor({
              entityId: topCard.cardId,
              zoneId: zoneName,
              side,
              face: "public",
            })}
          >
            <Card
              imageUrl={topCard.imageUrl}
              name={topCard.name}
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
