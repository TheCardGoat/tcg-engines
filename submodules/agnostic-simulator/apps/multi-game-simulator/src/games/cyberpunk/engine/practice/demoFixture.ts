import { recommendedBotLabDeckIds } from "@tcg/cyberpunk-utils";
import { getPracticeDeckFixture } from "./deckFixtures";
import { createPracticeMatchConfig } from "./sessionStorage";

/** Select each seat independently so a demo can also be a mirror match. */
export function createDemoPracticeMatchConfig(random: () => number = Math.random) {
  const pickDeck = () => {
    const id = recommendedBotLabDeckIds[Math.floor(random() * recommendedBotLabDeckIds.length)];
    if (!id || !getPracticeDeckFixture(id)) {
      throw new Error(`Recommended demo deck is unavailable: ${id ?? "none"}`);
    }
    return id;
  };

  return createPracticeMatchConfig({
    playerDeckFixtureId: pickDeck(),
    botDeckFixtureId: pickDeck(),
    botStrategyId: "default",
  });
}
