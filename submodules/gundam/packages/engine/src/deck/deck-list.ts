import type { Card } from "@tcg/gundam-types";

/**
 * Official Gundam TCG construction rules: 50-card main deck, 10-card
 * resource deck, max 4 copies of any card by `cardNumber` (except the
 * resource card itself and engine-spawned tokens).
 */
export const GUNDAM_MAIN_DECK_SIZE = 50;
export const GUNDAM_RESOURCE_DECK_SIZE = 10;
export const GUNDAM_MAX_COPIES_PER_CARD = 4;

/**
 * Card numbers the engine creates as tokens (see
 * `gundam/lifecycle/setup/mulligan.ts` for setup tokens, and the
 * `deployToken` action handler for in-game ones) or that are exempt
 * from the 4-copy cap. Decklists must not include these at all — they
 * are spawned by the engine, not drafted.
 *
 * The set lists the two setup tokens explicitly. The `T-` prefix is
 * reserved for *any* in-game token printing (Gundam, Guncannon, Zaku Ⅱ,
 * Strike Gundam variants, …) — see `cards/t/unit/`. Reserving the
 * prefix at validation time keeps the deck rules in sync with the token
 * catalog without having to enumerate each new printing here.
 */
const TOKEN_CARD_NUMBERS: ReadonlySet<string> = new Set(["EXBP-001", "EXRP-003"]);
const TOKEN_PREFIXES: readonly string[] = ["T-"];

function isTokenCardNumber(cardNumber: string): boolean {
  if (TOKEN_CARD_NUMBERS.has(cardNumber)) return true;
  return TOKEN_PREFIXES.some((p) => cardNumber.startsWith(p));
}

export interface DeckListEntry {
  readonly cardNumber: string;
  readonly count: number;
}

export interface DeckListResourceEntry {
  readonly cardNumber: string;
  readonly count: number;
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
}

export type DeckValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly errors: ReadonlyArray<string> };

export interface DeckValidationOptions {
  readonly catalog: ReadonlyMap<string, Card> | Record<string, Card>;
  readonly mainDeckSize?: number;
  readonly resourceDeckSize?: number;
  readonly maxCopies?: number;
}

function getCard(
  catalog: ReadonlyMap<string, Card> | Record<string, Card>,
  cardNumber: string,
): Card | undefined {
  if (catalog instanceof Map) return catalog.get(cardNumber);
  return (catalog as Record<string, Card>)[cardNumber];
}

/**
 * Returns `{ ok: true }` if the decklist satisfies Gundam TCG
 * construction rules against the supplied catalog. On failure,
 * `errors` contains every problem found — callers should surface all
 * of them rather than stopping at the first one.
 */
export function validateDeckList(
  list: DeckList,
  options: DeckValidationOptions,
): DeckValidationResult {
  const errors: string[] = [];
  const mainSize = options.mainDeckSize ?? GUNDAM_MAIN_DECK_SIZE;
  const resSize = options.resourceDeckSize ?? GUNDAM_RESOURCE_DECK_SIZE;
  const maxCopies = options.maxCopies ?? GUNDAM_MAX_COPIES_PER_CARD;

  if (!list.name || list.name.trim().length === 0) {
    errors.push("deck must have a non-empty name");
  }

  const counts = new Map<string, number>();
  let totalMain = 0;

  for (const entry of list.cards) {
    if (isTokenCardNumber(entry.cardNumber)) {
      errors.push(
        `main deck cannot contain token "${entry.cardNumber}" — tokens are engine-spawned`,
      );
      continue;
    }
    if (!Number.isInteger(entry.count) || entry.count <= 0) {
      errors.push(`${entry.cardNumber}: count must be a positive integer`);
      continue;
    }
    const card = getCard(options.catalog, entry.cardNumber);
    if (!card) {
      errors.push(`${entry.cardNumber}: unknown card`);
      continue;
    }
    if (card.type === "resource") {
      errors.push(
        `${entry.cardNumber}: resource cards belong in the resource deck, not the main deck`,
      );
      continue;
    }
    const existing = counts.get(entry.cardNumber) ?? 0;
    counts.set(entry.cardNumber, existing + entry.count);
    totalMain += entry.count;
  }

  for (const [cardNumber, count] of counts) {
    if (count > maxCopies) {
      errors.push(`${cardNumber}: ${count} copies exceeds max of ${maxCopies}`);
    }
  }

  if (totalMain !== mainSize) {
    errors.push(`main deck must have exactly ${mainSize} cards (found ${totalMain})`);
  }

  // The three resource-side rules are independent: the cardNumber can
  // be a token AND the count can be wrong AND the card can resolve to
  // a non-resource type. Evaluate each on its own so a token entry
  // doesn't mask a size problem and vice versa — `validateDeckList`'s
  // contract is to surface *every* error at once, not short-circuit on
  // the first.
  if (isTokenCardNumber(list.resource.cardNumber)) {
    errors.push(
      `resource deck cannot contain token "${list.resource.cardNumber}" — tokens are engine-spawned`,
    );
  } else {
    const resCard = getCard(options.catalog, list.resource.cardNumber);
    if (!resCard) {
      errors.push(`${list.resource.cardNumber}: unknown resource card`);
    } else if (resCard.type !== "resource") {
      errors.push(
        `${list.resource.cardNumber}: resource deck entry must be a resource card (got "${resCard.type}")`,
      );
    }
  }

  if (!Number.isInteger(list.resource.count) || list.resource.count !== resSize) {
    errors.push(`resource deck must have exactly ${resSize} cards (found ${list.resource.count})`);
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true };
}

/**
 * True iff this card number is reserved for an engine-spawned token
 * and must not appear in a player-constructed decklist. Returns true
 * for both the explicit setup tokens (`EXBP-001` / `EXRP-003`) and any
 * in-game token printing under the `T-` prefix.
 */
export function isDeckListToken(cardNumber: string): boolean {
  return isTokenCardNumber(cardNumber);
}
