import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { meilinLeePopularRedPandaEnchanted } from "./240-meilin-lee-popular-red-panda-enchanted";

const karaokeSong = createMockSong({
  id: "meilin-popular-red-panda-enchanted-karaoke-song",
  name: "Karaoke Song",
  cost: 2,
  text: "A test song.",
});

describe("Meilin Lee - Popular Red Panda Enchanted", () => {
  it("matches the base Karaoke Queen behavior", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [karaokeSong],
      play: [{ card: meilinLeePopularRedPandaEnchanted, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().singSong(karaokeSong, meilinLeePopularRedPandaEnchanted),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(meilinLeePopularRedPandaEnchanted),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
  });
});
