import type { Card } from "@tcg/gundam-types";

import {
  evaluateGundamFormatLegality,
  type AppliedFormatPolicy,
  type DeckCardIdentityCount,
  type FormatLegalityViolation,
  type GundamFormatLegalityContext,
  type GundamRegisteredLineup,
} from "./format-legality.ts";

/**
 * Official Gundam TCG construction rules: 50-card main deck, 10-card
 * resource deck, one or two main-deck colors, and max 4 copies of the same
 * card number (except Resource cards and engine-spawned tokens). The catalog's
 * canonical identity is the aggregation key so alternate printing records
 * cannot accidentally evade that rule.
 */
export const GUNDAM_MAIN_DECK_SIZE = 50;
export const GUNDAM_RESOURCE_DECK_SIZE = 10;
export const GUNDAM_MAX_COPIES_PER_CARD = 4;
export const GUNDAM_MAX_DECK_COLORS = 2;
export const GUNDAM_SIDEBOARD_SIZE = 10;

/**
 * Card numbers the engine creates as tokens (see
 * `gundam/lifecycle/setup/mulligan.ts` for setup tokens, and the
 * `deployToken` action handler for in-game ones) or that are exempt
 * from the 4-copy cap. Decklists must not include these at all — they
 * are spawned by the engine, not drafted.
 *
 * Engine-spawned tokens: every EX Base artwork (`EXB-` booster, `EXBP-`
 * promo) and the promo EX Resource artworks (`EXRP-`). The booster EX
 * Resource cards (`EXR-*`) are deliberately NOT tokens — they are legal
 * resource-deck cards a player builds with. The `T-` prefix is reserved
 * for *any* in-game token printing (Gundam, Guncannon, Zaku Ⅱ, Strike
 * Gundam variants, …) — see `cards/t/unit/`. Reserving the prefixes at
 * validation time keeps the deck rules in sync with the token catalog
 * without having to enumerate each new printing here.
 */
const TOKEN_PREFIXES: readonly string[] = ["T-", "EXB-", "EXBP-", "EXRP-"];

function isTokenCardNumber(cardNumber: string): boolean {
  return TOKEN_PREFIXES.some((p) => cardNumber.startsWith(p));
}

export interface DeckListEntry {
  readonly cardNumber: string;
  readonly count: number;
  /**
   * Presentation printing for this row. A deck may allocate one canonical
   * card across several printings as separate rows; gameplay identity stays
   * `cardNumber` and this field only carries the chosen art. Optional so
   * engine-internal deck lists (sample decks, bots) stay unaffected.
   */
  readonly printingId?: string;
}

export interface DeckListResourceEntry {
  readonly cardNumber: string;
  readonly count: number;
  /** Presentation printing for the resource row (the art choice). */
  readonly printingId?: string;
}

/**
 * A serializable deck definition. The `cards` array is the 50-card
 * main deck (expanded from `count`); `resource` is the 10-card
 * resource deck — in Gundam TCG this is always 10 of a single resource
 * card, but the type allows future flexibility.
 */
export interface DeckList {
  readonly name: string;
  readonly description?: string;
  readonly cards: ReadonlyArray<DeckListEntry>;
  readonly resource: DeckListResourceEntry;
  readonly sideboard?: ReadonlyArray<DeckListEntry>;
}

export type GundamDeckConstructionFormat = "standard" | "best-of-three";
export type DeckListZone = "main" | "sideboard" | "resource" | "main-and-sideboard";

export type BaseDeckValidationViolationCode =
  | "deck-name"
  | "token-card"
  | "invalid-count"
  | "unknown-card"
  | "wrong-deck"
  | "base-copy-limit"
  | "main-deck-size"
  | "deck-colors"
  | "resource-deck-size"
  | "sideboard-not-allowed"
  | "sideboard-size";

export interface BaseDeckValidationViolation {
  readonly code: BaseDeckValidationViolationCode;
  readonly message: string;
  readonly cardIds?: ReadonlyArray<string>;
  readonly actual?: number;
  readonly allowed?: number;
  readonly zone?: DeckListZone;
}

export type DeckValidationViolation = BaseDeckValidationViolation | FormatLegalityViolation;

export type DeckValidationResult =
  | {
      readonly ok: true;
      readonly violations: readonly [];
      readonly policy?: AppliedFormatPolicy;
      readonly appliedExceptionIds?: ReadonlyArray<string>;
    }
  | {
      readonly ok: false;
      /** Compatibility projection for existing player-facing consumers. */
      readonly errors: ReadonlyArray<string>;
      readonly violations: ReadonlyArray<DeckValidationViolation>;
      readonly policy?: AppliedFormatPolicy;
      readonly appliedExceptionIds?: ReadonlyArray<string>;
    };

