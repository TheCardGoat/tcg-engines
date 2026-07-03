import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { meilinLeeLosingControl } from "./016-meilin-lee-losing-control";

const redPandaCharacter = createMockCharacter({
  id: "meilin-losing-red-panda",
  name: "Red Panda Friend",
  cost: 1,
  classifications: ["Dreamborn", "Red Panda"],
});

const nonRedPandaCharacter = createMockCharacter({
  id: "meilin-losing-non-red-panda",
  name: "Regular Friend",
  cost: 1,
});

const eligibleSong = createMockSong({
  id: "meilin-losing-song",
  name: "Eligible Song",
  cost: 1,
  text: "A song.",
});

const ineligibleAction = createMockAction({
  id: "meilin-losing-action",
  name: "Ineligible Action",
  cost: 1,
});

describe("Meilin Lee - Losing Control", () => {
  it("reveals a Red Panda character from the top 4 cards and puts the rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [meilinLeeLosingControl],
      inkwell: meilinLeeLosingControl.cost,
      deck: [ineligibleAction, redPandaCharacter, nonRedPandaCharacter, eligibleSong],
    });

    expect(testEngine.asPlayerOne().playCard(meilinLeeLosingControl)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(meilinLeeLosingControl, {
        destinations: [
          { zone: "hand", cards: [redPandaCharacter] },
          { zone: "deck-bottom", cards: [eligibleSong, nonRedPandaCharacter, ineligibleAction] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(redPandaCharacter)).toBe("hand");
  });

  it("reveals a song from the top 4 cards and puts the rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [meilinLeeLosingControl],
      inkwell: meilinLeeLosingControl.cost,
      deck: [ineligibleAction, nonRedPandaCharacter, eligibleSong, redPandaCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(meilinLeeLosingControl)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(meilinLeeLosingControl, {
        destinations: [
          { zone: "hand", cards: [eligibleSong] },
          {
            zone: "deck-bottom",
            cards: [redPandaCharacter, nonRedPandaCharacter, ineligibleAction],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(eligibleSong)).toBe("hand");
  });
});
