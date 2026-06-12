import type { LorcanaCard } from "@tcg/lorcana-types";
import { getFullName, LANGUAGES } from "@tcg/lorcana-types";
import { parseDeckListTextWithErrors } from "@tcg/shared/deck-list-parse";
import type { DeckListInvalidEntry } from "@tcg/shared/deck-list-errors";
import type { ParsedDeckListEntry } from "@tcg/shared/deck-list-parse";
import {
  normalizeDisplayNameApostropheInsensitive,
  normalizeDisplayNameForMatch,
} from "@tcg/shared/display-name-normalize";
import { getAllCards } from "../cards";

export const LORCANA_RARITY_ORDER: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  super_rare: 3,
  legendary: 4,
  promo: 5,
  enchanted: 6,
  epic: 7,
  iconic: 8,
};

/**
 * Default legacy display-name aliases for Lorcana lookup.
 * Use canonical pool names for card variants that changed over time.
 */
export const DEFAULT_LORCANA_DISPLAY_NAME_ALIASES: Record<string, string> = {
  [normalizeDisplayNameForMatch("Mother Gothel - Devious Conspirator")]:
    "Mother Gothel - Underhanded Schemer",
};

function rarityScore(card: LorcanaCard): number {
  const rarity = card.rarity ?? "common";
  const base = LORCANA_RARITY_ORDER[rarity] ?? 9;
  const special = card.specialRarity ? (LORCANA_RARITY_ORDER[card.specialRarity] ?? 0) : 0;
  return base * 10 + (special > 0 ? special : 0);
}

export function getLorcanaDisplayName(card: LorcanaCard): string {
  return getFullName(card);
}

/**
 * Compare a query against a card by name + fullName with punctuation/case normalization.
 */
