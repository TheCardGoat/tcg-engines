import { useEffect, useState } from "react";
import { Card } from "./Card";
import { simEntityAnchor, simZoneAnchor } from "./animationAnchors";
import { ZoneBadge } from "./ZoneBadge";
import {
  PLAYER_SIDE_TO_ID,
  type CardActiveEffectView,
  type EffectiveRule,
  type EngineCardType,
  type Side,
  useInteractionPermission,
} from "../../engine";
import { useMoveSelectionStateForSide } from "./MoveSelectionContext";
import classes from "./LegendsZone.module.css";

const LEGEND_LOG_HOVER_EVENT = "cyberpunk:legend-log-hover";

interface LegendCard {
  imageUrl: string;
  name: string;
  faceDown: boolean;
  spent?: boolean;
  /** Engine instance id, when the card is engine-driven. */
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
  gear?: Array<{
    imageUrl: string;
    name: string;
    cardId?: string;
    cardType?: EngineCardType;
    cost?: number | null;
    effectiveCost?: number | null;
    costEffects?: readonly CardActiveEffectView[];
    power?: number | null;
    effectivePower?: number | null;
    rulesText?: string | null;
    classifications?: readonly string[];
    keywords?: readonly string[];
    effectiveRules?: readonly EffectiveRule[];
    activeEffects?: readonly CardActiveEffectView[];
    hasSellTag?: boolean;
  }>;
  peeked?: boolean;
}

interface LegendsZoneProps {
  legends?: LegendCard[];
  opponent?: boolean;
  side?: Side;
}

export function LegendsZone({ legends = [], opponent = false, side }: LegendsZoneProps) {
  const zoneName = opponent ? "opp-legends" : "p-legends";
  const faceDownCount = legends.filter((l) => l.faceDown).length;
  const [logHighlight, setLogHighlight] = useState<{ ownerId: string; index: number } | null>(null);
  const ownerId = side ? String(PLAYER_SIDE_TO_ID[side]) : null;

  useEffect(() => {
    const handleLogHover = (event: Event) => {
      const detail = (event as CustomEvent<{ ownerId?: string | null; index?: number | null }>)
        .detail;
      if (!detail?.ownerId || detail.index === null || detail.index === undefined) {
        setLogHighlight(null);
        return;
      }
      setLogHighlight({ ownerId: detail.ownerId, index: detail.index });
    };
    window.addEventListener(LEGEND_LOG_HOVER_EVENT, handleLogHover);
    return () => window.removeEventListener(LEGEND_LOG_HOVER_EVENT, handleLogHover);
  }, []);

  return (
    <div
      className={`${classes.zone} ${opponent ? classes.opponent : ""}`}
      data-testid="legends-zone"
      data-side={side}
      data-count={legends.length}
      data-face-down-count={faceDownCount}
      {...simZoneAnchor({ id: zoneName, side, visibility: "private", role: "battlefield" })}
    >
      <div className={classes.slots}>
        {Array.from({ length: 3 }).map((_, i) => {
          const legend = legends[i];
          return (
            <LegendSlot
              key={i}
              legend={legend}
              index={i}
              ownerId={ownerId}
              logHighlight={logHighlight}
              side={side}
              zoneName={zoneName}
            />
          );
        })}
      </div>
      <ZoneBadge position={opponent ? "top" : "bottom"}>Legends</ZoneBadge>
    </div>
  );
}

function LegendSlot({
  legend,
  index,
  ownerId,
  logHighlight,
  side,
  zoneName,
}: {
  legend: LegendCard | undefined;
  index: number;
  ownerId: string | null;
  logHighlight: { ownerId: string; index: number } | null;
  side: Side | undefined;
  zoneName: string;
}) {
  const permission = useInteractionPermission(side ?? "player", legend?.cardId ?? "");
  const selectedMove = useMoveSelectionStateForSide(side ?? "player")?.moveId ?? null;
  const canCallLegend =
    permission.kind === "armable" &&
    permission.actionIds.some((actionId) => actionId === "callLegend");
  const isSelectedCallLegendCandidate = selectedMove === "callLegend" && canCallLegend;
  const isActionable =
    permission.kind === "selectable" ||
    (selectedMove ? isSelectedCallLegendCandidate : canCallLegend);
  const publicLegendAttrs =
    legend && !legend.faceDown
      ? {
          "data-card-id": legend.cardId,
          "data-card-name": legend.name,
          "data-card-type": legend.cardType,
          "data-card-color": legend.color,
          ...simEntityAnchor({
            entityId: legend.cardId,
            zoneId: zoneName,
            side,
            face: "public",
          }),
        }
      : {};

  return (
    <div
      className={classes.slot}
      data-testid="legend-slot"
      data-occupied={legend ? "true" : "false"}
      data-face-down={legend ? (legend.faceDown ? "true" : "false") : undefined}
      data-spent={legend ? (legend.spent ? "true" : "false") : undefined}
      data-log-highlight={
        ownerId && logHighlight?.ownerId === ownerId && logHighlight.index === index
          ? "true"
          : "false"
      }
      data-peeked={legend?.peeked ? "true" : "false"}
      data-actionable={isActionable ? "true" : "false"}
      data-selection-candidate={isSelectedCallLegendCandidate ? "true" : "false"}
      {...publicLegendAttrs}
    >
      {legend ? (
        <Card
          imageUrl={legend.imageUrl}
          faceDown={legend.faceDown}
          name={legend.name}
          cardType={legend.cardType}
          color={legend.color}
          tapped={legend.spent}
          rotateWhenTapped={false}
          zone={zoneName}
          index={index}
          acceptsDrop
          cardId={legend.cardId}
          side={side}
          effectiveRules={legend.effectiveRules}
          rulesText={legend.rulesText}
          classifications={legend.classifications}
          keywords={legend.keywords}
          hasSellTag={legend.hasSellTag}
          cost={legend.cost}
          effectiveCost={legend.effectiveCost}
          costEffects={legend.costEffects}
          power={legend.power}
          effectivePower={legend.effectivePower}
          activeEffects={legend.activeEffects}
          gear={legend.gear}
          peeked={legend.peeked}
        />
      ) : null}
    </div>
  );
}
