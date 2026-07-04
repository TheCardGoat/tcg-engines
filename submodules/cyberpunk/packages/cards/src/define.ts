import type {
  Ability,
  AttachmentDefinition,
  CardDefinition,
  CardKeyword,
  CardPrinting,
  CardType,
  GearCardDefinition,
  LegendCardDefinition,
  ProgramCardDefinition,
  StructuredCardDefinition,
  TimingTrigger,
  UnitCardDefinition,
} from "@tcg/cyberpunk-types";
import { cyberpunkCardMetadata, type CyberpunkCardMetadataEntry } from "./card-metadata.ts";

/**
 * Canonical attachment for Gear that equips to a friendly unit or face-up legend in play.
 * All current Gear (7 cards) share this exact shape. Authors should call this rather than
 * inline the literal so the rule lives in one place.
 */
export function gearAttachmentToUnitOrLegend(): AttachmentDefinition {
  return {
    text: "Equip to a unit or face-up legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  };
}

const TIMING_TRIGGERS: ReadonlySet<TimingTrigger> = new Set(["play", "attack", "flip", "call"]);

export function deriveTimingTriggers(abilities: readonly Ability[]): TimingTrigger[] {
  const seen: TimingTrigger[] = [];
  for (const ability of abilities) {
    const tag = ability.trigger?.trigger;
    if (tag && TIMING_TRIGGERS.has(tag as TimingTrigger)) {
      const t = tag as TimingTrigger;
      if (!seen.includes(t)) seen.push(t);
    }
  }
  return seen;
}

export function deriveKeywords(abilities: readonly Ability[]): CardKeyword[] {
  const seen: CardKeyword[] = [];
  for (const ability of abilities) {
    if (ability.kind === "keyword" && ability.keyword && !seen.includes(ability.keyword)) {
      seen.push(ability.keyword);
    }
  }
  return seen;
}

export function deriveCardSurface(card: StructuredCardDefinition): {
  timingTriggers: TimingTrigger[];
  keywords: CardKeyword[];
} {
  return {
    timingTriggers: deriveTimingTriggers(card.abilities),
    keywords: deriveKeywords(card.abilities),
  };
}

type MetadataBackedCardProperty = "printings" | "selectedPrintingId";

type DefaultableCardProperty =
  | "abilities"
  | "attachment"
  | "classifications"
  | "keywords"
  | "timingTriggers"
  | "reminderText"
  | "rarity";

export type AuthoredCyberpunkCardDefinition = Omit<
  CardDefinition,
  MetadataBackedCardProperty | DefaultableCardProperty
> &
  Partial<Pick<CardDefinition, MetadataBackedCardProperty | DefaultableCardProperty>>;

type HydratedCyberpunkCard<TCard extends { type?: CardType }> = TCard &
  (TCard extends { type: "legend" }
    ? LegendCardDefinition
    : TCard extends { type: "unit" }
      ? UnitCardDefinition
      : TCard extends { type: "gear" }
        ? GearCardDefinition
        : TCard extends { type: "program" }
          ? ProgramCardDefinition
          : StructuredCardDefinition);

function cardMetadataKey(card: Pick<CardDefinition, "set" | "slug">): string {
  return `${card.set.code}:${card.slug}`;
}

function hydratePrinting(
  printing: Partial<CardPrinting> & Pick<CardPrinting, "id" | "collectorNumber" | "setCode">,
): CardPrinting {
  const artId = printing.artId ?? printing.id;

  return {
    id: printing.id,
    artId,
    collectorNumber: printing.collectorNumber,
    setCode: printing.setCode,
    rarity: printing.rarity ?? "",
    imageUrl: printing.imageUrl ?? "",
  };
}

export function defineCyberpunkCard<TCard extends AuthoredCyberpunkCardDefinition>(
  card: TCard,
): HydratedCyberpunkCard<TCard> {
  const metadata: CyberpunkCardMetadataEntry | undefined =
    cyberpunkCardMetadata[cardMetadataKey(card)];
  if (!metadata) {
    throw new Error(`Missing Cyberpunk card metadata for ${card.set.code}:${card.slug}`);
  }

  const abilities = card.abilities ?? [];
  const text = metadata.i18n.en;
  const selectedPrintingId =
    card.selectedPrintingId ?? metadata.selectedPrintingId ?? metadata.printings[0]?.id;

  return {
    ...card,
    name: card.name ?? text.name,
    displayName: card.displayName ?? text.displayName,
    ...((card.subname ?? text.subname) ? { subname: card.subname ?? text.subname } : {}),
    ...((card.rulesText ?? text.rulesText) ? { rulesText: card.rulesText ?? text.rulesText } : {}),
    ...((card.flavorText ?? text.flavorText)
      ? { flavorText: card.flavorText ?? text.flavorText }
      : {}),
    ...((card.description ?? text.description)
      ? { description: card.description ?? text.description }
      : {}),
    ...((card.youtubeUrl ?? text.youtubeUrl)
      ? { youtubeUrl: card.youtubeUrl ?? text.youtubeUrl }
      : {}),
    ...((card.sourceUrl ?? text.sourceUrl) ? { sourceUrl: card.sourceUrl ?? text.sourceUrl } : {}),
    printings: (card.printings ?? metadata.printings).map(hydratePrinting),
    ...(selectedPrintingId ? { selectedPrintingId } : {}),
    cost: card.cost ?? null,
    power: card.power ?? null,
    ram: card.ram ?? null,
    rarity: card.rarity ?? null,
    classifications: card.classifications ?? [],
    timingTriggers: card.timingTriggers ?? deriveTimingTriggers(abilities),
    keywords: card.keywords ?? deriveKeywords(abilities),
    abilities,
    attachment: card.attachment ?? null,
    reminderText: card.reminderText ?? [],
  } as unknown as HydratedCyberpunkCard<TCard>;
}
