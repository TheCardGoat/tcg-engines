import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cruellaDeVilPerfectlyWretched } from "./145-cruella-de-vil-perfectly-wretched";

const opposingTarget = createMockCharacter({
  id: "cruella-opposing-target",
  name: "Opposing Target",
  cost: 2,
  strength: 4,
  willpower: 3,
  lore: 1,
});

describe("Cruella De Vil - Perfectly Wretched", () => {
  it("gives a chosen opposing character -2 strength this turn when Cruella quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: cruellaDeVilPerfectlyWretched, isDrying: false }],
        deck: 1,
      },
      {
        play: [opposingTarget],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(cruellaDeVilPerfectlyWretched)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    if (!bagEffect) {
      return;
    }

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cruellaDeVilPerfectlyWretched),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [opposingTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingTarget)).toBe(2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingTarget)).toBe(4);
  });
});
