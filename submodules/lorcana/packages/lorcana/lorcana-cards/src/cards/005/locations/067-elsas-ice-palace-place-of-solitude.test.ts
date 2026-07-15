import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elsasIcePalacePlaceOfSolitude } from "./067-elsas-ice-palace-place-of-solitude";

const frozenTarget = createMockCharacter({
  id: "ice-palace-target",
  name: "Frozen Target",
  cost: 2,
});

describe("Elsa's Ice Palace - Place of Solitude", () => {
  it("keeps the chosen exerted character from readying while the location stays in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [elsasIcePalacePlaceOfSolitude],
      inkwell: elsasIcePalacePlaceOfSolitude.cost,
      play: [{ card: frozenTarget, exerted: true }],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(elsasIcePalacePlaceOfSolitude, { targets: [frozenTarget] })
        .success,
    ).toBe(true);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(elsasIcePalacePlaceOfSolitude).success,
    ).toBe(true);
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingEffect(elsasIcePalacePlaceOfSolitude, { targets: [frozenTarget] }).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(frozenTarget)?.exerted).toBe(true);
  });
});
