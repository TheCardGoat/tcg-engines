import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { meilinLeePopularRedPanda } from "./125-meilin-lee-popular-red-panda";

const meilinBase = createMockCharacter({
  id: "meilin-popular-red-panda-shift-base",
  name: "Meilin Lee",
  cost: 2,
});

const karaokeSong = createMockSong({
  id: "meilin-popular-red-panda-karaoke-song",
  name: "Karaoke Song",
  cost: 2,
  text: "A test song.",
});

describe("Meilin Lee - Popular Red Panda", () => {
  it("temporarily shifts onto Meilin Lee, then returns only this card to hand and clears damage from the base", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [meilinLeePopularRedPanda],
        play: [{ card: meilinBase, damage: 2, isDrying: false }],
        inkwell: 3,
      },
      {
        deck: 1,
      },
    );
    const shiftTarget = testEngine.findCardInstanceId(meilinBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(meilinLeePopularRedPanda, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getCardsUnder(meilinLeePopularRedPanda)).toHaveLength(1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(meilinLeePopularRedPanda)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(meilinBase)).toBe("play");
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: meilinBase, value: 0 });
  });

  it("gains 3 lore when she sings a song during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [karaokeSong],
      play: [{ card: meilinLeePopularRedPanda, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().singSong(karaokeSong, meilinLeePopularRedPanda),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(meilinLeePopularRedPanda),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
  });
});
