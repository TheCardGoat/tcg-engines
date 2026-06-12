import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { halfHexwellCrown } from "./065-half-hexwell-crown";

const crownDraw = createMockCharacter({
  id: "half-crown-draw",
  name: "Half Crown Draw",
  cost: 1,
});

const discardCostCard = createMockCharacter({
  id: "half-crown-discard",
  name: "Discard Cost Card",
  cost: 2,
});

const exertTarget = createMockCharacter({
  id: "half-crown-target",
  name: "Exert Target",
  cost: 3,
});

describe("Half Hexwell Crown", () => {
  it("draws a card with AN UNEXPECTED FIND", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [crownDraw],
        inkwell: 2,
        play: [halfHexwellCrown],
      },
      {
        deck: [],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(halfHexwellCrown, {
        ability: "AN UNEXPECTED FIND",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(crownDraw)).toBe("hand");
  });

  it("discards a chosen card to exert the chosen character with A PERILOUS POWER", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [],
        hand: [discardCostCard],
        inkwell: 2,
        play: [halfHexwellCrown],
      },
      {
        deck: [],
        play: [exertTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(halfHexwellCrown, {
        ability: "A PERILOUS POWER",
        targets: [exertTarget],
        costs: {
          discardCards: [discardCostCard],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardCostCard)).toBe("discard");
    expect(testEngine.asPlayerTwo().isExerted(exertTarget)).toBe(true);
  });
});
