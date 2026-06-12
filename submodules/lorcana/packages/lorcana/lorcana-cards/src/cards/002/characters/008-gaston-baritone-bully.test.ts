import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockSong } from "@tcg/lorcana-engine/testing";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

const testSong = createMockSong({
  id: "gaston-baritone-bully-song",
  name: "Test Song",
  cost: 5,
  text: "A test song for Gaston.",
});

describe("Gaston - Baritone Bully", () => {
  it("can sing a song costing 5", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [testSong],
      play: [{ card: gastonBaritoneBully, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().singSong(testSong, gastonBaritoneBully),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(gastonBaritoneBully)).toBe(true);
  });
});
