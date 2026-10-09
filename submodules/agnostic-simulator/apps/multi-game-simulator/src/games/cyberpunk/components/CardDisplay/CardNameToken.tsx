import type { CSSProperties, HTMLAttributes } from "react";
import { useCardPreview, type CardPreviewDetails } from "../CardPreview/CardPreviewContext";
import {
  useCardView,
  useCardViewByName,
  type CardColor,
  type ZoneCardView,
} from "../../engine/zoneViews";
import { useHasHover } from "../../../../lib/media-query";
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

interface CardNameTextProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  color?: CardColor;
}

/** Shared card-name presentation for live cards and pregame deck lists. */
export function CardNameText({ name, color, className, style, ...props }: CardNameTextProps) {
  const accent = color ? CARD_ACCENT[color] : undefined;
  const tokenStyle = {
    ...style,
    ["--card-name-accent" as string]: accent ?? "#dce8ea",
  } as CSSProperties;
  return (
    <span className={`${classes.token} ${className ?? ""}`} style={tokenStyle} {...props}>
      {name}
    </span>
  );
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
  const hasHover = useHasHover();
  const resolvedCard = card ?? cardByName;

  if (!resolvedCard) {
    return (
      <span className={`${classes.missing} ${className ?? ""}`}>{fallbackName ?? cardId}</span>
    );
  }

  const namedReferenceIsRevealed = fallbackName === resolvedCard.name;
  const showPreview = () => {
    if (!resolvedCard.imageUrl || (resolvedCard.faceDown && !namedReferenceIsRevealed)) return;

    show({
      imageUrl: resolvedCard.imageUrl,
      face: "public",
      alt: resolvedCard.name,
      color: resolvedCard.color,
      details: toPreviewDetails(resolvedCard),
    });
  };

  if (!interactive) {
    return (
      <CardNameText
        name={resolvedCard.name}
        color={resolvedCard.color}
        className={className}
        onMouseEnter={showPreview}
        onMouseLeave={hide}
      />
    );
  }

  return (
    <CardNameText
      name={resolvedCard.name}
      color={resolvedCard.color}
      role="button"
      tabIndex={0}
      className={className}
      onMouseEnter={showPreview}
      onMouseLeave={hide}
      onFocus={showPreview}
      onBlur={hide}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        showPreview();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        showPreview();
      }}
      aria-label={`${hasHover ? "Preview" : "Inspect"} ${resolvedCard.name}`}
    />
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
