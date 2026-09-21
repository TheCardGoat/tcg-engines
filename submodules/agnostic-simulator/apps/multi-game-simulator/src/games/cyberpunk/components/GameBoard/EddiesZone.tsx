import type { SimulatorEntity } from "@tcg/simulator-contract";
import { ResourceCardZone } from "@tcg/simulator-ui";

import { CardImage } from "./CardImage";
import { usePaymentSelectionOptional } from "../PaymentSelection/PaymentSelectionContext";
import { useDragDrop } from "./DragDropContext";
import { useZoneDroppable } from "./useZoneDroppable";
import type { Side } from "../../engine";
import { cyberpunkCardZoneToSimulatorZone } from "../../engine/projectSimulator";
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
  /** Stretch the zone box across the available row width instead of hugging its cards. */
  fill?: boolean;
  /** Whether this side already sold a card this turn (sell is once per turn). */
  soldThisTurn?: boolean;
  /**
   * Whether selling is legal for this side right now (see `canShowSellCue`).
   * Drives the desktop "sell here" slot cue; never set on the rival row.
   */
  sellCue?: boolean;
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
  fill = false,
  soldThisTurn = false,
  sellCue = false,
}: EddiesZoneProps) {
  const zoneName = opponent ? "opp-eddies" : "p-eddies";
  const resolvedSide = side ?? (opponent ? "opponent" : "player");
  const zone = cyberpunkCardZoneToSimulatorZone("eddieArea", resolvedSide);
  const drop = useZoneDroppable(zoneName);
  const { activeSource } = useDragDrop();
  const paymentSelection = usePaymentSelectionOptional();
  const dropReady = activeSource?.zone === "p-hand" && zoneName === "p-eddies" ? "sell" : undefined;
  const counterLabel = `${availableCount}/${totalCount}`;
  const physicalCards = cards ?? [];
  const physicalSpentCount = physicalCards.filter((card) => card.spent).length;
  const placeholderCount = Math.max(0, cardCount - physicalCards.length);
  const placeholderSpentCount = Math.max(0, spentCardCount - physicalSpentCount);
  const renderedCards = [
    ...physicalCards,
    ...Array.from({ length: placeholderCount }, (_, i): EddieCardDisplay => ({
      spent: i < placeholderSpentCount,
    })),
  ];
  // Pips stay in engine zone order: regrouping ready/spent moves every later
  // slot when a card flips, remounting them mid-animation and breaking the
  // animation layer's clone anchoring (the row visibly blinks).
  const entities = renderedCards.map((card, index) => eddieEntity(card, index, zone));
  const cardById = new Map(entities.map((entity, index) => [entity.id, renderedCards[index]!]));

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.dropSlot} ${drop.isOver ? classes.dropOver : ""}`}
      data-testid="eddies-drop-slot"
      data-side={side}
      data-drop-zone={zoneName}
      data-drop-ready={dropReady}
      data-drop-over={drop.isOver ? "true" : "false"}
    >
      <ResourceCardZone
        zone={{ ...zone, entityIds: entities.map((entity) => entity.id), count: cardCount }}
        entities={entities}
        entityCount={totalCount}
        availableCount={availableCount}
        label="Eddies"
        emptyLabel="Eddies"
        zoneSlotClassName={classes.zoneSlot}
        className={`${classes.zone} ${fill ? classes.fill : ""} ${opponent ? classes.opponent : ""}`}
        rowClassName={classes.row}
        counterClassName={classes.counter}
        counterAttributes={{
          "data-testid": "eddies-counter",
          "data-available": availableCount,
          "data-total": totalCount,
          "data-resource": "eddies",
          "data-sim-value": counterLabel,
          "data-player-side": side,
        }}
        entityClassName={(entity) => {
          const card = cardById.get(entity.id);
          const paymentEligible = Boolean(
            paymentSelection?.paymentSelectionActive &&
            card?.cardId &&
            paymentSelection.eligiblePaymentSourceIds.has(card.cardId),
          );
          const paymentSelected = Boolean(
            card?.cardId && paymentSelection?.selectedPaymentSourceIds.has(card.cardId),
          );
          return `${classes.card} ${card?.spent ? classes.spent : ""} ${
            card?.revealed ? classes.revealed : ""
          } ${paymentEligible ? classes.paymentEligible : ""} ${
            paymentSelected ? classes.paymentSelected : ""
          }`;
        }}
        entityAttributes={(entity) => {
          const card = cardById.get(entity.id);
          return {
            "data-testid": "card",
            "data-card-kind": "card",
            "data-instance-id": card?.cardId,
            "data-definition-id": card?.revealed ? card.definitionId : undefined,
            "data-card-name": card?.revealed ? card.name : undefined,
            "data-face": card?.revealed ? undefined : "hidden",
            "data-spent": card?.spent ? "true" : "false",
            "data-revealed": card?.revealed ? "true" : "false",
            "data-resource-state": card?.spent ? "spent" : "ready",
            "data-payment-source":
              card?.cardId && paymentSelection?.eligiblePaymentSourceIds.has(card.cardId)
                ? "true"
                : undefined,
            "data-payment-selected":
              card?.cardId && paymentSelection?.selectedPaymentSourceIds.has(card.cardId)
                ? "true"
                : undefined,
          };
        }}
        anchorId={`${opponent ? "opp" : "p"}-eddies`}
        testId="eddies-zone"
        dataAttributes={{
          "data-side": side,
          "data-count": count,
          "data-card-count": cardCount,
          "data-total-count": totalCount,
          "data-drop-ready": dropReady,
          "data-drop-over": drop.isOver ? "true" : "false",
          "data-sold-this-turn": soldThisTurn ? "true" : "false",
          "data-sell-cue": sellCue ? "true" : "false",
        }}
        renderEntity={(entity) => {
          const card = cardById.get(entity.id);
          const paymentEligible = Boolean(
            paymentSelection?.paymentSelectionActive &&
            card?.cardId &&
            paymentSelection.eligiblePaymentSourceIds.has(card.cardId),
          );
          const content = (
            <CardImage
              faceDown={!card?.revealed}
              imageUrl={card?.revealed ? card.imageUrl : undefined}
              alt={card?.revealed ? (card.name ?? "Sold card") : "Eddie"}
            />
          );

          if (paymentEligible && card?.cardId) {
            const sourceId = card.cardId;
            const selected = paymentSelection?.selectedPaymentSourceIds.has(sourceId) ?? false;
            return (
              <button
                type="button"
                className={`${classes.cardBody} ${classes.paymentButton}`}
                aria-label={`${selected ? "Remove" : "Select"} Eddie for payment`}
                aria-pressed={selected}
                onClick={() => paymentSelection?.togglePaymentSource(sourceId)}
              >
                {content}
              </button>
            );
          }
          return <div className={classes.cardBody}>{content}</div>;
        }}
      />
    </div>
  );
}

function eddieEntity(
  card: EddieCardDisplay,
  index: number,
  zone: ReturnType<typeof cyberpunkCardZoneToSimulatorZone>,
): SimulatorEntity {
  const id = card.cardId ?? `${zone.id}:hidden:${index}`;
  return {
    id,
    title: card.revealed ? (card.name ?? "Sold card") : card.spent ? "Spent Eddie" : "Ready Eddie",
    subtitle: card.revealed ? "Sold card" : "Private information",
    kind: "resource",
    ownerId: zone.ownerId ?? "unknown",
    face: card.revealed ? "public" : "hidden",
    states: card.spent ? ["rested"] : ["ready"],
    stats: [],
    traits: [],
    imageUrl: card.revealed ? card.imageUrl : undefined,
    dataAttributes: {
      "data-definition-id": card.revealed ? card.definitionId : undefined,
    },
  };
}
