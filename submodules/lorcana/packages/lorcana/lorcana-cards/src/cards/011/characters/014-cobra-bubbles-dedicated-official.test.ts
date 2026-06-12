import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cobraBubblesDedicatedOfficial } from "./014-cobra-bubbles-dedicated-official";

const opposingCharacter = createMockCharacter({
  id: "cobra-bubbles-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Cobra Bubbles - Dedicated Official", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cobraBubblesDedicatedOfficial],
      inkwell: cobraBubblesDedicatedOfficial.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(cobraBubblesDedicatedOfficial),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(cobraBubblesDedicatedOfficial)).toBe("play");
  });

  it("gives a chosen opposing character cant-challenge and must-quest during their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cobraBubblesDedicatedOfficial],
        deck: 5,
      },
      {
        play: [opposingCharacter],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().quest(cobraBubblesDedicatedOfficial)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cobraBubblesDedicatedOfficial, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);
    expect(testEngine.hasRestriction(opposingCharacter, "must-quest")).toBe(true);
    expect(testEngine.asPlayerTwo().quest(opposingCharacter)).toBeSuccessfulCommand();
  });
});