export interface DeckValidationOptions {
  readonly catalog: ReadonlyMap<string, Card> | Record<string, Card>;
  readonly mainDeckSize?: number;
  readonly resourceDeckSize?: number;
  readonly maxCopies?: number;
  /** Override the color limit for non-player fixtures such as card coverage decks. */
  readonly maxColors?: number;
  /** Standard is the default; BO3 requires an exactly 10-card sideboard. */
  readonly constructionFormat?: GundamDeckConstructionFormat;
  /**
   * Optional dated format policy. Omitting this preserves base construction
   * validation only. `asOf` is mandatory when policies are supplied.
   */
  readonly formatLegality?: GundamFormatLegalityContext;
}

function getCard(
  catalog: ReadonlyMap<string, Card> | Record<string, Card>,
  cardNumber: string,
): Card | undefined {
  if (catalog instanceof Map) return catalog.get(cardNumber);
  return (catalog as Record<string, Card>)[cardNumber];
}

/**
 * Returns an empty violation list when the deck satisfies Gundam TCG
 * construction rules and the selected dated format policy. On failure,
 * structured `violations` and the compatibility `errors` projection contain
 * every problem found — callers should surface all of them rather than
 * stopping at the first one.
 */
export function validateDeckList(
  list: DeckList,
  options: DeckValidationOptions,
): DeckValidationResult {
  const violations: DeckValidationViolation[] = [];
  const addViolation = (violation: BaseDeckValidationViolation): void => {
    violations.push(violation);
  };
  const mainSize = options.mainDeckSize ?? GUNDAM_MAIN_DECK_SIZE;
  const resSize = options.resourceDeckSize ?? GUNDAM_RESOURCE_DECK_SIZE;
  const maxCopies = options.maxCopies ?? GUNDAM_MAX_COPIES_PER_CARD;
  const maxColors = options.maxColors ?? GUNDAM_MAX_DECK_COLORS;
  const constructionFormat = options.constructionFormat ?? "standard";

  if (!list.name || list.name.trim().length === 0) {
    addViolation({ code: "deck-name", message: "deck must have a non-empty name" });
  }

  const counts = new Map<string, number>();
  const displayCardNumbers = new Map<string, Set<string>>();
  const resolvedEntries: DeckCardIdentityCount[] = [];
  const colors = new Set<string>();
  let totalMain = 0;
  const totalSideboard = (list.sideboard ?? []).reduce(
    (total, entry) =>
      Number.isInteger(entry.count) && entry.count > 0 ? total + entry.count : total,
    0,
  );

  const validateCardEntries = (
    entries: ReadonlyArray<DeckListEntry>,
    zone: "main" | "sideboard",
  ): void => {
    for (const entry of entries) {
      if (isTokenCardNumber(entry.cardNumber)) {
        addViolation({
          code: "token-card",
          message: `${zone} deck cannot contain token "${entry.cardNumber}" — tokens are engine-spawned`,
          cardIds: [entry.cardNumber],
          zone,
        });
        continue;
      }
      if (!Number.isInteger(entry.count) || entry.count <= 0) {
        addViolation({
          code: "invalid-count",
          message: `${entry.cardNumber}: count must be a positive integer`,
          cardIds: [entry.cardNumber],
          actual: entry.count,
          zone,
        });
        continue;
      }
      const card = getCard(options.catalog, entry.cardNumber);
      if (!card) {
        addViolation({
          code: "unknown-card",
          message: `${entry.cardNumber}: unknown card`,
          cardIds: [entry.cardNumber],
          zone,
        });
        continue;
      }
      if (card.type === "resource") {
        addViolation({
          code: "wrong-deck",
          message: `${entry.cardNumber}: resource cards belong in the resource deck, not the ${zone} deck`,
          cardIds: [entry.cardNumber],
          zone,
        });
        continue;
      }
      const canonicalId = card.canonicalId || card.cardNumber || entry.cardNumber;
      const existing = counts.get(canonicalId) ?? 0;
      counts.set(canonicalId, existing + entry.count);
      const aliases = displayCardNumbers.get(canonicalId) ?? new Set<string>();
      aliases.add(entry.cardNumber);
      displayCardNumbers.set(canonicalId, aliases);
      resolvedEntries.push({
        cardNumber: entry.cardNumber,
        canonicalId,
        count: entry.count,
        zone,
      });
      if (card.color) colors.add(card.color);
      if (zone === "main") totalMain += entry.count;
    }
  };

  validateCardEntries(list.cards, "main");
  validateCardEntries(list.sideboard ?? [], "sideboard");

  if (constructionFormat === "standard" && totalSideboard > 0) {
    addViolation({
      code: "sideboard-not-allowed",
      message: `standard decks cannot include a sideboard (found ${totalSideboard} cards)`,
      actual: totalSideboard,
      allowed: 0,
      zone: "sideboard",
    });
  } else if (constructionFormat === "best-of-three" && totalSideboard !== GUNDAM_SIDEBOARD_SIZE) {
    addViolation({
      code: "sideboard-size",
      message: `best-of-three sideboard must have exactly ${GUNDAM_SIDEBOARD_SIZE} cards (found ${totalSideboard})`,
      actual: totalSideboard,
      allowed: GUNDAM_SIDEBOARD_SIZE,
      zone: "sideboard",
    });
  }

  for (const [canonicalId, count] of counts) {
    if (count > maxCopies) {
      const cardIds = [...(displayCardNumbers.get(canonicalId) ?? [canonicalId])];
      addViolation({
        code: "base-copy-limit",
        message: `${cardIds.join(" / ")}: ${count} copies exceeds max of ${maxCopies}`,
        cardIds,
        actual: count,
        allowed: maxCopies,
        zone: constructionFormat === "best-of-three" ? "main-and-sideboard" : "main",
      });
    }
  }

  if (totalMain !== mainSize) {
    addViolation({
      code: "main-deck-size",
      message: `main deck must have exactly ${mainSize} cards (found ${totalMain})`,
      actual: totalMain,
      allowed: mainSize,
      zone: "main",
    });
  }
  if (colors.size < 1 || colors.size > maxColors) {
    const colorRule =
      maxColors === GUNDAM_MAX_DECK_COLORS ? "one or two colors" : `one to ${maxColors} colors`;
    addViolation({
      code: "deck-colors",
      message:
        constructionFormat === "best-of-three"
          ? `main deck and sideboard must use ${colorRule} (found ${colors.size})`
          : `main deck must use ${colorRule} (found ${colors.size})`,
      actual: colors.size,
      allowed: maxColors,
      zone: constructionFormat === "best-of-three" ? "main-and-sideboard" : "main",
    });
  }

  // The three resource-side rules are independent: the cardNumber can
  // be a token AND the count can be wrong AND the card can resolve to
  // a non-resource type. Evaluate each on its own so a token entry
  // doesn't mask a size problem and vice versa — `validateDeckList`'s
  // contract is to surface *every* error at once, not short-circuit on
  // the first.
  if (isTokenCardNumber(list.resource.cardNumber)) {
    addViolation({
      code: "token-card",
      message: `resource deck cannot contain token "${list.resource.cardNumber}" — tokens are engine-spawned`,
      cardIds: [list.resource.cardNumber],
      zone: "resource",
    });
  } else {
    const resCard = getCard(options.catalog, list.resource.cardNumber);
    if (!resCard) {
      addViolation({
        code: "unknown-card",
        message: `${list.resource.cardNumber}: unknown resource card`,
        cardIds: [list.resource.cardNumber],
        zone: "resource",
      });
    } else if (resCard.type !== "resource") {
      addViolation({
        code: "wrong-deck",
        message: `${list.resource.cardNumber}: resource deck entry must be a resource card (got "${resCard.type}")`,
        cardIds: [list.resource.cardNumber],
        zone: "resource",
      });
    }
  }

  if (!Number.isInteger(list.resource.count) || list.resource.count !== resSize) {
    addViolation({
      code: "resource-deck-size",
      message: `resource deck must have exactly ${resSize} cards (found ${list.resource.count})`,
      actual: list.resource.count,
      allowed: resSize,
      zone: "resource",
    });
  }

  const formatReport = options.formatLegality
    ? evaluateGundamFormatLegality(resolvedEntries, options.formatLegality, {
        mainDeck: list.cards,
        resourceDeck: [list.resource],
        ...(list.sideboard === undefined ? {} : { sideboard: list.sideboard }),
      } satisfies GundamRegisteredLineup)
    : { violations: [] };
  violations.push(...formatReport.violations);

  if (violations.length > 0) {
    return {
      ok: false,
      errors: violations.map((violation) => violation.message),
      violations,
      ...(formatReport.policy ? { policy: formatReport.policy } : {}),
      ...(formatReport.appliedExceptionIds
        ? { appliedExceptionIds: formatReport.appliedExceptionIds }
        : {}),
    };
  }
  return {
    ok: true,
    violations: [],
    ...(formatReport.policy ? { policy: formatReport.policy } : {}),
    ...(formatReport.appliedExceptionIds
      ? { appliedExceptionIds: formatReport.appliedExceptionIds }
      : {}),
  };
}

/**
 * True iff this card number is reserved for an engine-spawned token
 * and must not appear in a player-constructed decklist. Returns true
 * for the EX Base artworks (`EXB-` / `EXBP-`), the promo EX Resource
 * artworks (`EXRP-`), and any in-game token printing under the `T-`
 * prefix. Booster EX Resource cards (`EXR-`) are legal resource-deck
 * cards, not tokens.
 */
export function isDeckListToken(cardNumber: string): boolean {
  return isTokenCardNumber(cardNumber);
}
