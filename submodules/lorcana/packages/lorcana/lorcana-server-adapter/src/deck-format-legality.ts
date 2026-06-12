import {
  LORCANA_FORMATS,
  validateDeckForFormat,
  type DeckCard,
  type DeckFormatResult,
  type LorcanaFormatId,
} from "@tcg/lorcana-types";
import { getLorcanaCardFormatLookup } from "./card-format-lookup";

/**
 * Validate a deck against a Lorcana format, returning the full result with per-rule details.
 *
 * Returns a synthetic failure if any card ID cannot be resolved in the catalog.
 */
export function validateDeckForLorcanaFormat(
  formatId: LorcanaFormatId,
  cardsJson: ReadonlyArray<{ cardId: string; quantity: number }>,
): DeckFormatResult {
  const format = LORCANA_FORMATS[formatId];
  const lookup = getLorcanaCardFormatLookup();
  const deckCards: DeckCard[] = cardsJson.map((row) => ({
    cardId: row.cardId,
    quantity: row.quantity,
  }));

  const unknownIds: string[] = [];
  for (const row of deckCards) {
    if (!lookup(row.cardId)) {
      unknownIds.push(row.cardId);
    }
  }

  if (unknownIds.length > 0) {
    return {
      formatId,
      valid: false,
      rules: [
        {
          kind: "CARD_SET",
          passed: false,
          message: `Unknown cards not found in catalog: ${unknownIds.join(", ")}.`,
        },
      ],
    };
  }

  return validateDeckForFormat(deckCards, lookup, format);
}
