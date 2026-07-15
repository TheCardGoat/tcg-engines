import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { yzmaScaryBeyondAllReason } from "./060-yzma-scary-beyond-all-reason";

const opponentTarget = createMockCharacter({
  id: "yzma-scary-beyond-all-reason-target",
  name: "Opponent Target",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const drawOne = createMockCharacter({
  id: "yzma-scary-beyond-all-reason-draw-1",
  name: "Draw One",
  cost: 1,
});

const drawTwo = createMockCharacter({
  id: "yzma-scary-beyond-all-reason-draw-2",
  name: "Draw Two",
  cost: 2,
});

describe("Yzma - Scary Beyond All Reason", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [yzmaScaryBeyondAllReason],
    });

    expect(testEngine.hasKeyword(yzmaScaryBeyondAllReason, "Shift")).toBe(true);
  });

  it("shuffles another chosen character into their player's deck and that player draws 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [yzmaScaryBeyondAllReason],
        inkwell: yzmaScaryBeyondAllReason.cost,
      },
      {
        play: [opponentTarget],
        deck: [drawOne, drawTwo],
      },
    );

    expect(testEngine.asPlayerOne().playCard(yzmaScaryBeyondAllReason)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(yzmaScaryBeyondAllReason),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [opponentTarget] }).success).toBe(
      true,
    );

    // opponentTarget was shuffled into the deck; after drawing 2, it may be in hand or deck
    // depending on the shuffle order — check only the counts.
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toHaveLength(1);
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 2 });
  });

  it("does not block the game when no valid target is available", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [yzmaScaryBeyondAllReason],
      inkwell: yzmaScaryBeyondAllReason.cost,
    });

    testEngine.asPlayerOne().playCard(yzmaScaryBeyondAllReason);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
