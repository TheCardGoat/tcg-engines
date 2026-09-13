import type { SimulatorEntity } from "@tcg/simulator-contract";
import type { SimulatorEntityVisualProps } from "@tcg/simulator-ui";
import type { CSSProperties } from "react";

import { GameCardVisual } from "../components/ui/GameCard.tsx";
import {
  CARD_IMAGE_DIMENSIONS,
  GUNDAM_FULL_CARD_ASPECT_RATIO,
  type CardSize,
} from "../components/ui/card/card-image-format.ts";
import type { CardType, GameCardData } from "../components/ui/types.ts";

export function gundamAnimationEntityForCard(card: GameCardData, ownerId: string): SimulatorEntity {
  return {
    id: card.id ?? `${ownerId}:${card.name}`,
    title: card.name,
    subtitle: card.cardType ?? "card",
    kind: simulatorKind(card.cardType),
    ownerId,
    face: card.faceDown ? "hidden" : "public",
    imageAspectRatio: GUNDAM_FULL_CARD_ASPECT_RATIO,
    states: card.exerted ? ["rested"] : [],
    stats: [
      ...(card.cost === undefined ? [] : [{ label: "Cost", value: String(card.cost) }]),
      ...(card.ap === undefined || card.ap === null
        ? []
        : [{ label: "AP", value: String(card.ap) }]),
      ...(card.hp === undefined || card.hp === null
        ? []
        : [{ label: "HP", value: String(card.hp) }]),
    ],
    traits: [...(card.traits ?? [])],
    ...(card.img ? { imageUrl: card.img } : {}),
    dataAttributes: {
      cardType: card.cardType,
      color: card.color,
      cost: card.cost,
      ap: card.ap ?? undefined,
      hp: card.hp ?? undefined,
      damage: card.damage,
    },
  };
}

export function GundamSimulatorEntityVisual({
  entity,
  density,
  className,
  presentation,
}: SimulatorEntityVisualProps) {
  const attributes = entity.dataAttributes ?? {};
  const cardType = cardTypeOf(attributes.cardType, entity.subtitle);
  const cost = numberAttribute(attributes.cost, entity, "Cost");
  const ap = numberAttribute(attributes.ap, entity, "AP");
  const hp = numberAttribute(attributes.hp, entity, "HP");
  const damage = numberAttribute(attributes.damage);
  const { width: cardWidth, height: cardHeight } = CARD_IMAGE_DIMENSIONS.full;
  const cardAspectRatio = cardWidth / cardHeight;
  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    containerType: "size",
    display: "grid",
    placeItems: "center",
  };
  const cardStyle: CSSProperties & {
    "--zone-card-width": string;
    "--zone-card-height": string;
  } = {
    width: `min(100cqw, calc(100cqh * ${cardAspectRatio}))`,
    aspectRatio: `${cardWidth} / ${cardHeight}`,
    "--zone-card-width": "100%",
    "--zone-card-height": "100%",
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={cardStyle}>
        <GameCardVisual
          imageLoading="eager"
          name={entity.title}
          cardType={cardType}
          img={entity.imageUrl}
          faceDown={entity.face === "hidden"}
          // Animation layers already own the visual's transform. Reapplying the
          // board's rested rotation inside either layer compounds that transform:
          // state changes turn past 90°, while transfers expand into the rotated
          // source bounds and briefly cover the battlefield.
          exerted={
            presentation === undefined || presentation === "default"
              ? entity.states.includes("rested")
              : false
          }
          cost={cost}
          ap={ap}
          hp={hp}
          damage={damage}
          size={cardSizeForDensity(density)}
          useContainerSize
        />
      </div>
    </div>
  );
}

function simulatorKind(cardType: CardType | undefined): SimulatorEntity["kind"] {
  switch (cardType) {
    case "unit":
      return "unit";
    case "resource":
      return "resource";
    case "base":
      return "leader";
    default:
      return "card";
  }
}

function cardTypeOf(value: unknown, subtitle: string): CardType | undefined {
  const candidate = typeof value === "string" ? value : subtitle;
  return candidate === "unit" ||
    candidate === "pilot" ||
    candidate === "command" ||
    candidate === "base" ||
    candidate === "resource"
    ? candidate
    : undefined;
}

function numberAttribute(
  value: unknown,
  entity?: SimulatorEntity,
  statLabel?: string,
): number | undefined {
  if (typeof value === "number") return value;
  if (!entity || !statLabel) return undefined;
  const stat = entity.stats.find((entry) => entry.label === statLabel);
  if (!stat) return undefined;
  const parsed = Number(stat.value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function cardSizeForDensity(density: SimulatorEntityVisualProps["density"]): CardSize {
  switch (density) {
    case "mini":
      return "micro";
    case "compact":
      return "tiny";
    case "large":
      return "large";
    default:
      return "small";
  }
}
