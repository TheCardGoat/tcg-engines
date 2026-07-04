import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { jasmineVineExpert } from "./020-jasmine-vine-expert";

describe("Jasmine - Vine Expert", () => {
  it("draws a card for each player when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [jasmineVineExpert],
        inkwell: jasmineVineExpert.cost,
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(jasmineVineExpert)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount("player_one")).toMatchObject({
      deck: 1,
      hand: 1,
    });
    expect(testEngine.asPlayerTwo().getZonesCardCount("player_two")).toMatchObject({
      deck: 1,
      hand: 1,
    });
  });
});
