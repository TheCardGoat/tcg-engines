import type { CyberpunkDeckValidationEntry } from "./deck-validation.js";

export const CYBERPUNK_SIX_PACK_LEGEND_MAX = 3;
export const CYBERPUNK_SIX_PACK_MAIN_MIN = 30;
export const CYBERPUNK_SIX_PACK_COLOR_MAX = 3;
export const CYBERPUNK_SIX_PACK_FORMAT_ID = "six-pack";

export type CyberpunkSixPackIssueCode =
  | "format"
  | "colors"
  | "legend-count"
  | "legend-board"
  | "main-deck-min"
  | "deck-color"
  | "pool"
  | "sideboard-legend";

export interface CyberpunkSixPackValidationInput {
  legends: readonly CyberpunkDeckValidationEntry[];
  mainDeck: readonly CyberpunkDeckValidationEntry[];
  sideboard: readonly CyberpunkDeckValidationEntry[];
  colors: readonly string[];
  /**
   * Canonical id to opened quantity. Omit it when the caller is not checking
   * today's pool. An empty object still means nothing was opened.
   */
  pool?: Readonly<Record<string, number>>;
}

export interface CyberpunkSixPackIssue {
  code: CyberpunkSixPackIssueCode;
  severity: "error";
  message: string;
  cardId?: string;
  cardName?: string;
  color?: string;
}

export interface CyberpunkSixPackValidationResult {
  isValid: boolean;
  issues: CyberpunkSixPackIssue[];
}

export function cyberpunkFormatFamily(formatId: string): string {
  if (formatId === "alpha" || formatId === "constructed") return "constructed";
  return formatId;
}

function quantity(entry: CyberpunkDeckValidationEntry): number {
  return Math.max(0, Math.floor(entry.quantity));
}

function displayName(entry: CyberpunkDeckValidationEntry): string {
  return entry.card.displayName ?? entry.card.name;
}

function issue(
  code: CyberpunkSixPackIssueCode,
  message: string,
  entry?: CyberpunkDeckValidationEntry,
): CyberpunkSixPackIssue {
  return {
    code,
    severity: "error",
    message,
    ...(entry
      ? {
          cardId: entry.card.id,
          cardName: displayName(entry),
          color: entry.card.color,
        }
      : {}),
  };
}

export function validateCyberpunkSixPackDeck(
  input: CyberpunkSixPackValidationInput,
): CyberpunkSixPackValidationResult {
  const issues: CyberpunkSixPackIssue[] = [];
  const colors = [
    ...new Set(input.colors.map((color) => color.trim().toLowerCase()).filter(Boolean)),
  ];
  if (colors.length < 1 || colors.length > CYBERPUNK_SIX_PACK_COLOR_MAX) {
    issues.push(issue("colors", `Choose 1 to ${CYBERPUNK_SIX_PACK_COLOR_MAX} deck colors.`));
  }
  if (colors.length !== input.colors.length) {
    issues.push(issue("colors", "Deck colors must be unique."));
  }

  const legendCount = input.legends.reduce((total, entry) => total + quantity(entry), 0);
  if (legendCount > CYBERPUNK_SIX_PACK_LEGEND_MAX) {
    issues.push(issue("legend-count", `Choose at most ${CYBERPUNK_SIX_PACK_LEGEND_MAX} Legends.`));
  }

  for (const entry of input.legends) {
    if (entry.card.type.trim().toLowerCase() !== "legend") {
      issues.push(issue("legend-board", "Each Legend slot is one Legend from the pool.", entry));
    }
  }

  const mainCount = input.mainDeck.reduce((total, entry) => total + quantity(entry), 0);
  if (mainCount < CYBERPUNK_SIX_PACK_MAIN_MIN) {
    issues.push(
      issue(
        "main-deck-min",
        `Add ${CYBERPUNK_SIX_PACK_MAIN_MIN - mainCount} more main deck cards.`,
      ),
    );
  }

  const allowed = new Set(colors);
  for (const entry of input.mainDeck) {
    if (entry.card.type.trim().toLowerCase() === "legend") {
      issues.push(issue("legend-board", "Legends stay out of the main deck.", entry));
      continue;
    }
    if (!allowed.has(entry.card.color.trim().toLowerCase())) {
      issues.push(
        issue("deck-color", `${displayName(entry)} is outside the chosen colors.`, entry),
      );
    }
  }

  for (const entry of input.sideboard) {
    if (entry.card.type.trim().toLowerCase() === "legend") {
      issues.push(issue("sideboard-legend", "Only non-Legends can be set aside.", entry));
    }
  }

  if (input.pool) {
    const used = new Map<string, { count: number; entry: CyberpunkDeckValidationEntry }>();
    for (const entry of [...input.legends, ...input.mainDeck, ...input.sideboard]) {
      const current = used.get(entry.card.id);
      if (current) current.count += quantity(entry);
      else used.set(entry.card.id, { count: quantity(entry), entry });
    }
    for (const [cardId, { count, entry }] of used) {
      const opened = input.pool[cardId] ?? 0;
      if (opened <= 0 || count > opened) {
        issues.push(
          issue(
            "pool",
            opened <= 0
              ? `${displayName(entry)} was not opened in today's pool.`
              : `${displayName(entry)} has ${count} copies, and the pool has ${opened}.`,
            entry,
          ),
        );
      }
    }
  }

  return { isValid: issues.length === 0, issues };
}
