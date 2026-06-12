import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { dinglehopper } from "../../001";
import { aliceAccidentallyAdrift } from "./141-alice-accidentally-adrift";

describe("Alice - Accidentally Adrift", () => {
  describe("WASHED AWAY", () => {
    it("when played, optionally puts chosen item into its player's inkwell facedown and exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [aliceAccidentallyAdrift],
          inkwell: aliceAccidentallyAdrift.cost,
          play: [dinglehopper],
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      expect(testEngine.asPlayerOne().playCard(aliceAccidentallyAdrift)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(aliceAccidentallyAdrift)).toBe("play");

      // Expect optional bag for WASHED AWAY
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional and target the item in one call
      const itemId = testEngine.findCardInstanceId(dinglehopper, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [itemId] }),
      ).toBeSuccessfulCommand();

      // Item should now be in inkwell
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("inkwell");
    });
  });

  describe("MAKING WAVES", () => {
    it("when questing, chosen opposing character gets -2 strength this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [aliceAccidentallyAdrift],
        },
        {
          play: [simbaProtectiveCub],
        },
      );
      const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().quest(aliceAccidentallyAdrift)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // simbaProtectiveCub has 2 strength, should be 0 after -2
      expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(0);
    });

    it("-2 strength expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [aliceAccidentallyAdrift],
        },
        {
          deck: 2,
          play: [simbaProtectiveCub],
        },
      );
      const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().quest(aliceAccidentallyAdrift)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Effect active this turn
      expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(0);

      // Pass turn - effect should expire
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(2);
    });
  });
});
