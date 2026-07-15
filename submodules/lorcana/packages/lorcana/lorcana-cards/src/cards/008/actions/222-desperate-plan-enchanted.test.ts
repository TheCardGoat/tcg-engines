import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { desperatePlanEnchanted } from "./222-desperate-plan-enchanted";

describe("Desperate Plan (Enchanted)", () => {
  it("draws until you have 3 cards when your hand is empty", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [desperatePlanEnchanted],
      inkwell: desperatePlanEnchanted.cost,
      deck: [goofyKnightForADay, goofyKnightForADay, goofyKnightForADay],
    });

    expect(testEngine.asPlayerOne().playCard(desperatePlanEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 3, deck: 0, discard: 1 });
  });
});
