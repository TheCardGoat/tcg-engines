import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockSong } from "@tcg/lorcana-engine/testing";
import { meilinLeeLeadVocalist } from "./007-meilin-lee-lead-vocalist";

const regularSong = createMockSong({
  id: "meilin-lead-regular-song",
  name: "Regular Song",
  cost: 3,
  text: "A regular song.",
});

const singTogetherSong = createMockSong({
  id: "meilin-lead-sing-together-song",
  name: "Sing Together Song",
  cost: 3,
  text: "A Sing Together song.",
  abilities: [{ type: "keyword", keyword: "SingTogether", value: 3 }],
});

describe("Meilin Lee - Lead Vocalist", () => {
  it("can sing a Sing Together song but cannot sing a song without Sing Together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [regularSong, singTogetherSong],
      play: [{ card: meilinLeeLeadVocalist, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().singSong(regularSong, meilinLeeLeadVocalist).success).toBe(
      false,
    );
    expect(
      testEngine.asPlayerOne().playSongTogether(singTogetherSong, [meilinLeeLeadVocalist]),
    ).toBeSuccessfulCommand();
  });
});
