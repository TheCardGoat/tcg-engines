import type {
  EntityKind,
  EntityState,
  SimulatorEntity,
  SimulatorMetadataItem,
  SimulatorZone,
  ZoneRole,
  ZoneVisibility,
} from "@tcg/simulator-contract";

import type { CardColor, CardType, GameCardData } from "../types.ts";
import { buildCardImageUrl } from "./card-image-format.ts";

const FRAME_COLORS: Record<CardColor, string> = {
  blue: "#1e49c7",
  green: "#2ea65a",
  red: "#d7263d",
  white: "#e8ecf1",
  purple: "#7b4182",
};

const CARD_KIND: Record<CardType, EntityKind> = {
  unit: "unit",
  pilot: "card",
  command: "card",
  base: "card",
  resource: "resource",
};

export interface ToSimulatorEntityOptions {
  readonly ownerId?: string;
  readonly zoneId?: string;
  readonly entityIdSuffix?: string | number;
}

export function toSimulatorEntity(
  card: GameCardData,
  options: ToSimulatorEntityOptions = {},
): SimulatorEntity {
  const ownerId = options.ownerId ?? ownerIdFromZone(options.zoneId ?? card.zoneId) ?? "unknown";
  const faceDown = card.faceDown === true;
  const id = faceDown
    ? hiddenEntityId(ownerId, options.zoneId ?? card.zoneId, options.entityIdSuffix)
    : (card.id ??
      fallbackEntityId(card, ownerId, options.zoneId ?? card.zoneId, options.entityIdSuffix));
  const dataAttributes = faceDown
    ? {
        "data-card-id": id,
        "data-entity-id": id,
        "data-sim-entity-id": id,
        "data-sim-zone-id": options.zoneId ?? card.zoneId,
      }
    : {
        "data-card-id": id,
        "data-entity-id": id,
        "data-sim-entity-id": id,
        "data-card-type": card.cardType,
        "data-sim-zone-id": options.zoneId ?? card.zoneId,
      };

  return {
    id,
    title: faceDown ? "Hidden card" : card.name,
    subtitle: faceDown ? "Private information" : (card.subtitle ?? card.cardType ?? "card"),
    kind: faceDown ? "card" : card.cardType ? CARD_KIND[card.cardType] : "card",
    ownerId,
    face: faceDown ? "hidden" : "public",
    states: statesFor(card),
    stats: statsFor(card),
    traits: faceDown ? [] : [...(card.traits ?? [])],
    imageUrl: faceDown ? undefined : imageUrlFor(card),
    frameStyle: faceDown || !card.color ? undefined : { color: FRAME_COLORS[card.color] },
    overlayBadges: faceDown ? undefined : overlayBadgesFor(card),
    dataAttributes,
  };
}

export function toSimulatorZone(
  id: string | undefined,
  label: string,
  entityIds: readonly string[],
  options: {
    readonly role?: ZoneRole;
    readonly ownerId?: string;
    readonly visibility?: ZoneVisibility;
    readonly count?: number;
    readonly hint?: string;
    readonly layoutHint?: SimulatorZone["layoutHint"];
  } = {},
): SimulatorZone {
  const resolvedId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return {
    id: resolvedId,
    label,
    role: options.role ?? "custom",
    ownerId: options.ownerId ?? ownerIdFromZone(resolvedId),
    visibility: options.visibility ?? "public",
    entityIds: [...entityIds],
    count: options.count,
    hint: options.hint ?? label,
    layoutHint: options.layoutHint,
  };
}

function ownerIdFromZone(zoneId: string | undefined): string | undefined {
  const [, ownerId] = zoneId?.split(":") ?? [];
  return ownerId;
}

function fallbackEntityId(
  card: GameCardData,
  ownerId: string,
  zoneId: string | undefined,
  suffix: string | number | undefined,
): string {
  const cardKey = card.cardNumber ?? card.name.toLowerCase().replace(/\s+/g, "-");
  return [zoneId ?? ownerId, cardKey, suffix].filter((part) => part !== undefined).join(":");
}

function hiddenEntityId(
  ownerId: string,
  zoneId: string | undefined,
  suffix: string | number | undefined,
): string {
  return [zoneId ?? ownerId, "hidden-card", suffix].filter((part) => part !== undefined).join(":");
}

function statesFor(card: GameCardData): EntityState[] {
  if (card.faceDown) return ["hidden"];
  if (card.exerted) return ["rested"];
  return ["ready"];
}

function statsFor(card: GameCardData): SimulatorMetadataItem[] {
  const stats: SimulatorMetadataItem[] = [];
  pushStat(stats, "Cost", card.cost);
  pushStat(stats, "Level", card.level);
  pushStat(stats, "AP", card.ap);
  pushStat(stats, "HP", card.hp);
  return stats;
}

function pushStat(
  stats: SimulatorMetadataItem[],
  label: string,
  value: string | number | null | undefined,
) {
  if (value === null || value === undefined) return;
  stats.push({ label, value: String(value) });
}

function imageUrlFor(card: GameCardData): string | undefined {
  if (card.img) return card.img;
  if (card.set && card.cardNumber) return buildCardImageUrl(card.set, card.cardNumber);
  return undefined;
}

function overlayBadgesFor(card: GameCardData): SimulatorEntity["overlayBadges"] {
  const badges: NonNullable<SimulatorEntity["overlayBadges"]> = [];

  if (card.damage && card.damage > 0) {
    badges.push({ label: String(card.damage), color: "#d7263d", position: "br" });
  }

  if (card.highlight) {
    badges.push({ label: "!", color: "#4cc3ff", position: "tl" });
  }

  return badges.length > 0 ? badges : undefined;
}
