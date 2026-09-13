import preconstructedDecksJson from "./data/preconstructed-decks.json" with { type: "json" };

export const FLESH_AND_BLOOD_PRECONSTRUCTED_DECK_FORMATS = [
  "Blitz",
  "Classic Constructed",
  "Living Legend",
  "Open",
  "Silver Age",
  "Ultimate Pit Fight",
] as const;

export type FleshAndBloodPreconstructedDeckFormat =
  (typeof FLESH_AND_BLOOD_PRECONSTRUCTED_DECK_FORMATS)[number];

export type FleshAndBloodPreconstructedDeckVerificationStatus =
  | "official-list-match"
  | "official-list-discrepancy"
  | "official-product-verified";

export interface FleshAndBloodPreconstructedDeckCard {
  readonly cardIdentifier: string;
  readonly name: string;
  readonly pitch: 1 | 2 | 3 | null;
  readonly quantity: number;
  readonly inventoryQuantity: number;
  readonly printOverride: string | null;
}

export interface FleshAndBloodPreconstructedDeckHero {
  readonly cardIdentifier: string;
  readonly name: string;
  readonly quantity: number;
  readonly printOverride: string | null;
}

export interface FleshAndBloodPreconstructedDeckVerification {
  readonly status: FleshAndBloodPreconstructedDeckVerificationStatus;
  readonly evidenceUrl: string;
  readonly notes: readonly string[];
}

export interface FleshAndBloodPreconstructedDeck {
  readonly deckId: string;
  readonly name: string;
  readonly format: FleshAndBloodPreconstructedDeckFormat;
  readonly hero: FleshAndBloodPreconstructedDeckHero;
  readonly sourceUrl: string;
  readonly sourceUpdatedAt: string;
  readonly cards: readonly FleshAndBloodPreconstructedDeckCard[];
  readonly officialVerification: FleshAndBloodPreconstructedDeckVerification;
}

export interface FleshAndBloodPreconstructedDeckSnapshot {
  readonly schemaVersion: 1;
  readonly retrievedAt: string;
  readonly sources: {
    readonly fabraryIndex: string;
    readonly fabraryDeckTemplate: string;
    readonly officialDecklists: string;
  };
  readonly decks: readonly FleshAndBloodPreconstructedDeck[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) throw new TypeError(`${label} must be an object.`);
  return value;
}

function string(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${label} must be a non-empty string.`);
  }
  return value;
}

function nullableString(value: unknown, label: string): string | null {
  return value === null ? null : string(value, label);
}

function httpsUrl(value: unknown, label: string): string {
  const parsed = string(value, label);
  if (new URL(parsed).protocol !== "https:") throw new TypeError(`${label} must use HTTPS.`);
  return parsed;
}

function isoTimestamp(value: unknown, label: string): string {
  const parsed = string(value, label);
  if (Number.isNaN(Date.parse(parsed))) throw new TypeError(`${label} must be an ISO timestamp.`);
  return parsed;
}

function integer(value: unknown, label: string, minimum: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < minimum) {
    throw new TypeError(`${label} must be an integer greater than or equal to ${minimum}.`);
  }
  return value;
}

function pitch(value: unknown, label: string): 1 | 2 | 3 | null {
  switch (value) {
    case null:
    case 1:
    case 2:
    case 3:
      return value;
    default:
      throw new TypeError(`${label} must be null, 1, 2, or 3.`);
  }
}

function format(value: unknown): FleshAndBloodPreconstructedDeckFormat {
  switch (value) {
    case "Blitz":
    case "Classic Constructed":
    case "Living Legend":
    case "Open":
    case "Silver Age":
    case "Ultimate Pit Fight":
      return value;
    default:
      throw new TypeError(`Unsupported preconstructed deck format: ${String(value)}.`);
  }
}

function verificationStatus(value: unknown): FleshAndBloodPreconstructedDeckVerificationStatus {
  switch (value) {
    case "official-list-match":
    case "official-list-discrepancy":
    case "official-product-verified":
      return value;
    default:
      throw new TypeError(`Unsupported official verification status: ${String(value)}.`);
  }
}

function stringArray(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array.`);
  return value.map((entry, index) => string(entry, `${label}[${index}]`));
}

function parseHero(value: unknown, label: string): FleshAndBloodPreconstructedDeckHero {
  const hero = record(value, label);
  return {
    cardIdentifier: string(hero.cardIdentifier, `${label}.cardIdentifier`),
    name: string(hero.name, `${label}.name`),
    quantity: integer(hero.quantity, `${label}.quantity`, 1),
    printOverride: nullableString(hero.printOverride, `${label}.printOverride`),
  };
}

