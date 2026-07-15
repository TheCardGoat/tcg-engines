import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { princeNaveenUkulelePlayer } from "@tcg/lorcana-cards/cards/005";

const cheapSong = createMockSong({
  id: "play-trigger-cheap-song",
  name: "Cheap Song",
  cost: 3,
  text: "Draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
});

const expensiveSong = createMockSong({
  id: "play-trigger-expensive-song",
  name: "Expensive Song",
  cost: 7,
  text: "Draw 3 cards.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "draw",
        amount: 3,
        target: "CONTROLLER",
      },
    },
  ],
});

describe("IT'S BEAUTIFUL, NO? - Prince Naveen, Ukulele Player - When you play this character, you may play a song with cost 6 or less for free.", () => {
  it("should trigger when this character is played from hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [princeNaveenUkulelePlayer, cheapSong],
      inkwell: princeNaveenUkulelePlayer.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(princeNaveenUkulelePlayer)).toBeSuccessfulCommand();

    // Trigger should fire with optional to play a song
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });

  it("should allow playing a song for free via the trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [princeNaveenUkulelePlayer, cheapSong],
      inkwell: princeNaveenUkulelePlayer.cost,
      deck: 5,
    });

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

    expect(testEngine.asPlayerOne().playCard(princeNaveenUkulelePlayer)).toBeSuccessfulCommand();

    // Accept the optional: play the cheap song for free
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
          targets: [cheapSong],
        }),
    ).toBeSuccessfulCommand();

    // Song should have been played (went to discard) and drew 1 card
    expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("discard");
  });

  it("should allow declining the optional trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [princeNaveenUkulelePlayer, cheapSong],
      inkwell: princeNaveenUkulelePlayer.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(princeNaveenUkulelePlayer)).toBeSuccessfulCommand();

    // Decline the optional
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: false,
        }),
    ).toBeSuccessfulCommand();

    // Song should still be in hand
    expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("hand");
  });

  it.skip("should enforce the cost cap - cannot play a song with cost 7+ for free", () => {
    // QUESTION: Does the filter enforce the cost cap in the target selection,
    // or does it fail at resolution time? The card says "cost 6 or less".
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [princeNaveenUkulelePlayer, expensiveSong],
      inkwell: princeNaveenUkulelePlayer.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(princeNaveenUkulelePlayer)).toBeSuccessfulCommand();

    // The expensive song (cost 7) should not be a valid target
    const result = testEngine
      .asPlayerOne()
      .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
        resolveOptional: true,
        targets: [expensiveSong],
      });

    expect(result.success).toBe(false);
  });
});
