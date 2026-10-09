import type { SimulatorEntity } from "@tcg/simulator-contract";
import { Card } from "./Card";
import { DiscardPileZone } from "@tcg/simulator-ui";
import { useResolvingProgramId } from "./useResolvingProgramId";
import { useZoneDroppable } from "./useZoneDroppable";
import { ZoneBadge } from "./ZoneBadge";
import { type Side } from "../../engine";
import { cyberpunkCardZoneToSimulatorZone } from "../../engine/projectSimulator";
import { type KeyboardEvent, type MouseEvent, useEffect, useRef, useState } from "react";
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
  /** Cards currently animated by a transfer; while the top card is inbound the
   * pile's animation node is suppressed and the backstop copy keeps it filled. */
  movingIds?: ReadonlySet<string>;
  onOpen?: () => void;
}

export function TrashZone({
  topCard,
  cards,
  opponent = false,
  side,
  count = 0,
  movingIds,
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
  const resolvingProgramId = useResolvingProgramId();
  const hideResolvingTopCard = Boolean(topCard?.cardId && topCard.cardId === resolvingProgramId);
  const trashCards = cards ?? (topCard ? [topCard] : []);
  // Identity for pile comparisons: cardId is optional on TrashZoneCard, so
  // raw cardId equality reports "same" (undefined === undefined) for two
  // key-less cards and silently hides the beneath layer. Fall back to the
  // same definitionId ?? name key the rest of the file uses.
  const cardKey = (card: TrashZoneCard | null | undefined): string | null =>
    card ? (card.cardId ?? card.definitionId ?? card.name) : null;
  // While a discard flight is inbound the presentation state already shows the
  // new top card, which the transfer layer keeps hidden until it lands - the
  // pile would read as empty mid-flight. Keep the previous top card rendered
  // underneath for a grace period; the landed card simply covers it.
  const topKey = topCard ? (topCard.cardId ?? topCard.definitionId ?? topCard.name) : null;
  const [underCard, setUnderCard] = useState<TrashZoneCard | null>(null);
  const previousTopRef = useRef<{ key: string | null; card: TrashZoneCard | undefined }>({
    key: null,
    card: undefined,
  });
  useEffect(() => {
    const previous = previousTopRef.current;
    previousTopRef.current = { key: topKey, card: topCard };
    if (!previous.card || previous.key === topKey) {
      return;
    }
    setUnderCard(previous.card);
    const timer = window.setTimeout(() => setUnderCard(null), 1200);
    return () => window.clearTimeout(timer);
  }, [topKey, topCard]);
  // The pile must never read as empty while it holds cards: whenever the top
  // card is not actually painted (inbound flight, or hidden while it floats as
  // the resolving program), the card beneath it shows instead of a bare zone.
  const beneathCard =
    trashCards.length >= 2 && cardKey(trashCards[trashCards.length - 2]) !== cardKey(topCard)
      ? trashCards[trashCards.length - 2]!
      : null;
  // When a discard lands on a pile of 2+, beneathCard and underCard resolve to
  // the same card — render only one copy so the pile doesn't briefly duplicate
  // a draggable id in the DOM. Compare the fallback key so a key-less card
  // still matches itself instead of hiding the layer.
  const showBeneathCard = Boolean(beneathCard && cardKey(beneathCard) !== cardKey(underCard));
  // A discard flight suppresses the pile's animation node until the transfer
  // lands, hiding every layer rendered inside it. While the top card is
  // inbound, a backstop copy renders outside that node so the zone keeps
  // showing the pile (the previous top) instead of going bare.
  const backstopCard =
    topCard?.cardId && movingIds?.has(topCard.cardId) ? (beneathCard ?? underCard) : null;
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
        {backstopCard ? (
          <div className={classes.backstop} data-testid="trash-card-backstop" aria-hidden>
            <div className={classes.cardWrap}>
              <Card
                imageUrl={backstopCard.imageUrl}
                name={backstopCard.name}
                definitionId={backstopCard.definitionId}
                cardId={backstopCard.cardId}
                cardType={backstopCard.cardType}
                color={backstopCard.color}
                zone={zoneName}
                index={0}
                side={side}
              />
            </div>
          </div>
        ) : null}
        <DiscardPileZone
          zone={zone}
          entities={topEntity ? [topEntity] : []}
          entityCount={count}
          label="Trash"
          emptyLabel="Trash"
          density="mini"
          className={classes.pile}
          renderTopEntity={() => (
            <div className={classes.topStack}>
              {beneathCard && showBeneathCard ? (
                <div className={classes.cardWrap} data-testid="trash-card-beneath" aria-hidden>
                  <Card
                    imageUrl={beneathCard.imageUrl}
                    name={beneathCard.name}
                    definitionId={beneathCard.definitionId}
                    cardId={beneathCard.cardId}
                    cardType={beneathCard.cardType}
                    color={beneathCard.color}
                    zone={zoneName}
                    index={0}
                    side={side}
                  />
                </div>
              ) : null}
              {underCard && cardKey(underCard) !== cardKey(topCard) ? (
                <div className={classes.cardWrap} data-testid="trash-card-previous" aria-hidden>
                  <Card
                    imageUrl={underCard.imageUrl}
                    name={underCard.name}
                    definitionId={underCard.definitionId}
                    cardId={underCard.cardId}
                    cardType={underCard.cardType}
                    color={underCard.color}
                    zone={zoneName}
                    index={0}
                    side={side}
                  />
                </div>
              ) : null}
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
              ) : null}
            </div>
          )}
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
