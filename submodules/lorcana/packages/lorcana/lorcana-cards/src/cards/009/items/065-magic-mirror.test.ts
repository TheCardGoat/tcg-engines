import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { magicMirror } from "./065-magic-mirror";

describe("Magic Mirror", () => {
  it("draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 1,
      inkwell: 4,
      play: [magicMirror],
    });

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 0, deck: 1 }),
    );

    expect(
      testEngine.asPlayerOne().activateAbility(magicMirror, {
        ability: "SPEAK!",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(magicMirror)).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0 }),
    );
  });
});
