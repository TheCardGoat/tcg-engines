import { useEffect, useState } from "react";
import { MaskedCardFrame } from "@tcg/simulator-ui";
import { Card } from "./Card";
import { ZoneBadge } from "./ZoneBadge";
import {
  PLAYER_SIDE_TO_ID,
  type CardActiveEffectView,
  type EffectiveRule,
  type EngineCardType,
  type Side,
  useEngineOptional,
  useInteractionPermission,
} from "../../engine";
import { useMoveSelectionStateForSide } from "./MoveSelectionContext";
import classes from "./LegendsZone.module.css";

const LEGEND_LOG_HOVER_EVENT = "cyberpunk:legend-log-hover";

interface LegendCard {
  imageUrl: string;
  name: string;
  definitionId?: string;
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
  maskBottomPercent?: number;
}

export function LegendsZone({
  legends = [],
  opponent = false,
  side,
  maskBottomPercent,
}: LegendsZoneProps) {
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
      data-zone-id={opponent ? "opp-legendArea" : "p-legendArea"}
      data-sim-zone-id={opponent ? "opp-legendArea" : "p-legendArea"}
      data-side={side}
      data-count={legends.length}
      data-face-down-count={faceDownCount}
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
              maskBottomPercent={maskBottomPercent}
            />
          );
        })}
      </div>
      <ZoneBadge position={opponent ? "top" : "bottom"} label="Legends">
        Legends
      </ZoneBadge>
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
  maskBottomPercent,
}: {
  legend: LegendCard | undefined;
  index: number;
  ownerId: string | null;
  logHighlight: { ownerId: string; index: number } | null;
  side: Side | undefined;
  zoneName: string;
  maskBottomPercent: number | undefined;
}) {
  const permission = useInteractionPermission(side ?? "player", legend?.cardId ?? "");
  const engine = useEngineOptional();
  const isLocalHumanSide = side !== undefined && side === engine?.humanSide;
  const selectedMove = useMoveSelectionStateForSide(side ?? "player")?.moveId ?? null;
  const canCallLegend =
    isLocalHumanSide &&
    permission.kind === "armable" &&
    permission.actionIds.some((actionId) => actionId === "callLegend");
  const isSelectedCallLegendCandidate = selectedMove === "callLegend" && canCallLegend;
  const isActionable =
    (isLocalHumanSide && permission.kind === "selectable") ||
    (selectedMove ? isSelectedCallLegendCandidate : canCallLegend);
  const instanceAttrs = legend
    ? {
        "data-card-id": legend.cardId,
        "data-instance-id": legend.cardId,
      }
    : {};
  const publicLegendAttrs =
    legend && !legend.faceDown
      ? {
          ...instanceAttrs,
          "data-definition-id": legend.definitionId,
          "data-card-name": legend.name,
          "data-card-type": legend.cardType,
          "data-card-color": legend.color,
        }
      : instanceAttrs;

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
      data-call-legend-actionable={canCallLegend ? "true" : "false"}
      data-selection-candidate={isSelectedCallLegendCandidate ? "true" : "false"}
      {...publicLegendAttrs}
    >
      {legend ? (
        maskBottomPercent === undefined ? (
          <LegendCardView legend={legend} index={index} side={side} zoneName={zoneName} />
        ) : (
          <MaskedCardFrame
            maskBottomPercent={maskBottomPercent}
            className={classes.maskedCardFrame}
            ariaLabel={legend.name}
          >
            <LegendCardView legend={legend} index={index} side={side} zoneName={zoneName} />
          </MaskedCardFrame>
        )
      ) : null}
    </div>
  );
}

function LegendCardView({
  legend,
  index,
  side,
  zoneName,
}: {
  legend: LegendCard;
  index: number;
  side: Side | undefined;
  zoneName: string;
}) {
  return (
    <Card
      imageUrl={legend.imageUrl}
      faceDown={legend.faceDown}
      name={legend.name}
      definitionId={legend.definitionId}
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
  );
}
