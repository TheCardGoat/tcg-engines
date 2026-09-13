/** Public metadata only; engine implementations remain behind the adapter. */
import {
  FAB_DECK_TEXT_FIXTURES,
  FAB_AUTOMATED_ACTION_STRATEGIES,
  type FabDeckFormat,
} from "@tcg/flesh-and-blood-engine/simulator";

const formatIds = {
  "classic-constructed": "cc",
  "silver-age": "silverAge",
} as const satisfies Record<FabDeckFormat, string>;

export function getFabPracticeCatalog() {
  return {
    decks: FAB_DECK_TEXT_FIXTURES.map((deck) => ({
      id: deck.id,
      name: deck.name,
      formatId: formatIds[deck.format],
    })),
    strategies: FAB_AUTOMATED_ACTION_STRATEGIES.filter((strategy) => !strategy.testOnly).map(
      ({ id, label, description }) => ({ id, label, description }),
    ),
  };
}
