import type {
  CardEffects,
  CharacterCard,
  DonCard,
  EventCard,
  Keyword,
  LeaderCard,
  OPAttribute,
  OPCard,
  OPColor,
  OPRarity,
  StageCard,
} from "@tcg/op-types";
import type { OPCardI18n } from "@tcg/op-types";
import type { RawOPCard } from "./types/scraper.ts";

export class NormalizationError extends Error {
  readonly cardId: string;
  readonly field: string;

  constructor(cardId: string, field: string, message: string) {
    super(`[${cardId}] ${field}: ${message}`);
    this.name = "NormalizationError";
    this.cardId = cardId;
    this.field = field;
  }
}

const COLOR_MAP: Record<string, OPColor> = {
  red: "red",
  blue: "blue",
  green: "green",
  purple: "purple",
  black: "black",
  yellow: "yellow",
};

const ATTRIBUTE_MAP: Record<string, OPAttribute> = {
  strike: "strike",
  slash: "slash",
  ranged: "ranged",
  wisdom: "wisdom",
  special: "special",
};

const RARITY_MAP: Record<string, OPRarity> = {
  C: "C",
  UC: "UC",
  R: "R",
  SR: "SR",
  SEC: "SEC",
  SP: "SP",
  L: "L",
  DON: "DON",
  MR: "MR",
  TR: "TR",
  P: "P",
  // API uses "PR" for promos
  PR: "P",
};

/** The API sometimes returns "NULL" as a literal string for missing values. */
function isNullValue(raw: string | null): boolean {
  return raw === null || raw.toUpperCase() === "NULL" || raw.trim() === "";
}

function parseColors(raw: string, cardId: string): OPColor[] {
  if (isNullValue(raw)) return [];
  // API uses either "/" or space as separator (e.g. "Red/Blue" or "Blue Purple")
  const parts = raw.includes("/") ? raw.split("/") : raw.split(" ");
  return parts.map((s) => {
    const color = COLOR_MAP[s.trim().toLowerCase()];
    if (!color) throw new NormalizationError(cardId, "card_color", `unknown color "${s}"`);
    return color;
  });
}

function parseAttribute(raw: string | null, cardId: string): OPAttribute | undefined {
  if (!raw || isNullValue(raw)) return undefined;
  const attr = ATTRIBUTE_MAP[raw.trim().toLowerCase()];
  if (!attr) throw new NormalizationError(cardId, "attribute", `unknown attribute "${raw}"`);
  return attr;
}

function parseRarity(raw: string, cardId: string): OPRarity {
  const rarity = RARITY_MAP[raw.trim().toUpperCase()];
  if (!rarity) {
    throw new NormalizationError(cardId, "rarity", `unknown rarity "${raw}"`);
  }
  return rarity;
}

