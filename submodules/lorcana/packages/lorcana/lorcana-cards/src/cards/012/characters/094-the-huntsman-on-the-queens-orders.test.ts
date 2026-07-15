import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { theHuntsmanOnTheQueensOrders } from "./094-the-huntsman-on-the-queens-orders";

const challenger = createMockCharacter({
  id: "huntsman-challenger",
  name: "Challenger",
  cost: 3,
  strength: 3,
  willpower: 6,
});

describe("The Huntsman - On the Queen's Orders", () => {
  describe("Ward - Opponents can't choose this character except to challenge.", () => {
    it("exposes Ward through the runtime card model", () => {
      const testEngine = new LorcanaTestEngine({
        play: [theHuntsmanOnTheQueensOrders],
      });

      expect(theHuntsmanOnTheQueensOrders.missingImplementation).toBeUndefined();
      expect(theHuntsmanOnTheQueensOrders.missingTests).toBeUndefined();
      expect(testEngine.getCardModel(theHuntsmanOnTheQueensOrders).hasWard()).toBe(true);
    });

    it("prevents opponents from targeting The Huntsman with chosen-character effects", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
        {
          play: [{ card: theHuntsmanOnTheQueensOrders, isDrying: false }],
        },
      );

      const rejected = testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [theHuntsmanOnTheQueensOrders],
      });

      expect(rejected.success).toBe(false);
      expect(testEngine.asPlayerTwo().getCardZone(theHuntsmanOnTheQueensOrders)).toBe("play");
    });

    it("still allows opponents to challenge The Huntsman", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: challenger, isDrying: false }],
        },
        {
          play: [{ card: theHuntsmanOnTheQueensOrders, isDrying: false, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(challenger, theHuntsmanOnTheQueensOrders),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(challenger)).toBe(
        theHuntsmanOnTheQueensOrders.strength,
      );
      expect(testEngine.asPlayerTwo().getCardZone(theHuntsmanOnTheQueensOrders)).toBe("discard");
    });
  });
});