function parseCard(value: unknown, label: string): FleshAndBloodPreconstructedDeckCard {
  const card = record(value, label);
  const quantity = integer(card.quantity, `${label}.quantity`, 0);
  const inventoryQuantity = integer(card.inventoryQuantity, `${label}.inventoryQuantity`, 0);
  if (quantity + inventoryQuantity === 0) {
    throw new TypeError(`${label} must appear in the deck or its inventory.`);
  }
  return {
    cardIdentifier: string(card.cardIdentifier, `${label}.cardIdentifier`),
    name: string(card.name, `${label}.name`),
    pitch: pitch(card.pitch, `${label}.pitch`),
    quantity,
    inventoryQuantity,
    printOverride: nullableString(card.printOverride, `${label}.printOverride`),
  };
}

function parseVerification(
  value: unknown,
  label: string,
): FleshAndBloodPreconstructedDeckVerification {
  const verification = record(value, label);
  const status = verificationStatus(verification.status);
  const notes = stringArray(verification.notes, `${label}.notes`);
  if (status === "official-list-discrepancy" && notes.length === 0) {
    throw new TypeError(`${label}.notes must explain the official list discrepancy.`);
  }
  return {
    status,
    evidenceUrl: httpsUrl(verification.evidenceUrl, `${label}.evidenceUrl`),
    notes,
  };
}

function parseDeck(value: unknown, index: number): FleshAndBloodPreconstructedDeck {
  const label = `decks[${index}]`;
  const deck = record(value, label);
  const deckId = string(deck.deckId, `${label}.deckId`);
  if (!/^01[A-Z0-9]{24}$/.test(deckId)) {
    throw new TypeError(`${label}.deckId must be a Fabrary ULID.`);
  }
  if (!Array.isArray(deck.cards) || deck.cards.length === 0) {
    throw new TypeError(`${label}.cards must be a non-empty array.`);
  }
  return {
    deckId,
    name: string(deck.name, `${label}.name`),
    format: format(deck.format),
    hero: parseHero(deck.hero, `${label}.hero`),
    sourceUrl: httpsUrl(deck.sourceUrl, `${label}.sourceUrl`),
    sourceUpdatedAt: isoTimestamp(deck.sourceUpdatedAt, `${label}.sourceUpdatedAt`),
    cards: deck.cards.map((card, cardIndex) => parseCard(card, `${label}.cards[${cardIndex}]`)),
    officialVerification: parseVerification(
      deck.officialVerification,
      `${label}.officialVerification`,
    ),
  };
}

function parseSnapshot(value: unknown): FleshAndBloodPreconstructedDeckSnapshot {
  const snapshot = record(value, "preconstructed deck snapshot");
  if (snapshot.schemaVersion !== 1) {
    throw new TypeError(
      `Unsupported preconstructed deck schema: ${String(snapshot.schemaVersion)}.`,
    );
  }
  const sources = record(snapshot.sources, "preconstructed deck snapshot.sources");
  if (!Array.isArray(snapshot.decks)) {
    throw new TypeError("preconstructed deck snapshot.decks must be an array.");
  }
  const decks = snapshot.decks.map(parseDeck);
  const deckIds = new Set(decks.map((deck) => deck.deckId));
  if (deckIds.size !== decks.length) {
    throw new TypeError("Preconstructed deck IDs must be unique.");
  }
  return {
    schemaVersion: 1,
    retrievedAt: isoTimestamp(snapshot.retrievedAt, "preconstructed deck snapshot.retrievedAt"),
    sources: {
      fabraryIndex: httpsUrl(sources.fabraryIndex, "sources.fabraryIndex"),
      fabraryDeckTemplate: httpsUrl(sources.fabraryDeckTemplate, "sources.fabraryDeckTemplate"),
      officialDecklists: httpsUrl(sources.officialDecklists, "sources.officialDecklists"),
    },
    decks,
  };
}

export const fleshAndBloodPreconstructedDeckSnapshot = parseSnapshot(preconstructedDecksJson);

export const fleshAndBloodPreconstructedDecks = fleshAndBloodPreconstructedDeckSnapshot.decks;

export const fleshAndBloodPreconstructedDecksById: ReadonlyMap<
  string,
  FleshAndBloodPreconstructedDeck
> = new Map(fleshAndBloodPreconstructedDecks.map((deck) => [deck.deckId, deck]));

export function getFleshAndBloodPreconstructedDeck(
  deckId: string,
): FleshAndBloodPreconstructedDeck | undefined {
  return fleshAndBloodPreconstructedDecksById.get(deckId);
}
