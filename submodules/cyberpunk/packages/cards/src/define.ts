import type {
  Ability,
  AttachmentDefinition,
  CardDefinition,
  CardKeyword,
  CardPrinting,
  CardType,
  CyberpunkCardLocale,
  CyberpunkLocale,
  GearCardDefinition,
  LegendCardDefinition,
  ProgramCardDefinition,
  StructuredCardDefinition,
  TimingTrigger,
  UnitCardDefinition,
} from "@tcg/cyberpunk-types";
import { unitsAndLegendsInPlay } from "@tcg/cyberpunk-types";
import { cyberpunkCardMetadata, type CyberpunkCardMetadataEntry } from "./card-metadata.ts";

/**
 * Canonical attachment for Gear that equips to a friendly unit or face-up legend in play.
 * The shared target preset also serves card effects, the parser, and engine conditions.
 */
export function gearAttachmentToUnitOrLegend(): AttachmentDefinition {
  return {
    text: "Equip to a unit or face-up legend.",
    target: unitsAndLegendsInPlay("friendly", "faceUp"),
  };
}

const TIMING_TRIGGERS: ReadonlySet<TimingTrigger> = new Set([
  "play",
  "attack",
  "flip",
  "call",
  "defeated",
]);

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

/**
 * Card-level display text. Authored card files must NOT carry these — they
 * live in the per-card `<slug>.i18n.ts` sibling and are supplied to
 * {@link defineCyberpunkCard} through its `i18n` parameter, so forbidding them
 * here makes text-in-the-wrong-file a compile error.
 */
type LocalizedTextCardProperty =
  | "name"
  | "subname"
  | "displayName"
  | "rulesText"
  | "flavorText"
  | "description"
  | "youtubeUrl"
  | "sourceUrl";

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
  MetadataBackedCardProperty | LocalizedTextCardProperty | DefaultableCardProperty
> &
  Partial<Pick<CardDefinition, MetadataBackedCardProperty | DefaultableCardProperty>>;

type LocalizedTextFreeAuthoredCardDefinition = AuthoredCyberpunkCardDefinition & {
  [Property in LocalizedTextCardProperty]?: never;
};

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

/**
 * Metadata is keyed by canonical slug — one entry per card regardless of how
 * many sets carry printings for it. The authored file must be the canonical
 * set's definition; every other set version of the card exists only as
 * `printings[]` entries on the same entry.
 */
function cardMetadataKey(card: Pick<CardDefinition, "slug">): string {
  return card.slug;
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

export function defineCyberpunkCard<TCard extends LocalizedTextFreeAuthoredCardDefinition>(
  card: TCard,
  i18n: Record<CyberpunkLocale, CyberpunkCardLocale>,
): HydratedCyberpunkCard<TCard> {
  const metadata: CyberpunkCardMetadataEntry | undefined =
    cyberpunkCardMetadata[cardMetadataKey(card)];
  if (!metadata) {
    throw new Error(`Missing Cyberpunk card metadata for ${card.slug}`);
  }
  if (metadata.canonicalSetCode !== card.set.code) {
    throw new Error(
      `Cyberpunk card ${card.slug} is authored under set "${card.set.code}" but canonical ` +
        `metadata owns it under "${metadata.canonicalSetCode}". Only the canonical set may ` +
        `author the card file; other set versions are printings on the same card.`,
    );
  }

  const abilities = card.abilities ?? [];
  const text = i18n.en;
  const selectedPrintingId =
    card.selectedPrintingId ?? metadata.selectedPrintingId ?? metadata.printings[0]?.id;

  return {
    ...card,
    name: text.name,
    displayName: text.displayName,
    ...(text.subname ? { subname: text.subname } : {}),
    ...(text.rulesText ? { rulesText: text.rulesText } : {}),
    ...(text.flavorText ? { flavorText: text.flavorText } : {}),
    ...(text.description ? { description: text.description } : {}),
    ...(text.youtubeUrl ? { youtubeUrl: text.youtubeUrl } : {}),
    ...(text.sourceUrl ? { sourceUrl: text.sourceUrl } : {}),
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
  } as HydratedCyberpunkCard<TCard>;
}
