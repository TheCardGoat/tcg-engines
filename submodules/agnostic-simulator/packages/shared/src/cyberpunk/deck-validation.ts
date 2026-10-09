export const CYBERPUNK_LEGEND_COUNT = 3;
export const CYBERPUNK_MAIN_DECK_MIN = 40;
export const CYBERPUNK_MAIN_DECK_MAX = 50;
export const CYBERPUNK_MAX_COPIES = 3;
export const CYBERPUNK_SIDEBOARD_SIZE = 7;

const ALPHA_KIT_SET_CODE = "alpha";
const NOVA_RARE_RARITY = "nova rare";

/**
 * Sets the tournament page treats as official expansions for Appendix B.
 * A textless restricted identity is playable when one of these printings
 * exists for that same name and subtitle. Alpha Kit is intentionally absent.
 */
const OFFICIAL_EXPANSION_SET_CODES = new Set([
  "welcometonightcitybeta",
  "welcometonightcityretail",
  "welcometonightcityretail-fr",
]);

const JACKIE_AND_V = { name: "jackie & v", subname: "chooms to the end" };

const TEXTLESS_RESTRICTED_IDENTITIES = [
  { name: "lucyna kushinada", subname: "fresh beginnings" },
  { name: "david martinez", subname: "built different" },
  { name: "rebecca", subname: "having a moment" },
] as const;

export type CyberpunkDeckValidationIssueCode =
  | "legend-count"
  | "legend-name-unique"
  | "legend-board"
  | "main-deck-min"
  | "main-deck-max"
  | "sideboard-max"
  | "sideboard-legend"
  | "copy-limit"
  | "ram-limit"
  | "constructed-legality";

export type CyberpunkDeckValidationSeverity = "error";

export interface CyberpunkDeckValidationPrinting {
  setCode?: string | null;
  rarity?: string | null;
  /** Set only when the catalog already distinguishes this printing as a test print. */
  testPrint?: boolean;
}

export interface CyberpunkDeckValidationCard {
  id: string;
  name: string;
  /** Printed subtitle. A different subtitle is a different card. */
  subname?: string | null;
  displayName?: string;
  type: string;
  color: string;
  ram: number | null;
  /** Set of the printing being registered. */
  setCode?: string | null;
  rarity?: string | null;
  /** True when the registered printing has no rules text. */
  textless?: boolean;
  /** True only when the catalog already marks this printing as a test print. */
  testPrint?: boolean;
  /** Every printing of this name and subtitle the catalog already carries. */
  printings?: readonly CyberpunkDeckValidationPrinting[];
}

export interface CyberpunkDeckValidationEntry {
  card: CyberpunkDeckValidationCard;
  quantity: number;
}

export interface CyberpunkDeckValidationIssue {
  code: CyberpunkDeckValidationIssueCode;
  severity: CyberpunkDeckValidationSeverity;
  message: string;
  cardId?: string;
  cardName?: string;
  color?: string;
}

export interface CyberpunkDeckValidationInput {
  legends: CyberpunkDeckValidationEntry[];
  mainDeck: CyberpunkDeckValidationEntry[];
  /**
   * Omitted, empty, and 1–7 are legal here. More than 7 is `sideboard-max`.
   * Exactly 7 is required only by competitive pre-board registration.
   */
  sideboard?: CyberpunkDeckValidationEntry[];
}

export interface CyberpunkDeckValidationResult {
  isValid: boolean;
  issues: CyberpunkDeckValidationIssue[];
  ramBudget: Map<string, number>;
  legendCount: number;
  mainDeckCount: number;
  sideboardCount: number;
}

/**
 * Catalog shape accepted from both the camelCase card package and the
 * snake_case web catalog. The selected printing, when present, is the
 * physical card being registered.
 */
export interface CyberpunkValidationCatalogCard {
  id: string;
  name: string;
  subname?: string | null;
  displayName?: string;
  display_name?: string;
  type: string;
  color: string;
  ram: number | null;
  rarity?: string | null;
  rulesText?: string | null;
  rules_text?: string | null;
  setCode?: string | null;
  set?: { code?: string | null } | null;
  testPrint?: boolean;
  printings?: ReadonlyArray<{
    id?: string;
    setCode?: string | null;
    set?: { code?: string | null } | null;
    rarity?: string | null;
    testPrint?: boolean;
  }>;
}

