import {
  getPrintedCardRecord,
  hasPrintedCardRecord,
  officialCardImageUrl,
  officialCatalog,
} from "@tcg/alpha-clash-cards";
import type { AcCardDefinition } from "@tcg/alpha-clash-types";

/** One physical printing of a card, with its own artwork resolution. */
export interface AlphaClashDeckBuilderPrinting {
  readonly id: string;
  readonly setName: string;
  readonly collectorNumber: string;
  readonly rarity: string | null;
  /** CDN artwork for this printing, or null when no face has been published. */
  readonly imageUrl: string | null;
}

/**
 * Public, presentation-safe catalog for the platform's Alpha Clash deck
 * builder. Mirrors `getNarutoDeckBuilderCatalog`: the game adapter owns the
 * snapshot so web surfaces never import game internals.
 */
export interface AlphaClashDeckBuilderCard {
  readonly id: string;
  readonly name: string;
  readonly cardType: AcCardDefinition["cardType"];
  /** Accessory/action subtype ("weapon", "trap", "quick", "clash-buff", …). */
  readonly subtype: string | null;
  readonly colors: readonly string[];
  readonly rarity: string | null;
  readonly affiliation: string | null;
  readonly planet: string | null;
  readonly characterName: string | null;
  readonly keywords: readonly string[];
  readonly symbols: readonly string[];
  /** Printed resource cost total; null for Contenders. */
  readonly cost: number | null;
  /** The cost includes X (paid variable). */
  readonly xCost: boolean;
  readonly attack: number | null;
  readonly defense: number | null;
  /** Contender health; null for other card types. */
  readonly health: number | null;
  readonly text: string;
  /** Distinct print set names, canonical printing first. */
  readonly sets: readonly string[];
  /** Canonical printing's collector number (e.g. "AC1-001"). */
  readonly number: string | null;
  readonly imageUrl: string | null;
  /** Every printing, canonical first. Printings with `imageUrl: null` have no
   * published face and are selection-blocked (surfaced as Atelier teasers). */
  readonly printings: readonly AlphaClashDeckBuilderPrinting[];
  /**
   * Name + character + printed text + keywords/symbols/facets so catalog
   * surfaces can offer full-text search. Not rendered directly.
   */
  readonly searchText: string;
}

/** Constructed deck rules cited from Comprehensive Rulebook v8. */
export interface AlphaClashDeckBuilderRules {
  readonly minMainDeck: number;
  readonly maxMainDeck: number;
  readonly maxCopiesPerName: number;
  readonly maxClashBuffs: number;
  readonly maxUnrivaled: number;
}

export interface AlphaClashDeckBuilderCatalog {
  readonly rulesProfile: "alpha-clash-constructed-v8";
  readonly cards: readonly AlphaClashDeckBuilderCard[];
  readonly rules: AlphaClashDeckBuilderRules;
}

export const ALPHA_CLASH_DECK_BUILDER_RULES: AlphaClashDeckBuilderRules = {
  minMainDeck: 50,
  maxMainDeck: 60,
  maxCopiesPerName: 4,
  maxClashBuffs: 4,
  maxUnrivaled: 1,
};

function cardSearchText(card: AcCardDefinition): string {
  const parts = [
    card.name,
    "characterName" in card ? card.characterName : undefined,
    "locationName" in card ? card.locationName : undefined,
    card.text,
    ...("keywords" in card ? (card.keywords ?? []) : []),
    ...(card.symbols ?? []),
    "affiliation" in card ? card.affiliation : undefined,
    "subtype" in card ? card.subtype : undefined,
  ];
  return parts.filter((part): part is string => Boolean(part)).join(" ");
}

function cardPrintings(
  card: AcCardDefinition,
): AlphaClashDeckBuilderPrinting[] {
  // Authored definitions carry only their canonical printing; the printed
  // database holds every physical printing (folded reprints included).
  const printings = hasPrintedCardRecord(card.id)
    ? (getPrintedCardRecord(card.id).printings ?? [])
    : (card.printings ?? []);
  return printings.map((printing) => ({
    id: printing.id,
    setName: printing.setName,
    collectorNumber: printing.collectorNumber,
    rarity: printing.rarity ?? null,
    imageUrl: officialCardImageUrl(printing.id) ?? null,
  }));
}

function toDeckBuilderCard(card: AcCardDefinition): AlphaClashDeckBuilderCard {
  const canonicalPrinting = card.printings?.[0];
  const cost = "cost" in card ? card.cost : undefined;
  const printings = cardPrintings(card);
  return {
    id: card.id,
    name: card.name,
    cardType: card.cardType,
    subtype: "subtype" in card ? (card.subtype ?? null) : null,
    colors: [...card.colors],
    rarity: card.rarity ?? null,
    affiliation: "affiliation" in card ? (card.affiliation ?? null) : null,
    planet: card.planet ?? null,
    characterName: "characterName" in card ? (card.characterName ?? null) : null,
    keywords: "keywords" in card ? [...(card.keywords ?? [])] : [],
    symbols: [...(card.symbols ?? [])],
    cost: cost ? cost.total : null,
    xCost: cost ? Boolean(cost.x) : false,
    attack: "attack" in card ? card.attack : null,
    defense: "defense" in card ? card.defense : null,
    health: card.cardType === "contender" ? card.health : null,
    text: card.text ?? "",
    sets: [...new Set(printings.map((printing) => printing.setName))],
    number: canonicalPrinting?.collectorNumber ?? printings[0]?.collectorNumber ?? null,
    imageUrl: officialCardImageUrl(card.id) ?? null,
    printings,
    searchText: cardSearchText(card),
  };
}

export function getAlphaClashDeckBuilderCatalog(): AlphaClashDeckBuilderCatalog {
  return {
    rulesProfile: "alpha-clash-constructed-v8",
    cards: officialCatalog.map(toDeckBuilderCard),
    rules: ALPHA_CLASH_DECK_BUILDER_RULES,
  };
}
