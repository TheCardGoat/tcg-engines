import type { CardColor, CardDefinition } from "@tcg/cyberpunk-types";

export type DeckValidationErrorCode =
  | "INVALID_LEGEND_COUNT"
  | "NON_LEGEND_IN_LEGENDS"
  | "DUPLICATE_LEGEND_NAME"
  | "INVALID_DECK_SIZE"
  | "LEGEND_IN_MAIN_DECK"
  | "EXCEEDS_COPY_LIMIT"
  | "EXCEEDS_RAM_LIMIT";

export interface DeckValidationError {
  code: DeckValidationErrorCode;
  message: string;
}

const MIN_DECK_SIZE = 40;
const MAX_DECK_SIZE = 50;
const REQUIRED_LEGENDS = 3;
const MAX_COPIES = 3;

export function validateDeck(
  legends: CardDefinition[],
  mainDeck: CardDefinition[],
): DeckValidationError[] {
  const errors: DeckValidationError[] = [];

  if (legends.length !== REQUIRED_LEGENDS) {
    errors.push({
      code: "INVALID_LEGEND_COUNT",
      message: `Deck must have exactly ${REQUIRED_LEGENDS} legends, got ${legends.length}`,
    });
  }

  for (const card of legends) {
    if (card.type !== "legend") {
      errors.push({
        code: "NON_LEGEND_IN_LEGENDS",
        message: `"${card.displayName}" is a ${card.type}, not a legend`,
      });
    }
  }

  const legendNames = new Set<string>();
  for (const card of legends) {
    if (legendNames.has(card.name)) {
      errors.push({
        code: "DUPLICATE_LEGEND_NAME",
        message: `Duplicate legend name "${card.name}"`,
      });
    }
    legendNames.add(card.name);
  }

  if (mainDeck.length < MIN_DECK_SIZE || mainDeck.length > MAX_DECK_SIZE) {
    errors.push({
      code: "INVALID_DECK_SIZE",
      message: `Main deck must have ${MIN_DECK_SIZE}-${MAX_DECK_SIZE} cards, got ${mainDeck.length}`,
    });
  }

  for (const card of mainDeck) {
    if (card.type === "legend") {
      errors.push({
        code: "LEGEND_IN_MAIN_DECK",
        message: `Legend "${card.displayName}" cannot be in the main deck`,
      });
    }
  }

  const copyCounts = new Map<string, { count: number; displayName: string }>();
  for (const card of mainDeck) {
    const entry = copyCounts.get(card.slug);
    if (entry) {
      entry.count++;
    } else {
      copyCounts.set(card.slug, { count: 1, displayName: card.displayName });
    }
  }
  for (const [, { count, displayName }] of copyCounts) {
    if (count > MAX_COPIES) {
      errors.push({
        code: "EXCEEDS_COPY_LIMIT",
        message: `"${displayName}" has ${count} copies, maximum is ${MAX_COPIES}`,
      });
    }
  }

  const ramBudget = new Map<CardColor, number>();
  for (const card of legends) {
    if (card.type === "legend") {
      ramBudget.set(card.color, (ramBudget.get(card.color) ?? 0) + card.ram);
    }
  }

  for (const card of mainDeck) {
    if (card.type === "legend") continue;
    const budget = ramBudget.get(card.color);
    if (budget === undefined) {
      errors.push({
        code: "EXCEEDS_RAM_LIMIT",
        message: `"${card.displayName}" is ${card.color} but no legend provides ${card.color} RAM`,
      });
    } else if (card.ram > budget) {
      errors.push({
        code: "EXCEEDS_RAM_LIMIT",
        message: `"${card.displayName}" requires ${card.ram} ${card.color} RAM but legends only provide ${budget}`,
      });
    }
  }

  return errors;
}