export function toCyberpunkValidationCard(
  card: CyberpunkValidationCatalogCard,
  printingId?: string | null,
): CyberpunkDeckValidationCard {
  const printings = (card.printings ?? []).map((printing) => {
    const mapped: CyberpunkDeckValidationPrinting = {
      setCode: printingSetCode(printing),
      rarity: printing.rarity ?? null,
    };
    if (printing.testPrint === true) mapped.testPrint = true;
    return mapped;
  });
  const selected = printingId
    ? card.printings?.find((printing) => printing.id === printingId)
    : undefined;
  const rulesText = card.rulesText ?? card.rules_text;
  const textless = typeof rulesText !== "string" || rulesText.trim().length === 0;
  const selectedTestPrint = selected?.testPrint === true || card.testPrint === true;

  return {
    id: card.id,
    name: card.name,
    subname: card.subname ?? null,
    displayName: card.displayName ?? card.display_name ?? card.name,
    type: card.type,
    color: card.color,
    ram: card.ram,
    setCode: selected ? printingSetCode(selected) : (card.setCode ?? card.set?.code ?? null),
    rarity: selected ? (selected.rarity ?? null) : (card.rarity ?? null),
    textless,
    ...(selectedTestPrint ? { testPrint: true } : {}),
    printings,
  };
}

