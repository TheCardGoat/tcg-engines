import { Card, type CardGearAttachment } from "./Card";
import { simEntityAnchor, simZoneAnchor } from "./animationAnchors";
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
  tapped?: boolean;
  gear?: CardGearAttachment[];
  /** Engine instance id, when the card is engine-driven. */
  cardId?: string;
  playedThisTurn?: boolean;
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
}

export function FieldZone({ units = [], opponent = false, side }: FieldZoneProps) {
  const zoneName = opponent ? "opp-field" : "p-field";
  const drop = useZoneDroppable(zoneName);
  const { activeSource } = useDragDrop();
  const dropReady =
    activeSource?.zone === "p-hand" && zoneName === "p-field"
      ? "play"
      : activeSource?.zone === "p-field" && zoneName === "opp-field"
        ? "attack"
        : undefined;

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${opponent ? classes.opp : ""} ${drop.isOver ? classes.dropOver : ""}`}
      data-testid="field-zone"
      data-side={side}
      data-count={units.length}
      data-drop-ready={dropReady}
      data-drop-over={drop.isOver ? "true" : "false"}
      {...simZoneAnchor({ id: zoneName, side, visibility: "public", role: "battlefield" })}
    >
      <ZoneBadge position={opponent ? "bottom" : "top"} className={classes.fieldBadge}>
        Field
      </ZoneBadge>
      <div className={classes.cards} data-testid="field-cards">
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
            data-card-name={unit.name}
            data-card-type={unit.cardType}
            data-card-color={unit.color}
            data-cost={unit.cost ?? undefined}
            data-effective-cost={unit.effectiveCost ?? unit.cost ?? undefined}
            data-power={unit.effectivePower ?? unit.power ?? undefined}
            data-spent={unit.tapped ? "true" : "false"}
            data-played-this-turn={unit.playedThisTurn ? "true" : "false"}
            data-ready={unit.tapped ? "false" : "true"}
            data-gear-count={unit.gear?.length ?? 0}
            {...simEntityAnchor({
              entityId: unit.cardId,
              zoneId: zoneName,
              side,
              face: "public",
            })}
          >
            <Card
              imageUrl={unit.imageUrl}
              name={unit.name}
              cardType={unit.cardType}
              color={unit.color}
              gear={unit.gear}
              zone={zoneName}
              index={i}
              tapped={unit.tapped}
              playedThisTurn={unit.playedThisTurn}
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
