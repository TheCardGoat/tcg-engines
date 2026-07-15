import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
} from "@tcg/lorcana-engine/testing";
import { captainHookForcefulDuelist } from "./186-captain-hook-forceful-duelist";

const toughDefender = createMockCharacter({
  id: "hook-test-tough-defender",
  name: "Tough Defender",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Captain Hook - Forceful Duelist", () => {
  it("should have Challenger +2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [captainHookForcefulDuelist],
    });

    const cardUnderTest = testEngine.getCardModel(captainHookForcefulDuelist);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });

  it("Challenger +2: deals 3 damage (1 base + 2 challenger) when challenging", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: captainHookForcefulDuelist, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: toughDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(captainHookForcefulDuelist, toughDefender),
    ).toBeSuccessfulCommand();

    // Captain Hook has 1 strength + 2 challenger = 3 damage dealt to defender
    expect(testEngine.asPlayerTwo().getCard(toughDefender).damage).toBe(
      captainHookForcefulDuelist.strength + 2,
    );
    // Defender deals 2 damage back to Captain Hook, banishing him (willpower 2)
    expect(testEngine.asPlayerOne().getCardZone(captainHookForcefulDuelist)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(toughDefender)).toBe("play");
  });
});
