import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconArrowBarToDown,
  IconArrowBarToUp,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";
import { Card } from "./Card";
import { CardImage } from "./CardImage";
import { useDragDrop } from "./DragDropContext";
import { useHandCardTap } from "./useHandCardTap";
import { useHandCommand, useSelectedHandCard } from "./useHandCommand";
import { useZoneDroppable } from "./useZoneDroppable";
import type { CardActiveEffectView, EffectiveRule, EngineCardType, Side } from "../../engine";
import classes from "./MobileHandZone.module.css";

interface MobileHandCard {
  imageUrl: string;
  name: string;
  definitionId?: string;
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
  temporaryRevealed?: boolean;
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
  onMeasure?: (measurement: MobileHandMeasurement) => void;
}

export interface MobileHandMeasurement {
  availableWidth: number;
  contentWidth: number;
  naturalWidth: number;
}

interface HandOverflowState {
  before: boolean;
  after: boolean;
}

function compactRules(card: MobileHandCard | null | undefined): string {
  const printed = card?.rulesText ? [card.rulesText] : [];
  const effective =
    card?.effectiveRules
      ?.filter((rule) => !card.keywords?.includes(rule))
      .map((rule) => `Effective: ${rule}.`) ?? [];
  const source = [...(card?.keywords ?? []), ...printed, ...effective].join(" ");
  return source.replace(/\s+/g, " ").trim();
}

function cardKindLabel(card: MobileHandCard | null | undefined): string {
  const parts = [...(card?.classifications ?? []), ...(card?.keywords ?? [])].filter(Boolean);
  if (parts.length > 0) {
    return parts.slice(0, 2).join(" / ");
  }
  return card?.cardType ?? "Card";
}

function statLabel(value: number | null | undefined): string {
  return typeof value === "number" ? String(value) : "-";
}

