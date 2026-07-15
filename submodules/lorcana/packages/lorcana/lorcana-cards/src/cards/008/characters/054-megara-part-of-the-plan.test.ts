import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { megaraPartOfThePlan } from "./054-megara-part-of-the-plan";
import { hadesRuthlessTyrant } from "./048-hades-ruthless-tyrant";

const nonHadesCharacter = createMockCharacter({
  id: "megara-test-non-hades",
  name: "Some Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Megara - Part of the Plan", () => {
  it("does not have Challenger without a Hades character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [megaraPartOfThePlan, nonHadesCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(megaraPartOfThePlan, "Challenger")).toBe(false);
  });

  it("CONTENTIOUS ALLIANCE - gains Challenger +2 while you have a character named Hades in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [megaraPartOfThePlan, hadesRuthlessTyrant],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(megaraPartOfThePlan, "Challenger")).toBe(true);
    expect(testEngine.getKeywordValue(megaraPartOfThePlan, "Challenger")).toBe(2);
  });
});
