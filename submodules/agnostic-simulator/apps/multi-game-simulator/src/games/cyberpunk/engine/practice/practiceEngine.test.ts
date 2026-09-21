import { describe, expect, it } from "vitest";
import { isTacticalAIStrategy } from "@tcg/cyberpunk-engine";

import { createPracticeAiConfig } from "./practiceEngine";
import { createImportedPracticeMatchConfig, createPracticeMatchConfig } from "./sessionStorage";
import { DEFAULT_BOT_PRACTICE_DECK_ID, getPracticeDeckFixture } from "./deckFixtures";

describe("createPracticeAiConfig", () => {
  it("binds the authored deck profile onto the practice bot", () => {
    const config = createPracticeAiConfig(
      createPracticeMatchConfig({
        botDeckFixtureId: "authored-relic-placide-surgical-reanimation",
        playerDeckFixtureId: "authored-overwatch-recharge-control",
        botStrategyId: "tactical",
      }),
    );
    expect(isTacticalAIStrategy(config.opponent)).toBe(true);
    if (!isTacticalAIStrategy(config.opponent)) return;
    expect(config.opponent.deckProfile?.deckId).toBe("authored-relic-placide-surgical-reanimation");
  });

  it("leaves engine starter fixtures unbound", () => {
    const config = createPracticeAiConfig(
      createPracticeMatchConfig({
        botDeckFixtureId: DEFAULT_BOT_PRACTICE_DECK_ID,
        botStrategyId: "tactical",
      }),
    );
    expect(isTacticalAIStrategy(config.opponent)).toBe(true);
    if (!isTacticalAIStrategy(config.opponent)) return;
    expect(config.opponent.deckProfile).toBeUndefined();
  });

  it("infers an authored plan from an imported bot deck without a fixture id", () => {
    const fixture = getPracticeDeckFixture("authored-judy-top-deck-discount");
    expect(fixture).toBeTruthy();
    const config = createPracticeAiConfig(
      createImportedPracticeMatchConfig({
        playerDeck: fixture!.deck,
        botDeck: { ...fixture!.deck, playerId: "bot", playerName: "Judy bot" },
        botStrategyId: "tactical",
      }),
    );
    expect(isTacticalAIStrategy(config.opponent)).toBe(true);
    if (!isTacticalAIStrategy(config.opponent)) return;
    expect(config.opponent.deckProfile?.deckId).toBe("authored-judy-top-deck-discount");
  });
});
