import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { chiefTuiRespectedLeader } from "./143-chief-tui-respected-leader";

const supportTarget = createMockCharacter({
  id: "support-target",
  name: "Support Target",
  strength: 2,
  willpower: 4,
  cost: 2,
});

describe("Chief Tui - Respected Leader", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [chiefTuiRespectedLeader],
    });

    const cardUnderTest = testEngine.getCardModel(chiefTuiRespectedLeader);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("should add Chief Tui's strength to chosen character when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: chiefTuiRespectedLeader, isDrying: false }, supportTarget],
    });

    expect(testEngine.asPlayerOne().quest(chiefTuiRespectedLeader)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(chiefTuiRespectedLeader, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + chiefTuiRespectedLeader.strength,
    );
  });

  it("strength bonus lasts only until end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: chiefTuiRespectedLeader, isDrying: false }, supportTarget],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(chiefTuiRespectedLeader)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(chiefTuiRespectedLeader, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + chiefTuiRespectedLeader.strength,
    );

    // Pass both turns to advance to next turn
    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    // Strength bonus should have expired
    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });
});
