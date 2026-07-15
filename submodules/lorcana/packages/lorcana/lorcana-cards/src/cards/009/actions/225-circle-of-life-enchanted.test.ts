import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { circleOfLifeEnchanted } from "./225-circle-of-life-enchanted";

describe("Circle of Life Enchanted", () => {
  it("plays a character from your discard for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [circleOfLifeEnchanted],
      inkwell: circleOfLifeEnchanted.cost,
      discard: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(circleOfLifeEnchanted, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
  });
});
