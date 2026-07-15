import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { whatDidYouCallMe } from "./132-what-did-you-call-me";

describe("What Did You Call Me?", () => {
  it("gives the chosen damaged character +3 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [whatDidYouCallMe],
      inkwell: whatDidYouCallMe.cost,
      play: [{ card: goofyKnightForADay, damage: 1 }],
    });

    expect(testEngine.asPlayerOne().playCardTo(whatDidYouCallMe, goofyKnightForADay).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardStrength(goofyKnightForADay)).toBe(
      goofyKnightForADay.strength + 3,
    );
  });
});
