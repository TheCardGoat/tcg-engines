import type { OPCard, TargetFilter } from "@tcg/op-types";
import { getAllCards, getCard, hasCard } from "./index.ts";

/**
 * Deck-construction validation for the One Piece Card Game (Comprehensive
 * Rules 5-1-2 family) against this package's catalog. This is the game-owned
 * home of the rules; the agnostic-simulator server adapter's
 * `validateDeckForFormat` is a thin delegate over this module.
 */

/** Deck entry submitted for validation: a public card id and its quantity. */
export interface DeckValidationEntry {
  cardId: string;
  quantity: number;
}

/** Per-rule outcome; structurally matches the shared game-adapter contract. */
export interface DeckValidationRuleResult {
  kind: string;
  passed: boolean;
  message: string;
  details?: unknown;
}

/** Format validation result; structurally matches `DeckFormatResult`. */
export interface DeckValidationResult {
  formatId: string;
  /** Human-readable format name for error messages. */
  label?: string;
  valid: boolean;
  rules: DeckValidationRuleResult[];
}

/** Caller-selected event eligibility; this does not verify entry or opened packs. */
export interface DeckValidationOptions {
  allowDesignatedEventCards?: boolean;
}

const STANDARD_MAIN_DECK_SIZE = 50;
const SEALED_MAIN_DECK_SIZE = 40;
const STANDARD_DON_DECK_SIZE = 10;
const MAIN_DECK_CARD_TYPES: ReadonlySet<string> = new Set(["character", "event", "stage"]);

// Built lazily on first use: this module is re-exported from ./index.ts, so
// the catalog is only guaranteed to be registered by call time, not at module
// evaluation time.
let canonicalByPublicId: ReadonlyMap<string, string> | null = null;

function getCanonicalByPublicId(): ReadonlyMap<string, string> {
  if (canonicalByPublicId === null) {
    const map = new Map<string, string>();
    for (const card of getAllCards()) {
      map.set(card.id, card.canonicalId);
      for (const printing of card.printings) {
        map.set(printing.id, card.canonicalId);
      }
    }
    canonicalByPublicId = map;
  }
  return canonicalByPublicId;
}

/** Static deck restrictions have no game state; unsupported runtime filters fail closed. */
function matchesDeckFilter(card: OPCard, filter: TargetFilter): boolean | null {
  switch (filter.filter) {
    case "cardCategory":
      return card.cardType === filter.value;
    case "trait": {
      const values = typeof filter.value === "string" ? [filter.value] : filter.value;
      const matches = (card.traits ?? []).some((trait) =>
        values.some((value) =>
          filter.match === "includes" ? trait.includes(value) : trait === value,
        ),
      );
      return filter.negate ? !matches : matches;
    }
    case "cost":
    case "baseCost": {
      if (!("cost" in card)) return false;
      switch (filter.comparison) {
        case "eq":
          return card.cost === filter.value;
        case "gte":
          return card.cost >= filter.value;
        case "lte":
          return card.cost <= filter.value;
        case "gt":
          return card.cost > filter.value;
        case "lt":
          return card.cost < filter.value;
      }
    }
    default:
      return null;
  }
}

/**
 * Validate a deck against a format. Returns the per-rule breakdown; throws
 * when the format id is unknown.
 */
