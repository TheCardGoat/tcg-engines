import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack } from "../../001/characters/007-heihei-boat-snack";
import { jetsamUrsulasSpy } from "../../001/characters/046-jetsam-ursulas-spy";
import { dragonGem } from "./033-dragon-gem";

describe("Dragon Gem", () => {
  it("returns a character card with Support from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      discard: [heiheiBoatSnack],
      inkwell: 3,
      play: [dragonGem],
    });

    const result = testEngine.asPlayerOne().activateAbility(dragonGem, {
      targets: [heiheiBoatSnack],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("hand");
  });

  it("does not let you choose a character card without Support", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      discard: [jetsamUrsulasSpy],
      inkwell: 3,
      play: [dragonGem],
    });

    const result = testEngine.asPlayerOne().activateAbility(dragonGem, {
      targets: [jetsamUrsulasSpy],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(jetsamUrsulasSpy)).toBe("discard");
  });

  describe("Fabled Release Notes - Alice / Dragon Gem", () => {
    it.todo("Dragon Gem cannot return Alice - Growing Girl (she doesn't have Support herself)", () => {});

    it.todo("Dragon Gem CAN return Alice if another Alice gives her Support", () => {});
  });
});
