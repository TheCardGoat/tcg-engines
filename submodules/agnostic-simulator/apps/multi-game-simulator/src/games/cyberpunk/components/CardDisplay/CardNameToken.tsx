import type { CSSProperties } from "react";
import { useCardPreview, type CardPreviewDetails } from "../CardPreview/CardPreviewContext";
import {
  useCardView,
  useCardViewByName,
  type CardColor,
  type ZoneCardView,
} from "../../engine/zoneViews";
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
  interactive?: boolean;
}

export function CardNameToken({
  cardId,
  fallbackName,
  className,
  interactive = true,
}: CardNameTokenProps) {
  const card = useCardView(cardId);
  const cardByName = useCardViewByName(card ? null : (fallbackName ?? null));
  const { show, hide } = useCardPreview();
  const resolvedCard = card ?? cardByName;

  if (!resolvedCard) {
    return (
      <span className={`${classes.missing} ${className ?? ""}`}>{fallbackName ?? cardId}</span>
    );
  }

  const accent = CARD_ACCENT[resolvedCard.color];
  const style = { ["--card-name-accent" as string]: accent } as CSSProperties;
  const namedReferenceIsRevealed = fallbackName === resolvedCard.name;
  const showPreview = () => {
    if (!resolvedCard.imageUrl || (resolvedCard.faceDown && !namedReferenceIsRevealed)) return;

    show({
      imageUrl: resolvedCard.imageUrl,
      alt: resolvedCard.name,
      color: resolvedCard.color,
      details: toPreviewDetails(resolvedCard),
    });
  };

  return (
    <span
      className={`${classes.token} ${className ?? ""}`}
      style={style}
      tabIndex={interactive ? 0 : undefined}
      onMouseEnter={showPreview}
      onMouseLeave={hide}
      onFocus={interactive ? showPreview : undefined}
      onBlur={interactive ? hide : undefined}
    >
      {resolvedCard.name}
    </span>
  );
}

function toPreviewDetails(card: ZoneCardView): CardPreviewDetails {
  return {
    name: card.name,
    cardType: card.cardType,
    cost: card.cost,
    effectiveCost: card.effectiveCost,
    power: card.power,
    effectivePower: card.effectivePower,
    classifications: card.classifications,
    keywords: card.keywords,
    rules: [
      ...card.keywords.map(formatPreviewKeyword),
      ...(card.rulesText ? [card.rulesText] : []),
      ...card.effectiveRules
        .filter((rule) => !card.keywords.includes(rule))
        .map((rule) => `Effective: ${formatPreviewKeyword(rule)}.`),
    ],
    costEffects: card.costEffects,
    activeEffects: card.activeEffects,
    hasSellTag: card.hasSellTag,
  };
}

function formatPreviewKeyword(rule: string): string {
  return rule
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}
