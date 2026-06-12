import { describe, expect, it } from "bun:test";
import type { LocationCard } from "@tcg/lorcana-types";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { sugarRushSpeedwayFinishLine } from "./035-sugar-rush-speedway-finish-line";

const startingLineI18n = {
  en: { name: "Sugar Rush Speedway", version: "Starting Line" },
  de: { name: "Sugar Rush Speedway", version: "Starting Line" },
  fr: { name: "Sugar Rush Speedway", version: "Starting Line" },
  it: { name: "Sugar Rush Speedway", version: "Starting Line" },
};

const startingLine: LocationCard = {
  id: "sugar-rush-starting-line",
  canonicalId: "ci_sugar_rush_starting_line",
  cardType: "location",
  name: "Sugar Rush Speedway",
  version: "Starting Line",
  i18n: startingLineI18n,
  inkType: ["amber"],
  set: "TST",
  cardNumber: 1,
  rarity: "common",
  cost: 1,
  moveCost: 1,
  willpower: 4,
  lore: 0,
  inkable: true,
  abilities: [],
};

const racer = createMockCharacter({
  id: "finish-line-racer",
  name: "Finish Line Racer",
  cost: 2,
});

describe("Sugar Rush Speedway - Finish Line", () => {
  it("banishes itself to gain 3 lore and draw 3 after a character moves here from another location", () => {
    const drawOne = createMockCharacter({ id: "finish-line-draw-1", name: "Draw One", cost: 1 });
    const drawTwo = createMockCharacter({ id: "finish-line-draw-2", name: "Draw Two", cost: 1 });
    const drawThree = createMockCharacter({
      id: "finish-line-draw-3",
      name: "Draw Three",
      cost: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [startingLine, sugarRushSpeedwayFinishLine, racer],
      deck: [drawOne, drawTwo, drawThree],
      inkwell: 7,
    });

    expect(testEngine.asPlayerOne().moveCharacterToLocation(racer, startingLine).success).toBe(
      true,
    );
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(racer, sugarRushSpeedwayFinishLine).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(sugarRushSpeedwayFinishLine).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardZone(sugarRushSpeedwayFinishLine)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
    expect(testEngine.asPlayerOne().getCardZone(drawOne)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(drawTwo)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(drawThree)).toBe("hand");
  });

  it("does not trigger when the character moves here from play instead of another location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sugarRushSpeedwayFinishLine, racer],
      inkwell: sugarRushSpeedwayFinishLine.moveCost,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(racer, sugarRushSpeedwayFinishLine).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
