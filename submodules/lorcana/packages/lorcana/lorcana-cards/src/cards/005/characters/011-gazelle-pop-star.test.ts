import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockSong } from "@tcg/lorcana-engine/testing";
import { gazellePopStar } from "./011-gazelle-pop-star";

const testSong = createMockSong({
  id: "gazelle-pop-star-test-song",
  name: "Test Song",
  cost: 5,
  text: "A test song for Gazelle.",
});

describe("Gazelle - Pop Star", () => {
  it("can sing a cost 5 song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [testSong],
      play: [gazellePopStar],
    });

    expect(testEngine.asPlayerOne().singSong(testSong, gazellePopStar)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(testSong)).toBe("discard");
    expect(testEngine.asPlayerOne().isExerted(gazellePopStar)).toBe(true);
  });
});
