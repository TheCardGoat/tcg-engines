import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { rapunzelEtherealProtector } from "@tcg/lorcana-cards/cards/011";

const opponentCharacter = createMockCharacter({
  id: "quest-trigger-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const boostCard = createMockCharacter({
  id: "quest-trigger-boost-card",
  name: "Boost Card",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("CLONK! - Rapunzel, Ethereal Protector - Whenever this character quests, if there's a card under her, chosen opposing character can't challenge until the start of your next turn.", () => {
  it("should trigger when questing with a card under her", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          {
            card: rapunzelEtherealProtector,
            isDrying: false,
            cardsUnder: [boostCard],
          },
        ],
        lore: 0,
      },
      {
        play: [opponentCharacter],
      },
    );

    expect(testEngine.asPlayerOne().quest(rapunzelEtherealProtector)).toBeSuccessfulCommand();

    // Trigger should fire since there's a card under her
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
  });

  it("should NOT trigger when questing without a card under her", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: rapunzelEtherealProtector, isDrying: false }],
        lore: 0,
      },
      {
        play: [opponentCharacter],
      },
    );

    expect(testEngine.asPlayerOne().quest(rapunzelEtherealProtector)).toBeSuccessfulCommand();

    // No trigger because no card under her
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("should apply cant-challenge restriction to the chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          {
            card: rapunzelEtherealProtector,
            isDrying: false,
            cardsUnder: [boostCard],
          },
          {
            card: createMockCharacter({
              id: "quest-trigger-my-exerted",
              name: "My Exerted Character",
              cost: 2,
              strength: 2,
              willpower: 4,
            }),
            exerted: true,
            isDrying: false,
          },
        ],
        lore: 0,
        deck: 2,
      },
      {
        play: [{ card: opponentCharacter, isDrying: false }],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().quest(rapunzelEtherealProtector)).toBeSuccessfulCommand();

    // Apply the restriction to the opponent character
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          targets: [opponentCharacter],
        }),
    ).toBeSuccessfulCommand();

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent should not be able to challenge with the restricted character
    const result = testEngine
      .asPlayerTwo()
      .challenge(opponentCharacter, rapunzelEtherealProtector) as CommandFailure;

    expect(result.success).toBe(false);
  });
});
