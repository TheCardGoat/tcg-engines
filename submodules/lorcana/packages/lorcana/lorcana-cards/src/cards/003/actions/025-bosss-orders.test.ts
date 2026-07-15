import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { bosssOrders } from "./025-bosss-orders";

describe("Boss's Orders", () => {
  it("gives the chosen character Support this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bosssOrders],
      inkwell: bosssOrders.cost,
      play: [arielOnHumanLegs],
    });

    expect(
      testEngine.asPlayerOne().playCard(bosssOrders, {
        targets: [arielOnHumanLegs],
      }).success,
    ).toBe(true);

    expect(testEngine.hasKeyword(arielOnHumanLegs, "Support")).toBe(true);
  });
});
