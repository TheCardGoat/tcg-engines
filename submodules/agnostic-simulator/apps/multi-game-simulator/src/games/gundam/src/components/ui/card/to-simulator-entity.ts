import type {
  EntityKind,
  EntityState,
  SimulatorEntity,
  SimulatorEntityRule,
  SimulatorMetadataItem,
  SimulatorZone,
  ZoneRole,
  ZoneVisibility,
} from "@tcg/simulator-contract";

import type { CardColor, CardType, GameCardData } from "../types.ts";
import { keywordTag } from "./card-tags.ts";
import { buildCardImageUrl, GUNDAM_FULL_CARD_ASPECT_RATIO } from "./card-image-format.ts";

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

const RESTABLE_ZONE_BY_CARD_TYPE: Partial<Record<CardType, string>> = {
  unit: "battleArea",
  base: "baseSection",
  resource: "resourceArea",
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
  const zoneId = options.zoneId ?? card.zoneId;
  const ownerId = options.ownerId ?? ownerIdFromZone(zoneId) ?? "unknown";
  const faceDown = card.faceDown === true;
  const id = faceDown
    ? hiddenEntityId(ownerId, zoneId, options.entityIdSuffix)
    : (card.id ?? fallbackEntityId(card, ownerId, zoneId, options.entityIdSuffix));
  const dataAttributes = faceDown
    ? {
        "data-card-id": id,
        "data-entity-id": id,
        "data-sim-entity-id": id,
        "data-sim-zone-id": zoneId,
      }
    : {
        "data-card-id": id,
        "data-entity-id": id,
        "data-sim-entity-id": id,
        "data-card-type": card.cardType,
        "data-sim-zone-id": zoneId,
      };

  return {
    id,
    title: faceDown ? "Hidden card" : card.name,
    subtitle: faceDown ? "Private information" : (card.subtitle ?? card.cardType ?? "card"),
    kind: faceDown ? "card" : card.cardType ? CARD_KIND[card.cardType] : "card",
    ownerId,
    face: faceDown ? "hidden" : "public",
    states: statesFor(card, zoneId),
    stats: statsFor(card),
    traits: faceDown ? [] : [...(card.traits ?? [])],
    imageUrl: faceDown ? undefined : imageUrlFor(card),
    imageAspectRatio: GUNDAM_FULL_CARD_ASPECT_RATIO,
    frameStyle: faceDown || !card.color ? undefined : { color: FRAME_COLORS[card.color] },
    decorations: faceDown ? undefined : decorationsFor(card),
    activeEffects: faceDown ? undefined : activeEffectsFor(card),
    details: faceDown ? undefined : detailsFor(card),
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

function statesFor(card: GameCardData, zoneId: string | undefined): EntityState[] {
  if (card.faceDown) return ["hidden"];
  if (!card.cardType || RESTABLE_ZONE_BY_CARD_TYPE[card.cardType] !== baseZoneId(zoneId)) return [];
  if (card.exerted) return ["rested"];
  return ["ready"];
}

function baseZoneId(zoneId: string | undefined): string | undefined {
  return zoneId?.split(":", 1)[0];
}

function statsFor(card: GameCardData): SimulatorMetadataItem[] {
  const stats: SimulatorMetadataItem[] = [];
  pushStat(stats, "Cost", card.cost);
  pushStat(stats, "Level", card.level);
  pushStat(stats, "AP", card.ap, card.baseAp);
  pushStat(stats, "HP", card.hp, card.baseHp);
  if (card.battlefieldZones?.length) {
    stats.push({
      label: "Zone",
      value: card.battlefieldZones.map(capitalize).join(" / "),
    });
  }
  return stats;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function pushStat(
  stats: SimulatorMetadataItem[],
  label: string,
  value: string | number | null | undefined,
  baseValue?: string | number | null,
) {
  if (value === null || value === undefined) return;
  stats.push({
    label,
    value: String(value),
    baseValue:
      baseValue === null || baseValue === undefined || baseValue === value
        ? undefined
        : String(baseValue),
  });
}

function detailsFor(card: GameCardData): NonNullable<SimulatorEntity["details"]> {
  const rules = [
    ...(card.keywords ?? []).map((entry, index) => {
      const presentation = keywordTag(entry);
      return {
        id: `keyword-${index}`,
        label: presentation.label,
        text: presentation.tooltip,
        kind: "keyword" as const,
      };
    }),
    ...effectRulesFor(card),
    ...(card.linkRequirement
      ? [
          {
            id: "link",
            label: "Link",
            text: card.linkRequirement,
            kind: "ability" as const,
          },
        ]
      : []),
  ];

  return {
    rules,
    relationships: card.pairedPilot?.id
      ? [
          {
            id: `paired-pilot:${card.pairedPilot.id}`,
            label: "Paired Pilot",
            entityIds: [card.pairedPilot.id],
          },
        ]
      : [],
  };
}

function effectRulesFor(card: GameCardData): SimulatorEntityRule[] {
  const sourceBlocks =
    card.effectBlocks && card.effectBlocks.length > 0
      ? card.effectBlocks
      : splitLegacyEffectText(card.effect);

  return sourceBlocks.map((sourceText, index) => {
    const { labels, text } = parseEffectBlock(sourceText);
    return {
      id: `effect-${index}`,
      kind: labels.length > 0 ? "ability" : "text",
      label: labels.length > 0 ? labels.join(" · ") : undefined,
      text,
    };
  });
}

function splitLegacyEffectText(effect: string | undefined): string[] {
  if (!effect) return [];
  const lines = normalizeEffectText(effect)
    .split(/\n+/u)
    .map(stripMarkdownEmphasis)
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks: string[] = [];

  for (const line of lines) {
    if (LEADING_RULE_LABEL.test(line) || blocks.length === 0) {
      blocks.push(line);
      continue;
    }
    blocks[blocks.length - 1] = `${blocks.at(-1)}\n${line}`;
  }

  return blocks;
}

const LEADING_RULE_LABEL = /^【[^】]+】/u;

function parseEffectBlock(sourceText: string): { labels: string[]; text: string } {
  let remaining = stripMarkdownEmphasis(normalizeEffectText(sourceText).trim());
  const labels: string[] = [];

  while (true) {
    const match = remaining.match(/^【([^】]+)】\s*/u);
    if (!match) break;
    labels.push(match[1]?.trim().replace(/[･・]/gu, " · ") ?? "");
    remaining = remaining.slice(match[0].length);
  }

  return {
    labels: labels.filter(Boolean),
    text: decodeEffectEntities(
      remaining.trim() || stripMarkdownEmphasis(normalizeEffectText(sourceText).trim()),
    ),
  };
}

function decodeEffectEntities(value: string): string {
  // Card data includes escaped keyword brackets. Keep the result as plain text;
  // decoding the ampersand last prevents recursively decoding nested entities.
  return value
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">")
    .replace(/&quot;/gu, '"')
    .replace(/&apos;|&#39;/gu, "'")
    .replace(/&nbsp;/gu, " ")
    .replace(/&amp;/gu, "&");
}

function normalizeEffectText(value: string): string {
  return value
    .replace(/<br\s*\/?>/giu, "\n")
    .replace(/\r\n?/gu, "\n")
    .replace(/\n{3,}/gu, "\n\n");
}

function stripMarkdownEmphasis(value: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith("**") && trimmed.endsWith("**") ? trimmed.slice(2, -2).trim() : trimmed;
}

function activeEffectsFor(card: GameCardData): SimulatorEntity["activeEffects"] {
  return (card.activeEffects ?? []).map((effect, index) => ({
    id: `${effect.sourceId}:${index}`,
    targetKind: "entity",
    targetId: card.id ?? card.name,
    sourceEntityId: effect.sourceId,
    sourceLabel: effect.sourceName ?? effect.sourceLabel ?? "Effect",
    label: effect.kind,
    detail: effect.description,
    tone: effect.kind.includes("restriction") ? "debuff" : "neutral",
    durationLabel: effect.duration,
  }));
}

function imageUrlFor(card: GameCardData): string | undefined {
  if (card.img) return card.img;
  if (card.set && card.cardNumber) return buildCardImageUrl(card.set, card.cardNumber);
  return undefined;
}

function decorationsFor(card: GameCardData): SimulatorEntity["decorations"] {
  const decorations: NonNullable<SimulatorEntity["decorations"]> = [];

  if (card.damage && card.damage > 0) {
    decorations.push({
      id: "damage",
      slot: "bottom-end",
      ariaLabel: `${card.damage} damage`,
      content: { kind: "text", text: String(card.damage) },
      tone: "negative",
    });
  }

  if (card.highlight) {
    decorations.push({
      id: "highlight",
      slot: "top-start",
      ariaLabel: "Highlighted",
      content: { kind: "icon", token: "highlight" },
      tone: "neutral",
    });
  }

  return decorations.length > 0 ? decorations : undefined;
}
