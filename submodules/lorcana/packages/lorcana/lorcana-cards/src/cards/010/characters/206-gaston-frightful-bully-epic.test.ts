import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gastonFrightfulBullyEpic } from "./206-gaston-frightful-bully-epic";

const cardUnderGastonEpic = createMockCharacter({
  id: "gaston-frightful-bully-epic-under-card",
  name: "Under Card",
  cost: 1,
});

const opposingCharacter = createMockCharacter({
  id: "gaston-frightful-bully-epic-opponent",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Gaston - Frightful Bully - Epic", () => {
  it("matches the base card's TOP THAT! restriction effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: gastonFrightfulBullyEpic, isDrying: false, cardsUnder: [cardUnderGastonEpic] },
        ],
        deck: 5,
      },
      {
        play: [opposingCharacter],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().quest(gastonFrightfulBullyEpic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(gastonFrightfulBullyEpic, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);
    expect(testEngine.hasRestriction(opposingCharacter, "must-quest")).toBe(true);
  });
});
