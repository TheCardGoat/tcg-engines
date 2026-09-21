/** Public practice metadata only; deck construction stays in the simulator. */
import { AUTOMATED_ACTION_STRATEGIES } from "@tcg/cyberpunk-engine";
import { authoredBotLabDeckSpecs } from "@tcg/cyberpunk-utils";

/**
 * Authored bot-lab decks plus the production bot strategies, mirroring the
 * Flesh and Blood practice catalog. The web practice tab lists `decks` as
 * `fixture:<id>` bot deck choices; the simulator resolves those ids against
 * the same specs.
 */
export function getCyberpunkPracticeCatalog() {
  return {
    decks: authoredBotLabDeckSpecs.map((deck) => ({
      id: deck.id,
      name: deck.title,
    })),
    strategies: AUTOMATED_ACTION_STRATEGIES.filter((strategy) => !strategy.testOnly).map(
      ({ id, label, description }) => ({ id, label, description }),
    ),
  };
}
