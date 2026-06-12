import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { liloMakingAWish } from "../../001";
import { jaqConnoisseurOfClimbing } from "./077-jaq-connoisseur-of-climbing";

describe("Jaq - Connoisseur of Climbing", () => {
  describe("SNEAKY IDEA — When you play this character, chosen opposing character gains Reckless during their next turn.", () => {
    it("chosen opposing character gains Reckless during their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jaqConnoisseurOfClimbing.cost,
          hand: [jaqConnoisseurOfClimbing],
        },
        {
          play: [liloMakingAWish],
        },
      );

      expect(testEngine.asPlayerOne().playCard(jaqConnoisseurOfClimbing)).toBeSuccessfulCommand();

      // Resolve the triggered ability via bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jaqConnoisseurOfClimbing),
      ).toBeSuccessfulCommand();

      // Choose the opposing character as target
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [liloMakingAWish] }),
      ).toBeSuccessfulCommand();

      // Pass turn to opponent's turn
      testEngine.asServer().passTurn();

      // During opponent's next turn, the character should have Reckless
      expect(testEngine.hasKeyword(liloMakingAWish, "Reckless")).toBe(true);
    });

    it("Reckless is removed after the opponent's turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jaqConnoisseurOfClimbing.cost,
          hand: [jaqConnoisseurOfClimbing],
        },
        {
          play: [liloMakingAWish],
        },
      );

      testEngine.asPlayerOne().playCard(jaqConnoisseurOfClimbing);
      testEngine.asPlayerOne().resolvePendingByCard(jaqConnoisseurOfClimbing);
      testEngine.asPlayerOne().resolveNextPending({ targets: [liloMakingAWish] });

      // Pass to opponent's turn (Reckless active)
      testEngine.asServer().passTurn();
      expect(testEngine.hasKeyword(liloMakingAWish, "Reckless")).toBe(true);

      // Pass back to player one's turn (Reckless should be gone)
      testEngine.asServer().passTurn();
      expect(testEngine.hasKeyword(liloMakingAWish, "Reckless")).toBe(false);
    });
  });
});
