/** Public practice metadata only; deck construction stays in the simulator. */
import { AUTOMATED_ACTION_STRATEGIES } from "@tcg/cyberpunk-engine";
import { authoredBotLabDeckSpecs, recommendedBotLabDeckIds } from "@tcg/cyberpunk-utils";

/**
 * Authored bot-lab decks plus the production bot strategies, mirroring the
 * Flesh and Blood practice catalog. The web practice tab lists `decks` as
 * `fixture:<id>` bot deck choices and preselects the leader of
 * `recommendedDeckIds` (the bot lab's ranked top three, owned by
 * `@tcg/cyberpunk-utils`); the simulator resolves those ids against the same
 * specs. `PRACTICE_TEST_STRATEGY_IDS` opts two engine test strategies into
 * practice — useful sparring opponents that stay out of production bot
 * assignment.
 */
const PRACTICE_TEST_STRATEGY_IDS: ReadonlySet<string> = new Set(["attack-rival-only", "pass-only"]);

export function getCyberpunkPracticeCatalog() {
  return {
    decks: authoredBotLabDeckSpecs.map((deck) => ({
      id: deck.id,
      name: deck.title,
    })),
    // Spread: the JSON contract is a plain array; the lab-owned source stays
    // a readonly tuple so typos and reordered ranks fail typecheck upstream.
    recommendedDeckIds: [...recommendedBotLabDeckIds],
    strategies: AUTOMATED_ACTION_STRATEGIES.filter(
      (strategy) => !strategy.testOnly || PRACTICE_TEST_STRATEGY_IDS.has(strategy.id),
    ).map(({ id, label, description }) => ({ id, label, description })),
  };
}
