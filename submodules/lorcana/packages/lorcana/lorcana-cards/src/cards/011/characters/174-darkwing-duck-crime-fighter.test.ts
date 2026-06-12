import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { darkwingDuckCrimeFighter } from "./174-darkwing-duck-crime-fighter";

describe("Darkwing Duck - Crime Fighter", () => {
  it("defines an empty ability list for a vanilla character", () => {
    expect(darkwingDuckCrimeFighter.abilities).toEqual([]);
  });

  it("can be played with enough ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [darkwingDuckCrimeFighter],
      inkwell: darkwingDuckCrimeFighter.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(darkwingDuckCrimeFighter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(darkwingDuckCrimeFighter)).toBe("play");
  });
});
