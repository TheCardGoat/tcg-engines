import { Card } from "./Card";
import { CardImage } from "./CardImage";
import { simEntityAnchor, simZoneAnchor } from "./animationAnchors";
import { useDragDrop } from "./DragDropContext";
import { useHandCommand, useSelectedHandCard } from "./useHandCommand";
import { useZoneDroppable } from "./useZoneDroppable";
import type { CardActiveEffectView, EffectiveRule, EngineCardType, Side } from "../../engine";
import classes from "./MobileHandZone.module.css";

interface MobileHandCard {
  imageUrl: string;
  name: string;
  cardId?: string;
  cardType?: EngineCardType;
  color?: "blue" | "green" | "red" | "yellow";
  effectiveRules?: readonly EffectiveRule[];
  rulesText?: string | null;
  classifications?: readonly string[];
  keywords?: readonly string[];
  hasSellTag?: boolean;
  cost?: number | null;
  effectiveCost?: number | null;
  costEffects?: readonly CardActiveEffectView[];
  power?: number | null;
  effectivePower?: number | null;
  activeEffects?: readonly CardActiveEffectView[];
}

interface MobileHandZoneProps {
  faceDown?: boolean;
  /** Used for face-down (opponent) hand to render N silhouettes. */
  cardCount?: number;
  /** Real cards (player hand). When provided, drives the rendered slots. */
  cards?: ReadonlyArray<MobileHandCard>;
  side?: Side;
  /** Current spendable Eddies. Drives `data-affordable` per card for targeted affordances. */
  availableEddies?: number;
}

/**
 * Flat horizontal hand for mobile. Cards overlap so 6+ fit in a phone-width
 * row; if the hand grows past the viewport the row scrolls horizontally.
 * Reuses the same Card / CardImage primitives (and therefore the same drag
 * source wiring via zone="p-hand") as the desktop fanned HandZone.
 */
export function MobileHandZone({
  faceDown = false,
  cardCount,
  cards,
  side,
  availableEddies,
}: MobileHandZoneProps) {
  const variantClass = faceDown ? classes.opp : classes.player;
  const zoneName = faceDown ? "opp-hand" : "p-hand";
  const renderCount = cards ? cards.length : (cardCount ?? 0);
  const drop = useZoneDroppable(faceDown ? null : zoneName);
  const { activeSource } = useDragDrop();
  const isReturnDropReady = !faceDown && activeSource?.zone === zoneName;
  const [selectedCardId, setSelectedCardId] = useSelectedHandCard();
  const command = useHandCommand({
    cards,
    selectedCardId,
    setSelectedCardId,
    side,
  });
  const visibleOpponentCards = faceDown ? Math.min(renderCount, 5) : renderCount;

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${variantClass}`}
      data-testid="hand-zone"
      data-side={side}
      data-face-down={faceDown ? "true" : "false"}
      data-count={renderCount}
      data-drop-zone={!faceDown ? zoneName : undefined}
      data-drop-ready={isReturnDropReady ? "return" : undefined}
      data-drop-over={drop.isOver ? "true" : "false"}
      {...simZoneAnchor({ id: zoneName, side, visibility: "private", role: "hand" })}
    >
      {faceDown ? (
        <div className={classes.oppCount} data-testid="opponent-hand-count">
          <span>HAND</span>
          <strong>{renderCount}</strong>
        </div>
      ) : null}
      {!faceDown && command.visible ? (
        <div
          className={classes.commandTray}
          data-testid="hand-command-tray"
          data-for-card-id={command.selectedCard?.cardId ?? undefined}
          onClick={(event) => event.stopPropagation()}
        >
          <span className={classes.commandName}>{command.selectedCard?.name}</span>
          <div className={classes.commandActions}>
            {command.canPlay ? (
              <button type="button" data-testid="hand-action-play" onClick={command.play}>
                Play
              </button>
            ) : null}
            {command.canGoSolo ? (
              <button type="button" data-testid="hand-action-goSolo" onClick={command.goSolo}>
                Go Solo
              </button>
            ) : null}
            {command.canSell ? (
              <button type="button" data-testid="hand-action-sell" onClick={command.sell}>
                Sell
              </button>
            ) : null}
            <button type="button" onClick={command.inspectSelected}>
              Inspect
            </button>
          </div>
        </div>
      ) : null}
      <div className={classes.scroller}>
        {Array.from({ length: visibleOpponentCards }, (_, i) => {
          const card = cards?.[i];
          const affordable =
            card &&
            !faceDown &&
            typeof (card.effectiveCost ?? card.cost) === "number" &&
            typeof availableEddies === "number"
              ? availableEddies >= (card.effectiveCost ?? card.cost)!
              : undefined;
          const publicCardAttrs =
            card && !faceDown
              ? {
                  "data-card-id": card.cardId,
                  "data-card-name": card.name,
                  "data-card-type": card.cardType,
                  "data-card-color": card.color,
                  "data-cost": card.cost ?? undefined,
                  "data-effective-cost": card.effectiveCost ?? card.cost ?? undefined,
                  "data-power": card.effectivePower ?? card.power ?? undefined,
                  "data-affordable":
                    affordable === undefined ? undefined : affordable ? "true" : "false",
                  ...simEntityAnchor({
                    entityId: card.cardId,
                    zoneId: zoneName,
                    side,
                    face: "public",
                  }),
                }
              : {};
          return (
            <div
              key={card?.cardId ?? i}
              className={classes.slot}
              data-testid="hand-card"
              data-face-down={faceDown ? "true" : "false"}
              data-ready={card && !faceDown ? "true" : undefined}
              data-selected={card?.cardId && card.cardId === selectedCardId ? "true" : "false"}
              {...publicCardAttrs}
              style={{ zIndex: card?.cardId === selectedCardId ? 200 : i + 1 }}
            >
              {faceDown ? (
                <CardImage faceDown disablePreview alt="Opponent card" />
              ) : (
                <Card
                  imageUrl={card?.imageUrl}
                  name={card?.name}
                  cardType={card?.cardType}
                  color={card?.color}
                  zone={zoneName}
                  index={i}
                  cardId={card?.cardId}
                  side={side}
                  effectiveRules={card?.effectiveRules}
                  rulesText={card?.rulesText}
                  classifications={card?.classifications}
                  keywords={card?.keywords}
                  hasSellTag={card?.hasSellTag}
                  cost={card?.cost}
                  effectiveCost={card?.effectiveCost}
                  costEffects={card?.costEffects}
                  power={card?.power}
                  effectivePower={card?.effectivePower}
                  activeEffects={card?.activeEffects}
                  onCardClick={command.selectCard}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
