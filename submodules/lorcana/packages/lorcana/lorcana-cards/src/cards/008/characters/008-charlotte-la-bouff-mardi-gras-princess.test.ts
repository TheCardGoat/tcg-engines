import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { charlotteLaBouffMardiGrasPrincess } from "./008-charlotte-la-bouff-mardi-gras-princess";

describe("Charlotte La Bouff - Mardi Gras Princess", () => {
  it("can be played as a normal vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [charlotteLaBouffMardiGrasPrincess],
      inkwell: charlotteLaBouffMardiGrasPrincess.cost,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().playCard(charlotteLaBouffMardiGrasPrincess),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(charlotteLaBouffMardiGrasPrincess)).toBe("play");
    expect(testEngine.asPlayerOne().getCard(charlotteLaBouffMardiGrasPrincess)).toMatchObject({
      strength: 1,
      willpower: 3,
      lore: 1,
    });
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
