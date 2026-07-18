import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { tiggerHunnyBarbarian } from "./126-tigger-hunny-barbarian";

const hunnyAlly = createMockCharacter({
  id: "tigger-hunny-ally",
  name: "Hunny Ally",
  cost: 2,
  willpower: 3,
  classifications: ["Storyborn", "Ally", "Hunny"],
});

const opposingDefender = createMockCharacter({
  id: "tigger-opposing-defender",
  name: "Opposing Defender",
  cost: 2,
  strength: 1,
  willpower: 6,
});

const opposingLocation = createMockLocation({
  id: "tigger-opposing-location",
  name: "Opposing Location",
  cost: 2,
  willpower: 6,
  moveCost: 1,
  lore: 0,
});

describe("Tigger - Hunny Barbarian", () => {
  it("has Reckless", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [tiggerHunnyBarbarian],
    });

    expect(testEngine.asPlayerOne().hasKeyword(tiggerHunnyBarbarian, "Reckless")).toBe(true);
  });

  it("readies a chosen Hunny character and prevents it from questing after Tigger challenges", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: tiggerHunnyBarbarian, isDrying: false },
          { card: hunnyAlly, exerted: true },
        ],
        deck: 3,
      },
      {
        play: [{ card: opposingDefender, exerted: true }],
        deck: 3,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(tiggerHunnyBarbarian, opposingDefender),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tiggerHunnyBarbarian, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [hunnyAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(hunnyAlly)).toBe(false);
    expect(testEngine.hasRestriction(hunnyAlly, "cant-quest")).toBe(true);
  });

  it("does not trigger when Tigger challenges a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: tiggerHunnyBarbarian, isDrying: false }],
        deck: 3,
      },
      {
        play: [opposingLocation],
        deck: 3,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(tiggerHunnyBarbarian, opposingLocation),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
