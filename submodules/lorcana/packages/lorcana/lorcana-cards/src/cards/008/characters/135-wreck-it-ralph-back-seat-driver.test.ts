import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { wreckitRalphBackSeatDriver } from "./135-wreck-it-ralph-back-seat-driver";

const racerCharacter = createMockCharacter({
  id: "ralph-back-seat-racer-target",
  name: "Racer Target",
  cost: 2,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Hero", "Racer"],
});

describe("Wreck-It Ralph - Back Seat Driver", () => {
  it("CHARGED UP - gives +4 strength to a chosen Racer character this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [wreckitRalphBackSeatDriver],
      inkwell: wreckitRalphBackSeatDriver.cost,
      play: [racerCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(wreckitRalphBackSeatDriver)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphBackSeatDriver),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [racerCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(racerCharacter)).toBe(
      racerCharacter.strength + 4,
    );
  });

  it("CHARGED UP - +4 strength boost expires at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [wreckitRalphBackSeatDriver],
      inkwell: wreckitRalphBackSeatDriver.cost,
      play: [racerCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(wreckitRalphBackSeatDriver)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphBackSeatDriver),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [racerCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(racerCharacter)).toBe(
      racerCharacter.strength + 4,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(racerCharacter)).toBe(racerCharacter.strength);
  });
});
