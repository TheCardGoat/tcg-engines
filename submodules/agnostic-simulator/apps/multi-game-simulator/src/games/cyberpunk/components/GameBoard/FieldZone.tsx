import { useLayoutEffect, useRef, useState } from "react";
import { Card, type CardGearAttachment } from "./Card";
import { useDragDrop } from "./DragDropContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { ZoneBadge } from "./ZoneBadge";
import type { CardActiveEffectView, EffectiveRule, EngineCardType, Side } from "../../engine";
import classes from "./FieldZone.module.css";

// Vertical percentage margins resolve against card width. For a 5:7 card,
// 33.6% width reserves the same space as the 24% vertical gear peek.
const GEAR_PEEK_MARGIN_PERCENT = 33.6;

interface FieldUnit {
  imageUrl: string;
  name: string;
  definitionId?: string;
  tapped?: boolean;
  gear?: CardGearAttachment[];
  /** Engine instance id, when the card is engine-driven. */
  cardId?: string;
  hasLag?: boolean;
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

interface FieldZoneProps {
  units?: FieldUnit[];
  opponent?: boolean;
  side?: Side;
  scrollAxis?: "horizontal" | "vertical";
}

export function FieldZone({
  units = [],
  opponent = false,
  side,
  scrollAxis = "vertical",
}: FieldZoneProps) {
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const centeredHorizontalScrollKeyRef = useRef<string | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const zoneName = opponent ? "opp-field" : "p-field";
  const horizontalScrollKey =
    scrollAxis === "horizontal"
      ? units.map((unit, index) => unit.cardId ?? `${unit.name}-${index}`).join("|")
      : "";
  const drop = useZoneDroppable(zoneName);
  const { activeSource } = useDragDrop();
  const dropReady =
    activeSource?.zone === "p-hand" && zoneName === "p-field"
      ? "play"
      : activeSource?.zone === "p-field" && zoneName === "opp-field"
        ? "attack"
        : undefined;

  useLayoutEffect(() => {
    const node = cardsRef.current;
    if (!node) return;

    const updateScrollable = () => {
      if (scrollAxis === "horizontal") {
        const overflow = node.scrollWidth - node.clientWidth;
        setIsScrollable(overflow > 1);
        if (
          overflow > 1 &&
          centeredHorizontalScrollKeyRef.current !== horizontalScrollKey &&
          node.scrollLeft <= 1
        ) {
          node.scrollLeft = Math.round(overflow / 2);
          centeredHorizontalScrollKeyRef.current = horizontalScrollKey;
        }
        return;
      }

      const rowTops = Array.from(node.children).reduce<number[]>((tops, child) => {
        const top = Math.round(child.getBoundingClientRect().top);
        if (!tops.some((existing) => Math.abs(existing - top) <= 1)) {
          tops.push(top);
        }
        return tops;
      }, []);

      setIsScrollable(node.scrollHeight - node.clientHeight > 1 || rowTops.length > 1);
    };

    updateScrollable();
    const frame = window.requestAnimationFrame(updateScrollable);
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateScrollable);

    resizeObserver?.observe(node);
    Array.from(node.children).forEach((child) => {
      resizeObserver?.observe(child);
    });
    window.addEventListener("resize", updateScrollable);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateScrollable);
    };
  }, [horizontalScrollKey, scrollAxis, units.length]);

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${opponent ? classes.opp : ""} ${drop.isOver ? classes.dropOver : ""}`}
      data-testid="field-zone"
      data-zone-id={zoneName}
      data-sim-zone-id={zoneName}
      data-side={side}
      data-count={units.length}
      data-drop-ready={dropReady}
      data-drop-over={drop.isOver ? "true" : "false"}
    >
      <ZoneBadge position={opponent ? "bottom" : "top"} className={classes.fieldBadge}>
        Field
      </ZoneBadge>
      <div
        ref={cardsRef}
        className={classes.cards}
        data-testid="field-cards"
        data-scroll-axis={scrollAxis}
        data-scrollable={isScrollable ? "true" : "false"}
      >
        {units.map((unit, i) => (
          <div
            key={unit.cardId ?? i}
            className={`${classes.card} ${unit.tapped ? classes.tapped : ""}`}
            style={{
              ["--attached-gear-space" as string]: `${
                (unit.gear?.length ?? 0) * GEAR_PEEK_MARGIN_PERCENT
              }%`,
            }}
            data-testid="field-unit"
            data-card-id={unit.cardId}
            data-instance-id={unit.cardId}
            data-definition-id={unit.definitionId}
            data-sim-entity-id={unit.cardId}
            data-card-name={unit.name}
            data-card-type={unit.cardType}
            data-card-color={unit.color}
            data-cost={unit.cost ?? undefined}
            data-effective-cost={unit.effectiveCost ?? unit.cost ?? undefined}
            data-power={unit.effectivePower ?? unit.power ?? undefined}
            data-spent={unit.tapped ? "true" : "false"}
            data-has-lag={unit.hasLag ? "true" : "false"}
            data-ready={unit.tapped ? "false" : "true"}
            data-gear-count={unit.gear?.length ?? 0}
          >
            <Card
              imageUrl={unit.imageUrl}
              name={unit.name}
              definitionId={unit.definitionId}
              cardType={unit.cardType}
              color={unit.color}
              gear={unit.gear}
              zone={zoneName}
              index={i}
              tapped={unit.tapped}
              hasLag={unit.hasLag}
              acceptsDrop
              cardId={unit.cardId}
              side={side}
              effectiveRules={unit.effectiveRules}
              rulesText={unit.rulesText}
              classifications={unit.classifications}
              keywords={unit.keywords}
              hasSellTag={unit.hasSellTag}
              cost={unit.cost}
              effectiveCost={unit.effectiveCost}
              costEffects={unit.costEffects}
              power={unit.power}
              effectivePower={unit.effectivePower}
              activeEffects={unit.activeEffects}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