export function validateDeckForFormat(
  formatId: string,
  deck: ReadonlyArray<DeckValidationEntry>,
  options: DeckValidationOptions = {},
): DeckValidationResult {
  if (formatId !== "standard" && formatId !== "sealed") {
    throw new Error(`Unknown One Piece format: ${formatId}`);
  }

  const sealed = formatId === "sealed";
  const mainDeckSize = sealed ? SEALED_MAIN_DECK_SIZE : STANDARD_MAIN_DECK_SIZE;

  const invalidQuantities = deck.filter(
    (entry) => !Number.isSafeInteger(entry.quantity) || entry.quantity <= 0,
  );
  const quantitiesPassed = invalidQuantities.length === 0;

  // Normalize public/printing IDs to canonical IDs so the rest of the
  // validation can rely on the runtime catalog. The original entries are kept
  // only for the unknown-card-pool details.
  const canonicalDeck = deck.map((entry) => {
    if (hasCard(entry.cardId)) return entry;
    const canonicalId = getCanonicalByPublicId().get(entry.cardId);
    return canonicalId ? { ...entry, cardId: canonicalId } : entry;
  });

  // Unknown card ids must be rejected before any other rule is evaluated; they
  // do not contribute to counts or copy limits.
  const unknownEntries = canonicalDeck.filter((entry) => !hasCard(entry.cardId));
  const cardPoolPassed = unknownEntries.length === 0;

  // DON!! cards arrive as entries with cardType "don" in the same flat list
  // (the DeckCard API has no separate DON!! deck slot); their total quantity
  // forms the DON!! deck and never counts toward the main deck.
  const leaderEntries = canonicalDeck.filter(
    (entry) => hasCard(entry.cardId) && getCard(entry.cardId).cardType === "leader",
  );
  const designatedEventLeaders = leaderEntries.filter((entry) => {
    const card = getCard(entry.cardId);
    return card.cardType === "leader" && card.designatedEventsOnly;
  });
  const eventEligibilityPassed =
    designatedEventLeaders.length === 0 || (sealed && options.allowDesignatedEventCards === true);
  const leaderCount = leaderEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const leaderColors =
    quantitiesPassed && leaderCount === 1 ? getCard(leaderEntries[0]!.cardId).color : null;
  const leaderRules =
    quantitiesPassed && leaderCount === 1
      ? (getCard(leaderEntries[0]!.cardId).effects?.deckBuildingRules ?? [])
      : [];
  const donDeckSize =
    leaderRules.find((rule) => rule.rule === "donDeckCount")?.count ?? STANDARD_DON_DECK_SIZE;
  const restrictedCards = canonicalDeck.filter((entry) => {
    if (!hasCard(entry.cardId)) return false;
    const card = getCard(entry.cardId);
    if (!MAIN_DECK_CARD_TYPES.has(card.cardType)) return false;
    return leaderRules.some(
      (rule) =>
        rule.rule === "cannotInclude" &&
        rule.filters.every((filter) => matchesDeckFilter(card, filter) !== false),
    );
  });
  const unsupportedRestrictions = leaderRules.some(
    (rule) =>
      rule.rule === "cannotInclude" &&
      rule.filters.some(
        (filter) => !["cost", "baseCost", "trait", "cardCategory"].includes(filter.filter),
      ),
  );
  const leaderRestrictionsPassed = restrictedCards.length === 0 && !unsupportedRestrictions;

  const donCount = canonicalDeck.reduce(
    (sum, entry) =>
      hasCard(entry.cardId) && getCard(entry.cardId).cardType === "don"
        ? sum + entry.quantity
        : sum,
    0,
  );
  const totalCount = canonicalDeck.reduce((sum, entry) => sum + entry.quantity, 0);
  const mainCount = totalCount - donCount - leaderEntries.reduce((s, e) => s + e.quantity, 0);

  const copiesByCanonicalId = new Map<string, number>();
  for (const entry of canonicalDeck) {
    if (!hasCard(entry.cardId) || getCard(entry.cardId).cardType === "don") continue;
    const canonicalId = getCanonicalByPublicId().get(entry.cardId) ?? entry.cardId;
    copiesByCanonicalId.set(
      canonicalId,
      (copiesByCanonicalId.get(canonicalId) ?? 0) + entry.quantity,
    );
  }
  const overCopyLimit = [...copiesByCanonicalId].filter(([canonicalId, quantity]) => {
    if (sealed || quantity <= 4 || !hasCard(canonicalId)) return false;
    return !getCard(canonicalId).effects?.deckBuildingRules?.some(
      (rule) => rule.rule === "unlimitedCopies",
    );
  });
  const copyLimitPassed = overCopyLimit.length === 0;

  // Standard uses 50 main cards; official sealed rules use 40. Leader and DON!! are separate.
  const deckSizePassed = mainCount === mainDeckSize;
  // 5-1-2: the DON!! deck is exactly 10 DON!! cards. A list without DON!!
  // entries passes in standard for existing leader + main deck consumers.
  // Sealed requires the DON!! deck; printed Leader overrides still apply.
  const donDeckPassed = (!sealed && donCount === 0) || donCount === donDeckSize;
  // 5-1-2-1: the main deck is made up of Character, Event, and Stage cards.
  const invalidMainDeckCards = canonicalDeck.filter((entry) => {
    if (!hasCard(entry.cardId)) return false;
    const cardType = getCard(entry.cardId).cardType;
    return cardType !== "leader" && cardType !== "don" && !MAIN_DECK_CARD_TYPES.has(cardType);
  });
  const cardTypesPassed = invalidMainDeckCards.length === 0;
  // 5-1-2-2: only cards of a color included on the Leader card may be in the
  // deck (a multicolor card qualifies when any of its colors is included).
  // 5-1-2-4 replaces only the construction rules a card's own effect
  // specifies — e.g. OP01-075's unlimited-copies text replaces 5-1-2-3 for
  // that card, never color legality. No catalog card has a color-override
  // deck-construction effect; extend DeckBuildingRule when one appears.
  const offColorCards =
    sealed || leaderColors === null
      ? []
      : [...copiesByCanonicalId.keys()].filter((canonicalId) => {
          if (!hasCard(canonicalId)) return false;
          const card = getCard(canonicalId);
          if (card.cardType === "leader") return false;
          return !card.color.some((color) => leaderColors.includes(color));
        });
  const colorLegalityPassed = offColorCards.length === 0;

  return {
    formatId,
    label: sealed ? "Sealed" : "Standard",
    valid:
      quantitiesPassed &&
      cardPoolPassed &&
      eventEligibilityPassed &&
      deckSizePassed &&
      donDeckPassed &&
      cardTypesPassed &&
      colorLegalityPassed &&
      leaderRestrictionsPassed &&
      leaderCount === 1 &&
      copyLimitPassed,
    rules: [
      {
        kind: "card-quantities",
        passed: quantitiesPassed,
        message: quantitiesPassed
          ? "All card quantities are positive integers"
          : "Each card quantity must be a positive safe integer",
        details: invalidQuantities,
      },
      {
        kind: "card-pool",
        passed: cardPoolPassed,
        message:
          unknownEntries.length === 0
            ? "All cards are in the One Piece card pool"
            : `Unknown cards: ${unknownEntries.map((entry) => entry.cardId).join(", ")}`,
        details: unknownEntries,
      },
      {
        kind: "designated-event-eligibility",
        passed: eventEligibilityPassed,
        message: eventEligibilityPassed
          ? "Designated-event card eligibility requirements met"
          : "Designated-event Leaders require sealed format and explicit event eligibility",
        details: designatedEventLeaders,
      },
      {
        kind: "deck-size",
        passed: deckSizePassed,
        message: deckSizePassed
          ? `Deck has exactly ${mainDeckSize} main-deck cards`
          : `Deck must contain exactly ${mainDeckSize} main-deck cards (found ${mainCount})`,
      },
      {
        kind: "don-deck",
        passed: donDeckPassed,
        message: donDeckPassed
          ? donCount === 0
            ? "No DON!! cards submitted"
            : `DON!! deck has exactly ${donDeckSize} cards`
          : `DON!! deck must contain exactly ${donDeckSize} cards (found ${donCount})`,
      },
      {
        kind: "card-types",
        passed: cardTypesPassed,
        message: cardTypesPassed
          ? "Main deck contains only Character, Event, and Stage cards"
          : `Main deck may only contain Character, Event, and Stage cards: ${invalidMainDeckCards
              .map((entry) => entry.cardId)
              .join(", ")}`,
      },
      {
        kind: "color-legality",
        passed: colorLegalityPassed,
        message: colorLegalityPassed
          ? sealed
            ? "Sealed permits cards of any color"
            : "All cards match a color included on the leader"
          : `Cards with a color not included on the leader: ${offColorCards.join(", ")}`,
      },
      {
        kind: "leader-restrictions",
        passed: leaderRestrictionsPassed,
        message: unsupportedRestrictions
          ? "Leader deck restriction is not supported"
          : leaderRestrictionsPassed
            ? "All cards meet the leader's deck restrictions"
            : `Cards prohibited by the leader: ${restrictedCards.map((entry) => entry.cardId).join(", ")}`,
        details: restrictedCards,
      },
      {
        kind: "leader-count",
        passed: leaderCount === 1,
        message:
          leaderCount === 1
            ? "Deck has exactly 1 leader"
            : `Deck must have exactly 1 leader (found ${leaderCount})`,
      },
      {
        kind: "copy-limit",
        passed: copyLimitPassed,
        message: copyLimitPassed
          ? sealed
            ? "Sealed has no four-copy limit"
            : "No card exceeds its allowed copy limit"
          : `Copy limit exceeded: ${overCopyLimit
              .map(([canonicalId, quantity]) => `${canonicalId} x${quantity}`)
              .join(", ")}`,
        details: overCopyLimit.map(([canonicalId, quantity]) => ({ canonicalId, quantity })),
      },
    ],
  };
}
