import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockSong } from "@tcg/lorcana-engine/testing";
import { kangaHunnyBard } from "./023-kanga-hunny-bard";

const kangaSong = createMockSong({
  id: "kanga-hunny-bard-song",
  name: "Kanga Song",
  cost: 5,
  text: "A song Kanga can sing.",
});

describe("Kanga - Hunny Bard", () => {
  it("can sing songs as though she has cost 5", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [kangaSong],
      play: [{ card: kangaHunnyBard, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().singSong(kangaSong, kangaHunnyBard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(kangaHunnyBard)).toBe(true);
  });
});
