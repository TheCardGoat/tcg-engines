import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { basilOfBakerStreet } from "./139-basil-of-baker-street";

const supportTarget = createMockCharacter({
  id: "support-target",
  name: "Support Target",
  strength: 2,
  willpower: 4,
  cost: 2,
});

describe("Basil - Of Baker Street", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [basilOfBakerStreet],
    });

    const cardUnderTest = testEngine.getCardModel(basilOfBakerStreet);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("should add Basil's strength to chosen character when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: basilOfBakerStreet, isDrying: false }, supportTarget],
    });

    expect(testEngine.asPlayerOne().quest(basilOfBakerStreet)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(basilOfBakerStreet, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + basilOfBakerStreet.strength,
    );
  });

  it("strength bonus lasts only until end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: basilOfBakerStreet, isDrying: false }, supportTarget],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(basilOfBakerStreet)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(basilOfBakerStreet, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + basilOfBakerStreet.strength,
    );

    // Pass both turns to advance to next turn
    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    // Strength bonus should have expired
    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });
});
