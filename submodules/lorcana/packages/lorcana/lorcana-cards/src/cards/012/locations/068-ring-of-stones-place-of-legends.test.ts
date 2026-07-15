import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ringOfStonesPlaceOfLegends } from "./068-ring-of-stones-place-of-legends";

const pilgrim = createMockCharacter({
  id: "ring-of-stones-pilgrim",
  name: "Ring Pilgrim",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const secondPilgrim = createMockCharacter({
  id: "ring-of-stones-second-pilgrim",
  name: "Second Pilgrim",
  cost: 3,
  strength: 2,
  willpower: 3,
});

describe("Ring of Stones - Place of Legends", () => {
  it("FOLLOW YOUR FATE - an exerted character can move here for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ringOfStonesPlaceOfLegends, { card: pilgrim, exerted: true }],
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(pilgrim, ringOfStonesPlaceOfLegends).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCardLocationId(pilgrim)).toBe(
      testEngine.findCardInstanceId(ringOfStonesPlaceOfLegends, "play", PLAYER_ONE),
    );
  });

  it("FOLLOW YOUR FATE - a ready character cannot move here without ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ringOfStonesPlaceOfLegends, pilgrim],
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(pilgrim, ringOfStonesPlaceOfLegends).success,
    ).toBe(false);
  });

  it("FOLLOW YOUR FATE - a ready character can still move here by paying the move cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ringOfStonesPlaceOfLegends, pilgrim],
      inkwell: ringOfStonesPlaceOfLegends.moveCost,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(pilgrim, ringOfStonesPlaceOfLegends).success,
    ).toBe(true);
  });

  it("PART THE VEIL - gains 1 lore the first time a character moves here during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ringOfStonesPlaceOfLegends, { card: pilgrim, exerted: true }],
    });

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(pilgrim, ringOfStonesPlaceOfLegends).success,
    ).toBe(true);

    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ringOfStonesPlaceOfLegends).success,
      ).toBe(true);
    }

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("PART THE VEIL - only triggers once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        ringOfStonesPlaceOfLegends,
        { card: pilgrim, exerted: true },
        { card: secondPilgrim, exerted: true },
      ],
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(pilgrim, ringOfStonesPlaceOfLegends).success,
    ).toBe(true);
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ringOfStonesPlaceOfLegends).success,
      ).toBe(true);
    }
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(secondPilgrim, ringOfStonesPlaceOfLegends)
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
