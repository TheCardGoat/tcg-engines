import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { halfHexwellCrownEpic } from "./223-half-hexwell-crown-epic";

const crownDraw = createMockCharacter({
  id: "half-crown-epic-draw",
  name: "Half Crown Epic Draw",
  cost: 1,
});

const discardCostCard = createMockCharacter({
  id: "half-crown-epic-discard",
  name: "Epic Discard Cost Card",
  cost: 2,
});

const exertTarget = createMockCharacter({
  id: "half-crown-epic-target",
  name: "Epic Exert Target",
  cost: 3,
});

describe("Half Hexwell Crown - Epic", () => {
  it("draws a card with AN UNEXPECTED FIND", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [crownDraw],
        inkwell: 2,
        play: [halfHexwellCrownEpic],
      },
      {
        deck: [],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(halfHexwellCrownEpic, {
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
        play: [halfHexwellCrownEpic],
      },
      {
        deck: [],
        play: [exertTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(halfHexwellCrownEpic, {
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
