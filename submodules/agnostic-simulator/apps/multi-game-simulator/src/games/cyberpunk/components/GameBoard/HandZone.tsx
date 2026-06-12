import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "./Card";
import { CardImage } from "./CardImage";
import { simEntityAnchor, simZoneAnchor } from "./animationAnchors";
import { useDragDrop } from "./DragDropContext";
import { useHandCommand, useSelectedHandCard } from "./useHandCommand";
import { useMoveSelection } from "./MoveSelectionContext";
import { useZoneDroppable } from "./useZoneDroppable";
import type { CardActiveEffectView, EffectiveRule, EngineCardType, Side } from "../../engine";
import classes from "./HandZone.module.css";
import { DEFAULT_PLAYER_ZONE_WIDTH, computePlayerHandLayout } from "./handLayout";

interface HandCard {
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

interface HandZoneProps {
  faceDown?: boolean;
  cardCount?: number;
  /** When provided, render these specific cards (engine-driven). */
  cards?: HandCard[];
  side?: Side;
  /**
   * Current available Eddies for the hand owner. When provided, each card
   * gets a `data-affordable` flag for targeted affordances such as cost badges.
   * The "you have enough Eddies" check is purely an affordance hint —
   * the engine still owns the final legality decision.
   */
  availableEddies?: number;
}

function useElementWidth<TElement extends HTMLElement>(): [
  (element: TElement | null) => void,
  number,
] {
  const [element, setElement] = useState<TElement | null>(null);
  const [width, setWidth] = useState(DEFAULT_PLAYER_ZONE_WIDTH);
  const setMeasuredElement = useCallback((nextElement: TElement | null) => {
    setElement((currentElement) => (currentElement === nextElement ? currentElement : nextElement));
  }, []);

  useEffect(() => {
    if (!element) {
      return undefined;
    }

    const updateWidth = () => setWidth(element.getBoundingClientRect().width);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [setMeasuredElement, width];
}

export function HandZone({
  faceDown = false,
  cardCount = 6,
  cards,
  side,
  availableEddies,
}: HandZoneProps) {
  const renderCount = cards ? cards.length : cardCount;
  const [setZoneElement, zoneWidth] = useElementWidth<HTMLDivElement>();
  const playerLayout = computePlayerHandLayout(renderCount, zoneWidth);
  const layout = playerLayout.cards;
  const cardW = playerLayout.cardWidth;
  const variantClass = faceDown ? classes.opponent : classes.player;
  const zoneName = faceDown ? "opp-hand" : "p-hand";
  const drop = useZoneDroppable(faceDown ? null : zoneName);
  const setDropNodeRef = drop.setNodeRef;
  const currentZoneElement = useRef<HTMLDivElement | null>(null);
  const setZoneRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (currentZoneElement.current !== node) {
        currentZoneElement.current = node;
        setZoneElement(node);
      }
      setDropNodeRef(node);
    },
    [setDropNodeRef, setZoneElement],
  );
  const { activeSource } = useDragDrop();
  const isReturnDropReady = !faceDown && activeSource?.zone === zoneName;
  const [selectedCardId, setSelectedCardId] = useSelectedHandCard();
  const moveSelection = useMoveSelection();
  const command = useHandCommand({
    cards,
    selectedCardId,
    setSelectedCardId,
    side,
  });
  const selectedIndex = cards?.findIndex((card) => card.cardId === selectedCardId) ?? -1;
  const selectedLayout = selectedIndex >= 0 ? layout[selectedIndex] : null;

  return (
    <div
      ref={setZoneRef}
      className={`${classes.zone} ${faceDown ? classes.opponentZone : classes.playerZone}`}
      data-testid="hand-zone"
      data-side={side}
      data-face-down={faceDown ? "true" : "false"}
      data-count={renderCount}
      data-drop-zone={!faceDown ? zoneName : undefined}
      data-drop-ready={isReturnDropReady ? "return" : undefined}
      data-drop-over={drop.isOver ? "true" : "false"}
      {...simZoneAnchor({ id: zoneName, side, visibility: "private", role: "hand" })}
      style={{
        ["--hand-card-w" as string]: `${playerLayout.cardWidth}px`,
      }}
    >
      {faceDown ? (
        <span className={classes.opponentCount} data-testid="opponent-hand-count">
          <span>HAND</span>
          <strong>{renderCount}</strong>
        </span>
      ) : null}
      {!faceDown && command.visible ? (
        <div
          className={classes.commandTray}
          data-testid="hand-command-tray"
          data-for-card-id={command.selectedCard?.cardId ?? undefined}
          style={{
            ["--tray-x" as string]: `${selectedLayout?.x ?? 0}px`,
          }}
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
      {layout.map(({ angle, x, y }, i) => {
        const positionStyle = faceDown
          ? {
              left: `calc(50% - ${cardW / 2}px + ${x}px)`,
              top: `${-y}px`,
            }
          : {
              left: `calc(50% - ${cardW / 2}px + ${x}px)`,
              bottom: `${-y}px`,
            };
        const card = cards?.[i];
        const stagedProgram =
          Boolean(card?.cardId) &&
          moveSelection.selection?.moveId === "playCard" &&
          moveSelection.selection.sourceCardType === "program" &&
          moveSelection.selection.sourceCardId === card?.cardId;
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
            className={`${classes.card} ${variantClass}`}
            data-testid="hand-card"
            data-face-down={faceDown ? "true" : "false"}
            data-selected={card?.cardId && card.cardId === selectedCardId ? "true" : "false"}
            data-staged-program={stagedProgram ? "true" : undefined}
            {...publicCardAttrs}
            data-ready={card && !faceDown ? "true" : undefined}
            style={{
              ...positionStyle,
              ["--card-rotate" as string]: `${angle}deg`,
              zIndex: card?.cardId === selectedCardId ? 230 : i + 1,
            }}
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
  );
}
