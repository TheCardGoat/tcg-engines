import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AnimatedEntityCollection, AnimatedEntityNode, useAnimationNode } from "@tcg/simulator-ui";
import { Card, type CardGearAttachment } from "./Card";
import { useZoneDroppable } from "./useZoneDroppable";
import { ZoneBadge } from "./ZoneBadge";
import {
  PLAYER_SIDE_TO_ID,
  type CardActiveEffectView,
  type EffectiveRule,
  type EngineCardType,
  type Side,
} from "../../engine";
import classes from "./FieldZone.module.css";

// Attached gear extends 24% of the 5:7 unit card height, or 33.6% of its
// width. Keep this as a count so CSS can resolve it against the card width,
// rather than the much wider field container.

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
  side: Side;
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
  const [isVerticallyScrollable, setIsVerticallyScrollable] = useState(false);
  const zoneName = opponent ? "opp-field" : "p-field";
  const ownerId = String(PLAYER_SIDE_TO_ID[side]);
  const setAnimationZoneRef = useAnimationNode(
    { kind: "zone", id: zoneName, ownerId },
    { zoneId: zoneName, density: "normal", presence: "present" },
  );
  const horizontalScrollKey =
    scrollAxis === "horizontal"
      ? units.map((unit, index) => unit.cardId ?? `${unit.name}-${index}`).join("|")
      : "";
  const drop = useZoneDroppable(zoneName);
  const setZoneRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop.setNodeRef(node);
      setAnimationZoneRef(node);
    },
    [drop.setNodeRef, setAnimationZoneRef],
  );
  const { dropReady } = drop;

  useLayoutEffect(() => {
    const node = cardsRef.current;
    if (!node) return;

    const updateScrollable = () => {
      if (scrollAxis === "horizontal") {
        const overflow = node.scrollWidth - node.clientWidth;
        setIsScrollable(overflow > 1);

        const styles = window.getComputedStyle(node);
        const contentTop = Number.parseFloat(styles.paddingTop) || 0;
        const contentBottom = node.clientHeight - (Number.parseFloat(styles.paddingBottom) || 0);
        /*
          Card badges and tap transforms can enlarge scrollHeight without
          increasing the space the Unit and its Gear stack need. Compare the
          untransformed layout boxes instead, including the Gear-space margin.
        */
        const hasDeepStack = Array.from(node.children).some((child) => {
          if (!(child instanceof HTMLElement)) return false;
          const childStyles = window.getComputedStyle(child);
          const marginTop = Number.parseFloat(childStyles.marginTop) || 0;
          const marginBottom = Number.parseFloat(childStyles.marginBottom) || 0;
          const outerTop = child.offsetTop - marginTop;
          const outerBottom = child.offsetTop + child.offsetHeight + marginBottom;
          return outerTop < contentTop - 1 || outerBottom > contentBottom + 1;
        });
        setIsVerticallyScrollable(hasDeepStack);

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

      const bounds = node.getBoundingClientRect();
      const hasVisibleVerticalOverflow = Array.from(node.children).some((child) => {
        const cardBounds = child.getBoundingClientRect();
        return cardBounds.top < bounds.top - 1 || cardBounds.bottom > bounds.bottom + 1;
      });

      /*
        A tapped card is shorter but bottom-aligned in an opponent row, so
        sibling cards naturally have different top edges. Row-top comparison
        therefore reported a second row and forced a scrollbar for cards that
        were already fully visible. Scroll only for content that actually
        extends outside the field's visible bounds.
      */
      setIsScrollable(node.scrollTop > 1 || hasVisibleVerticalOverflow);
      setIsVerticallyScrollable(false);
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
      ref={setZoneRef}
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
        data-vertical-scrollable={isVerticallyScrollable ? "true" : "false"}
      >
        <AnimatedEntityCollection>
          {units.map((unit, i) => (
            <AnimatedEntityNode
              key={unit.cardId ?? `field-${i}`}
              entityId={unit.cardId ?? `field-${i}`}
              zoneRef={{
                kind: "zone",
                id: zoneName,
                ownerId,
              }}
              density="normal"
              className={`${classes.card} ${unit.tapped ? classes.tapped : ""}`}
              style={{
                ["--attached-gear-count" as string]: unit.gear?.length ?? 0,
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
            </AnimatedEntityNode>
          ))}
        </AnimatedEntityCollection>
      </div>
    </div>
  );
}
