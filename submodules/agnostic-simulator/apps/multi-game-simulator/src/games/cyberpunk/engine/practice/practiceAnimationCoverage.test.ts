import { describe, expect, it } from "vite-plus/test";
import {
  createPlayerId,
  defaultStrategy,
  randomStrategy,
  runAutoMatch,
} from "@tcg/cyberpunk-engine";
import { cyberpunkAnimationPlan } from "@tcg/cyberpunk-server-adapter/animation";

import {
  DEFAULT_BOT_PRACTICE_DECK_ID,
  DEFAULT_PLAYER_PRACTICE_DECK_ID,
  getPracticeCardCatalog,
  getPracticeDeckFixture,
} from "./deckFixtures";

describe("practice bot animation coverage", () => {
  // Three full games now use Expert's bounded search rather than Greedy.
  it("publishes a visible plan for each accepted action across complete authored-deck games", () => {
    const playerDeck = getPracticeDeckFixture(DEFAULT_PLAYER_PRACTICE_DECK_ID);
    const botDeck = getPracticeDeckFixture(DEFAULT_BOT_PRACTICE_DECK_ID);
    if (!playerDeck || !botDeck) throw new Error("Missing practice decks");

    let actedCount = 0;
    for (const [seed, playerStrategy] of [
      ["practice-motion-0", defaultStrategy],
      ["practice-motion-1", randomStrategy],
      ["practice-motion-2", defaultStrategy],
    ] as const) {
      const match = runAutoMatch({
        players: [
          { id: createPlayerId("p1"), name: "You" },
          { id: createPlayerId("p2"), name: "Bot" },
        ],
        decks: [
          { ...playerDeck.deck, playerId: "p1" },
          { ...botDeck.deck, playerId: "p2" },
        ],
        strategies: [playerStrategy, defaultStrategy],
        catalog: getPracticeCardCatalog(),
        seed,
        maxSteps: 300,
      });
      expect(match.reason).not.toBe("illegal");
      for (const entry of match.log) {
        if (entry.result.kind !== "acted" || !entry.result.result.success) continue;
        actedCount++;
        const plan = cyberpunkAnimationPlan(
          `${seed}:${entry.stepIndex}`,
          entry.result.result.animationScript,
        );
        expect(
          plan?.steps.length,
          `${seed} step ${entry.stepIndex}: ${entry.result.decision.move}`,
        ).toBeGreaterThan(0);
      }
    }
    expect(actedCount).toBeGreaterThan(100);
  }, 180_000);
});
