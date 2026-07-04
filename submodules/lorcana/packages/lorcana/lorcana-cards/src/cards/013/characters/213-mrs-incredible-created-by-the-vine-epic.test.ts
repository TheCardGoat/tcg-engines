import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mrsIncredibleCreatedByTheVineEpic } from "./213-mrs-incredible-created-by-the-vine-epic";

const shiftBase = createMockCharacter({
  id: "mrs-incredible-epic-torrent-shift-base",
  name: "Shift Hero",
  cost: 2,
});

const shiftHero = createMockCharacter({
  id: "mrs-incredible-epic-torrent-shift-hero",
  name: "Shift Hero",
  cost: 5,
  abilities: [
    {
      id: "mrs-incredible-epic-torrent-shift-hero-shift",
      type: "keyword",
      keyword: "Shift",
      text: "Shift 3",
      cost: { ink: 3 },
    },
  ],
});

describe("Mrs. Incredible - Created by the Vine - Epic", () => {
  it("reduces the next character you shift this turn by 1 when your Floodborn quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mrsIncredibleCreatedByTheVineEpic, isDrying: false }, shiftBase],
      hand: [shiftHero],
      inkwell: 2,
      deck: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().quest(mrsIncredibleCreatedByTheVineEpic),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCard(shiftHero, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(shiftHero)).toBe("play");
  });
});
