import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { annaIceBreaker } from "@tcg/lorcana-cards/cards/007";

/**
 * THE-955:
 * Anna - The Ice Breaker should require choosing an opposing character for WINTER AMBUSH.
 * The pending target list must not auto-include Anna herself as a default target.
 */
describe("THE-955 — Anna Ice Breaker targeting", () => {
  it("exposes only opposing characters as valid targets and applies cant-ready to the chosen one", () => {
    const chosenOpponent = createMockCharacter({
      id: "the-955-chosen-opponent",
      name: "THE-955 Chosen Opponent",
      cost: 2,
      strength: 2,
      willpower: 3,
    });

    const otherOpponent = createMockCharacter({
      id: "the-955-other-opponent",
      name: "THE-955 Other Opponent",
      cost: 2,
      strength: 2,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [annaIceBreaker],
        inkwell: annaIceBreaker.cost,
      },
      {
        play: [
          { card: chosenOpponent, exerted: true },
          { card: otherOpponent, exerted: true },
        ],
      },
    );

    expect(testEngine.asPlayerOne().playCard(annaIceBreaker)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(annaIceBreaker)).toBeSuccessfulCommand();

    const [pending] = testEngine.asPlayerOne().getPendingEffects();
    expect(pending).toBeDefined();
    expect(pending?.type).toBe("target-selection");

    const selectionContext = pending?.selectionContext;
    expect(selectionContext?.kind).toBe("target-selection");
    if (!selectionContext || selectionContext.kind !== "target-selection") {
      throw new Error("Expected target-selection context for Anna trigger");
    }
    expect(selectionContext.cardCandidateIds).toHaveLength(2);

    const annaInstanceId = testEngine.findCardInstanceId(annaIceBreaker, "play", "player_one");
    expect(annaInstanceId).toBeDefined();
    expect(selectionContext.cardCandidateIds).not.toContain(annaInstanceId);

    const chosenOpponentId = testEngine.findCardInstanceId(chosenOpponent, "play", "player_two");
    const otherOpponentId = testEngine.findCardInstanceId(otherOpponent, "play", "player_two");
    expect(chosenOpponentId).toBeDefined();
    expect(otherOpponentId).toBeDefined();
    expect(selectionContext.cardCandidateIds).toContain(chosenOpponentId);
    expect(selectionContext.cardCandidateIds).toContain(otherOpponentId);

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [chosenOpponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(chosenOpponent)).toBe(true);
    expect(testEngine.asPlayerTwo().isExerted(otherOpponent)).toBe(false);
    expect(testEngine.asPlayerTwo().isExerted(annaIceBreaker)).toBe(false);
  });
});
