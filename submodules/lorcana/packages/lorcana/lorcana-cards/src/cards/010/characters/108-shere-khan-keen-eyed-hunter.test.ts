import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { shereKhanKeeneyedHunter } from "./108-shere-khan-keen-eyed-hunter";

describe("Shere Khan - Keen-Eyed Hunter", () => {
  it("can be played from hand and enters play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shereKhanKeeneyedHunter],
      inkwell: shereKhanKeeneyedHunter.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().getCardZone(shereKhanKeeneyedHunter)).toBe("hand");

    expect(testEngine.asPlayerOne().playCard(shereKhanKeeneyedHunter)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(shereKhanKeeneyedHunter)).toBe("play");
  });

  it("can quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: shereKhanKeeneyedHunter, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(shereKhanKeeneyedHunter)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(shereKhanKeeneyedHunter)).toBe(true);
  });
});
