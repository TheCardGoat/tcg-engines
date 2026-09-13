import type { SimulatorEntity } from "@tcg/simulator-contract";
import { Card } from "./Card";
import { DiscardPileZone } from "@tcg/simulator-ui";
import { useMoveSelection } from "./MoveSelectionContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { ZoneBadge } from "./ZoneBadge";
import { useEngineOptional, type Side } from "../../engine";
import { cyberpunkCardZoneToSimulatorZone } from "../../engine/projectSimulator";
import type { KeyboardEvent, MouseEvent } from "react";
import classes from "./TrashZone.module.css";

interface TrashZoneCard {
  imageUrl: string;
  name: string;
  cardId?: string;
  definitionId?: string;
  cardType?: "legend" | "unit" | "gear" | "program";
  color?: "blue" | "green" | "red" | "yellow";
  spent?: boolean;
  hasLag?: boolean;
  faceDown?: boolean;
}

interface TrashZoneProps {
  topCard?: TrashZoneCard;
  cards?: readonly TrashZoneCard[];
  opponent?: boolean;
  side?: "player" | "opponent";
  count?: number;
  onOpen?: () => void;
}

export function TrashZone({
  topCard,
  cards,
  opponent = false,
  side,
  count = 0,
  onOpen,
}: TrashZoneProps) {
  const zoneName = opponent ? "opp-trash" : "p-trash";
  const resolvedSide: Side = side ?? (opponent ? "opponent" : "player");
  const ownerId = cyberpunkCardZoneToSimulatorZone("trash", resolvedSide).ownerId ?? resolvedSide;
  const topEntity = topCard ? trashEntity(topCard, ownerId) : undefined;
  const zone = {
    ...cyberpunkCardZoneToSimulatorZone("trash", resolvedSide),
    entityIds: topEntity ? [topEntity.id] : [],
    count,
    layoutHint: "stack" as const,
  };
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
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onOpen) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onOpen();
  };
  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!onOpen) return;
    // The pile is one navigation target. Its visible top card is a preview,
    // not a separate action: opening that card would leave the rest of the
    // trash inaccessible from a direct tap.
    event.preventDefault();
    event.stopPropagation();
    onOpen();
  };

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${drop.isOver ? classes.dropOver : ""} ${
        onOpen ? classes.interactive : ""
      }`}
      data-testid="trash-zone"
      data-zone-id={opponent ? "opp-trash" : "p-trash"}
      data-sim-zone-id={opponent ? "opp-trash" : "p-trash"}
      data-side={side}
      data-count={count}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={`${opponent ? "Rival" : "Your"} Trash, ${count} ${
        count === 1 ? "card" : "cards"
      }`}
      aria-haspopup={onOpen ? "dialog" : undefined}
      onClickCapture={handleClickCapture}
      onKeyDown={handleKeyDown}
    >
      <div className={classes.inner}>
        <DiscardPileZone
          zone={zone}
          entities={topEntity ? [topEntity] : []}
          entityCount={count}
          label="Trash"
          emptyLabel="Trash"
          density="mini"
          className={classes.pile}
          renderTopEntity={() =>
            topCard ? (
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
            ) : null
          }
        />
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
            data-has-lag={card.hasLag ? "true" : "false"}
            data-spent={card.spent ? "true" : "false"}
          />
        ))}
      </div>
      <ZoneBadge position={opponent ? "top" : "bottom"} label="Trash">
        Trash
      </ZoneBadge>
    </div>
  );
}

function trashEntity(card: TrashZoneCard, ownerId: string): SimulatorEntity {
  const id = card.cardId ?? card.definitionId ?? `${ownerId}:trash:${card.name}`;
  return {
    id,
    title: card.faceDown ? "Hidden card" : card.name,
    subtitle: card.faceDown ? "Private information" : (card.cardType ?? "card"),
    kind: "card",
    ownerId,
    face: card.faceDown ? "hidden" : "public",
    states: [
      ...(card.spent ? (["rested"] as const) : []),
      ...(card.faceDown ? (["hidden"] as const) : []),
    ],
    stats: [],
    traits: [],
    imageUrl: card.faceDown ? undefined : card.imageUrl,
    dataAttributes: {
      "data-card-id": id,
      "data-definition-id": card.definitionId,
      "data-card-type": card.cardType,
      "data-card-color": card.color,
    },
  };
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
