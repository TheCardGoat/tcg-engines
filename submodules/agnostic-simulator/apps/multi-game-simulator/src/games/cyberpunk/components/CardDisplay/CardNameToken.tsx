import type { CSSProperties } from "react";
import type { SimulatorEntity, SimulatorMetadataItem } from "@tcg/simulator-contract";
import { CardInspector } from "@tcg/simulator-ui";
import { useEngine } from "../../engine";
import { useCardView, useCardViewByName, type CardColor } from "../../engine/zoneViews";
import classes from "./CardNameToken.module.css";

const CARD_ACCENT: Record<CardColor, string> = {
  blue: "#4ad9ff",
  green: "#4af58a",
  red: "#ff4a6b",
  yellow: "#f5e642",
};

interface CardNameTokenProps {
  cardId?: string | null;
  fallbackName?: string | null;
  className?: string;
}

export function CardNameToken({ cardId, fallbackName, className }: CardNameTokenProps) {
  const card = useCardView(cardId);
  const cardByName = useCardViewByName(card ? null : (fallbackName ?? null));
  const { matchState } = useEngine();
  const resolvedCard = card ?? cardByName;

  if (!resolvedCard) {
    return (
      <span className={`${classes.missing} ${className ?? ""}`}>{fallbackName ?? cardId}</span>
    );
  }

  const accent = CARD_ACCENT[resolvedCard.color];
  const style = { ["--card-name-accent" as string]: accent } as CSSProperties;
  const entity = toSimulatorEntity(resolvedCard, cardId ?? fallbackName ?? "unknown", matchState);

  return (
    <CardInspector entity={entity}>
      <span className={`${classes.token} ${className ?? ""}`} style={style}>
        {resolvedCard.name}
      </span>
    </CardInspector>
  );
}

function toSimulatorEntity(
  card: NonNullable<ReturnType<typeof useCardView>>,
  id: string,
  matchState: ReturnType<typeof useEngine>["matchState"],
): SimulatorEntity {
  const instance = card.cardId ? matchState.G.cardIndex[card.cardId] : undefined;
  const ownerId = instance ? String(instance.ownerId) : "";
  const kind: SimulatorEntity["kind"] =
    card.cardType === "legend" ? "leader" : card.cardType === "unit" ? "unit" : "card";

  const stats: SimulatorMetadataItem[] = [];
  if (card.cost !== null && card.cost !== undefined) {
    stats.push({ label: "Cost", value: String(card.cost) });
  }
  if (card.power !== null && card.power !== undefined) {
    stats.push({ label: "Power", value: String(card.power) });
  }

  return {
    id,
    title: card.name,
    subtitle: card.cardType,
    kind,
    ownerId,
    face: card.faceDown ? "hidden" : "public",
    states: card.spent ? ["rested"] : [],
    stats,
    traits: [...card.classifications],
    imageUrl: card.imageUrl,
  };
}
