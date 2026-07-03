import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mrsIncredibleCreatedByTheVine } from "./051-mrs-incredible-created-by-the-vine";

const shiftBase = createMockCharacter({
  id: "mrs-incredible-torrent-shift-base",
  name: "Shift Hero",
  cost: 2,
});

const shiftHero = createMockCharacter({
  id: "mrs-incredible-torrent-shift-hero",
  name: "Shift Hero",
  cost: 3,
  abilities: [
    {
      id: "mrs-incredible-torrent-shift-hero-shift",
      type: "keyword",
      keyword: "Shift",
      text: "Shift 3",
      cost: { ink: 3 },
    },
  ],
});

describe("Mrs. Incredible - Created by the Vine", () => {
  it("reduces the next character you shift this turn by 1 when your Floodborn quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mrsIncredibleCreatedByTheVine, isDrying: false }, shiftBase],
      hand: [shiftHero],
      inkwell: 2,
      deck: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

    expect(testEngine.asPlayerOne().quest(mrsIncredibleCreatedByTheVine)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCard(shiftHero, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(shiftHero)).toBe("play");
  });

  it("does not reduce the next character played normally this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mrsIncredibleCreatedByTheVine, isDrying: false }, shiftBase],
      hand: [shiftHero],
      inkwell: 2,
      deck: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

    expect(testEngine.asPlayerOne().quest(mrsIncredibleCreatedByTheVine)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(shiftHero)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(shiftHero)).toBe("hand");

    expect(
      testEngine.asPlayerOne().playCard(shiftHero, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(shiftHero)).toBe("play");
  });
});