function parseCssPixels(value: string | null | undefined): number {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Flat horizontal hand for mobile. Cards compress only when the viewport cannot
 * fit their full widths; otherwise they spread without overlap.
 * Reuses the same Card / CardImage primitives (and therefore the same drag
 * source wiring via zone="p-hand") as the desktop fanned HandZone.
 */
export function MobileHandZone({
  faceDown = false,
  cardCount,
  cards,
  side,
  availableEddies,
  onMeasure,
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
  const visibleOpponentCards = faceDown && !cards ? Math.min(renderCount, 5) : renderCount;
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const lastMeasurementRef = useRef<MobileHandMeasurement | null>(null);
  const [spreadMode, setSpreadMode] = useState<"stacked" | "full">("stacked");
  const [commandPlacement, setCommandPlacement] = useState<"player" | "rival">("player");
  const [overflow, setOverflow] = useState<HandOverflowState>({ before: false, after: false });
  const { handleHandCardPointerDown, handleHandCardPointerUp } = useHandCardTap({
    faceDown,
    selectCard: command.selectCard,
  });

  const updateOverflow = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      setOverflow((current) =>
        current.before || current.after ? { before: false, after: false } : current,
      );
      return;
    }
    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const next = {
      before: scroller.scrollLeft > 2,
      after: scroller.scrollLeft < maxScrollLeft - 2,
    };
    setOverflow((current) =>
      current.before === next.before && current.after === next.after ? current : next,
    );
  }, []);

  const scrollHand = useCallback((direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    scroller.scrollBy({
      left: direction * Math.max(72, Math.floor(scroller.clientWidth * 0.62)),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    let frame: number | null = null;
    const measure = () => {
      frame = null;
      const scrollerRect = scroller.getBoundingClientRect();
      const childRects = Array.from(scroller.children)
        .filter((child): child is HTMLElement => child instanceof HTMLElement)
        .map((child) => child.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0);
      const style = window.getComputedStyle(scroller);
      const inlinePadding = parseCssPixels(style.paddingLeft) + parseCssPixels(style.paddingRight);
      const itemGap = parseCssPixels(style.columnGap) || parseCssPixels(style.gap);
      const childSpan =
        childRects.length > 0
          ? Math.max(...childRects.map((rect) => rect.right)) -
            Math.min(...childRects.map((rect) => rect.left))
          : 0;
      const naturalWidth =
        childRects.reduce((sum, rect) => sum + rect.width, 0) +
        Math.max(0, childRects.length - 1) * itemGap +
        inlinePadding;
      const next = {
        availableWidth: scrollerRect.width,
        contentWidth: childSpan + inlinePadding,
        naturalWidth,
      };
      const nextSpreadMode =
        !faceDown && naturalWidth <= scrollerRect.width + 1 ? "full" : "stacked";
      setSpreadMode((current) => (current === nextSpreadMode ? current : nextSpreadMode));
      updateOverflow();
      const last = lastMeasurementRef.current;
      if (
        !last ||
        Math.abs(last.availableWidth - next.availableWidth) > 1 ||
        Math.abs(last.contentWidth - next.contentWidth) > 1 ||
        Math.abs(last.naturalWidth - next.naturalWidth) > 1
      ) {
        lastMeasurementRef.current = next;
        onMeasure?.(next);
      }
    };
    const scheduleMeasure = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      frame = window.requestAnimationFrame(measure);
    };

    scheduleMeasure();
    scroller.addEventListener("scroll", updateOverflow, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleMeasure);
    observer?.observe(scroller);
    for (const child of Array.from(scroller.children)) {
      if (child instanceof HTMLElement) {
        observer?.observe(child);
      }
    }

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      scroller.removeEventListener("scroll", updateOverflow);
      window.removeEventListener("resize", scheduleMeasure);
      observer?.disconnect();
    };
  }, [command.visible, faceDown, onMeasure, renderCount, updateOverflow, visibleOpponentCards]);

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${variantClass}`}
      data-testid="hand-zone"
      data-zone-id={zoneName}
      data-sim-zone-id={zoneName}
      data-active-fan="true"
      data-side={side}
      data-face-down={faceDown ? "true" : "false"}
      data-count={renderCount}
      data-spread-mode={spreadMode}
      data-overflow-before={overflow.before ? "true" : "false"}
      data-overflow-after={overflow.after ? "true" : "false"}
      data-drop-zone={!faceDown ? zoneName : undefined}
      data-drop-ready={isReturnDropReady ? "return" : undefined}
      data-drop-over={drop.isOver ? "true" : "false"}
    >
      {!faceDown && command.visible ? (
        <div
          className={classes.commandTray}
          data-testid="hand-command-tray"
          data-for-card-id={command.selectedCard?.cardId ?? undefined}
          data-command-placement={commandPlacement}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={classes.commandChrome}>
            <button
              type="button"
              className={classes.commandIconButton}
              data-testid="hand-action-toggle-placement"
              aria-label={
                commandPlacement === "rival"
                  ? "Move hand actions back to your hand"
                  : "Move hand actions to rival hand"
              }
              aria-pressed={commandPlacement === "rival"}
              title={commandPlacement === "rival" ? "Move to your hand" : "Move to rival hand"}
              onClick={() =>
                setCommandPlacement((current) => (current === "rival" ? "player" : "rival"))
              }
            >
              {commandPlacement === "rival" ? (
                <IconArrowBarToDown size={14} stroke={1.8} aria-hidden="true" />
              ) : (
                <IconArrowBarToUp size={14} stroke={1.8} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className={classes.commandIconButton}
              data-testid="hand-action-close"
              aria-label="Close hand actions"
              title="Close"
              onClick={() => setSelectedCardId(null)}
            >
              <IconX size={14} stroke={1.9} aria-hidden="true" />
            </button>
          </div>
          <div className={classes.commandPeek}>
            <button
              type="button"
              className={classes.commandPreviewImageButton}
              onClick={command.inspectSelected}
              aria-label={`Inspect ${command.selectedCard?.name ?? "selected card"}`}
            >
              <CardImage
                imageUrl={command.selectedCard?.imageUrl}
                alt={command.selectedCard?.name ?? "Selected card"}
                disablePreview
              />
            </button>
            <div className={classes.commandCopy}>
              <div className={classes.commandHeading}>
                <span className={classes.commandName}>{command.selectedCard?.name}</span>
                <div className={classes.commandMeta} aria-label="Selected card details">
                  <span className={classes.commandKind}>{cardKindLabel(command.selectedCard)}</span>
                  <div className={classes.commandStats} aria-label="Selected card stats">
                    <span>
                      C{" "}
                      {statLabel(command.selectedCard?.effectiveCost ?? command.selectedCard?.cost)}
                    </span>
                    <span>
                      P{" "}
                      {statLabel(
                        command.selectedCard?.effectivePower ?? command.selectedCard?.power,
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <p className={classes.commandRules}>
                {compactRules(command.selectedCard) || "No rules text."}
              </p>
            </div>
          </div>
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
      {!faceDown && overflow.before ? (
        <span
          className={`${classes.edgeFade} ${classes.edgeFadeBefore}`}
          data-testid="mobile-hand-overflow-before"
          aria-hidden="true"
        />
      ) : null}
      {!faceDown && overflow.after ? (
        <span
          className={`${classes.edgeFade} ${classes.edgeFadeAfter}`}
          data-testid="mobile-hand-overflow-after"
          aria-hidden="true"
        />
      ) : null}
      {!faceDown && overflow.before ? (
        <button
          type="button"
          className={`${classes.scrollCue} ${classes.scrollCueBefore}`}
          aria-label="Show earlier hand cards"
          onClick={() => scrollHand(-1)}
        >
          <IconChevronLeft size={16} stroke={2.2} aria-hidden="true" />
        </button>
      ) : null}
      {!faceDown && overflow.after ? (
        <button
          type="button"
          className={`${classes.scrollCue} ${classes.scrollCueAfter}`}
          aria-label="Show more hand cards"
          onClick={() => scrollHand(1)}
        >
          <IconChevronRight size={16} stroke={2.2} aria-hidden="true" />
        </button>
      ) : null}
      <div ref={scrollerRef} className={classes.scroller} data-testid="mobile-hand-scroller">
        {Array.from({ length: visibleOpponentCards }, (_, i) => {
          const card = cards?.[i];
          const cardRevealed = faceDown && card?.temporaryRevealed === true;
          const cardFaceDown = faceDown && !cardRevealed;
          const affordable =
            card &&
            !faceDown &&
            typeof (card.effectiveCost ?? card.cost) === "number" &&
            typeof availableEddies === "number"
              ? availableEddies >= (card.effectiveCost ?? card.cost)!
              : undefined;
          const publicCardAttrs =
            card && !cardFaceDown
              ? {
                  "data-card-id": card.cardId,
                  "data-instance-id": card.cardId,
                  "data-definition-id": card.definitionId,
                  "data-card-name": card.name,
                  "data-card-type": card.cardType,
                  "data-card-color": card.color,
                  "data-cost": card.cost ?? undefined,
                  "data-effective-cost": card.effectiveCost ?? card.cost ?? undefined,
                  "data-power": card.effectivePower ?? card.power ?? undefined,
                  "data-affordable":
                    affordable === undefined ? undefined : affordable ? "true" : "false",
                }
              : {};
          return (
            <div
              key={card?.cardId ?? i}
              className={classes.slot}
              data-testid="hand-card"
              data-face-down={cardFaceDown ? "true" : "false"}
              data-temporary-revealed={cardRevealed ? "true" : undefined}
              data-ready={card && !cardFaceDown ? "true" : undefined}
              data-selected={card?.cardId && card.cardId === selectedCardId ? "true" : "false"}
              {...publicCardAttrs}
              data-sim-entity-id={!cardFaceDown ? card?.cardId : undefined}
              style={{ zIndex: card?.cardId === selectedCardId ? 200 : i + 1 }}
              onPointerDown={(event) => handleHandCardPointerDown(card?.cardId, event)}
              onPointerUp={(event) => handleHandCardPointerUp(card?.cardId, event)}
            >
              {cardFaceDown ? (
                <CardImage faceDown disablePreview alt="Opponent card" />
              ) : (
                <Card
                  imageUrl={card?.imageUrl}
                  name={card?.name}
                  definitionId={card?.definitionId}
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
                  disablePreview
                  disableActionMenu
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
