import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theQueenConceitedRuler } from "@tcg/lorcana-cards/cards/009";

const princessCard = createMockCharacter({
  id: "sot-princess-card",
  name: "Princess Card",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const nonPrincessCard = createMockCharacter({
  id: "sot-non-princess",
  name: "Non-Princess Card",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const discardTarget = createMockCharacter({
  id: "sot-discard-target",
  name: "Discard Target",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("ROYAL SUMMONS - The Queen, Conceited Ruler - At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.", () => {
  it("should trigger at the start of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [theQueenConceitedRuler],
        hand: [princessCard],
        discard: [discardTarget],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    // Pass to opponent, then pass back to trigger start-of-turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Should have a bag for the optional start-of-turn trigger
    const bagCount = testEngine.asPlayerOne().getBagCount();
    expect(bagCount).toBeGreaterThanOrEqual(1);
  });

  it("should allow declining the optional trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [theQueenConceitedRuler],
        hand: [princessCard],
        discard: [discardTarget],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    // Decline
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: false,
        }),
    ).toBeSuccessfulCommand();

    // Princess should still be in hand, discard target still in discard
    expect(testEngine.asPlayerOne().getCardZone(princessCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(discardTarget)).toBe("discard");
  });

  it("should NOT trigger during opponent's turn start", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [theQueenConceitedRuler],
        hand: [princessCard],
        discard: [discardTarget],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    // Pass to opponent's turn (this is the END of P1's turn, START of P2's turn)
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // At this point, P2's turn started - Queen's trigger should NOT fire during P2's turn start
    // (it fires at start of YOUR turn = P1's turn)
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
  });

  it("should trigger even if Queen is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: theQueenConceitedRuler, exerted: true, isDrying: false }],
        hand: [princessCard],
        discard: [discardTarget],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Trigger should still fire even though Queen is exerted (no exertion condition)
    // Note: Queen will have been readied at start of turn, so she's ready now
    const bagCount = testEngine.asPlayerOne().getBagCount();
    expect(bagCount).toBeGreaterThanOrEqual(1);
  });
});
