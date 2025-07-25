import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { LorcanaTestEngine } from "../../testing/lorcana-test-engine";

describe("Singer Ability", () => {
  it.skip("should be able to play a card", async () => {
    const testEngine = new LorcanaTestEngine({
      play: [arielSpectacularSinger],
    });

    const { singer } = testEngine.singSong({
      song: hakunaMatata,
      singer: arielSpectacularSinger,
    });
  });
});
