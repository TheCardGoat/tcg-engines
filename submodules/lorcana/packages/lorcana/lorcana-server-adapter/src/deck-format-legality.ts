import { getLorcanaShortIdResolution, resolveCurrentLorcanaShortId } from "@tcg/lorcana-cards/data";
import {
  LORCANA_FORMATS,
  validateDeckForFormat,
  type DeckCard,
  type DeckFormatResult,
  type LorcanaFormatId,
} from "@tcg/lorcana-types";
import { getLorcanaCardFormatLookup } from "./card-format-lookup";

const AMBIGUOUS_LEGACY_DECK_MESSAGE =
  "This deck was saved with outdated card IDs that can no longer be safely matched to the correct cards. Please recreate or re-import this deck before joining matchmaking.";

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
  const hasAmbiguousIds = cardsJson.some((row) => {
    const resolution = getLorcanaShortIdResolution(row.cardId);
    return resolution.kind === "ambiguous";
  });

  if (hasAmbiguousIds) {
    return {
      formatId,
      valid: false,
      rules: [
        {
          kind: "CARD_SET",
          passed: false,
          message: AMBIGUOUS_LEGACY_DECK_MESSAGE,
        },
      ],
    };
  }

  const deckCards: DeckCard[] = cardsJson.map((row) => ({
    cardId: resolveCurrentLorcanaShortId(row.cardId),
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
