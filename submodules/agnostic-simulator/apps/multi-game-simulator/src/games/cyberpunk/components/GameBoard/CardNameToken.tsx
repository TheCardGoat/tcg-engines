import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import { useCardView, useCardViewByName, type CardColor } from "../../engine/zoneViews";
import { useCardInspect } from "./CardInspectContext";
import { useCardPreview, type CardPreviewDetails } from "./CardPreviewContext";
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
  const { show, hide } = useCardPreview();
  const { inspect } = useCardInspect();
  const resolvedCard = card ?? cardByName;

  if (!resolvedCard) {
    return (
      <span className={`${classes.missing} ${className ?? ""}`}>{fallbackName ?? cardId}</span>
    );
  }

  const accent = CARD_ACCENT[resolvedCard.color];
  const style = { ["--card-name-accent" as string]: accent } as CSSProperties;
  const previewDetails: CardPreviewDetails = {
    name: resolvedCard.name,
    cardType: resolvedCard.cardType,
    cost: resolvedCard.cost,
    effectiveCost: resolvedCard.effectiveCost,
    power: resolvedCard.power,
    effectivePower: resolvedCard.effectivePower,
    classifications: resolvedCard.classifications,
    keywords: resolvedCard.keywords,
    rules: [
      ...resolvedCard.keywords.map(formatPreviewKeyword),
      ...(resolvedCard.rulesText ? [resolvedCard.rulesText] : []),
      ...resolvedCard.effectiveRules
        .filter((rule) => !resolvedCard.keywords.includes(rule))
        .map((rule) => `Effective: ${formatPreviewKeyword(rule)}.`),
    ],
    costEffects: resolvedCard.costEffects,
    activeEffects: resolvedCard.activeEffects,
    hasSellTag: resolvedCard.hasSellTag,
  };
  const showPreview = () =>
    show({
      imageUrl: resolvedCard.imageUrl,
      alt: resolvedCard.name,
      color: resolvedCard.color,
      details: previewDetails,
    });
  const openInspect = (ev: MouseEvent<HTMLSpanElement>) => {
    ev.stopPropagation();
    hide();
    inspect({
      imageUrl: resolvedCard.imageUrl,
      name: resolvedCard.name,
      color: resolvedCard.color,
    });
  };
  const openInspectFromKeyboard = (ev: KeyboardEvent<HTMLSpanElement>) => {
    if (ev.key !== "Enter" && ev.key !== " ") {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    hide();
    inspect({
      imageUrl: resolvedCard.imageUrl,
      name: resolvedCard.name,
      color: resolvedCard.color,
    });
  };

  return (
    <span
      className={`${classes.token} ${className ?? ""}`}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${resolvedCard.name}`}
      onClick={openInspect}
      onKeyDown={openInspectFromKeyboard}
      onMouseEnter={showPreview}
      onMouseLeave={hide}
      onFocus={showPreview}
      onBlur={hide}
    >
      {resolvedCard.name}
    </span>
  );
}

function formatPreviewKeyword(rule: string): string {
  return rule
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}