export function validateCyberpunkDeck(
  deck: CyberpunkDeckValidationInput,
): CyberpunkDeckValidationResult {
  const issues: CyberpunkDeckValidationIssue[] = [];
  const sideboard = deck.sideboard ?? [];
  const legendCount = countEntries(deck.legends);
  const mainDeckCount = countEntries(deck.mainDeck.filter((entry) => !isLegend(entry.card)));
  const sideboardCount = countEntries(sideboard.filter((entry) => !isLegend(entry.card)));
  const ramBudget = getCyberpunkRamBudget(deck.legends);

  if (legendCount !== CYBERPUNK_LEGEND_COUNT) {
    issues.push({
      code: "legend-count",
      severity: "error",
      message: `Choose exactly ${CYBERPUNK_LEGEND_COUNT} Legends.`,
    });
  }

  const legendNames = new Set<string>();
  for (const entry of deck.legends) {
    const name = normalizeText(entry.card.name);
    const quantity = entryQuantity(entry);
    if (legendNames.has(name) || quantity > 1) {
      issues.push({
        code: "legend-name-unique",
        severity: "error",
        message: "Legend names must be unique.",
        cardId: entry.card.id,
        cardName: displayName(entry.card),
      });
      break;
    }
    legendNames.add(name);
  }

  for (const entry of deck.mainDeck) {
    if (!isLegend(entry.card) || entryQuantity(entry) <= 0) continue;
    issues.push({
      code: "legend-board",
      severity: "error",
      message: `${displayName(entry.card)} is a Legend and cannot be in the main deck.`,
      cardId: entry.card.id,
      cardName: displayName(entry.card),
    });
    break;
  }

  if (mainDeckCount < CYBERPUNK_MAIN_DECK_MIN) {
    issues.push({
      code: "main-deck-min",
      severity: "error",
      message: `Add ${CYBERPUNK_MAIN_DECK_MIN - mainDeckCount} more main deck cards.`,
    });
  }

  if (mainDeckCount > CYBERPUNK_MAIN_DECK_MAX) {
    issues.push({
      code: "main-deck-max",
      severity: "error",
      message: `Remove ${mainDeckCount - CYBERPUNK_MAIN_DECK_MAX} main deck cards.`,
    });
  }

  if (sideboardCount > CYBERPUNK_SIDEBOARD_SIZE) {
    issues.push({
      code: "sideboard-max",
      severity: "error",
      message: `The sideboard cannot have more than ${CYBERPUNK_SIDEBOARD_SIZE} cards.`,
    });
  }

  for (const entry of sideboard) {
    if (!isLegend(entry.card) || entryQuantity(entry) <= 0) continue;
    issues.push({
      code: "sideboard-legend",
      severity: "error",
      message: `${displayName(entry.card)} is a Legend and cannot be in the sideboard.`,
      cardId: entry.card.id,
      cardName: displayName(entry.card),
    });
    break;
  }

  const copiesByIdentity = new Map<
    string,
    { quantity: number; entry: CyberpunkDeckValidationEntry }
  >();
  for (const entry of [...deck.mainDeck, ...sideboard]) {
    if (isLegend(entry.card)) continue;
    const quantity = entryQuantity(entry);
    if (quantity <= 0) continue;
    const key = copyIdentity(entry.card);
    const existing = copiesByIdentity.get(key);
    if (existing) {
      existing.quantity += quantity;
    } else {
      copiesByIdentity.set(key, { quantity, entry });
    }
  }

  for (const { quantity, entry } of copiesByIdentity.values()) {
    if (quantity <= CYBERPUNK_MAX_COPIES) continue;
    issues.push({
      code: "copy-limit",
      severity: "error",
      message: `${displayName(entry.card)} has too many copies.`,
      cardId: entry.card.id,
      cardName: displayName(entry.card),
    });
  }

  for (const entry of [...deck.mainDeck, ...sideboard]) {
    if (isLegend(entry.card) || entryQuantity(entry) <= 0) continue;
    const ram = validationRam(entry.card);
    const allowedRam = ramBudget.get(entry.card.color) ?? 0;
    if (ram > allowedRam) {
      issues.push({
        code: "ram-limit",
        severity: "error",
        message: `${displayName(entry.card)} needs ${ram} ${entry.card.color} RAM; Legends provide ${allowedRam}.`,
        cardId: entry.card.id,
        cardName: displayName(entry.card),
        color: entry.card.color,
      });
    }
  }

  for (const entry of [...deck.legends, ...deck.mainDeck, ...sideboard]) {
    if (entryQuantity(entry) <= 0) continue;
    const ban = constructedLegalityMessage(entry.card);
    if (!ban) continue;
    issues.push({
      code: "constructed-legality",
      severity: "error",
      message: ban,
      cardId: entry.card.id,
      cardName: displayName(entry.card),
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
    ramBudget,
    legendCount,
    mainDeckCount,
    sideboardCount,
  };
}

export function getCyberpunkRamBudget(
  legends: CyberpunkDeckValidationEntry[],
): Map<string, number> {
  const budget = new Map<string, number>();

  for (const entry of legends) {
    const quantity = entryQuantity(entry);
    const current = budget.get(entry.card.color) ?? 0;
    budget.set(entry.card.color, current + validationRam(entry.card) * quantity);
  }

  return budget;
}

function constructedLegalityMessage(card: CyberpunkDeckValidationCard): string | null {
  if (card.testPrint === true) {
    return `${displayName(card)} is a test print and is not constructed legal.`;
  }

  if (isAlphaKitPrinting(card) && !isNovaRare(card.rarity)) {
    return `${displayName(card)} is an Alpha Kit printing and is not constructed legal.`;
  }

  if (matchesIdentity(card, JACKIE_AND_V)) {
    return `${displayName(card)} is not constructed legal.`;
  }

  if (card.textless === true && isTextlessRestricted(card) && !hasOfficialExpansionPrinting(card)) {
    return `${displayName(card)} is a textless printing and is not constructed legal.`;
  }

  return null;
}

function isAlphaKitPrinting(card: CyberpunkDeckValidationCard): boolean {
  return normalizeSetCode(card.setCode) === ALPHA_KIT_SET_CODE;
}

function isNovaRare(rarity: string | null | undefined): boolean {
  return normalizeText(rarity) === NOVA_RARE_RARITY;
}

function isTextlessRestricted(card: CyberpunkDeckValidationCard): boolean {
  return TEXTLESS_RESTRICTED_IDENTITIES.some((identity) => matchesIdentity(card, identity));
}

function hasOfficialExpansionPrinting(card: CyberpunkDeckValidationCard): boolean {
  const setCodes = [card.setCode, ...(card.printings ?? []).map((printing) => printing.setCode)];
  return setCodes.some((setCode) => OFFICIAL_EXPANSION_SET_CODES.has(normalizeSetCode(setCode)));
}

function matchesIdentity(
  card: CyberpunkDeckValidationCard,
  identity: { name: string; subname: string },
): boolean {
  if (
    normalizeText(card.name) === identity.name &&
    normalizeText(card.subname) === identity.subname
  ) {
    return true;
  }
  const display = normalizeText(card.displayName);
  return (
    display === `${identity.name}: ${identity.subname}` ||
    display === `${identity.name} - ${identity.subname}`
  );
}

function copyIdentity(card: CyberpunkDeckValidationCard): string {
  return `${normalizeText(card.name)}\0${normalizeText(card.subname)}`;
}

function isLegend(card: CyberpunkDeckValidationCard): boolean {
  return card.type.trim().toLowerCase() === "legend";
}

function countEntries(entries: readonly CyberpunkDeckValidationEntry[]): number {
  return entries.reduce((total, entry) => total + entryQuantity(entry), 0);
}

function entryQuantity(entry: CyberpunkDeckValidationEntry): number {
  return Math.max(0, Math.floor(entry.quantity));
}

function validationRam(card: CyberpunkDeckValidationCard): number {
  return card.ram ?? 0;
}

function displayName(card: CyberpunkDeckValidationCard): string {
  return card.displayName ?? card.name;
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeSetCode(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function printingSetCode(printing: {
  setCode?: string | null;
  set?: { code?: string | null } | null;
}): string | null {
  return printing.setCode ?? printing.set?.code ?? null;
}
