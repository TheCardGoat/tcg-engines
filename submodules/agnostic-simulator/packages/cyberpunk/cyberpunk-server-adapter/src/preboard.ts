import {
  toCyberpunkValidationCard,
  validateCyberpunkDeck,
  type CyberpunkDeckValidationCard,
  type CyberpunkDeckValidationEntry,
  type CyberpunkValidationCatalogCard,
} from "@tcg/shared/cyberpunk/deck-validation";
import {
  isJsonValue,
  type DeckCard,
  type DeckEntry,
  type JsonValue,
  type PregameDeckInput,
  type PregameValidationResult,
} from "@tcg/shared/game-adapter";

/** C.2.1: three minutes to pre-sideboard before a competitive best-of-1. */
export const CYBERPUNK_PREBOARD_DEADLINE_MS = 3 * 60 * 1000;
/** D.1 registration: the sideboard is exactly this many non-Legend cards. */
export const CYBERPUNK_SIDEBOARD_REGISTRATION_COUNT = 7;
/** 3.4.4: after the exchange the sideboard cannot grow past the registered size. */
export const CYBERPUNK_SIDEBOARD_MAX = 7;
/** Stored runtime rows use "side". Deck documents may say "sideboard". Both are the same section. */
export const CYBERPUNK_SIDEBOARD_SECTION = "side";
const CYBERPUNK_SIDE_SECTIONS = new Set([CYBERPUNK_SIDEBOARD_SECTION, "sideboard"]);

function isSideboardSection(sectionId: string | undefined): boolean {
  return sectionId !== undefined && CYBERPUNK_SIDE_SECTIONS.has(sectionId);
}

const SIDEBOARD_LOCKED = "The sideboard is locked for the rest of the match.";

export interface CyberpunkPreboardCard {
  cardId: string;
  quantity: number;
  printingId?: string;
  card: CyberpunkDeckValidationCard;
}

export type CyberpunkCardResolver = (
  cardId: string,
  printingId?: string,
) => CyberpunkValidationCatalogCard | undefined;

export interface CyberpunkPreboardQuantity {
  cardId: string;
  quantity: number;
  printingId?: string;
}

export interface CyberpunkPreboardPool {
  formatId: string;
  stage?: "game-one" | "between-games";
  startingSelection?: CyberpunkPreboardSelection;
  legends: CyberpunkPreboardCard[];
  main: CyberpunkPreboardCard[];
  sideboard: CyberpunkPreboardCard[];
}

