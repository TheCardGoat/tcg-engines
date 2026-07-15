import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { percyPupsicle } from "@tcg/lorcana-cards/cards/011";

describe("ICE BATH - Percy, Pupsicle - This character can't challenge.", () => {
  it("should prevent Percy from challenging any opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: percyPupsicle, isDrying: false }],
      },
      {
        play: [{ card: stitchNewDog, exerted: true }],
      },
    );

    const result = testEngine
      .asPlayerOne()
      .challenge(percyPupsicle, stitchNewDog) as CommandFailure;

    expect(result.success).toBe(false);
  });

  it("should still allow Percy to quest normally", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: percyPupsicle, isDrying: false }],
        lore: 0,
      },
      {},
    );

    expect(testEngine.asPlayerOne().quest(percyPupsicle)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(percyPupsicle.lore);
  });

  it("should still allow opposing characters to challenge Percy", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: percyPupsicle, exerted: true }],
        deck: 2,
      },
      {
        play: [{ card: stitchNewDog, isDrying: false }],
        deck: 2,
      },
    );

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent CAN challenge Percy
    expect(testEngine.asPlayerTwo().challenge(stitchNewDog, percyPupsicle)).toBeSuccessfulCommand();
  });

  it("should still allow Percy to be the target of effects and abilities", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [percyPupsicle],
      },
      {},
    );

    // Percy is a valid target for effects (just can't challenge)
    expect(testEngine.asPlayerOne().getCardZone(percyPupsicle)).toBe("play");
  });
});
