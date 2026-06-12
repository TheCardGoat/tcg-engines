import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { bosssOrders } from "../actions";
import { simbaScrappyCub } from "../characters";
import { airfoil } from "./097-airfoil";

describe("Airfoil", () => {
  it("does not draw a card if you have played fewer than 2 actions this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 1,
      hand: [bosssOrders],
      inkwell: 1,
      play: [airfoil, simbaScrappyCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(bosssOrders, {
        targets: [simbaScrappyCub],
      }),
    ).toBeSuccessfulCommand();

    const result = testEngine.asPlayerOne().activateAbility(airfoil, {
      ability: "I GOT TO BE GOING",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("ABILITY_CONDITION_NOT_MET");
    }
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 1 });
  });

  it("draws a card if you have played 2 or more actions this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 1,
      hand: [bosssOrders, bosssOrders],
      inkwell: 2,
      play: [airfoil, simbaScrappyCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(bosssOrders, {
        targets: [simbaScrappyCub],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().playCard(bosssOrders, {
        targets: [simbaScrappyCub],
      }),
    ).toBeSuccessfulCommand();

    const result = testEngine.asPlayerOne().activateAbility(airfoil, {
      ability: "I GOT TO BE GOING",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(airfoil)).toBe(true);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0 });
  });
});