export interface CyberpunkPreboardSelection {
  legends: CyberpunkPreboardQuantity[];
  main: CyberpunkPreboardQuantity[];
  sideboard: CyberpunkPreboardQuantity[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function issue(code: string, message: string): PregameValidationResult["issues"][number] {
  return { code, message };
}

function quantityKey(cardId: string, printingId?: string): string {
  return `${cardId}\0${printingId ?? ""}`;
}

function aggregateQuantities(
  entries: readonly CyberpunkPreboardQuantity[],
): CyberpunkPreboardQuantity[] {
  const totals = new Map<string, CyberpunkPreboardQuantity>();
  for (const entry of entries) {
    const key = quantityKey(entry.cardId, entry.printingId);
    const existing = totals.get(key);
    if (existing) existing.quantity += entry.quantity;
    else totals.set(key, { ...entry });
  }
  return [...totals.values()].sort((left, right) =>
    quantityKey(left.cardId, left.printingId).localeCompare(
      quantityKey(right.cardId, right.printingId),
    ),
  );
}

function sameQuantities(
  left: readonly CyberpunkPreboardQuantity[],
  right: readonly CyberpunkPreboardQuantity[],
): boolean {
  const a = aggregateQuantities(left);
  const b = aggregateQuantities(right);
  if (a.length !== b.length) return false;
  return a.every(
    (entry, index) =>
      entry.cardId === b[index]?.cardId &&
      entry.quantity === b[index]?.quantity &&
      (entry.printingId ?? "") === (b[index]?.printingId ?? ""),
  );
}

function parseQuantityList(value: unknown, label: string): CyberpunkPreboardQuantity[] {
  if (!Array.isArray(value)) throw new Error(`Invalid Cyberpunk pre-board ${label}`);
  return aggregateQuantities(
    value.map((entry) => {
      if (
        !isRecord(entry) ||
        typeof entry.cardId !== "string" ||
        entry.cardId.length === 0 ||
        typeof entry.quantity !== "number" ||
        !Number.isSafeInteger(entry.quantity) ||
        entry.quantity < 1 ||
        (entry.printingId !== undefined && typeof entry.printingId !== "string")
      ) {
        throw new Error(`Invalid Cyberpunk pre-board ${label} entry`);
      }
      return {
        cardId: entry.cardId,
        quantity: entry.quantity,
        ...(typeof entry.printingId === "string" ? { printingId: entry.printingId } : {}),
      };
    }),
  );
}

function cardFact(entry: CyberpunkPreboardCard): CyberpunkDeckValidationCard {
  return { ...entry.card, id: entry.cardId };
}

function validationEntries(
  entries: readonly CyberpunkPreboardCard[],
): CyberpunkDeckValidationEntry[] {
  return entries.map((entry) => ({ card: cardFact(entry), quantity: entry.quantity }));
}

function quantitiesOf(entries: readonly CyberpunkPreboardCard[]): CyberpunkPreboardQuantity[] {
  return aggregateQuantities(
    entries.map((entry) => ({
      cardId: entry.cardId,
      quantity: entry.quantity,
      ...(entry.printingId ? { printingId: entry.printingId } : {}),
    })),
  );
}

function lookupFacts(
  pool: CyberpunkPreboardPool,
  cardId: string,
  printingId?: string,
): CyberpunkPreboardCard | undefined {
  return [...pool.legends, ...pool.main, ...pool.sideboard].find(
    (entry) => quantityKey(entry.cardId, entry.printingId) === quantityKey(cardId, printingId),
  );
}

function sharedDeckIssues(input: {
  legends: CyberpunkDeckValidationEntry[];
  mainDeck: CyberpunkDeckValidationEntry[];
  sideboard: CyberpunkDeckValidationEntry[];
}): PregameValidationResult["issues"][number][] {
  return validateCyberpunkDeck(input).issues.map((entry) => issue(entry.code, entry.message));
}

/** Exactly 7 is competitive registration. The shared Alpha check allows 0–7 and rejects only more than 7. */
function registrationIssues(
  pool: CyberpunkPreboardPool,
): PregameValidationResult["issues"][number][] {
  const issues = sharedDeckIssues({
    legends: validationEntries(pool.legends),
    mainDeck: validationEntries(pool.main),
    sideboard: validationEntries(pool.sideboard),
  });
  const sideboardCount = pool.sideboard.reduce((total, entry) => {
    if (entry.card.type.trim().toLowerCase() === "legend") return total;
    return total + entry.quantity;
  }, 0);
  if (sideboardCount !== CYBERPUNK_SIDEBOARD_REGISTRATION_COUNT) {
    issues.push(
      issue(
        "sideboard-count",
        `Sideboard must contain exactly ${CYBERPUNK_SIDEBOARD_REGISTRATION_COUNT} cards; it has ${sideboardCount}.`,
      ),
    );
  }
  return issues;
}

function expandInput(
  input: PregameDeckInput,
  resolve: CyberpunkCardResolver,
): {
  legends: DeckCard[];
  main: DeckCard[];
  sideboard: DeckCard[];
} {
  const legends: DeckCard[] = [];
  const main: DeckCard[] = [];
  const sideboard: DeckCard[] = [];
  const place = (entry: DeckCard, source: "listed" | "inventory") => {
    if (!Number.isSafeInteger(entry.quantity) || entry.quantity < 1) {
      throw new Error(`Invalid Cyberpunk deck quantity for ${entry.cardId}`);
    }
    const card = resolve(entry.cardId, entry.printingId);
    if (!card) throw new Error(`Unknown Cyberpunk card: ${entry.cardId}`);
    if (source === "inventory") {
      if (deckHasTaggedSideboard(input)) return;
      sideboard.push(entry);
      return;
    }
    if (isSideboardSection(entry.sectionId)) {
      sideboard.push(entry);
      return;
    }
    if (entry.sectionId === "main") {
      main.push(entry);
      return;
    }
    if (
      entry.sectionId === "legend" ||
      (!entry.sectionId && card.type.trim().toLowerCase() === "legend")
    ) {
      legends.push(entry);
      return;
    }
    if (entry.sectionId && entry.sectionId !== "main") {
      throw new Error(`Unknown Cyberpunk deck section: ${entry.sectionId}`);
    }
    main.push(entry);
  };
  for (const entry of input.mainDeck) place(entry, "listed");
  for (const entry of input.inventory) place(entry, "inventory");
  return { legends, main, sideboard };
}

function toPoolCards(
  entries: readonly DeckCard[],
  resolve: CyberpunkCardResolver,
): CyberpunkPreboardCard[] {
  return aggregateQuantities(
    entries.map((entry) => ({
      cardId: entry.cardId,
      quantity: entry.quantity,
      ...(entry.printingId ? { printingId: entry.printingId } : {}),
    })),
  ).map((entry) => {
    const catalogCard = resolve(entry.cardId, entry.printingId);
    if (!catalogCard) throw new Error(`Unknown Cyberpunk card: ${entry.cardId}`);
    return {
      cardId: entry.cardId,
      quantity: entry.quantity,
      ...(entry.printingId ? { printingId: entry.printingId } : {}),
      card: { ...toCyberpunkValidationCard(catalogCard, entry.printingId), id: entry.cardId },
    };
  });
}

function deckHasTaggedSideboard(deck: PregameDeckInput): boolean {
  return deck.mainDeck.some((entry) => isSideboardSection(entry.sectionId) && entry.quantity > 0);
}

/** Non-Legend sideboard cards. A tagged section wins; inventory is the sideboard only when no section is tagged. */
export function cyberpunkNonLegendSideboardCount(
  deck: PregameDeckInput,
  isLegend: (cardId: string) => boolean = () => false,
): number {
  let total = 0;
  const consider = (entry: DeckCard) => {
    if (!Number.isSafeInteger(entry.quantity) || entry.quantity < 1) return;
    if (isLegend(entry.cardId)) return;
    total += entry.quantity;
  };
  if (deckHasTaggedSideboard(deck)) {
    for (const entry of deck.mainDeck) {
      if (isSideboardSection(entry.sectionId)) consider(entry);
    }
    return total;
  }
  for (const entry of deck.inventory) consider(entry);
  return total;
}

/** Queue policy selects preparation. Deck contents can never disable a required phase. */
export function cyberpunkPreboardApplies(input: {
  readonly format: string;
  readonly matchType?: string;
  readonly decks: readonly PregameDeckInput[];
}): boolean {
  if (input.format === "best_of_3") return true;
  if (input.format !== "best_of_1") return false;
  // Casual, testing, and bot practice BO1 use quick decks. Competitive and
  // private registrations use the full tournament preparation procedure.
  return (
    input.matchType !== "casual" &&
    input.matchType !== "testing" &&
    input.matchType !== "practice_vs_bot"
  );
}

export function createCyberpunkPreboardPool(
  input: PregameDeckInput,
  resolve: CyberpunkCardResolver,
  matchFormat?: string,
): CyberpunkPreboardPool {
  const sections = expandInput(input, resolve);
  const pool: CyberpunkPreboardPool = {
    formatId: input.formatId,
    ...(matchFormat === "best_of_3" ? { stage: "game-one" as const } : {}),
    legends: toPoolCards(sections.legends, resolve),
    main: toPoolCards(sections.main, resolve),
    sideboard: toPoolCards(sections.sideboard, resolve),
  };
  const issues = registrationIssues(pool);
  if (issues.length > 0) {
    throw new Error(issues.map((entry) => entry.message).join(" "));
  }
  return pool;
}

export function parseCyberpunkPreboardPool(value: unknown): CyberpunkPreboardPool {
  if (!isRecord(value) || typeof value.formatId !== "string") {
    throw new Error("Invalid Cyberpunk pre-board pool");
  }
  const readCards = (section: unknown, label: string): CyberpunkPreboardCard[] => {
    if (!Array.isArray(section)) throw new Error(`Invalid Cyberpunk pre-board ${label}`);
    return section.map((entry) => {
      if (
        !isRecord(entry) ||
        typeof entry.cardId !== "string" ||
        typeof entry.quantity !== "number" ||
        !Number.isSafeInteger(entry.quantity) ||
        entry.quantity < 1 ||
        (entry.printingId !== undefined && typeof entry.printingId !== "string")
      ) {
        throw new Error(`Invalid Cyberpunk pre-board ${label} entry`);
      }
      return {
        cardId: entry.cardId,
        quantity: entry.quantity,
        ...(typeof entry.printingId === "string" ? { printingId: entry.printingId } : {}),
        card: parseStoredCard(entry.card, entry.cardId),
      };
    });
  };
  return {
    formatId: value.formatId,
    ...(value.stage === "game-one" || value.stage === "between-games"
      ? { stage: value.stage }
      : {}),
    ...(value.startingSelection !== undefined
      ? { startingSelection: parseCyberpunkPreboardSelection(value.startingSelection) }
      : {}),
    legends: readCards(value.legends, "legends"),
    main: readCards(value.main, "main"),
    sideboard: readCards(value.sideboard, "sideboard"),
  };
}

export function parseCyberpunkPreboardSelection(value: unknown): CyberpunkPreboardSelection {
  if (!isRecord(value)) throw new Error("Invalid Cyberpunk pre-board selection");
  return {
    legends: parseQuantityList(value.legends, "legends"),
    main: parseQuantityList(value.main, "main"),
    sideboard: parseQuantityList(value.sideboard, "sideboard"),
  };
}

export function defaultCyberpunkPreboardSelection(
  pool: CyberpunkPreboardPool,
): CyberpunkPreboardSelection {
  if (pool.startingSelection) return pool.startingSelection;
  return {
    legends: quantitiesOf(pool.legends),
    main: quantitiesOf(pool.main),
    sideboard: quantitiesOf(pool.sideboard),
  };
}

/** Retain the registered pool and present the previous game's legal split. */
export function nextCyberpunkPreboardPool(
  pool: CyberpunkPreboardPool,
  previousSelection: CyberpunkPreboardSelection,
): CyberpunkPreboardPool {
  const validation = validateCyberpunkPreboard(pool, previousSelection);
  if (!validation.valid) throw new Error(validation.issues.map((issue) => issue.message).join(" "));
  return {
    ...pool,
    stage: "between-games",
    startingSelection: previousSelection,
  };
}

export function validateCyberpunkPreboard(
  pool: CyberpunkPreboardPool,
  selection: CyberpunkPreboardSelection,
  viewer?: { readonly locked?: boolean },
): PregameValidationResult {
  if (viewer?.locked) {
    return { valid: false, issues: [issue("sideboard-locked", SIDEBOARD_LOCKED)] };
  }
  const issues: PregameValidationResult["issues"][number][] = [];
  const count = (entries: readonly { quantity: number }[]) =>
    entries.reduce((sum, entry) => sum + entry.quantity, 0);
  if (count(selection.main) !== count(pool.main)) {
    issues.push(issue("main-count", "Keep the registered main deck card count."));
  }
  if (count(selection.sideboard) !== CYBERPUNK_SIDEBOARD_REGISTRATION_COUNT) {
    issues.push(issue("sideboard-count", "The sideboard must contain exactly 7 cards."));
  }
  if (
    pool.stage === "game-one" &&
    (!sameQuantities(selection.main, quantitiesOf(pool.main)) ||
      !sameQuantities(selection.sideboard, quantitiesOf(pool.sideboard)))
  ) {
    issues.push(
      issue("game-one-deck", "Game 1 uses the registered deck. Sideboard between games."),
    );
  }
  if (!sameQuantities(selection.legends, quantitiesOf(pool.legends))) {
    issues.push(issue("legend-lock", "Legends stay on the registered list."));
  }
  const legendIds = new Set(pool.legends.map((entry) => entry.cardId));
  if ([...selection.main, ...selection.sideboard].some((entry) => legendIds.has(entry.cardId))) {
    issues.push(issue("legend-lock", "Players may not sideboard Legend cards."));
  }
  const registered = quantitiesOf([...pool.main, ...pool.sideboard]);
  const presented = aggregateQuantities([...selection.main, ...selection.sideboard]);
  if (!sameQuantities(registered, presented)) {
    issues.push(
      issue("registered-pool", "Move cards only between the registered main deck and sideboard."),
    );
  }
  for (const entry of presented) {
    if (!lookupFacts(pool, entry.cardId, entry.printingId)) {
      issues.push(issue("registered-pool", `${entry.cardId} is outside the registered pool.`));
    }
  }
  issues.push(
    ...sharedDeckIssues({
      legends: validationEntries(pool.legends),
      mainDeck: selectedEntries(pool, selection.main),
      sideboard: selectedEntries(pool, selection.sideboard),
    }),
  );
  return { valid: issues.length === 0, issues };
}

function selectedEntries(
  pool: CyberpunkPreboardPool,
  quantities: readonly CyberpunkPreboardQuantity[],
): CyberpunkDeckValidationEntry[] {
  return quantities.flatMap((entry) => {
    const fact = lookupFacts(pool, entry.cardId, entry.printingId);
    if (!fact) return [];
    return [{ card: cardFact(fact), quantity: entry.quantity }];
  });
}

function parseStoredCard(value: unknown, cardId: string): CyberpunkDeckValidationCard {
  if (
    !isRecord(value) ||
    typeof value.name !== "string" ||
    typeof value.type !== "string" ||
    typeof value.color !== "string" ||
    (value.ram !== null && typeof value.ram !== "number")
  ) {
    throw new Error(`Invalid Cyberpunk pre-board card: ${cardId}`);
  }
  const card: CyberpunkDeckValidationCard = {
    id: cardId,
    name: value.name,
    type: value.type,
    color: value.color,
    ram: typeof value.ram === "number" ? value.ram : null,
  };
  if (typeof value.displayName === "string") card.displayName = value.displayName;
  if (typeof value.subname === "string" || value.subname === null) card.subname = value.subname;
  if (typeof value.setCode === "string" || value.setCode === null) card.setCode = value.setCode;
  if (typeof value.rarity === "string" || value.rarity === null) card.rarity = value.rarity;
  if (typeof value.textless === "boolean") card.textless = value.textless;
  if (value.testPrint === true) card.testPrint = true;
  if (Array.isArray(value.printings)) {
    card.printings = value.printings.flatMap((printing) => {
      if (!isRecord(printing)) return [];
      return [
        {
          ...(typeof printing.setCode === "string" || printing.setCode === null
            ? { setCode: printing.setCode }
            : {}),
          ...(typeof printing.rarity === "string" || printing.rarity === null
            ? { rarity: printing.rarity }
            : {}),
          ...(printing.testPrint === true ? { testPrint: true } : {}),
        },
      ];
    });
  }
  return card;
}

export function reconcileCyberpunkPreboard(
  pool: CyberpunkPreboardPool,
  selection: CyberpunkPreboardSelection,
): { selection: CyberpunkPreboardSelection; validation: PregameValidationResult } {
  const validation = validateCyberpunkPreboard(pool, selection);
  if (validation.valid) return { selection, validation };
  const fallback = defaultCyberpunkPreboardSelection(pool);
  return { selection: fallback, validation: validateCyberpunkPreboard(pool, fallback) };
}

/** Rival view: the three Legends, face up. Main deck and sideboard stay private. */
export function projectCyberpunkRivalLegends(pool: CyberpunkPreboardPool): {
  legends: CyberpunkPreboardCard[];
} {
  return {
    legends: pool.legends.map((entry) => ({ ...entry })),
  };
}

export function projectCyberpunkPreboardPool(
  pool: CyberpunkPreboardPool,
  viewer?: { readonly locked?: boolean },
): JsonValue {
  if (viewer?.locked) {
    return cyberpunkPreboardToJson({
      ...(pool.stage ? { stage: pool.stage } : {}),
      legends: pool.legends.map((entry) => ({ ...entry })),
      sideboardLocked: true,
    });
  }
  return cyberpunkPreboardToJson({
    ...(pool.stage ? { stage: pool.stage } : {}),
    legends: pool.legends.map((entry) => ({ ...entry })),
    main: pool.main.map((entry) => ({ ...entry })),
    sideboard: pool.sideboard.map((entry) => ({ ...entry })),
  });
}

export function projectCyberpunkPreboardSelection(
  selection: CyberpunkPreboardSelection,
  viewer?: { readonly locked?: boolean },
): JsonValue {
  if (viewer?.locked) {
    return cyberpunkPreboardToJson({
      legends: selection.legends.map((entry) => ({ ...entry })),
      main: selection.main.map((entry) => ({ ...entry })),
      sideboardLocked: true,
    });
  }
  return cyberpunkPreboardToJson({
    legends: selection.legends.map((entry) => ({ ...entry })),
    main: selection.main.map((entry) => ({ ...entry })),
    sideboard: readCyberpunkPregameSideboard({ locked: false, sideboard: selection.sideboard }),
  });
}

/** The sideboard read players are allowed during the open window. */
export function readCyberpunkPregameSideboard(seat: {
  readonly locked: boolean;
  readonly sideboard?: readonly CyberpunkPreboardQuantity[];
  readonly sideboardLocked?: boolean;
}): CyberpunkPreboardQuantity[] {
  if (seat.locked || seat.sideboardLocked || !seat.sideboard) {
    throw new Error(SIDEBOARD_LOCKED);
  }
  return seat.sideboard.map((entry) => ({ ...entry }));
}

export function materializeCyberpunkPreboard(
  pool: CyberpunkPreboardPool,
  selection: CyberpunkPreboardSelection,
): DeckEntry[] {
  const validation = validateCyberpunkPreboard(pool, selection);
  if (!validation.valid) {
    throw new Error(validation.issues.map((entry) => entry.message).join(" "));
  }
  const stock = [...pool.legends, ...pool.main, ...pool.sideboard].map((entry) => ({ ...entry }));
  const take = (
    { cardId, quantity, printingId }: CyberpunkPreboardQuantity,
    sectionId: string,
  ): DeckEntry[] => {
    let needed = quantity;
    const rows: DeckEntry[] = [];
    for (const entry of stock) {
      if (
        quantityKey(entry.cardId, entry.printingId) !== quantityKey(cardId, printingId) ||
        entry.quantity === 0
      )
        continue;
      const qty = Math.min(needed, entry.quantity);
      rows.push({
        cardId,
        qty,
        sectionId,
        ...(entry.printingId ? { printingId: entry.printingId } : {}),
      });
      entry.quantity -= qty;
      needed -= qty;
      if (needed === 0) break;
    }
    if (needed > 0) throw new Error(`Incomplete Cyberpunk printing allocation: ${cardId}`);
    return rows;
  };
  return [
    ...selection.legends.flatMap((entry) => take(entry, "legend")),
    ...selection.main.flatMap((entry) => take(entry, "main")),
  ];
}

export function cyberpunkPreboardToJson(value: unknown): JsonValue {
  if (!isJsonValue(value)) throw new Error("Cyberpunk pre-board value is not JSON");
  return value;
}