export function displayNameMatchesLorcana(query: string, card: LorcanaCard): boolean {
  const normalizedQuery = normalizeDisplayNameForMatch(query);
  const normalizedName = normalizeDisplayNameForMatch(card.name);
  const normalizedFullName = normalizeDisplayNameForMatch(getLorcanaDisplayName(card));

  if (normalizedQuery === normalizedName || normalizedQuery === normalizedFullName) {
    return true;
  }

  const normalizedQueryNoApostrophe = normalizeDisplayNameApostropheInsensitive(query);
  const normalizedNameNoApostrophe = normalizeDisplayNameApostropheInsensitive(card.name);
  const normalizedFullNameNoApostrophe = normalizeDisplayNameApostropheInsensitive(
    getLorcanaDisplayName(card),
  );

  if (
    normalizedQueryNoApostrophe === normalizedNameNoApostrophe ||
    normalizedQueryNoApostrophe === normalizedFullNameNoApostrophe
  ) {
    return true;
  }

  // Check localized names (i18n) for non-English deck lists
  for (const lang of LANGUAGES) {
    const i18nProps = card.i18n[lang];
    if (!i18nProps) continue;

    const localizedName = i18nProps.name;
    const localizedFullName = i18nProps.version
      ? `${i18nProps.name} - ${i18nProps.version}`
      : i18nProps.name;

    const normLocalName = normalizeDisplayNameForMatch(localizedName);
    const normLocalFullName = normalizeDisplayNameForMatch(localizedFullName);

    if (normalizedQuery === normLocalName || normalizedQuery === normLocalFullName) {
      return true;
    }

    const normLocalNameNoApo = normalizeDisplayNameApostropheInsensitive(localizedName);
    const normLocalFullNameNoApo = normalizeDisplayNameApostropheInsensitive(localizedFullName);

    if (
      normalizedQueryNoApostrophe === normLocalNameNoApo ||
      normalizedQueryNoApostrophe === normLocalFullNameNoApo
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Preferred printing: latest set, then lower rarity.
 */
export function preferredLorcanaPrinting(cards: LorcanaCard[]): LorcanaCard | null {
  if (cards.length === 0) {
    return null;
  }

  if (cards.length === 1) {
    return cards[0] ?? null;
  }

  const sorted = [...cards].sort((a, b) => {
    const setCmp = (b.set ?? "").localeCompare(a.set ?? "", undefined, { numeric: true });
    if (setCmp !== 0) return setCmp;
    return rarityScore(a) - rarityScore(b);
  });

  return sorted[0] ?? null;
}

export type LorcanaDeckListResolverOptions = {
  displayNameAliases?: Record<string, string>;
};

export type LorcanaDisplayNameResolution = {
  cardName: string;
  resolvedCardName: string;
  matchCount: number;
  matches: LorcanaCard[];
  selectedCard: LorcanaCard | null;
};

export type LorcanaDeckListResolutionDiagnostics = {
  parsedEntriesCount: number;
  malformedLines: DeckListInvalidEntry[];
  unresolvedNames: string[];
  multiPrintingSelections: LorcanaDisplayNameResolution[];
};

export type LorcanaDeckListResolutionResult = {
  entries: ParsedDeckListEntry[];
  resolvedCards: Array<{
    cardName: string;
    quantity: number;
    card: LorcanaCard;
    cardId: string;
  }>;
  cards: LorcanaCard[];
  resolvedByCardName: Map<string, LorcanaDisplayNameResolution>;
  diagnostics: LorcanaDeckListResolutionDiagnostics;
};

function resolveDisplayNameAliases(
  cardName: string,
  options?: LorcanaDeckListResolverOptions,
): string {
  const aliases = options?.displayNameAliases ?? DEFAULT_LORCANA_DISPLAY_NAME_ALIASES;
  const trimmedName = cardName.trim();
  const normalized = normalizeDisplayNameForMatch(trimmedName);
  return aliases[normalized] ?? trimmedName;
}

/**
 * Resolve a card name against a fixed card pool.
 */
export function resolveLorcanaCardByDisplayNameFromPool(
  cardName: string,
  cardPool: Iterable<LorcanaCard>,
  options?: LorcanaDeckListResolverOptions,
): LorcanaDisplayNameResolution {
  const trimmedName = cardName.trim();
  const resolvedCardName = resolveDisplayNameAliases(trimmedName, options);

  const matches = [...cardPool].filter((card) => displayNameMatchesLorcana(resolvedCardName, card));
  const selectedCard = preferredLorcanaPrinting(matches);

  return {
    cardName: trimmedName,
    resolvedCardName,
    matchCount: matches.length,
    matches,
    selectedCard,
  };
}

/**
 * Resolve deck list text against a provided card pool (synchronous).
 */
export function resolveLorcanaDeckListTextFromPool(
  deckText: string,
  cardPool: Iterable<LorcanaCard>,
  options?: LorcanaDeckListResolverOptions,
): LorcanaDeckListResolutionResult {
  const { entries, invalid } = parseDeckListTextWithErrors(deckText);

  const resolvedByCardName = new Map<string, LorcanaDisplayNameResolution>();
  const unresolvedNames: string[] = [];
  const multiPrintingSelections: LorcanaDisplayNameResolution[] = [];

  const uniqueCardNames = [...new Set(entries.map((entry) => entry.cardName))];
  for (const cardName of uniqueCardNames) {
    const resolution = resolveLorcanaCardByDisplayNameFromPool(cardName, cardPool, options);
    resolvedByCardName.set(cardName, resolution);

    if (!resolution.selectedCard) {
      unresolvedNames.push(cardName);
      continue;
    }

    if (resolution.matchCount > 1) {
      multiPrintingSelections.push(resolution);
    }
  }

  const resolvedCards: Array<{
    cardName: string;
    quantity: number;
    card: LorcanaCard;
    cardId: string;
  }> = [];
  const cards: LorcanaCard[] = [];

  for (const entry of entries) {
    const resolution = resolvedByCardName.get(entry.cardName);
    const selectedCard = resolution?.selectedCard;

    if (!selectedCard) {
      continue;
    }

    const cardData = {
      cardName: entry.cardName,
      quantity: entry.quantity,
      card: selectedCard,
      cardId: selectedCard.id,
    };
    resolvedCards.push(cardData);
    for (let i = 0; i < entry.quantity; i++) {
      cards.push(selectedCard);
    }
  }

  return {
    entries,
    resolvedCards,
    cards,
    resolvedByCardName,
    diagnostics: {
      parsedEntriesCount: entries.length,
      malformedLines: invalid,
      unresolvedNames,
      multiPrintingSelections,
    },
  };
}

/**
 * Resolve deck list text against async-loaded package cards.
 */
export async function resolveLorcanaDeckListText(
  deckText: string,
  options?: LorcanaDeckListResolverOptions,
): Promise<LorcanaDeckListResolutionResult> {
  const allCards = await getAllCards();
  return resolveLorcanaDeckListTextFromPool(deckText, allCards, options);
}
