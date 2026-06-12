import { describe, expect, it } from "bun:test";
import {
  LorcanaTestEngine,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { eilonwyPrincessOfLlyr } from "./007-eilonwy-princess-of-llyr";

describe("Eilonwy - Princess of Llyr", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [eilonwyPrincessOfLlyr],
    });

    const cardUnderTest = testEngine.getCardModel(eilonwyPrincessOfLlyr);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("adds Eilonwy's strength to another character when she quests", () => {
    const supportTarget = createMockCharacter({
      id: "eilonwy-support-target",
      name: "Support Target",
      cost: 2,
      strength: 3,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: eilonwyPrincessOfLlyr, isDrying: false }, supportTarget],
      deck: 1,
    });

    const targetStrengthBefore = testEngine.asPlayerOne().getCardStrength(supportTarget);

    expect(testEngine.asPlayerOne().quest(eilonwyPrincessOfLlyr)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(eilonwyPrincessOfLlyr, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      targetStrengthBefore + eilonwyPrincessOfLlyr.strength,
    );

    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(targetStrengthBefore);
  });

  it("can use Support to buff an opponent's character", () => {
    const opposingCharacter = createMockCharacter({
      id: "eilonwy-opposing-target",
      name: "Opposing Target",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: eilonwyPrincessOfLlyr, isDrying: false }],
        deck: 1,
      },
      {
        play: [opposingCharacter],
      },
    );

    const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

    expect(testEngine.asPlayerOne().quest(eilonwyPrincessOfLlyr)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(eilonwyPrincessOfLlyr, {
        resolveOptional: true,
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
      strengthBefore + eilonwyPrincessOfLlyr.strength,
    );
  });
});
