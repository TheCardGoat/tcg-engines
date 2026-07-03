import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { belleAlwaysReading } from "./148-belle-always-reading";

const shiftedBelle = createMockCharacter({
  id: "belle-always-reading-shifted-belle",
  name: "Belle",
  cost: 5,
  abilities: [
    {
      id: "belle-always-reading-shifted-belle-shift",
      type: "keyword",
      keyword: "Shift",
      text: "Shift 3",
      cost: { ink: 3 },
      shiftTarget: "Belle",
    },
  ],
});

const shiftedBeast = createMockCharacter({
  id: "belle-always-reading-shifted-beast",
  name: "Beast",
  cost: 5,
  abilities: [
    {
      id: "belle-always-reading-shifted-beast-shift",
      type: "keyword",
      keyword: "Shift",
      text: "Shift 3",
      cost: { ink: 3 },
      shiftTarget: "Beast",
    },
  ],
});

const beastBase = createMockCharacter({
  id: "belle-always-reading-beast-base",
  name: "Beast",
  cost: 2,
});

describe("Belle - Always Reading", () => {
  it("reduces the cost to shift a character on top of her by 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [belleAlwaysReading],
      hand: [shiftedBelle],
      inkwell: 2,
    });
    const shiftTarget = testEngine.findCardInstanceId(belleAlwaysReading, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(shiftedBelle, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(shiftedBelle)).toBe("play");
  });

  it("does not reduce the cost to shift a character on top of another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [belleAlwaysReading, beastBase],
      hand: [shiftedBeast],
      inkwell: 2,
    });
    const shiftTarget = testEngine.findCardInstanceId(beastBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(shiftedBeast, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toEqual(
      expect.objectContaining({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      }),
    );

    expect(testEngine.asPlayerOne().getCardZone(shiftedBeast)).toBe("hand");
  });
});