function parseTraits(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[;,/]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSetId(raw: string): string {
  // API returns "OP-01", normalize to "OP01"
  return raw.replace("-", "");
}

function parseIntOrUndefined(raw: string | null): number | undefined {
  if (raw === null || raw === "") return undefined;
  const n = parseInt(raw, 10);
  return isNaN(n) ? undefined : n;
}

const KEYWORD_LOOKUP: Record<string, Keyword> = {
  rush: "rush",
  "rush: character": "rushCharacter",
  "double attack": "doubleAttack",
  banish: "banish",
  blocker: "blocker",
  unblockable: "unblockable",
};

/**
 * Pattern matching words that precede a keyword reference rather than a
 * keyword declaration. For example, "gains [Rush]" or "activate a [Blocker]"
 * are references — NOT innate keywords on the card.
 */
const KEYWORD_REFERENCE_PREFIX =
  /(?:gains?|has|with\s+an?|without\s+an?|activate\s+(?:an?\s+)?)\s*$/i;

/**
 * Extracts innate keyword abilities from card text.
 *
 * Finds all keyword bracket patterns and filters out mid-sentence references
 * like "gains [Rush]" or "activate a [Blocker] Character" which refer to
 * the keyword rather than declaring it as an innate ability.
 */
export function parseKeywords(text: string): Keyword[] {
  const keywords: Keyword[] = [];
  const pattern = /\[(Rush(?:: Character)?|Double Attack|Banish|Blocker|Unblockable)\]/gi;
  for (const match of text.matchAll(pattern)) {
    const before = text.slice(0, match.index);
    if (KEYWORD_REFERENCE_PREFIX.test(before)) continue;
    const keyword = KEYWORD_LOOKUP[match[1]!.toLowerCase()];
    if (keyword && !keywords.includes(keyword)) {
      keywords.push(keyword);
    }
  }
  return keywords;
}

/**
 * Extracts the [Trigger] clause from card text if present.
 *
 * [Trigger] only marks a trigger ability when it appears at the start of a
 * line (or the very start of the text). Mid-sentence occurrences like
 * "add a card with a [Trigger] from your hand" are property descriptors and
 * must not be treated as the trigger clause separator.
 *
 * Captures everything from [Trigger] to end of string so that card-name
 * references in brackets (e.g. "[Vegapunk]") are not cut off.
 */
function extractTrigger(text: string): { effect?: string; trigger?: string } {
  const triggerMatch = /(?:^|\n)\[Trigger\]\s*([\s\S]*)$/i.exec(text);
  if (triggerMatch) {
    const trigger = triggerMatch[1]?.trim() || undefined;
    const effect = text.replace(/(?:^|\n)\[Trigger\][\s\S]*$/i, "").trim() || undefined;
    return { effect: effect ?? (text.trim() || undefined), trigger };
  }
  return { effect: text.trim() || undefined };
}

export function normalize(raw: RawOPCard): OPCard {
  const id = raw.card_set_id;
  const cardTypeRaw = raw.card_type.trim().toLowerCase();
  const colors = parseColors(raw.card_color, id);
  const rarity = parseRarity(raw.rarity, id);
  const attribute = parseAttribute(raw.attribute, id);
  const traits = parseTraits(raw.sub_types);
  const setId = parseSetId(raw.set_id);
  const imageUrl = raw.card_image ?? undefined;
  const { effect, trigger } = extractTrigger(raw.card_text ?? "");
  const keywords = parseKeywords(raw.card_text ?? "");
  const effects: CardEffects | undefined = keywords.length > 0 ? { keywords } : undefined;
  const counter =
    raw.counter_amount != null && raw.counter_amount > 0 ? raw.counter_amount : undefined;

  const i18n: OPCardI18n = {
    en: {
      name: raw.card_name.trim(),
      ...(effect !== undefined && { effect }),
      ...(imageUrl !== undefined && { imageUrl }),
    },
  };

  const base = {
    id,
    color: colors,
    rarity,
    setId,
    ...(traits.length > 0 && { traits }),
    ...(attribute !== undefined && { attribute }),
    ...(effects !== undefined && { effects }),
    i18n,
  };

  if (cardTypeRaw === "leader") {
    const power = parseIntOrUndefined(raw.card_power);
    const life = parseIntOrUndefined(raw.life);
    if (power === undefined)
      throw new NormalizationError(id, "card_power", "leaders must have power");
    if (life === undefined) throw new NormalizationError(id, "life", "leaders must have life");
    return {
      ...base,
      cardType: "leader",
      power,
      life,
      ...(counter !== undefined && { counter }),
    } satisfies LeaderCard;
  }

  if (cardTypeRaw === "character") {
    const cost = parseIntOrUndefined(raw.card_cost);
    if (cost === undefined)
      throw new NormalizationError(id, "card_cost", "characters must have cost");
    return {
      ...base,
      cardType: "character",
      cost,
      ...(parseIntOrUndefined(raw.card_power) !== undefined && {
        power: parseIntOrUndefined(raw.card_power),
      }),
      ...(counter !== undefined && { counter }),
      ...(trigger !== undefined && { trigger }),
    } satisfies CharacterCard;
  }

  if (cardTypeRaw === "event") {
    const cost = parseIntOrUndefined(raw.card_cost);
    if (cost === undefined) throw new NormalizationError(id, "card_cost", "events must have cost");
    return {
      ...base,
      cardType: "event",
      cost,
      ...(trigger !== undefined && { trigger }),
    } satisfies EventCard;
  }

  if (cardTypeRaw === "stage") {
    const cost = parseIntOrUndefined(raw.card_cost);
    if (cost === undefined) throw new NormalizationError(id, "card_cost", "stages must have cost");
    return {
      ...base,
      cardType: "stage",
      cost,
      ...(trigger !== undefined && { trigger }),
    } satisfies StageCard;
  }

  if (cardTypeRaw === "don!!" || cardTypeRaw === "don") {
    return {
      ...base,
      cardType: "don",
    } satisfies DonCard;
  }

  throw new NormalizationError(id, "card_type", `unknown card type "${raw.card_type}"`);
}

export function normalizeAll(raws: RawOPCard[]): OPCard[] {
  return raws.map((raw) => normalize(raw));
}
