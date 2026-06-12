export const CYBERPUNK_LEGEND_COUNT = 3;
export const CYBERPUNK_MAIN_DECK_MIN = 40;
export const CYBERPUNK_MAIN_DECK_MAX = 50;
export const CYBERPUNK_MAX_COPIES = 3;

export type CyberpunkDeckValidationIssueCode =
  | "legend-count"
  | "legend-name-unique"
  | "main-deck-min"
  | "main-deck-max"
  | "copy-limit"
  | "ram-limit";

export type CyberpunkDeckValidationSeverity = "error";

export interface CyberpunkDeckValidationCard {
  id: string;
  name: string;
  displayName?: string;
  type: string;
  color: string;
  ram: number;
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
}

export interface CyberpunkDeckValidationResult {
  isValid: boolean;
  issues: CyberpunkDeckValidationIssue[];
  ramBudget: Map<string, number>;
  legendCount: number;
  mainDeckCount: number;
}

export function validateCyberpunkDeck(
  deck: CyberpunkDeckValidationInput,
): CyberpunkDeckValidationResult {
  const issues: CyberpunkDeckValidationIssue[] = [];
  const legendCount = deck.legends.reduce(
    (total, entry) => total + Math.max(0, Math.floor(entry.quantity)),
    0,
  );
  const mainDeckCount = deck.mainDeck.reduce(
    (total, entry) => total + Math.max(0, Math.floor(entry.quantity)),
    0,
  );
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
    const name = entry.card.name.trim().toLowerCase();
    const quantity = Math.max(0, Math.floor(entry.quantity));
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

  const totalQuantityById = new Map<string, number>();
  for (const entry of deck.mainDeck) {
    const q = Math.max(0, Math.floor(entry.quantity));
    totalQuantityById.set(entry.card.id, (totalQuantityById.get(entry.card.id) ?? 0) + q);
  }

  for (const entry of deck.mainDeck) {
    const quantity = totalQuantityById.get(entry.card.id) ?? 0;

    if (quantity > CYBERPUNK_MAX_COPIES) {
      issues.push({
        code: "copy-limit",
        severity: "error",
        message: `${displayName(entry.card)} has too many copies.`,
        cardId: entry.card.id,
        cardName: displayName(entry.card),
      });
      totalQuantityById.set(entry.card.id, 0); // prevent duplicate errors for same card
    }

    const allowedRam = ramBudget.get(entry.card.color) ?? 0;
    if (entry.card.ram > allowedRam) {
      issues.push({
        code: "ram-limit",
        severity: "error",
        message: `${displayName(entry.card)} needs ${entry.card.ram} ${entry.card.color} RAM; Legends provide ${allowedRam}.`,
        cardId: entry.card.id,
        cardName: displayName(entry.card),
        color: entry.card.color,
      });
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    ramBudget,
    legendCount,
    mainDeckCount,
  };
}

export function getCyberpunkRamBudget(
  legends: CyberpunkDeckValidationEntry[],
): Map<string, number> {
  const budget = new Map<string, number>();

  for (const entry of legends) {
    const quantity = Math.max(0, Math.floor(entry.quantity));
    const current = budget.get(entry.card.color) ?? 0;
    budget.set(entry.card.color, current + entry.card.ram * quantity);
  }

  return budget;
}

function displayName(card: CyberpunkDeckValidationCard): string {
  return card.displayName ?? card.name;
}
