import type {
  BaseCard,
  Card,
  CardColor,
  CardPrinting,
  CardRarity,
  CardSet,
  CommandCard,
  KeywordEffect,
  KeywordEffectEntry,
  PilotCard,
  ResourceCard,
  UnitCard,
  Zone,
} from "@tcg/gundam-types";
import { cleanHtml } from "../scripts/effect-parser/helpers.ts";
import { extractPrintedKeyword, splitIntoSegments } from "../scripts/effect-parser/segments.ts";
import { slugify } from "../scripts/_helpers.ts";
import type { RawGundamCard } from "./types/scraper.ts";

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

// ── Maps ─────────────────────────────────────────────────────────────────────

const RARITY_MAP: Record<string, CardRarity> = {
  C: "common",
  Common: "common",
  U: "uncommon",
  UC: "uncommon",
  Uncommon: "uncommon",
  R: "rare",
  Rare: "rare",
  LR: "legendRare",
  LegendRare: "legendRare",
  "Legend Rare": "legendRare",
  P: "promo",
  Promo: "promo",
  Promotion: "promo",
  SR: "superRare",
  SuperRare: "superRare",
  "Super Rare": "superRare",
  SCR: "secretRare",
  SEC: "secretRare",
  SecretRare: "secretRare",
  "Secret Rare": "secretRare",
};

const COLOR_MAP: Record<string, CardColor> = {
  Blue: "blue",
  blue: "blue",
  Green: "green",
  green: "green",
  Red: "red",
  red: "red",
  White: "white",
  white: "white",
  Purple: "purple",
  purple: "purple",
};

