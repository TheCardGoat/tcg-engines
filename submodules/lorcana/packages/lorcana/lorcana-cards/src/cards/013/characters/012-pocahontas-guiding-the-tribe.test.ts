import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pocahontasGuidingTheTribe } from "./012-pocahontas-guiding-the-tribe";

const costOneCharacter = createMockCharacter({
  id: "pocahontas-guiding-tribe-cost-one",
  name: "Cost One Character",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const costTwoCharacter = createMockCharacter({
  id: "pocahontas-guiding-tribe-cost-two",
  name: "Cost Two Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const costZeroCharacter = createMockCharacter({
  id: "pocahontas-guiding-tribe-cost-zero",
  name: "Cost Zero Character",
  cost: 0,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Pocahontas - Guiding the Tribe", () => {
  it("may play a character with cost 1 from hand for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pocahontasGuidingTheTribe, costOneCharacter],
      inkwell: pocahontasGuidingTheTribe.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(pocahontasGuidingTheTribe)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pocahontasGuidingTheTribe, {
        resolveOptional: true,
        targets: [costOneCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(costOneCharacter)).toBe("play");
  });

  it("does not play a character that costs more than 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pocahontasGuidingTheTribe, costTwoCharacter],
      inkwell: pocahontasGuidingTheTribe.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(pocahontasGuidingTheTribe)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pocahontasGuidingTheTribe, {
        resolveOptional: true,
        targets: [costTwoCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(costTwoCharacter)).toBe("hand");
  });

  it("does not play a character that costs less than 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pocahontasGuidingTheTribe, costZeroCharacter],
      inkwell: pocahontasGuidingTheTribe.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(pocahontasGuidingTheTribe)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pocahontasGuidingTheTribe, {
        resolveOptional: true,
        targets: [costZeroCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(costZeroCharacter)).toBe("hand");
  });
});
