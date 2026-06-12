import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { mostEveryonesMadHere } from "./151-most-everyones-mad-here";

describe("Most Everyone's Mad Here", () => {
  it("Gain lore equal to the damage on chosen character, then banish them.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mostEveryonesMadHere],
      inkwell: mostEveryonesMadHere.cost,
      play: [goofyKnightForADay],
    });

    testEngine.asServer().manualSetDamage(goofyKnightForADay, 5);

    testEngine.asPlayerOne().playCard(mostEveryonesMadHere, {
      targets: [goofyKnightForADay],
    });

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toEqual(5);
    expect(testEngine.asPlayerOne().getCardZone(goofyKnightForADay)).toEqual("discard");
  });
});