const ZONE_MAP: Record<string, Zone> = {
  Deck: "deck",
  ResourceDeck: "resourceDeck",
  "Resource Deck": "resourceDeck",
  ResourceArea: "resourceArea",
  "Resource Area": "resourceArea",
  BattleArea: "battleArea",
  "Battle Area": "battleArea",
  ShieldArea: "shieldArea",
  "Shield Area": "shieldArea",
  RemovalArea: "removalArea",
  "Removal Area": "removalArea",
  Hand: "hand",
  Trash: "trash",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseRarity(raw: string | null, id: string): CardRarity {
  if (!raw) throw new NormalizationError(id, "rarity", "missing rarity");
  const rarity = RARITY_MAP[raw.trim().replace(/(?:\s*\+\s*)+$/, "")];
  if (!rarity) throw new NormalizationError(id, "rarity", `unknown rarity "${raw}"`);
  return rarity;
}

function parseColor(raw: string | null, id: string): CardColor | undefined {
  if (!raw || raw.trim() === "" || raw.trim() === "-") return undefined;
  const color = COLOR_MAP[raw.trim()];
  if (!color) throw new NormalizationError(id, "color", `unknown color "${raw}"`);
  return color;
}

function parseZone(raw: string | null): Zone | undefined {
  if (!raw || raw.trim() === "") return undefined;
  const cleaned = raw
    .trim()
    .replace(/^\(|\)$/g, "")
    .trim();
  return ZONE_MAP[cleaned];
}

function parseTraits(raw: string | null): string[] {
  if (!raw || raw.trim() === "" || raw.trim() === "-") return [];
  const parenthesized = [...raw.matchAll(/\(([^)]+)\)/g)]
    .map((m) => m[1]!.trim().toLowerCase())
    .filter(Boolean);
  if (parenthesized.length > 0) return parenthesized;
  return raw
    .split(/[/,]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseLevel(raw: string | null): number {
  if (!raw) return 0;
  const n = parseInt(raw, 10);
  return isNaN(n) ? 0 : n;
}

function parseCost(raw: number | null): number {
  return raw ?? 0;
}

function parseSourceTitle(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const cleaned = raw.trim();
  if (!cleaned || cleaned === "-") return undefined;
  return normalizeSourceTitle(cleaned);
}

function normalizeCardId(value: string): string {
  return value.trim().replace(/_/g, "-");
}

function setCodeFromProduct(raw: RawGundamCard): string | undefined {
  const source = raw.getIt && raw.getIt !== "-" ? raw.getIt : (raw.set?.name ?? "");
  const bracketed = source.match(/\[([A-Z0-9-]+)\]/);
  if (bracketed?.[1]) return bracketed[1].toUpperCase();
  const setId = raw.set?.id?.trim();
  return setId ? setId.toUpperCase() : undefined;
}

function normalizeSet(raw: RawGundamCard): CardSet | undefined {
  const code = setCodeFromProduct(raw);
  if (!code) return undefined;
  const setName = raw.set?.name?.trim();
  const sourceName =
    setName && setName !== "-" ? setName : raw.getIt && raw.getIt !== "-" ? raw.getIt : undefined;
  return {
    code,
    name: sourceName?.trim() || code,
    ...(raw.set?.packageId ? { packageId: raw.set.packageId } : {}),
  };
}

function imageUrl(raw: RawGundamCard): string | undefined {
  return raw.images.large ?? raw.images.small ?? undefined;
}

function normalizePrinting(raw: RawGundamCard, rarity: CardRarity): CardPrinting | undefined {
  const set = normalizeSet(raw);
  if (!set) return undefined;
  const id = normalizeCardId(raw.id);
  const sourceImageUrl = imageUrl(raw);
  return {
    id,
    collectorNumber: id,
    cardNumber: raw.code || id,
    set,
    rarity,
    finish: raw.rarity.includes("+") || /-p\d+$/i.test(id) ? "parallel" : "standard",
    ...(sourceImageUrl ? { imageUrl: sourceImageUrl, sourceImageUrl } : {}),
    ...(raw.getIt && raw.getIt !== "-" ? { productName: raw.getIt } : {}),
  };
}

function catalogMetadata(raw: RawGundamCard, rarity: CardRarity) {
  const id = normalizeCardId(raw.id);
  const set = normalizeSet(raw);
  const printing = normalizePrinting(raw, rarity);
  const sourceImageUrl = imageUrl(raw);
  return {
    id,
    externalId: `gundam:${id.toLowerCase()}`,
    slug: `${slugify(raw.name)}-${id.toLowerCase()}`,
    displayName: raw.name,
    rulesText: raw.effect,
    ...(set ? { set } : {}),
    printNumber: id,
    ...(printing ? { printings: [printing], selectedPrintingId: printing.id } : {}),
    ...(sourceImageUrl ? { imageUrl: sourceImageUrl, sourceImageUrl } : {}),
    legality: "legal" as const,
  };
}

function normalizeSourceTitle(value: string): string {
  const normalized = value
    .replace(/Hathaway"s/g, "Hathaway's")
    .replace(/^Mobile Suit Gundam Mobile Suit Gundam GQuuuuuuX$/i, "Mobile Suit Gundam GQuuuuuuX");

  const lower = normalized.toLowerCase();
  if (lower === "mobile suit gundam uc") return "Mobile Suit Gundam Unicorn";
  if (lower === "mobile suit gundam seed destiny") return "Mobile Suit Gundam SEED Destiny";
  if (lower === "mobile suit gundam iron-blooded orphans") {
    return "Mobile Suit Gundam: Iron-Blooded Orphans";
  }

  return normalized;
}

function sourceTitleProperties(raw: RawGundamCard): { sourceTitle?: string } {
  const sourceTitle = parseSourceTitle(raw.sourceTitle);
  return sourceTitle === undefined ? {} : { sourceTitle };
}

function parseStat(raw: number | string | null): number {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === "number") return raw;
  // Normalize fullwidth digits and strip leading +/- markers meaning "no value"
  const normalized = raw
    .replace(/[０-９]/g, (c) => String(c.charCodeAt(0) - 0xff10))
    .replace(/^\+/, "");
  if (normalized === "-" || normalized === "") return 0;
  const n = parseInt(normalized, 10);
  return isNaN(n) ? 0 : n;
}

/**
 * Extract the card's printed/intrinsic keywords from its raw effect text.
 *
 * Only keywords that appear as a *standalone segment* — i.e. the whole
 * segment is `<Keyword>` or `<Keyword N>` optionally followed by a
 * parenthesized reminder text — are considered printed. Keywords that are
 * merely referenced in text ("while this Unit has <Repair>") or granted by
 * another effect ("this Unit gains <Blocker>") are ignored: they are not
 * intrinsic to the card and must not be promoted into
 * `card.keywordEffects`, which would otherwise change engine behavior
 * (e.g. derived-state seeding, self-fulfilling conditions, UI displays).
 *
 * The segment-level recognition uses `splitIntoSegments` + the shared
 * `extractPrintedKeyword` helper from the parser, guaranteeing that the
 * normalizer and the segment parser stay in sync: every segment the
 * normalizer captures here is also dropped by `parseConstantEffect`
 * (so it does not also appear as a `grantKeyword` `CardEffect`).
 *
 * Duplicate keywords are deduplicated.
 */
function parseKeywordEffects(effect: string | null): KeywordEffectEntry[] {
  if (!effect) return [];
  const cleaned = cleanHtml(effect);
  const segments = splitIntoSegments(cleaned);
  const out: KeywordEffectEntry[] = [];
  const seen = new Set<KeywordEffect>();
  for (const seg of segments) {
    const entry = extractPrintedKeyword(seg);
    if (!entry || seen.has(entry.keyword)) continue;
    seen.add(entry.keyword);
    out.push(entry);
  }
  return out;
}

function parsePilotName(effect: string | null): string | undefined {
  if (!effect) return undefined;
  return cleanHtml(effect)
    .match(/【Pilot】\s*\[([^\]]+)\]/i)?.[1]
    ?.trim();
}

// ── Normalizers ───────────────────────────────────────────────────────────────

export function normalizeUnit(raw: RawGundamCard): UnitCard {
  const zone = parseZone(raw.zone);
  const rarity = parseRarity(raw.rarity, raw.id);
  return {
    cardNumber: raw.code || raw.id,
    ...catalogMetadata(raw, rarity),
    name: raw.name,
    type: "unit",
    color: parseColor(raw.color, raw.id),
    traits: parseTraits(raw.trait),
    ...sourceTitleProperties(raw),
    level: parseLevel(raw.level),
    cost: parseCost(raw.cost),
    ap: parseStat(raw.ap),
    hp: parseStat(raw.hp),
    ...(raw.link !== null &&
      raw.link !== undefined &&
      raw.link.trim() !== "-" && { linkCondition: raw.link }),
    ...(zone !== undefined && { zone }),
    ...(raw.effect !== null && raw.effect !== undefined && { effect: raw.effect }),
    keywordEffects: parseKeywordEffects(raw.effect),
    rarity,
  };
}

export function normalizePilot(raw: RawGundamCard): PilotCard {
  const rarity = parseRarity(raw.rarity, raw.id);
  return {
    cardNumber: raw.code || raw.id,
    ...catalogMetadata(raw, rarity),
    name: raw.name,
    type: "pilot",
    color: parseColor(raw.color, raw.id),
    traits: parseTraits(raw.trait),
    ...sourceTitleProperties(raw),
    level: parseLevel(raw.level),
    cost: parseCost(raw.cost),
    apBonus: parseStat(raw.ap),
    hpBonus: parseStat(raw.hp),
    ...(raw.effect !== null && raw.effect !== undefined && { effect: raw.effect }),
    keywordEffects: parseKeywordEffects(raw.effect),
    rarity,
  };
}

export function normalizeCommand(raw: RawGundamCard): CommandCard {
  const pilotName = parsePilotName(raw.effect);
  const rarity = parseRarity(raw.rarity, raw.id);
  return {
    cardNumber: raw.code || raw.id,
    ...catalogMetadata(raw, rarity),
    name: raw.name,
    type: "command",
    color: parseColor(raw.color, raw.id),
    traits: parseTraits(raw.trait),
    ...sourceTitleProperties(raw),
    level: parseLevel(raw.level),
    cost: parseCost(raw.cost),
    ...(pilotName !== undefined && {
      pilotName,
      apBonus: parseStat(raw.ap),
      hpBonus: parseStat(raw.hp),
    }),
    ...(raw.effect !== null && raw.effect !== undefined && { effect: raw.effect }),
    keywordEffects: parseKeywordEffects(raw.effect),
    rarity,
  };
}

export function normalizeBase(raw: RawGundamCard): BaseCard {
  const rarity = parseRarity(raw.rarity, raw.id);
  return {
    cardNumber: raw.code || raw.id,
    ...catalogMetadata(raw, rarity),
    name: raw.name,
    type: "base",
    traits: parseTraits(raw.trait),
    ...sourceTitleProperties(raw),
    level: parseLevel(raw.level),
    cost: parseCost(raw.cost),
    hp: parseStat(raw.hp),
    ...(raw.effect !== null && raw.effect !== undefined && { effect: raw.effect }),
    keywordEffects: parseKeywordEffects(raw.effect),
    rarity,
  };
}

export function normalizeResource(raw: RawGundamCard): ResourceCard {
  const rarity = parseRarity(raw.rarity, raw.id);
  return {
    cardNumber: raw.code || raw.id,
    ...catalogMetadata(raw, rarity),
    name: raw.name,
    type: "resource",
    traits: parseTraits(raw.trait),
    ...sourceTitleProperties(raw),
    level: parseLevel(raw.level),
    cost: parseCost(raw.cost),
    ...(raw.effect !== null && raw.effect !== undefined && { effect: raw.effect }),
    keywordEffects: parseKeywordEffects(raw.effect),
    rarity,
  };
}

const TYPE_MAP: Record<string, (raw: RawGundamCard) => Card> = {
  UNIT: normalizeUnit,
  "UNIT TOKEN": normalizeUnit,
  Unit: normalizeUnit,
  unit: normalizeUnit,
  PILOT: normalizePilot,
  Pilot: normalizePilot,
  pilot: normalizePilot,
  COMMAND: normalizeCommand,
  Command: normalizeCommand,
  command: normalizeCommand,
  BASE: normalizeBase,
  "EX BASE": normalizeBase,
  Base: normalizeBase,
  base: normalizeBase,
  RESOURCE: normalizeResource,
  "EX RESOURCE": normalizeResource,
  Resource: normalizeResource,
  resource: normalizeResource,
};

export function normalize(raw: RawGundamCard): Card {
  const fn = TYPE_MAP[raw.cardType];
  if (!fn) throw new NormalizationError(raw.id, "cardType", `unknown type "${raw.cardType}"`);
  return fn(raw);
}
