import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockSong } from "@tcg/lorcana-engine/testing";
import { meilinLeeLeadVocalistP4Challenge } from "./p4-010-meilin-lee-lead-vocalist-challenge";

const singTogetherSong = createMockSong({
  id: "meilin-lead-challenge-sing-together-song",
  name: "Sing Together Song",
  cost: 3,
  text: "A Sing Together song.",
  abilities: [{ type: "keyword", keyword: "SingTogether", value: 3 }],
});

describe("Meilin Lee - Lead Vocalist - Challenge", () => {
  it("can sing a song with Sing Together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [singTogetherSong],
      play: [{ card: meilinLeeLeadVocalistP4Challenge, isDrying: false }],
    });

    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(singTogetherSong, [meilinLeeLeadVocalistP4Challenge]),
    ).toBeSuccessfulCommand();
  });
});
