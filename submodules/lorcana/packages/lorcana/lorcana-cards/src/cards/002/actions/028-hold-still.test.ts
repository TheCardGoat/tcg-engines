import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { holdStill } from "./028-hold-still";

describe("Hold Still", () => {
  it("removes up to 4 damage from the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [holdStill],
      inkwell: holdStill.cost,
      play: [{ card: goofyKnightForADay, damage: 5 }],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(holdStill, goofyKnightForADay),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: goofyKnightForADay, value: 1 });
  });
});
