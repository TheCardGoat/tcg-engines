import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { beastWounded } from "./103-beast-wounded";

describe("Beast - Wounded", () => {
  it("THAT HURTS! - This character enters play with 4 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [beastWounded],
      inkwell: beastWounded.cost,
    });

    expect(testEngine.asPlayerOne().playCard(beastWounded)).toBeSuccessfulCommand();

    const beast = testEngine.asPlayerOne().getCard(beastWounded);
    expect(beast.damage).toBe(4);
  });

  it("THAT HURTS! - Beast survives because willpower (6) > damage (4)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [beastWounded],
      inkwell: beastWounded.cost,
    });

    expect(testEngine.asPlayerOne().playCard(beastWounded)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(beastWounded)).toBe("play");
  });
});
