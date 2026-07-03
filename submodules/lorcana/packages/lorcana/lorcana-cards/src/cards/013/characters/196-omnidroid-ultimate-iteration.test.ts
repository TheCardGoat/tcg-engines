import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { omnidroidUltimateIteration } from "./196-omnidroid-ultimate-iteration";

const omnidroidBase = createMockCharacter({
  id: "omnidroid-ultimate-base",
  name: "Omnidroid",
  cost: 2,
});

describe("Omnidroid - Ultimate Iteration", () => {
  it("can be played using Shift 6", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [omnidroidBase],
      hand: [omnidroidUltimateIteration],
      inkwell: 6,
      deck: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(omnidroidBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(omnidroidUltimateIteration, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(omnidroidUltimateIteration)).toBe("play");
  });

  it("has Resist +2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [omnidroidUltimateIteration],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(omnidroidUltimateIteration, "Resist")).toBe(2);
  });

  it("may return all cards under it to your hand when shifted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [omnidroidBase],
      hand: [omnidroidUltimateIteration],
      inkwell: 6,
      deck: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(omnidroidBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(omnidroidUltimateIteration, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(omnidroidUltimateIteration, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(omnidroidBase)).toBe("hand");
    expect(testEngine.getCardsUnder(omnidroidUltimateIteration)).toHaveLength(0);
  });
});
