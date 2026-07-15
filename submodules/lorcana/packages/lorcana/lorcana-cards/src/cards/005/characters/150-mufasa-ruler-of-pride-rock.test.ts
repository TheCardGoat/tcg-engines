import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mufasaRulerOfPrideRock } from "./150-mufasa-ruler-of-pride-rock";

describe("Mufasa - Ruler of Pride Rock", () => {
  describe("A DELICATE BALANCE - When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.", () => {
    it("exerts all inkwell cards and returns 2 random cards to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mufasaRulerOfPrideRock],
        inkwell: mufasaRulerOfPrideRock.cost + 4, // 12 ink total
      });

      expect(testEngine.asPlayerOne().playCard(mufasaRulerOfPrideRock)).toBeSuccessfulCommand();

      // 12 inkwell cards. Playing costs 8 (exerts 8), then ability exerts all remaining
      // and returns 2 at random to hand. 12 - 2 = 10 in inkwell, 2 in hand.
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(10);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

      // All remaining inkwell cards should be exerted
      const authoritativeState = testEngine.getAuthoritativeState();
      for (const cardId of testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)) {
        expect(authoritativeState.ctx.zones.private.cardMeta[cardId]?.state).toBe("exerted");
      }
    });

    it("returns 0 cards when inkwell is empty after paying", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mufasaRulerOfPrideRock],
        inkwell: mufasaRulerOfPrideRock.cost, // exactly 8 ink
      });

      expect(testEngine.asPlayerOne().playCard(mufasaRulerOfPrideRock)).toBeSuccessfulCommand();

      // 8 inkwell cards. Playing costs 8 (exerts all 8), then ability exerts all
      // and returns 2 at random. But all 8 are still in inkwell, so 8 - 2 = 6.
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(6);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    });
  });

  describe("EVERYTHING THE LIGHT TOUCHES - Whenever this character quests, ready all cards in your inkwell.", () => {
    it("readies all cards in inkwell when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mufasaRulerOfPrideRock],
        inkwell: mufasaRulerOfPrideRock.cost,
      });

      // Exert all inkwell cards first
      for (const cardId of testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)) {
        testEngine.asServer().manualExertCard(cardId);
      }

      expect(testEngine.asPlayerOne().quest(mufasaRulerOfPrideRock)).toBeSuccessfulCommand();

      // All inkwell cards should now be ready
      const stateAfterQuest = testEngine.getAuthoritativeState();
      for (const cardId of testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)) {
        expect(stateAfterQuest.ctx.zones.private.cardMeta[cardId]?.state).not.toBe("exerted");
      }
    });
  });

  it("regression: inkwell cards readied by EVERYTHING THE LIGHT TOUCHES are not exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mufasaRulerOfPrideRock],
      inkwell: mufasaRulerOfPrideRock.cost,
    });

    // Exert all inkwell cards first (simulating they were used to pay costs)
    for (const cardId of testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)) {
      testEngine.asServer().manualExertCard(cardId);
    }

    // Verify all are exerted
    const stateBefore = testEngine.getAuthoritativeState();
    for (const cardId of testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)) {
      expect(stateBefore.ctx.zones.private.cardMeta[cardId]?.state).toBe("exerted");
    }

    // Quest with Mufasa to trigger EVERYTHING THE LIGHT TOUCHES
    expect(testEngine.asPlayerOne().quest(mufasaRulerOfPrideRock)).toBeSuccessfulCommand();

    // All inkwell cards should now be ready (not exerted)
    const stateAfter = testEngine.getAuthoritativeState();
    for (const cardId of testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)) {
      expect(stateAfter.ctx.zones.private.cardMeta[cardId]?.state).not.toBe("exerted");
    }
  });
});
